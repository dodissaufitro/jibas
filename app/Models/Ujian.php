<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ujian extends Model
{
    protected $table = 'ujian';

    protected $fillable = [
        'mata_pelajaran_id',
        'guru_id',
        'kelas_id',
        'tahun_ajaran_id',
        'semester_id',
        'judul_ujian',
        'jenis_ujian',
        'tanggal_ujian',
        'durasi_menit',
        'bobot',
        'kkm',
        'keterangan',
        'status',
    ];

    protected $casts = [
        'tanggal_ujian' => 'datetime',
        'durasi_menit' => 'integer',
        'bobot' => 'decimal:2',
        'kkm' => 'decimal:2',
    ];

    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function nilai(): HasMany
    {
        return $this->hasMany(Nilai::class);
    }

    public function soalUjian(): HasMany
    {
        return $this->hasMany(SoalUjian::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeBerlangsung($query)
    {
        return $query->where('status', 'berlangsung');
    }
}
