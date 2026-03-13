<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Raport extends Model
{
    protected $table = 'raport';

    protected $fillable = [
        'siswa_id',
        'semester_id',
        'kelas_id',
        'ranking',
        'rata_rata',
        'total_sakit',
        'total_izin',
        'total_alpha',
        'catatan_wali_kelas',
        'is_published',
        'tanggal_terbit',
    ];

    protected $casts = [
        'tanggal_terbit' => 'date',
        'is_published' => 'boolean',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}
