<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JawabanSiswa extends Model
{
    use HasFactory;

    protected $table = 'jawaban_siswa';

    protected $fillable = [
        'ujian_siswa_id',
        'soal_ujian_id',
        'jawaban',
        'jawaban_essay',
        'is_benar',
        'nilai',
    ];

    protected $casts = [
        'is_benar' => 'boolean',
        'nilai' => 'decimal:2',
    ];

    public function ujianSiswa()
    {
        return $this->belongsTo(UjianSiswa::class);
    }

    public function soalUjian()
    {
        return $this->belongsTo(SoalUjian::class);
    }
}
