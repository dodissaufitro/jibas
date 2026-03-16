<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Kelas Policy
 * 
 * Authorization policy for kelas-based access control
 */
class KelasPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if user can view resources from a specific kelas
     */
    public function viewKelas(User $user, int $kelasId): bool
    {
        // Super admin and admin can view all kelas
        if ($user->hasRole(['super_admin', 'admin'])) {
            return true;
        }

        // Guru can view all kelas
        if ($user->hasRole('guru')) {
            return true;
        }

        // Siswa can only view their own kelas
        if ($user->hasRole('siswa')) {
            $siswa = $user->siswa;
            return $siswa && $siswa->kelas_id === $kelasId;
        }

        return false;
    }

    /**
     * Determine if user can access a model that belongs to a kelas
     */
    public function accessKelasResource(User $user, $model): bool
    {
        // Super admin and admin can access all
        if ($user->hasRole(['super_admin', 'admin'])) {
            return true;
        }

        // Guru can access all
        if ($user->hasRole('guru')) {
            return true;
        }

        // Check if model has kelas_id
        if (!isset($model->kelas_id)) {
            return true; // No kelas restriction
        }

        // Siswa can only access resources from their kelas
        if ($user->hasRole('siswa')) {
            $siswa = $user->siswa;
            return $siswa && $siswa->kelas_id === $model->kelas_id;
        }

        return false;
    }

    /**
     * Determine if user can view siswa from their kelas
     */
    public function viewClassmate(User $user, User $targetUser): bool
    {
        // Super admin, admin, and guru can view all
        if ($user->hasRole(['super_admin', 'admin', 'guru'])) {
            return true;
        }

        // Siswa can only view classmates
        if ($user->hasRole('siswa') && $targetUser->hasRole('siswa')) {
            $userSiswa = $user->siswa;
            $targetSiswa = $targetUser->siswa;

            if ($userSiswa && $targetSiswa) {
                return $userSiswa->kelas_id === $targetSiswa->kelas_id;
            }
        }

        return false;
    }
}
