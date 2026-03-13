<?php

namespace App\Modules\InstitutionSpecific\Pesantren\Asrama\Models;

use App\Base\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KamarAsrama extends BaseModel
{
    protected $table = 'kamar_asrama';

    protected $fillable = [
        'institution_id',
        'asrama_id',
        'nomor_kamar',
        'lantai',
        'kapasitas',
        'terisi',
        'fasilitas',
        'status',
    ];

    protected $casts = [
        'kapasitas' => 'integer',
        'terisi' => 'integer',
        'fasilitas' => 'array',
    ];

    // Relationships
    public function asrama(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\Asrama::class);
    }

    public function penghuni(): HasMany
    {
        return $this->hasMany(\App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\PenghuniAsrama::class, 'kamar_id');
    }

    // Accessors
    public function getSisaKapasitasAttribute(): int
    {
        return $this->kapasitas - $this->terisi;
    }

    public function getIsFullAttribute(): bool
    {
        return $this->terisi >= $this->kapasitas;
    }
}
