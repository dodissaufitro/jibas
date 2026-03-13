<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Komunikasi extends Model
{
    protected $table = 'komunikasi';

    protected $fillable = [
        'pengirim_id',
        'penerima_id',
        'judul',
        'isi',
        'jenis',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];
}
