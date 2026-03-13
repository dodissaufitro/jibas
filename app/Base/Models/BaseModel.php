<?php

namespace App\Base\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

/**
 * Base Model
 * 
 * All module models should extend this class
 * Provides common scopes and functionality
 */
abstract class BaseModel extends Model
{
    /**
     * Scope to filter by institution
     */
    public function scopeForInstitution(Builder $query, ?int $institutionId = null): Builder
    {
        if ($institutionId === null && Auth::check()) {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            $institutionId = $user->institution_id;
        }

        return $query->where($this->getTable() . '.institution_id', $institutionId);
    }

    /**
     * Scope to filter active records
     */
    public function scopeActive(Builder $query): Builder
    {
        if ($this->hasColumn('is_active')) {
            return $query->where('is_active', true);
        }

        if ($this->hasColumn('status')) {
            return $query->where('status', 'aktif');
        }

        return $query;
    }

    /**
     * Check if column exists in table
     */
    protected function hasColumn(string $column): bool
    {
        return in_array($column, $this->getFillable());
    }

    /**
     * Get formatted date
     */
    public function getFormattedDateAttribute(): ?string
    {
        return $this->created_at?->format('d M Y');
    }

    /**
     * Boot method to auto-set institution_id
     */
    protected static function booted()
    {
        static::creating(function ($model) {
            if (in_array('institution_id', $model->getFillable()) && !$model->institution_id && Auth::check()) {
                /** @var \App\Models\User $user */
                $user = Auth::user();
                $model->institution_id = $user->institution_id;
            }
        });
    }
}
