<?php

namespace App\Shared\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

/**
 * Kelas Scoped Trait
 * 
 * Automatically scope queries to current user's kelas
 * Used for models that have kelas_id column
 * 
 * Usage:
 * ```php
 * use App\Shared\Traits\KelasScoped;
 * 
 * class YourModel extends Model
 * {
 *     use KelasScoped;
 * }
 * ```
 */
trait KelasScoped
{
    /**
     * Boot the trait and apply global scope
     */
    protected static function bootKelasScoped()
    {
        // Only apply scope for authenticated siswa users
        static::addGlobalScope('kelas', function (Builder $builder) {
            /** @var \App\Models\User|null $user */
            $user = Auth::user();

            // Only apply to siswa role
            if ($user && $user->hasRole('siswa')) {
                $siswa = $user->siswa;

                if ($siswa && $siswa->kelas_id) {
                    $builder->where('kelas_id', $siswa->kelas_id);
                }
            }
        });
    }

    /**
     * Scope query to specific kelas
     */
    public function scopeByKelas(Builder $query, int $kelasId): Builder
    {
        return $query->where('kelas_id', $kelasId);
    }

    /**
     * Scope query without kelas restriction (for admin/guru)
     */
    public function scopeWithoutKelasScope(Builder $query): Builder
    {
        return $query->withoutGlobalScope('kelas');
    }

    /**
     * Check if resource belongs to user's kelas
     */
    public function belongsToUserKelas(): bool
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (!$user || !$user->hasRole('siswa')) {
            return true; // Non-siswa users can access all
        }

        $siswa = $user->siswa;

        if (!$siswa || !$siswa->kelas_id) {
            return false;
        }

        return $this->kelas_id === $siswa->kelas_id;
    }
}
