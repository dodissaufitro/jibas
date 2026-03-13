<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    protected $table = 'pembayaran';

    protected $fillable = [
        'tagihan_id',
        'jumlah',
        'tanggal_bayar',
        'metode',
        'bukti',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_bayar' => 'date',
    ];

    public function tagihan()
    {
        return $this->belongsTo(Tagihan::class);
    }
}
