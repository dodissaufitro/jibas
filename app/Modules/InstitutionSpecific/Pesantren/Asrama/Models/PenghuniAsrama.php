<?php

namespace App\Modules\InstitutionSpecific\Pesantren\Asrama\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenghuniAsrama extends BaseModel
{
    protected $table = 'penghuni_asrama';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'asrama_id',
        'kamar_id',
        'tanggal_masuk',
        'tanggal_keluar',
        'status',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_masuk' => 'date',
        'tanggal_keluar' => 'date',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function asrama(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\Asrama::class);
    }

    public function kamar(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\KamarAsrama::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif')
            ->whereNull('tanggal_keluar');
    }
}
