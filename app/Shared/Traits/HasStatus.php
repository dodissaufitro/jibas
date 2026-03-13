<?php

namespace App\Shared\Traits;

/**
 * Has Status Trait
 * 
 * For models with status field
 */
trait HasStatus
{
    /**
     * Scope active records
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'aktif');
    }

    /**
     * Scope inactive records
     */
    public function scopeInactive($query)
    {
        return $query->where('status', '!=', 'aktif');
    }

    /**
     * Check if active
     */
    public function isActive(): bool
    {
        return $this->status === 'aktif';
    }

    /**
     * Activate
     */
    public function activate()
    {
        $this->update(['status' => 'aktif']);
    }

    /**
     * Deactivate
     */
    public function deactivate()
    {
        $this->update(['status' => 'nonaktif']);
    }
}
