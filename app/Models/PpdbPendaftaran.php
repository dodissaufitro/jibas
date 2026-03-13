<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PpdbPendaftaran extends Model
{
    protected $table = 'ppdb_pendaftaran';

    protected $fillable = [
        'no_pendaftaran',
        'tahun_ajaran_id',
        'jenjang_id',
        'jurusan_id',
        'nama_lengkap',
        'nisn',
        'nik',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'alamat',
        'email',
        'no_hp',
        'nama_ayah',
        'nama_ibu',
        'pekerjaan_ayah',
        'pekerjaan_ibu',
        'no_hp_ortu',
        'penghasilan_ortu',
        'jalur',
        'status',
        'catatan',
        'user_id',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'penghasilan_ortu' => 'integer',
    ];

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class);
    }

    public function jenjang(): BelongsTo
    {
        return $this->belongsTo(Jenjang::class);
    }

    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dokumen(): HasMany
    {
        return $this->hasMany(PpdbDokumen::class);
    }

    public function seleksi(): HasOne
    {
        return $this->hasOne(PpdbSeleksi::class);
    }

    public function pembayaran(): HasMany
    {
        return $this->hasMany(PpdbPembayaran::class);
    }
}
