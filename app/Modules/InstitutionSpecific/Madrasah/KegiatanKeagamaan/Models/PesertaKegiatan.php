<?php

namespace App\Modules\InstitutionSpecific\Madrasah\KegiatanKeagamaan\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PesertaKegiatan extends BaseModel
{
    protected $table = 'peserta_kegiatan';

    protected $fillable = [
        'institution_id',
        'kegiatan_id',
        'siswa_id',
        'status_kehadiran', // hadir, tidak_hadir, izin
        'nilai_partisipasi',
        'catatan',
    ];

    protected $casts = [
        'nilai_partisipasi' => 'integer',
    ];

    // Relationships
    public function kegiatan(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\InstitutionSpecific\Madrasah\KegiatanKeagamaan\Models\KegiatanKeagamaan::class, 'kegiatan_id');
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    // Scopes
    public function scopeHadir($query)
    {
        return $query->where('status_kehadiran', 'hadir');
    }
}
