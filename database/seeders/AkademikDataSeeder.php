<?php

namespace Database\Seeders;

use App\Models\MataPelajaran;
use App\Models\Semester;
use App\Models\TahunAjaran;
use Illuminate\Database\Seeder;

class AkademikDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil tahun ajaran yang aktif
        $tahunAjaran = TahunAjaran::where('is_active', true)->first();

        if (!$tahunAjaran) {
            $this->command->warn('Tahun ajaran aktif tidak ditemukan. Run MasterDataSeeder terlebih dahulu.');
            return;
        }

        // Semester
        $semester = [
            [
                'tahun_ajaran_id' => $tahunAjaran->id,
                'semester' => 'ganjil',
                'is_active' => true,
                'tanggal_mulai' => $tahunAjaran->tahun_mulai . '-07-01',
                'tanggal_selesai' => $tahunAjaran->tahun_mulai . '-12-31',
            ],
            [
                'tahun_ajaran_id' => $tahunAjaran->id,
                'semester' => 'genap',
                'is_active' => false,
                'tanggal_mulai' => $tahunAjaran->tahun_selesai . '-01-01',
                'tanggal_selesai' => $tahunAjaran->tahun_selesai . '-06-30',
            ],
        ];

        foreach ($semester as $data) {
            Semester::create($data);
        }
        $this->command->info('Semester berhasil ditambahkan.');

        // Mata Pelajaran
        $jenjang = \App\Models\Jenjang::all();

        if ($jenjang->isEmpty()) {
            $this->command->warn('Jenjang tidak ditemukan. Run MasterDataSeeder terlebih dahulu.');
            return;
        }

        // Ambil jenjang pertama (bisa SD, SMP, SMA, atau SMK)
        $jenjangId = $jenjang->first()->id;

        $mataPelajaran = [
            ['nama' => 'Matematika', 'kode' => 'MTK', 'jenjang_id' => $jenjangId, 'jenis' => 'wajib', 'kkm' => 75],
            ['nama' => 'Bahasa Indonesia', 'kode' => 'BIND', 'jenjang_id' => $jenjangId, 'jenis' => 'wajib', 'kkm' => 75],
            ['nama' => 'Bahasa Inggris', 'kode' => 'BING', 'jenjang_id' => $jenjangId, 'jenis' => 'wajib', 'kkm' => 75],
            ['nama' => 'IPA', 'kode' => 'IPA', 'jenjang_id' => $jenjangId, 'jenis' => 'wajib', 'kkm' => 75],
            ['nama' => 'IPS', 'kode' => 'IPS', 'jenjang_id' => $jenjangId, 'jenis' => 'wajib', 'kkm' => 75],
            ['nama' => 'Pendidikan Agama Islam', 'kode' => 'PAI', 'jenjang_id' => $jenjangId, 'jenis' => 'wajib', 'kkm' => 75],
            ['nama' => 'Pendidikan Kewarganegaraan', 'kode' => 'PKN', 'jenjang_id' => $jenjangId, 'jenis' => 'wajib', 'kkm' => 75],
            ['nama' => 'Seni Budaya', 'kode' => 'SBDP', 'jenjang_id' => $jenjangId, 'jenis' => 'wajib', 'kkm' => 75],
            ['nama' => 'Pendidikan Jasmani', 'kode' => 'PJOK', 'jenjang_id' => $jenjangId, 'jenis' => 'wajib', 'kkm' => 75],
            ['nama' => 'Fisika', 'kode' => 'FIS', 'jenjang_id' => $jenjangId, 'jenis' => 'peminatan', 'kkm' => 75],
            ['nama' => 'Kimia', 'kode' => 'KIM', 'jenjang_id' => $jenjangId, 'jenis' => 'peminatan', 'kkm' => 75],
            ['nama' => 'Biologi', 'kode' => 'BIO', 'jenjang_id' => $jenjangId, 'jenis' => 'peminatan', 'kkm' => 75],
            ['nama' => 'Ekonomi', 'kode' => 'EKO', 'jenjang_id' => $jenjangId, 'jenis' => 'peminatan', 'kkm' => 75],
            ['nama' => 'Sosiologi', 'kode' => 'SOS', 'jenjang_id' => $jenjangId, 'jenis' => 'peminatan', 'kkm' => 75],
            ['nama' => 'Geografi', 'kode' => 'GEO', 'jenjang_id' => $jenjangId, 'jenis' => 'peminatan', 'kkm' => 75],
        ];

        foreach ($mataPelajaran as $data) {
            MataPelajaran::create($data);
        }
        $this->command->info('Mata Pelajaran berhasil ditambahkan. Total: ' . count($mataPelajaran) . ' mata pelajaran.');
    }
}
