<?php

namespace App\Modules\InstitutionSpecific\Pesantren\Hafalan\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use App\Models\User;
use App\Models\Institution;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Hafalan Quran Model
 * 
 * Model for tracking student's Quran memorization
 */
class HafalanQuran extends BaseModel
{
    protected $table = 'hafalan_quran';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'juz',
        'surat',
        'ayat_dari',
        'ayat_sampai',
        'tanggal_setoran',
        'penguji_id',
        'nilai',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_setoran' => 'date',
    ];

    // Relationships
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function penguji(): BelongsTo
    {
        return $this->belongsTo(User::class, 'penguji_id');
    }

    // Accessors
    public function getNilaiLabelAttribute(): string
    {
        return match ($this->nilai) {
            'A' => 'Sangat Baik (A)',
            'B' => 'Baik (B)',
            'C' => 'Cukup (C)',
            'D' => 'Perlu Perbaikan (D)',
            default => 'Unknown',
        };
    }

    public function getJumlahAyatAttribute(): int
    {
        return $this->ayat_sampai - $this->ayat_dari + 1;
    }

    // Scopes
    public function scopeForSiswa($query, $siswaId)
    {
        return $query->where('siswa_id', $siswaId);
    }

    public function scopeLulus($query)
    {
        return $query->whereIn('nilai', ['A', 'B', 'C']);
    }

    public function scopeByJuz($query, $juz)
    {
        return $query->where('juz', $juz);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('tanggal_setoran', '>=', now()->subDays($days));
    }
}
