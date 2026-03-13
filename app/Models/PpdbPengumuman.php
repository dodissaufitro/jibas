<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PpdbPengumuman extends Model
{
    protected $table = 'ppdb_pengumuman';

    protected $fillable = [
        'tahun_ajaran_id',
        'judul',
        'isi',
        'tanggal_pengumuman',
        'is_published',
    ];

    protected $casts = [
        'tanggal_pengumuman' => 'date',
        'is_published' => 'boolean',
    ];

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class);
    }
}
