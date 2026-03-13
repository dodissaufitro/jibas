<?php

namespace App\Modules\InstitutionSpecific\School\Analisis\Models;

use App\Base\Models\BaseModel;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestasiSiswa extends BaseModel
{
    protected $table = 'prestasi_siswa';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'jenis', // akademik, non_akademik
        'kategori', // olimpiade, lomba, kejuaraan, penghargaan
        'nama_prestasi',
        'tingkat', // sekolah, kecamatan, kabupaten, provinsi, nasional, internasional
        'peringkat', // juara_1, juara_2, juara_3, harapan_1, dll
        'penyelenggara',
        'tanggal',
        'sertifikat', // file path
        'keterangan',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    // Accessors
    public function getPoinAttribute(): int
    {
        $tingkatPoin = [
            'sekolah' => 10,
            'kecamatan' => 20,
            'kabupaten' => 30,
            'provinsi' => 50,
            'nasional' => 100,
            'internasional' => 200,
        ];

        $peringkatPoin = [
            'juara_1' => 1.5,
            'juara_2' => 1.3,
            'juara_3' => 1.2,
            'harapan_1' => 1.1,
        ];

        $basePoin = $tingkatPoin[$this->tingkat] ?? 0;
        $multiplier = $peringkatPoin[$this->peringkat] ?? 1;

        return (int) ($basePoin * $multiplier);
    }

    // Scopes
    public function scopeJenisAkademik($query)
    {
        return $query->where('jenis', 'akademik');
    }

    public function scopeJenisNonAkademik($query)
    {
        return $query->where('jenis', 'non_akademik');
    }

    public function scopeTingkat($query, string $tingkat)
    {
        return $query->where('tingkat', $tingkat);
    }
}
