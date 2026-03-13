<?php

namespace App\Modules\InstitutionSpecific\Pesantren\Akhlak\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenilaianAkhlak extends BaseModel
{
    protected $table = 'penilaian_akhlak';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'semester_id',
        'aspek', // kejujuran, tanggung_jawab, disiplin, sopan_santun, kebersihan
        'nilai', // A, B, C, D
        'catatan',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    // Accessors
    public function getNilaiLabelAttribute(): string
    {
        return match ($this->nilai) {
            'A' => 'Sangat Baik',
            'B' => 'Baik',
            'C' => 'Cukup',
            'D' => 'Perlu Bimbingan',
            default => 'Unknown',
        };
    }
}
