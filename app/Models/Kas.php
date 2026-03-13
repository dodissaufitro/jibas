<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kas extends Model
{
    protected $table = 'kas';

    protected $fillable = [
        'tanggal',
        'jenis',
        'kategori',
        'keterangan',
        'debit',
        'kredit',
        'saldo',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];
}
