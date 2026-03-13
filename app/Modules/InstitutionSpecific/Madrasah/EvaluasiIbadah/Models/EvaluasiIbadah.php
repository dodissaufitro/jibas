<?php

namespace App\Modules\InstitutionSpecific\Madrasah\EvaluasiIbadah\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluasiIbadah extends BaseModel
{
    protected $table = 'evaluasi_ibadah';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'periode', // bulanan
        'bulan',
        'tahun',
        'shalat_fardhu', // persentase kehadiran
        'shalat_dhuha',
        'shalat_tahajud',
        'membaca_quran', // persentase kehadiran
        'hafalan_quran', // jumlah halaman/juz
        'puasa_sunnah', // jumlah hari
        'infaq_sedekah',
        'kegiatan_keagamaan', // jumlah kehadiran
        'nilai_total',
        'predikat',
        'catatan',
    ];

    protected $casts = [
        'bulan' => 'integer',
        'tahun' => 'integer',
        'shalat_fardhu' => 'float',
        'shalat_dhuha' => 'float',
        'shalat_tahajud' => 'float',
        'membaca_quran' => 'float',
        'hafalan_quran' => 'float',
        'puasa_sunnah' => 'integer',
        'infaq_sedekah' => 'integer',
        'kegiatan_keagamaan' => 'integer',
        'nilai_total' => 'float',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    // Methods
    public function hitungNilaiTotal(): float
    {
        return ($this->shalat_fardhu * 0.3) +
            ($this->shalat_dhuha * 0.1) +
            ($this->shalat_tahajud * 0.1) +
            ($this->membaca_quran * 0.2) +
            (min($this->hafalan_quran * 2, 20) * 0.1) +
            (min($this->puasa_sunnah * 2, 10) * 0.1) +
            (min($this->kegiatan_keagamaan * 1, 10) * 0.1);
    }

    public function tentukanPredikat(): string
    {
        $nilai = $this->nilai_total;
        return match (true) {
            $nilai >= 90 => 'Sangat Baik',
            $nilai >= 75 => 'Baik',
            $nilai >= 60 => 'Cukup',
            default => 'Perlu Bimbingan',
        };
    }

    // Scopes
    public function scopePeriode($query, int $bulan, int $tahun)
    {
        return $query->where('bulan', $bulan)->where('tahun', $tahun);
    }
}
