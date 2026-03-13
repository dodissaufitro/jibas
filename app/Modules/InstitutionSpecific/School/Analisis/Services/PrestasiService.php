<?php

namespace App\Modules\InstitutionSpecific\School\Analisis\Services;

use App\Base\Services\BaseService;
use App\Modules\InstitutionSpecific\School\Analisis\Models\PrestasiSiswa;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PrestasiService extends BaseService
{
    /**
     * Get paginated prestasi dengan filter
     */
    public function getPaginatedPrestasi(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $query = PrestasiSiswa::with(['siswa.kelas'])
            ->where('institution_id', $institutionId);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('nama_prestasi', 'like', '%' . $filters['search'] . '%')
                    ->orWhereHas('siswa', function ($sq) use ($filters) {
                        $sq->where('nama_lengkap', 'like', '%' . $filters['search'] . '%');
                    });
            });
        }

        if (!empty($filters['jenis'])) {
            $query->where('jenis', $filters['jenis']);
        }

        if (!empty($filters['tingkat'])) {
            $query->where('tingkat', $filters['tingkat']);
        }

        if (!empty($filters['siswa_id'])) {
            $query->where('siswa_id', $filters['siswa_id']);
        }

        if (!empty($filters['tahun'])) {
            $query->whereYear('tanggal', $filters['tahun']);
        }

        return $query->orderBy('tanggal', 'desc')->paginate($perPage);
    }

    /**
     * Create prestasi dengan upload sertifikat
     */
    public function createPrestasi(array $data): PrestasiSiswa
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $data['institution_id'] = $institutionId;

        // Handle file upload
        if (isset($data['sertifikat_file'])) {
            $file = $data['sertifikat_file'];
            $path = $file->store('sertifikat', 'public');
            $data['sertifikat'] = $path;
            unset($data['sertifikat_file']);
        }

        return PrestasiSiswa::create($data);
    }

    /**
     * Update prestasi
     */
    public function updatePrestasi(int $id, array $data): PrestasiSiswa
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $prestasi = PrestasiSiswa::where('institution_id', $institutionId)->findOrFail($id);

        // Handle file upload
        if (isset($data['sertifikat_file'])) {
            // Hapus file lama
            if ($prestasi->sertifikat) {
                Storage::disk('public')->delete($prestasi->sertifikat);
            }

            $file = $data['sertifikat_file'];
            $path = $file->store('sertifikat', 'public');
            $data['sertifikat'] = $path;
            unset($data['sertifikat_file']);
        }

        $prestasi->update($data);
        return $prestasi->fresh();
    }

    /**
     * Get prestasi siswa dengan total poin
     */
    public function getPrestasiSiswa(int $siswaId): array
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $prestasi = PrestasiSiswa::where('institution_id', $institutionId)
            ->where('siswa_id', $siswaId)
            ->orderBy('tanggal', 'desc')
            ->get();

        $totalPoin = $prestasi->sum(function ($p) {
            return $p->poin;
        });

        return [
            'prestasi' => $prestasi,
            'total_poin' => $totalPoin,
            'jumlah_prestasi' => $prestasi->count(),
        ];
    }

    /**
     * Get ranking siswa berdasarkan total poin prestasi
     */
    public function getRankingSiswa(int $limit = 10): array
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $ranking = PrestasiSiswa::where('institution_id', $institutionId)
            ->with('siswa')
            ->select('siswa_id', DB::raw('SUM(CASE 
                WHEN tingkat = "internasional" THEN 100
                WHEN tingkat = "nasional" THEN 75
                WHEN tingkat = "provinsi" THEN 50
                WHEN tingkat = "kabupaten" THEN 35
                WHEN tingkat = "kecamatan" THEN 20
                ELSE 10
            END * CASE
                WHEN peringkat LIKE "juara_1%" THEN 3
                WHEN peringkat LIKE "juara_2%" THEN 2
                WHEN peringkat LIKE "juara_3%" THEN 1.5
                ELSE 1
            END) as total_poin'))
            ->groupBy('siswa_id')
            ->orderByDesc('total_poin')
            ->limit($limit)
            ->get();

        return $ranking->toArray();
    }

    /**
     * Get statistik prestasi
     */
    public function getStatistics(): array
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        return [
            'total_prestasi' => PrestasiSiswa::where('institution_id', $institutionId)->count(),
            'tahun_ini' => PrestasiSiswa::where('institution_id', $institutionId)
                ->whereYear('tanggal', now()->year)
                ->count(),
            'by_jenis' => PrestasiSiswa::where('institution_id', $institutionId)
                ->select('jenis', DB::raw('count(*) as total'))
                ->groupBy('jenis')
                ->pluck('total', 'jenis')
                ->toArray(),
            'by_tingkat' => PrestasiSiswa::where('institution_id', $institutionId)
                ->select('tingkat', DB::raw('count(*) as total'))
                ->groupBy('tingkat')
                ->pluck('total', 'tingkat')
                ->toArray(),
        ];
    }
}
