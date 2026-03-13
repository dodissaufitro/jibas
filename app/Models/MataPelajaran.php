<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MataPelajaran extends Model
{
    protected $table = 'mata_pelajaran';

    protected $fillable = [
        'nama',
        'kode',
        'jenjang_id',
        'kkm',
        'jenis',
    ];

    public function jenjang()
    {
        return $this->belongsTo(Jenjang::class);
    }

    public function jadwalPelajaran()
    {
        return $this->hasMany(JadwalPelajaran::class);
    }

    public function nilai()
    {
        return $this->hasMany(Nilai::class);
    }

    public function ujian()
    {
        return $this->hasMany(Ujian::class);
    }
}
