<?php

namespace App\Modules\InstitutionSpecific\School\OSIS\Models;

use App\Base\Models\BaseModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KegiatanOSIS extends BaseModel
{
    protected $table = 'kegiatan_osis';

    protected $fillable = [
        'institution_id',
        'nama_kegiatan',
        'kategori', // bakti_sosial, lomba, seminar, upacara, dll
        'tanggal_mulai',
        'tanggal_selesai',
        'tempat',
        'penanggung_jawab_id',
        'anggaran',
        'realisasi_anggaran',
        'deskripsi',
        'hasil',
        'dokumentasi',
        'status', // rencana, berlangsung, selesai
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'anggaran' => 'integer',
        'realisasi_anggaran' => 'integer',
        'dokumentasi' => 'array',
    ];

    // Relationships
    public function penanggungJawab(): BelongsTo
    {
        return $this->belongsTo(User::class, 'penanggung_jawab_id');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->whereIn('status', ['rencana', 'berlangsung']);
    }

    public function scopeSelesai($query)
    {
        return $query->where('status', 'selesai');
    }
}
