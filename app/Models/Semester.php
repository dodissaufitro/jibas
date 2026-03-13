<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    protected $table = 'semester';

    protected $fillable = [
        'tahun_ajaran_id',
        'semester',
        'is_active',
        'tanggal_mulai',
        'tanggal_selesai',
    ];

    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class);
    }

    public function nilai()
    {
        return $this->hasMany(Nilai::class);
    }

    public function raport()
    {
        return $this->hasMany(Raport::class);
    }

    public function ujian()
    {
        return $this->hasMany(Ujian::class);
    }
}
