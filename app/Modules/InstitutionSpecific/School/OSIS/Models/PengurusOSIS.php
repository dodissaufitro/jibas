<?php

namespace App\Modules\InstitutionSpecific\School\OSIS\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengurusOSIS extends BaseModel
{
    protected $table = 'pengurus_osis';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'tahun_ajaran_id',
        'jabatan', // ketua, wakil, sekretaris, bendahara, seksi
        'seksi', // pendidikan, olahraga, seni, dll
        'periode_mulai',
        'periode_selesai',
        'status', // aktif, nonaktif
    ];

    protected $casts = [
        'periode_mulai' => 'date',
        'periode_selesai' => 'date',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeJabatan($query, string $jabatan)
    {
        return $query->where('jabatan', $jabatan);
    }
}
