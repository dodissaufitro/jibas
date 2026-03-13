<?php

namespace App\Modules\InstitutionSpecific\Pesantren\IzinPulang\Services;

use App\Base\Services\BaseService;
use App\Modules\InstitutionSpecific\Pesantren\IzinPulang\Models\IzinPulang;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class IzinPulangService extends BaseService
{
    /**
     * Get paginated izin pulang dengan filter
     */
    public function getPaginatedIzin(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $query = IzinPulang::with(['siswa.kelas', 'siswa.jurusan', 'approver'])
            ->where('institution_id', $institutionId);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereHas('siswa', function ($sq) use ($filters) {
                    $sq->where('nama_lengkap', 'like', '%' . $filters['search'] . '%')
                        ->orWhere('nis', 'like', '%' . $filters['search'] . '%');
                });
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['jenis_izin'])) {
            $query->where('jenis_izin', $filters['jenis_izin']);
        }

        if (!empty($filters['siswa_id'])) {
            $query->where('siswa_id', $filters['siswa_id']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Create pengajuan izin pulang
     */
    public function createIzin(array $data): IzinPulang
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $data['institution_id'] = $institutionId;
        $data['tanggal_izin'] = now();
        $data['status'] = 'pending';

        return IzinPulang::create($data);
    }

    /**
     * Approve izin pulang
     */
    public function approveIzin(int $id, ?string $catatan = null): IzinPulang
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $izin = IzinPulang::where('institution_id', $institutionId)->findOrFail($id);

        if ($izin->status !== 'pending') {
            throw new \Exception('Izin tidak dalam status pending');
        }

        return $this->transaction(function () use ($izin, $catatan) {
            $izin->update([
                'status' => 'disetujui',
                'disetujui_oleh' => Auth::id(),
                'tanggal_disetujui' => now(),
                'catatan_approval' => $catatan,
            ]);

            return $izin->fresh();
        });
    }

    /**
     * Reject izin pulang
     */
    public function rejectIzin(int $id, string $alasan): IzinPulang
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $izin = IzinPulang::where('institution_id', $institutionId)->findOrFail($id);

        if ($izin->status !== 'pending') {
            throw new \Exception('Izin tidak dalam status pending');
        }

        return $this->transaction(function () use ($izin, $alasan) {
            $izin->update([
                'status' => 'ditolak',
                'disetujui_oleh' => Auth::id(),
                'tanggal_disetujui' => now(),
                'catatan_approval' => $alasan,
            ]);

            return $izin->fresh();
        });
    }

    /**
     * Mark siswa kembali
     */
    public function markKembali(int $id): IzinPulang
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        $izin = IzinPulang::where('institution_id', $institutionId)->findOrFail($id);

        if ($izin->status !== 'disetujui') {
            throw new \Exception('Izin belum disetujui');
        }

        if ($izin->status === 'kembali') {
            throw new \Exception('Siswa sudah ditandai kembali');
        }

        return $this->transaction(function () use ($izin) {
            $tanggalKembali = now();
            $terlambat = $tanggalKembali->isAfter($izin->tanggal_selesai);

            $izin->update([
                'status' => 'kembali',
                'tanggal_kembali' => $tanggalKembali,
                'terlambat' => $terlambat,
            ]);

            return $izin->fresh();
        });
    }

    /**
     * Get statistik izin pulang
     */
    public function getStatistics(): array
    {
        $institutionId = $this->getInstitutionId();
        if ($institutionId === null) {
            throw new \Exception('User tidak terkait dengan institusi');
        }

        return [
            'pending' => IzinPulang::where('institution_id', $institutionId)->pending()->count(),
            'disetujui' => IzinPulang::where('institution_id', $institutionId)->where('status', 'disetujui')->count(),
            'ditolak' => IzinPulang::where('institution_id', $institutionId)->where('status', 'ditolak')->count(),
            'sedang_pulang' => IzinPulang::where('institution_id', $institutionId)
                ->where('status', 'disetujui')
                ->whereDate('tanggal_mulai', '<=', now())
                ->whereDate('tanggal_selesai', '>=', now())
                ->count(),
            'terlambat_bulan_ini' => IzinPulang::where('institution_id', $institutionId)
                ->where('terlambat', true)
                ->whereMonth('tanggal_kembali', now()->month)
                ->count(),
        ];
    }
}
