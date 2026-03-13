<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Arsip extends Model
{
    protected $table = 'arsip';

    protected $fillable = [
        'kategori',
        'nomor_dokumen',
        'judul',
        'tanggal_dokumen',
        'file',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_dokumen' => 'date',
    ];
}
