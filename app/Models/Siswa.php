<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Siswa extends Model
{
    protected $table = 'siswa';

    protected $fillable = [
        'user_id',
        'institution_id',
        'nis',
        'nisn',
        'nik',
        'nama_lengkap',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'alamat',
        'email',
        'no_hp',
        'foto',
        'nama_ayah',
        'nama_ibu',
        'no_hp_ortu',
        'kelas_id',
        'status',
        'tanggal_masuk',
        'tanggal_keluar',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_masuk' => 'date',
        'tanggal_keluar' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function orangTua(): HasOne
    {
        return $this->hasOne(OrangTua::class);
    }

    public function nilai(): HasMany
    {
        return $this->hasMany(Nilai::class);
    }

    public function presensi(): HasMany
    {
        return $this->hasMany(PresensiSiswa::class);
    }

    public function tagihan(): HasMany
    {
        return $this->hasMany(Tagihan::class);
    }

    /**
     * Get common relations for listing pages (lightweight)
     */
    public function getCommonRelations(): array
    {
        return [
            'kelas.jenjang',
            'kelas.jurusan',
            'institution:id,name',
        ];
    }

    /**
     * Get detailed relations for detail/show pages
     */
    public function getDetailRelations(): array
    {
        return [
            'kelas.jenjang',
            'kelas.jurusan',
            'institution',
            'user',
            'orangTua',
            'presensi' => fn($q) => $q->orderBy('tanggal', 'desc')->limit(30),
            'tagihan' => fn($q) => $q->with('pembayaran')->orderBy('created_at', 'desc'),
            'nilai.mataPelajaran',
        ];
    }

    /**
     * Scope for efficient listing with pagination
     */
    public function scopeForListing($query)
    {
        return $query->with($this->getCommonRelations())
            ->select('siswa.*'); // Explicit select to allow joins
    }
}
