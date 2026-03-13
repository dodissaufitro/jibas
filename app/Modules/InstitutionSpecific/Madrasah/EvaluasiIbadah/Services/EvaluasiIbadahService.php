<?php

namespace App\Modules\InstitutionSpecific\Madrasah\EvaluasiIbadah\Services;

use App\Base\Services\BaseService;
use App\Modules\InstitutionSpecific\Madrasah\EvaluasiIbadah\Models\EvaluasiIbadah;
use Illuminate\Pagination\LengthAwarePaginator;

class EvaluasiIbadahService extends BaseService
{
    /**
     * Get paginated evaluasi ibadah
     */
    public function getPaginatedEvaluasi(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $query = EvaluasiIbadah::with(['siswa.kelas'])
            ->where('institution_id', $institutionId);

        if (!empty($filters['search'])) {
            $query->whereHas('siswa', function ($q) use ($filters) {
                $q->where('nama_lengkap', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('nis', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['siswa_id'])) {
            $query->where('siswa_id', $filters['siswa_id']);
        }

        if (!empty($filters['bulan'])) {
            $query->where('bulan', $filters['bulan']);
        }

        if (!empty($filters['tahun'])) {
            $query->where('tahun', $filters['tahun']);
        }

        return $query->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->paginate($perPage);
    }

    /**
     * Create evaluasi ibadah dengan perhitungan otomatis
     */
    public function createEvaluasi(array $data): EvaluasiIbadah
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $data['institution_id'] = $institutionId;
        $data['periode'] = 'bulanan';

        // Hitung nilai total
        $nilaiTotal = $this->hitungNilaiTotal($data);
        $data['nilai_total'] = $nilaiTotal;
        $data['predikat'] = $this->tentukanPredikat($nilaiTotal);

        return EvaluasiIbadah::create($data);
    }

    /**
     * Update evaluasi ibadah
     */
    public function updateEvaluasi(int $id, array $data): EvaluasiIbadah
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $evaluasi = EvaluasiIbadah::where('institution_id', $institutionId)->findOrFail($id);

        // Hitung nilai total
        $nilaiTotal = $this->hitungNilaiTotal($data);
        $data['nilai_total'] = $nilaiTotal;
        $data['predikat'] = $this->tentukanPredikat($nilaiTotal);

        $evaluasi->update($data);
        return $evaluasi->fresh();
    }

    /**
     * Hitung nilai total (sama dengan method di model)
     */
    private function hitungNilaiTotal(array $data): float
    {
        return ($data['shalat_fardhu'] ?? 0) * 0.30 +
            ($data['membaca_quran'] ?? 0) * 0.10 +
            ($data['hafalan_quran'] ?? 0) * 0.10 +
            ($data['puasa_sunnah'] ?? 0) * 0.20 +
            ($data['shalat_dhuha'] ?? 0) * 0.10 +
            ($data['shalat_tahajud'] ?? 0) * 0.10 +
            ($data['kegiatan_keagamaan'] ?? 0) * 0.10;
    }

    /**
     * Tentukan predikat
     */
    private function tentukanPredikat(float $nilai): string
    {
        return match (true) {
            $nilai >= 90 => 'Sangat Baik',
            $nilai >= 80 => 'Baik',
            $nilai >= 70 => 'Cukup',
            $nilai >= 60 => 'Kurang',
            default => 'Sangat Kurang'
        };
    }

    /**
     * Get evaluasi siswa per tahun
     */
    public function getEvaluasiSiswaTahunan(int $siswaId, int $tahun): array
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $evaluasi = EvaluasiIbadah::where('institution_id', $institutionId)
            ->where('siswa_id', $siswaId)
            ->where('tahun', $tahun)
            ->orderBy('bulan')
            ->get();

        $rataRata = $evaluasi->avg('nilai_total');

        return [
            'evaluasi_per_bulan' => $evaluasi,
            'rata_rata' => round($rataRata, 2),
            'predikat' => $this->tentukanPredikat($rataRata),
        ];
    }

    /**
     * Get statistik evaluasi ibadah
     */
    public function getStatistics(int $bulan = null, int $tahun = null): array
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $bulan = $bulan ?? now()->month;
        $tahun = $tahun ?? now()->year;

        $query = EvaluasiIbadah::where('institution_id', $institutionId)
            ->where('bulan', $bulan)
            ->where('tahun', $tahun);

        $data = $query->get();

        return [
            'total_siswa' => $data->count(),
            'rata_rata_nilai' => round($data->avg('nilai_total'), 2),
            'rata_rata_shalat_fardhu' => round($data->avg('shalat_fardhu'), 2),
            'rata_rata_membaca_quran' => round($data->avg('membaca_quran'), 2),
            'rata_rata_hafalan' => round($data->avg('hafalan_quran'), 2),
            'sangat_baik' => $data->where('nilai_total', '>=', 90)->count(),
            'baik' => $data->whereBetween('nilai_total', [80, 89.99])->count(),
            'cukup' => $data->whereBetween('nilai_total', [70, 79.99])->count(),
            'kurang' => $data->where('nilai_total', '<', 70)->count(),
        ];
    }
}
