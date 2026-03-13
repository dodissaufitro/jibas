<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RekapPresensiSiswa extends Model
{
    protected $table = 'rekap_presensi_siswa';

    protected $fillable = [
        'siswa_id',
        'kelas_id',
        'bulan',
        'tahun',
        'total_hadir',
        'total_izin',
        'total_sakit',
        'total_alpha',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}
