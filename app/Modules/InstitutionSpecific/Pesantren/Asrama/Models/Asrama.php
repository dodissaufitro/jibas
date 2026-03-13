<?php

namespace App\Modules\InstitutionSpecific\Pesantren\Asrama\Models;

use App\Base\Models\BaseModel;
use App\Models\Institution;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asrama extends BaseModel
{
    protected $table = 'asrama';

    protected $fillable = [
        'institution_id',
        'nama_asrama',
        'jenis', // putra/putri
        'kapasitas',
        'terisi',
        'pengurus_id',
        'alamat',
        'fasilitas',
        'status',
    ];

    protected $casts = [
        'kapasitas' => 'integer',
        'terisi' => 'integer',
        'fasilitas' => 'array',
    ];

    // Relationships
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function pengurus(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Guru::class, 'pengurus_id');
    }

    public function kamar(): HasMany
    {
        return $this->hasMany(\App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\KamarAsrama::class, 'asrama_id');
    }

    public function penghuni(): HasMany
    {
        return $this->hasMany(\App\Modules\InstitutionSpecific\Pesantren\Asrama\Models\PenghuniAsrama::class, 'asrama_id');
    }

    // Accessors
    public function getSisaKapasitasAttribute(): int
    {
        return $this->kapasitas - $this->terisi;
    }

    public function getPersentaseTerisiAttribute(): float
    {
        return $this->kapasitas > 0 ? ($this->terisi / $this->kapasitas) * 100 : 0;
    }

    // Scopes
    public function scopeJenisPutra($query)
    {
        return $query->where('jenis', 'putra');
    }

    public function scopeJenisPutri($query)
    {
        return $query->where('jenis', 'putri');
    }

    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }
}
