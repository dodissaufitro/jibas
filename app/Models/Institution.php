<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Institution extends Model
{
    protected $fillable = [
        'name',
        'type',
        'education_level',
        'address',
        'phone',
        'email',
        'logo',
        'website',
        'npsn',
        'nss',
        'vision',
        'mission',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get all users belonging to this institution
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the institution type label
     */
    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'pesantren' => 'Pondok Pesantren / Yayasan',
            'umum' => 'Sekolah Umum',
            'madrasah' => 'Madrasah',
            default => $this->type,
        };
    }

    /**
     * Get the education level full name
     */
    public function getEducationLevelFullNameAttribute(): string
    {
        return match ($this->education_level) {
            'RA' => 'Raudhatul Athfal',
            'MI' => 'Madrasah Ibtidaiyah',
            'MTs' => 'Madrasah Tsanawiyah',
            'MA' => 'Madrasah Aliyah',
            'TK' => 'Taman Kanak-Kanak',
            'SD' => 'Sekolah Dasar',
            'SMP' => 'Sekolah Menengah Pertama',
            'SMA' => 'Sekolah Menengah Atas',
            'SMK' => 'Sekolah Menengah Kejuruan',
            default => $this->education_level,
        };
    }
}
