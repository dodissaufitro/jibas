<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PpdbPembayaran extends Model
{
    protected $table = 'ppdb_pembayaran';

    protected $fillable = [
        'ppdb_pendaftaran_id',
        'jenis_pembayaran',
        'jumlah',
        'status_bayar',
        'bukti_bayar',
        'tanggal_bayar',
    ];

    protected $casts = [
        'tanggal_bayar' => 'date',
        'jumlah' => 'integer',
    ];

    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(PpdbPendaftaran::class, 'ppdb_pendaftaran_id');
    }
}
