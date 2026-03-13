<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PpdbSeleksi extends Model
{
    protected $table = 'ppdb_seleksi';

    protected $fillable = [
        'ppdb_pendaftaran_id',
        'jenis_seleksi',
        'nilai',
        'keterangan',
        'status',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(PpdbPendaftaran::class, 'ppdb_pendaftaran_id');
    }
}
