<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanKeuangan extends Model
{
    protected $table = 'laporan_keuangan';

    protected $fillable = [
        'tahun_ajaran_id',
        'periode',
        'jenis',
        'total_pemasukan',
        'total_pengeluaran',
        'saldo_akhir',
        'file',
    ];

    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class);
    }
}
