<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jenjang extends Model
{
    protected $table = 'jenjang';

    protected $fillable = [
        'nama',
        'kode',
        'keterangan',
    ];

    public function jurusan(): HasMany
    {
        return $this->hasMany(Jurusan::class);
    }

    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class);
    }

    public function mataPelajaran(): HasMany
    {
        return $this->hasMany(MataPelajaran::class);
    }
}
