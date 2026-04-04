<?php

namespace App\Policies;

use App\Models\Siswa;
use App\Models\User;

/**
 * Siswa Policy
 * 
 * Authorization logic untuk Siswa resource
 * Mencegah IDOR (Insecure Direct Object References)
 */
class SiswaPolicy
{
    /**
     * Determine if the user can view the siswa.
     */
    public function view(User $user, Siswa $siswa): bool
    {
        // User hanya bisa view siswa dari institution yang sama
        return $user->institution_id === $siswa->institution_id;
    }

    /**
     * Determine if the user can create siswa.
     */
    public function create(User $user): bool
    {
        // Check permission
        return $user->hasPermission('create_siswa') || $user->hasRole('super_admin');
    }

    /**
     * Determine if the user can update the siswa.
     */
    public function update(User $user, Siswa $siswa): bool
    {
        // User harus dari institution yang sama DAN punya permission
        return $user->institution_id === $siswa->institution_id
            && ($user->hasPermission('edit_siswa') || $user->hasRole('super_admin'));
    }

    /**
     * Determine if the user can delete the siswa.
     */
    public function delete(User $user, Siswa $siswa): bool
    {
        // User harus dari institution yang sama DAN punya permission
        return $user->institution_id === $siswa->institution_id
            && ($user->hasPermission('delete_siswa') || $user->hasRole('super_admin'));
    }

    /**
     * Determine if the user can restore the siswa.
     */
    public function restore(User $user, Siswa $siswa): bool
    {
        return $user->institution_id === $siswa->institution_id
            && ($user->hasPermission('delete_siswa') || $user->hasRole('super_admin'));
    }

    /**
     * Determine if the user can permanently delete the siswa.
     */
    public function forceDelete(User $user, Siswa $siswa): bool
    {
        // Only super_admin can force delete
        return $user->hasRole('super_admin')
            && $user->institution_id === $siswa->institution_id;
    }
}
