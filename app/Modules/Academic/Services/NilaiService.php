<?php

namespace App\Modules\Academic\Services;

use App\Base\Services\BaseService;
use App\Models\Nilai;
use App\Modules\Academic\Events\NilaiDiinput;

/**
 * Nilai Service
 * 
 * Handle business logic for student grades
 */
class NilaiService extends BaseService
{
    /**
     * Get paginated nilai for institution
     */
    public function getPaginatedNilai(array $filters = [], int $perPage = 15)
    {
        $institutionId = $this->getInstitutionId();
        if (!$institutionId) {
            throw new \Exception('User institution not found');
        }

        $query = Nilai::with(['siswa', 'mataPelajaran', 'semester'])
            ->where('institution_id', $institutionId);

        if (isset($filters['kelas_id'])) {
            $query->whereHas('siswa', fn($q) => $q->where('kelas_id', $filters['kelas_id']));
        }

        if (isset($filters['semester_id'])) {
            $query->where('semester_id', $filters['semester_id']);
        }

        if (isset($filters['mata_pelajaran_id'])) {
            $query->where('mata_pelajaran_id', $filters['mata_pelajaran_id']);
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Create nilai
     */
    public function create(array $data): Nilai
    {
        return $this->transaction(function () use ($data) {
            $institutionId = $this->getInstitutionId();
            if (!$institutionId) {
                throw new \Exception('User institution not found');
            }

            $nilai = Nilai::create([
                ...$data,
                'institution_id' => $institutionId,
            ]);

            // Auto-calculate final grade
            $nilai->nilai_akhir = $this->calculateFinalGrade($nilai);
            $nilai->predikat = $this->determinePredikat($nilai->nilai_akhir);
            $nilai->save();

            // Trigger event for notifications
            event(new NilaiDiinput($nilai));

            $this->logActivity('create_nilai', 'academic', [
                'nilai_id' => $nilai->id,
                'siswa_id' => $nilai->siswa_id,
            ]);

            return $nilai;
        });
    }

    /**
     * Update nilai
     */
    public function update(Nilai $nilai, array $data): Nilai
    {
        return $this->transaction(function () use ($nilai, $data) {
            $nilai->update($data);

            // Recalculate
            $nilai->nilai_akhir = $this->calculateFinalGrade($nilai);
            $nilai->predikat = $this->determinePredikat($nilai->nilai_akhir);
            $nilai->save();

            $this->logActivity('update_nilai', 'academic', [
                'nilai_id' => $nilai->id,
            ]);

            return $nilai;
        });
    }

    /**
     * Calculate final grade based on components
     */
    private function calculateFinalGrade(Nilai $nilai): float
    {
        $tugas = $nilai->nilai_tugas ?? 0;
        $uts = $nilai->nilai_uts ?? 0;
        $uas = $nilai->nilai_uas ?? 0;
        $praktik = $nilai->nilai_praktik ?? 0;

        // Formula: Tugas 20%, UTS 30%, UAS 40%, Praktik 10%
        return ($tugas * 0.2) + ($uts * 0.3) + ($uas * 0.4) + ($praktik * 0.1);
    }

    /**
     * Determine predikat based on final grade
     */
    private function determinePredikat(float $nilaiAkhir): string
    {
        if ($nilaiAkhir >= 90) return 'A';
        if ($nilaiAkhir >= 80) return 'B';
        if ($nilaiAkhir >= 70) return 'C';
        if ($nilaiAkhir >= 60) return 'D';
        return 'E';
    }

    /**
     * Get nilai statistics for siswa
     */
    public function getSiswaStatistics(int $siswaId, int $semesterId): array
    {
        $nilaiList = Nilai::where('siswa_id', $siswaId)
            ->where('semester_id', $semesterId)
            ->get();

        return [
            'total_mapel' => $nilaiList->count(),
            'nilai_rata_rata' => $nilaiList->avg('nilai_akhir'),
            'nilai_tertinggi' => $nilaiList->max('nilai_akhir'),
            'nilai_terendah' => $nilaiList->min('nilai_akhir'),
            'predikat_counts' => $nilaiList->groupBy('predikat')->map->count(),
        ];
    }
}
