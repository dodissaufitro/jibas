<?php

namespace App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Services;

use App\Base\Services\BaseService;
use App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models\Ekstrakurikuler;
use App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models\AnggotaEkskul;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EkstrakurikulerService extends BaseService
{
    /**
     * Get paginated ekstrakurikuler dengan filter
     */
    public function getPaginatedEkskul(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $query = Ekstrakurikuler::with(['pembina'])
            ->where('institution_id', $institutionId);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('nama_ekskul', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['kategori'])) {
            $query->where('kategori', $filters['kategori']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('nama_ekskul', 'asc')->paginate($perPage);
    }

    /**
     * Daftarkan siswa ke ekstrakurikuler
     */
    public function daftarkanSiswa(int $ekskulId, int $siswaId, int $tahunAjaranId): AnggotaEkskul
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $ekskul = Ekstrakurikuler::where('institution_id', $institutionId)->findOrFail($ekskulId);

        // Cek kuota
        if ($ekskul->terisi >= $ekskul->kuota) {
            throw new \Exception('Kuota ekstrakurikuler sudah penuh');
        }

        // Cek duplikasi
        $existing = AnggotaEkskul::where('ekstrakurikuler_id', $ekskulId)
            ->where('siswa_id', $siswaId)
            ->where('tahun_ajaran_id', $tahunAjaranId)
            ->first();

        if ($existing) {
            throw new \Exception('Siswa sudah terdaftar di ekstr akurikuler ini');
        }

        return $this->transaction(function () use ($ekskul, $siswaId, $tahunAjaranId, $institutionId) {
            $anggota = AnggotaEkskul::create([
                'institution_id' => $institutionId,
                'ekstrakurikuler_id' => $ekskul->id,
                'siswa_id' => $siswaId,
                'tahun_ajaran_id' => $tahunAjaranId,
                'tanggal_daftar' => now(),
                'jabatan' => 'anggota',
                'status' => 'aktif',
            ]);

            $ekskul->increment('terisi');

            return $anggota;
        });
    }

    /**
     * Keluarkan siswa dari ekstrakurikuler
     */
    public function keluarkanSiswa(int $anggotaId): AnggotaEkskul
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $anggota = AnggotaEkskul::where('institution_id', $institutionId)->findOrFail($anggotaId);

        if ($anggota->status === 'keluar') {
            throw new \Exception('Siswa sudah keluar dari ekstrakurikuler');
        }

        return $this->transaction(function () use ($anggota) {
            $anggota->update(['status' => 'keluar']);

            $ekskul = $anggota->ekstrakurikuler;
            if ($ekskul->terisi > 0) {
                $ekskul->decrement('terisi');
            }

            return $anggota->fresh();
        });
    }

    /**
     * Update nilai anggota ekstrakurikuler
     */
    public function updateNilaiAnggota(int $anggotaId, float $nilaiAkhir): AnggotaEkskul
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $anggota = AnggotaEkskul::where('institution_id', $institutionId)->findOrFail($anggotaId);

        // Tentukan predikat berdasarkan nilai
        $predikat = match (true) {
            $nilaiAkhir >= 90 => 'A',
            $nilaiAkhir >= 80 => 'B',
            $nilaiAkhir >= 70 => 'C',
            $nilaiAkhir >= 60 => 'D',
            default => 'E'
        };

        $anggota->update([
            'nilai_akhir' => $nilaiAkhir,
            'predikat' => $predikat,
        ]);

        return $anggota->fresh();
    }

    /**
     * Get statistik ekstrakurikuler
     */
    public function getStatistics(): array
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        return [
            'total_ekskul' => Ekstrakurikuler::where('institution_id', $institutionId)->aktif()->count(),
            'total_anggota' => AnggotaEkskul::where('institution_id', $institutionId)->aktif()->count(),
            'by_kategori' => Ekstrakurikuler::where('institution_id', $institutionId)
                ->aktif()
                ->select('kategori', DB::raw('count(*) as total'))
                ->groupBy('kategori')
                ->pluck('total', 'kategori')
                ->toArray(),
        ];
    }
}
