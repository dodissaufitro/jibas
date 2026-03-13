<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisPembayaran extends Model
{
    protected $table = 'jenis_pembayaran';

    protected $fillable = [
        'nama',
        'kode',
        'nominal',
        'tipe',
        'keterangan',
        'is_active',
    ];

    protected $casts = [
        'nominal' => 'integer',
        'is_active' => 'boolean',
    ];

    public function tagihan(): HasMany
    {
        return $this->hasMany(Tagihan::class);
    }
}
