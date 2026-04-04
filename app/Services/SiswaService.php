<?php

namespace App\Services;

use App\Models\Siswa;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SiswaService
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Create a new siswa with optional user account
     *
     * @param array $data
     * @return array ['siswa' => Siswa, 'password' => string|null]
     */
    public function createSiswa(array $data): array
    {
        $generatedPassword = null;

        $siswa = DB::transaction(function () use ($data, &$generatedPassword) {
            // Handle file upload
            if (isset($data['foto']) && $data['foto']) {
                $data['foto'] = $data['foto']->store('siswa/foto', 'public');
            }

            // Create siswa
            $siswa = Siswa::create($data);

            // Create user account if email provided
            if (!empty($data['email'])) {
                $existingUser = User::where('email', $data['email'])->first();

                if ($existingUser) {
                    $userAccount = $existingUser;
                } else {
                    $result = $this->userService->createUser([
                        'name'           => $data['nama_lengkap'],
                        'email'          => $data['email'],
                        'institution_id' => $data['institution_id'],
                    ]);

                    $userAccount = $result['user'];
                    $generatedPassword = $result['plainPassword'];

                    if (method_exists($userAccount, 'assignRole')) {
                        $userAccount->assignRole('siswa');
                    }
                }

                $siswa->update(['user_id' => $userAccount->id]);
            }

            // Log activity
            ActivityLog::log(
                'create',
                $siswa,
                "Siswa {$siswa->nama_lengkap} (NIS: {$siswa->nis}) ditambahkan",
                [],
                $siswa->toArray()
            );

            return $siswa;
        });

        return [
            'siswa' => $siswa,
            'password' => $generatedPassword
        ];
    }

    /**
     * Update siswa data
     *
     * @param Siswa $siswa
     * @param array $data
     * @return Siswa
     */
    public function updateSiswa(Siswa $siswa, array $data): Siswa
    {
        $oldValues = $siswa->toArray();

        $siswa = DB::transaction(function () use ($siswa, $data, $oldValues) {
            // Handle file upload
            if (isset($data['foto']) && $data['foto']) {
                if ($siswa->foto) {
                    Storage::disk('public')->delete($siswa->foto);
                }
                $data['foto'] = $data['foto']->store('siswa/foto', 'public');
            }

            $siswa->update($data);

            // Update user account if email changed
            if ($siswa->user && isset($data['email'])) {
                $siswa->user->update([
                    'name' => $data['nama_lengkap'],
                    'email' => $data['email'],
                ]);
            }

            // Log activity
            ActivityLog::log(
                'update',
                $siswa,
                "Siswa {$siswa->nama_lengkap} diupdate",
                $oldValues,
                $siswa->toArray()
            );

            return $siswa;
        });

        return $siswa->fresh();
    }

    /**
     * Delete siswa
     *
     * @param Siswa $siswa
     * @return bool
     */
    public function deleteSiswa(Siswa $siswa): bool
    {
        return DB::transaction(function () use ($siswa) {
            $siswaData = $siswa->toArray();

            // Delete photo if exists
            if ($siswa->foto) {
                Storage::disk('public')->delete($siswa->foto);
            }

            // Soft delete or hard delete based on your requirement
            $siswa->delete();

            // Log activity
            ActivityLog::log(
                'delete',
                $siswa,
                "Siswa {$siswaData['nama_lengkap']} (NIS: {$siswaData['nis']}) dihapus",
                $siswaData,
                [],
                'warning'
            );

            return true;
        });
    }

    /**
     * Generate user account for siswa
     *
     * @param Siswa $siswa
     * @return array ['user' => User, 'password' => string]
     */
    public function generateUserAccount(Siswa $siswa): array
    {
        if ($siswa->user_id) {
            throw new \Exception('Siswa ini sudah memiliki akun user.');
        }

        if (empty($siswa->email)) {
            throw new \Exception('Siswa tidak memiliki email. Tambahkan email terlebih dahulu.');
        }

        $result = DB::transaction(function () use ($siswa) {
            $result = $this->userService->createUser([
                'name'           => $siswa->nama_lengkap,
                'email'          => $siswa->email,
                'institution_id' => $siswa->institution_id,
            ]);

            $userAccount = $result['user'];

            if (method_exists($userAccount, 'assignRole')) {
                $userAccount->assignRole('siswa');
            }

            $siswa->update(['user_id' => $userAccount->id]);

            ActivityLog::log(
                'generate_account',
                $siswa,
                "Akun user dibuat untuk siswa {$siswa->nama_lengkap} (NIS: {$siswa->nis})"
            );

            return $result;
        });

        return $result;
    }

    /**
     * Reset siswa password
     *
     * @param Siswa $siswa
     * @return string New password
     */
    public function resetPassword(Siswa $siswa): string
    {
        if (!$siswa->user) {
            throw new \Exception('Siswa ini belum memiliki akun user.');
        }

        $newPassword = $this->userService->resetPassword($siswa->user);

        ActivityLog::log(
            'reset_password',
            $siswa,
            "Password siswa {$siswa->nama_lengkap} direset",
            [],
            ['user_id' => $siswa->user->id]
        );

        return $newPassword;
    }

    /**
     * Get siswa statistics
     *
     * @param int|null $institutionId
     * @return array
     */
    public function getStatistics(?int $institutionId = null): array
    {
        $query = $institutionId
            ? Siswa::where('institution_id', $institutionId)
            : Siswa::query();

        return [
            'total' => (clone $query)->count(),
            'aktif' => (clone $query)->where('status', 'aktif')->count(),
            'lulus' => (clone $query)->where('status', 'lulus')->count(),
            'pindah' => (clone $query)->where('status', 'pindah')->count(),
            'keluar' => (clone $query)->where('status', 'keluar')->count(),
            'laki_laki' => (clone $query)->where('jenis_kelamin', 'L')->count(),
            'perempuan' => (clone $query)->where('jenis_kelamin', 'P')->count(),
            'by_kelas' => (clone $query)
                ->select('kelas_id', DB::raw('count(*) as total'))
                ->with('kelas:id,nama_kelas')
                ->groupBy('kelas_id')
                ->get(),
        ];
    }

    /**
     * Import siswa from array data
     *
     * @param array $siswas
     * @param int $institutionId
     * @return array ['success' => int, 'errors' => array]
     */
    public function importBulk(array $siswas, int $institutionId): array
    {
        $success = 0;
        $errors = [];

        foreach ($siswas as $index => $siswaData) {
            try {
                $siswaData['institution_id'] = $institutionId;
                $this->createSiswa($siswaData);
                $success++;
            } catch (\Exception $e) {
                $errors[] = [
                    'row' => $index + 1,
                    'data' => $siswaData,
                    'error' => $e->getMessage()
                ];
            }
        }

        ActivityLog::logImport(
            'siswa',
            "Import {$success} siswa berhasil" . (count($errors) > 0 ? ", {count($errors)} gagal" : ""),
            [
                'total_success' => $success,
                'total_errors' => count($errors),
            ]
        );

        return [
            'success' => $success,
            'errors' => $errors
        ];
    }
}
