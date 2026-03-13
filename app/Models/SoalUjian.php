<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SoalUjian extends Model
{
    protected $table = 'soal_ujian';

    protected $fillable = [
        'ujian_id',
        'nomor_soal',
        'tipe_soal',
        'pertanyaan',
        'opsi_a',
        'opsi_b',
        'opsi_c',
        'opsi_d',
        'opsi_e',
        'jawaban_benar',
        'pembahasan',
        'file_soal',
        'bobot',
    ];

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }
}
