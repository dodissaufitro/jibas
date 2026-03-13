<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PpdbDokumen extends Model
{
    protected $table = 'ppdb_dokumen';

    protected $fillable = [
        'ppdb_pendaftaran_id',
        'jenis_dokumen',
        'file',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(PpdbPendaftaran::class, 'ppdb_pendaftaran_id');
    }
}
