<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tagihan extends Model
{
    protected $table = 'tagihan';

    protected $fillable = [
        'siswa_id',
        'jenis_pembayaran_id',
        'nomor_tagihan',
        'bulan',
        'tahun',
        'jumlah',
        'denda',
        'total',
        'jatuh_tempo',
        'status',
        'keterangan',
    ];

    protected $casts = [
        'jatuh_tempo' => 'date',
        'bulan' => 'integer',
        'tahun' => 'integer',
        'jumlah' => 'integer',
        'denda' => 'integer',
        'total' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tagihan) {
            if (empty($tagihan->nomor_tagihan)) {
                $tagihan->nomor_tagihan = 'TGH-' . date('Ymd') . '-' . str_pad(Tagihan::whereDate('created_at', today())->count() + 1, 4, '0', STR_PAD_LEFT);
            }
            $tagihan->total = $tagihan->jumlah + ($tagihan->denda ?? 0);
        });

        static::updating(function ($tagihan) {
            $tagihan->total = $tagihan->jumlah + ($tagihan->denda ?? 0);
        });
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function jenisPembayaran(): BelongsTo
    {
        return $this->belongsTo(JenisPembayaran::class);
    }

    public function pembayaran(): HasMany
    {
        return $this->hasMany(Pembayaran::class);
    }
}
