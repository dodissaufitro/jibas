<?php

namespace App\Modules\InstitutionSpecific\Pesantren\Akhlak\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PembinaanAkhlak extends BaseModel
{
    protected $table = 'pembinaan_akhlak';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'pembina_id',
        'jenis_pembinaan', // peringatan, bimbingan, penghargaan
        'kategori', // ibadah, adab, kedisiplinan, kebersihan, dll
        'deskripsi',
        'tindak_lanjut',
        'tanggal',
        'status', // proses, selesai
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function pembina(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pembina_id');
    }

    // Scopes
    public function scopeJenisPeringatan($query)
    {
        return $query->where('jenis_pembinaan', 'peringatan');
    }

    public function scopeJenisPenghargaan($query)
    {
        return $query->where('jenis_pembinaan', 'penghargaan');
    }

    public function scopeProses($query)
    {
        return $query->where('status', 'proses');
    }
}
