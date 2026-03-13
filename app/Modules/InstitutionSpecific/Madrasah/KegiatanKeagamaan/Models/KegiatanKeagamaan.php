<?php

namespace App\Modules\InstitutionSpecific\Madrasah\KegiatanKeagamaan\Models;

use App\Base\Models\BaseModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KegiatanKeagamaan extends BaseModel
{
    protected $table = 'kegiatan_keagamaan';

    protected $fillable = [
        'institution_id',
        'nama_kegiatan',
        'jenis', // pengajian, peringatan_hari_besar, pesantren_kilat, maulid, isra_miraj
        'pembicara',
        'tanggal_mulai',
        'tanggal_selesai',
        'waktu',
        'tempat',
        'penanggung_jawab_id',
        'target_peserta',
        'jumlah_peserta',
        'deskripsi',
        'materi',
        'dokumentasi',
        'status', // rencana, berlangsung, selesai
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'target_peserta' => 'integer',
        'jumlah_peserta' => 'integer',
        'dokumentasi' => 'array',
    ];

    // Relationships
    public function penanggungJawab(): BelongsTo
    {
        return $this->belongsTo(User::class, 'penanggung_jawab_id');
    }

    public function peserta(): HasMany
    {
        return $this->hasMany(\App\Modules\InstitutionSpecific\Madrasah\KegiatanKeagamaan\Models\PesertaKegiatan::class, 'kegiatan_id');
    }

    // Accessors
    public function getPersentasePesertaAttribute(): float
    {
        return $this->target_peserta > 0
            ? ($this->jumlah_peserta / $this->target_peserta) * 100
            : 0;
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->whereIn('status', ['rencana', 'berlangsung']);
    }

    public function scopeJenis($query, string $jenis)
    {
        return $query->where('jenis', $jenis);
    }

    public function scopeMendatang($query)
    {
        return $query->where('tanggal_mulai', '>=', now())
            ->where('status', 'rencana');
    }
}
