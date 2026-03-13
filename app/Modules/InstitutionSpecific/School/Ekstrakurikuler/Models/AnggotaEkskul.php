<?php

namespace App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnggotaEkskul extends BaseModel
{
    protected $table = 'anggota_ekskul';

    protected $fillable = [
        'institution_id',
        'ekstrakurikuler_id',
        'siswa_id',
        'tahun_ajaran_id',
        'tanggal_daftar',
        'jabatan', // ketua, wakil, sekretaris, anggota
        'status', // aktif, keluar
        'nilai_akhir',
        'predikat',
    ];

    protected $casts = [
        'tanggal_daftar' => 'date',
    ];

    // Relationships
    public function ekstrakurikuler(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models\Ekstrakurikuler::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }
}
