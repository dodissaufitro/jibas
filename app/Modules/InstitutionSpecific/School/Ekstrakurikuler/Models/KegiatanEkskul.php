<?php

namespace App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models;

use App\Base\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KegiatanEkskul extends BaseModel
{
    protected $table = 'kegiatan_ekskul';

    protected $fillable = [
        'institution_id',
        'ekstrakurikuler_id',
        'nama_kegiatan',
        'jenis', // latihan_rutin, lomba, pentas, studi_banding
        'tanggal',
        'tempat',
        'deskripsi',
        'hasil',
        'dokumentasi', // JSON array of file paths
    ];

    protected $casts = [
        'tanggal' => 'date',
        'dokumentasi' => 'array',
    ];

    // Relationships
    public function ekstrakurikuler(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models\Ekstrakurikuler::class);
    }
}
