<?php

namespace App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models;

use App\Base\Models\BaseModel;
use App\Models\Guru;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ekstrakurikuler extends BaseModel
{
    protected $table = 'ekstrakurikuler';

    protected $fillable = [
        'institution_id',
        'nama_ekskul',
        'kategori', // olahraga, seni, sains, bahasa, keagamaan
        'pembina_id',
        'jadwal', // JSON: hari, waktu
        'tempat',
        'kuota',
        'terisi',
        'biaya',
        'deskripsi',
        'status', // aktif, nonaktif
    ];

    protected $casts = [
        'jadwal' => 'array',
        'kuota' => 'integer',
        'terisi' => 'integer',
        'biaya' => 'integer',
    ];

    // Relationships
    public function pembina(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'pembina_id');
    }

    public function anggota(): HasMany
    {
        return $this->hasMany(\App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models\AnggotaEkskul::class, 'ekstrakurikuler_id');
    }

    public function kegiatan(): HasMany
    {
        return $this->hasMany(\App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Models\KegiatanEkskul::class, 'ekstrakurikuler_id');
    }

    // Accessors
    public function getSisaKuotaAttribute(): int
    {
        return $this->kuota - $this->terisi;
    }

    public function getIsFullAttribute(): bool
    {
        return $this->terisi >= $this->kuota;
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeKategori($query, string $kategori)
    {
        return $query->where('kategori', $kategori);
    }
}
