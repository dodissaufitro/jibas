<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\JenisPembayaran;

class JenisPembayaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jenisPembayaran = [
            [
                'nama' => 'SPP',
                'kode' => 'SPP',
                'nominal' => 500000,
                'tipe' => 'bulanan',
                'keterangan' => 'Sumbangan Pembinaan Pendidikan bulanan',
                'is_active' => true,
            ],
            [
                'nama' => 'Uang Pendaftaran',
                'kode' => 'DAFTAR',
                'nominal' => 1000000,
                'tipe' => 'insidental',
                'keterangan' => 'Biaya pendaftaran siswa baru',
                'is_active' => true,
            ],
            [
                'nama' => 'Uang Gedung',
                'kode' => 'GEDUNG',
                'nominal' => 5000000,
                'tipe' => 'tahunan',
                'keterangan' => 'Biaya pembangunan dan pemeliharaan gedung',
                'is_active' => true,
            ],
            [
                'nama' => 'Ujian Tengah Semester',
                'kode' => 'UTS',
                'nominal' => 150000,
                'tipe' => 'insidental',
                'keterangan' => 'Biaya pelaksanaan UTS',
                'is_active' => true,
            ],
            [
                'nama' => 'Ujian Akhir Semester',
                'kode' => 'UAS',
                'nominal' => 150000,
                'tipe' => 'insidental',
                'keterangan' => 'Biaya pelaksanaan UAS',
                'is_active' => true,
            ],
            [
                'nama' => 'Seragam',
                'kode' => 'SERAGAM',
                'nominal' => 750000,
                'tipe' => 'tahunan',
                'keterangan' => 'Biaya seragam sekolah (3 stel)',
                'is_active' => true,
            ],
            [
                'nama' => 'Buku Pelajaran',
                'kode' => 'BUKU',
                'nominal' => 1200000,
                'tipe' => 'tahunan',
                'keterangan' => 'Biaya buku pelajaran satu tahun ajaran',
                'is_active' => true,
            ],
            [
                'nama' => 'Kegiatan Ekstrakurikuler',
                'kode' => 'EKSKUL',
                'nominal' => 200000,
                'tipe' => 'bulanan',
                'keterangan' => 'Biaya kegiatan ekstrakurikuler',
                'is_active' => true,
            ],
            [
                'nama' => 'Praktikum Komputer',
                'kode' => 'PRAKKOM',
                'nominal' => 100000,
                'tipe' => 'bulanan',
                'keterangan' => 'Biaya praktikum komputer',
                'is_active' => true,
            ],
            [
                'nama' => 'Study Tour',
                'kode' => 'TOUR',
                'nominal' => 2500000,
                'tipe' => 'insidental',
                'keterangan' => 'Biaya kegiatan study tour',
                'is_active' => false,
            ],
        ];

        foreach ($jenisPembayaran as $data) {
            JenisPembayaran::create($data);
        }

        $this->command->info('Berhasil menambahkan ' . count($jenisPembayaran) . ' jenis pembayaran.');
    }
}
