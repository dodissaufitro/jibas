<?php

namespace App\Modules\InstitutionSpecific\Pesantren\Hafalan\Services;

use App\Base\Services\BaseService;
use App\Modules\InstitutionSpecific\Pesantren\Hafalan\Models\HafalanQuran;

/**
 * Hafalan Service
 * 
 * Business logic for Quran memorization tracking
 */
class HafalanService extends BaseService
{
    /**
     * Catat setoran hafalan
     */
    public function catatSetoran(array $data): HafalanQuran
    {
        return $this->transaction(function () use ($data) {
            $institutionId = $this->getInstitutionId();
            if (!$institutionId) {
                throw new \Exception('User institution not found');
            }

            $hafalan = HafalanQuran::create([
                ...$data,
                'institution_id' => $institutionId,
            ]);

            // TODO: Update target progress
            // TODO: Send notification to parent

            $this->logActivity('catat_setoran', 'hafalan', [
                'hafalan_id' => $hafalan->id,
                'siswa_id' => $hafalan->siswa_id,
                'nilai' => $hafalan->nilai,
            ]);

            return $hafalan;
        });
    }

    /**
     * Get paginated hafalan records
     */
    public function getPaginatedHafalan(int $perPage = 15, ?string $search = null)
    {
        $institutionId = $this->getInstitutionId();
        if (!$institutionId) {
            throw new \Exception('User institution not found');
        }

        $query = HafalanQuran::query()
            ->with(['siswa', 'penguji'])
            ->forInstitution($institutionId)
            ->orderBy('tanggal_setoran', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('siswa', function ($subQuery) use ($search) {
                    $subQuery->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%");
                })->orWhere('surat', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    /**
     * Create new hafalan record
     */
    public function create(array $data): HafalanQuran
    {
        return $this->transaction(function () use ($data) {
            $institutionId = $this->getInstitutionId();
            if (!$institutionId) {
                throw new \Exception('User institution not found');
            }

            $hafalan = HafalanQuran::create([
                ...$data,
                'institution_id' => $institutionId,
                'penguji_id' => $this->getUser()?->id,
            ]);

            $this->logActivity('tambah_hafalan', 'hafalan', [
                'hafalan_id' => $hafalan->id,
                'siswa_id' => $hafalan->siswa_id,
            ]);

            return $hafalan->load('siswa');
        });
    }

    /**
     * Update hafalan record
     */
    public function update(int $id, array $data): HafalanQuran
    {
        return $this->transaction(function () use ($id, $data) {
            $institutionId = $this->getInstitutionId();
            if (!$institutionId) {
                throw new \Exception('User institution not found');
            }

            $hafalan = HafalanQuran::forInstitution($institutionId)
                ->findOrFail($id);

            $hafalan->update($data);

            $this->logActivity('update_hafalan', 'hafalan', [
                'hafalan_id' => $hafalan->id,
            ]);

            return $hafalan->load('siswa');
        });
    }

    /**
     * Get hafalan by siswa
     */
    public function getHafalanBySiswa(int $siswaId)
    {
        $institutionId = $this->getInstitutionId();
        if (!$institutionId) {
            throw new \Exception('User institution not found');
        }

        return HafalanQuran::query()
            ->forInstitution($institutionId)
            ->where('siswa_id', $siswaId)
            ->with('penguji')
            ->orderBy('tanggal_setoran', 'desc')
            ->get();
    }

    /**
     * Get hafalan progress for a student
     */
    public function getHafalanProgress(int $siswaId): array
    {
        $hafalan = $this->getHafalanBySiswa($siswaId);

        $stats = [
            'total_setoran' => $hafalan->count(),
            'nilai_A' => $hafalan->where('nilai', 'A')->count(),
            'nilai_B' => $hafalan->where('nilai', 'B')->count(),
            'nilai_C' => $hafalan->where('nilai', 'C')->count(),
            'nilai_D' => $hafalan->where('nilai', 'D')->count(),
            'total_ayat' => $hafalan->sum(function ($h) {
                return $h->ayat_sampai - $h->ayat_dari + 1;
            }),
        ];

        return [
            'statistics' => $stats,
            'progress_by_juz' => $this->getProgressByJuz($siswaId),
        ];
    }

    /**
     * Get progress by juz
     */
    private function getProgressByJuz(int $siswaId): array
    {
        $institutionId = $this->getInstitutionId();
        if (!$institutionId) {
            return [];
        }

        $progress = [];

        for ($juz = 1; $juz <= 30; $juz++) {
            $hafalanCount = HafalanQuran::query()
                ->forInstitution($institutionId)
                ->where('siswa_id', $siswaId)
                ->where('juz', $juz)
                ->whereIn('nilai', ['A', 'B', 'C'])
                ->count();

            $progress[$juz] = [
                'juz' => $juz,
                'setoran_count' => $hafalanCount,
                'status' => $hafalanCount > 0 ? 'started' : 'not_started',
            ];
        }

        return $progress;
    }

    /**
     * Get leaderboard
     */
    public function getLeaderboard(int $limit = 10): array
    {
        $institutionId = $this->getInstitutionId();
        if (!$institutionId) {
            return [];
        }

        return HafalanQuran::selectRaw('siswa_id, COUNT(*) as total_setoran, SUM(ayat_sampai - ayat_dari + 1) as total_ayat')
            ->forInstitution($institutionId)
            ->whereIn('nilai', ['A', 'B', 'C'])
            ->groupBy('siswa_id')
            ->orderBy('total_ayat', 'desc')
            ->limit($limit)
            ->with('siswa')
            ->get()
            ->toArray();
    }
}
