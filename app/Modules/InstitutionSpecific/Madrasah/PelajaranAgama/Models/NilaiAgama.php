<?php

namespace App\Modules\InstitutionSpecific\Madrasah\PelajaranAgama\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NilaiAgama extends BaseModel
{
    protected $table = 'nilai_agama';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'semester_id',
        'mata_pelajaran', // quran_hadits, aqidah_akhlak, fiqh, ski, bahasa_arab
        'hafalan_surat', // JSON
        'nilai_tugas',
        'nilai_uts',
        'nilai_uas',
        'nilai_praktik',
        'nilai_akhir',
        'predikat',
        'catatan',
    ];

    protected $casts = [
        'hafalan_surat' => 'array',
        'nilai_tugas' => 'float',
        'nilai_uts' => 'float',
        'nilai_uas' => 'float',
        'nilai_praktik' => 'float',
        'nilai_akhir' => 'float',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    // Methods
    public function hitungNilaiAkhir(): float
    {
        return ($this->nilai_tugas * 0.2) +
            ($this->nilai_uts * 0.3) +
            ($this->nilai_uas * 0.3) +
            ($this->nilai_praktik * 0.2);
    }

    public function tentukanPredikat(): string
    {
        $nilai = $this->nilai_akhir;
        return match (true) {
            $nilai >= 90 => 'A',
            $nilai >= 80 => 'B',
            $nilai >= 70 => 'C',
            $nilai >= 60 => 'D',
            default => 'E',
        };
    }
}
