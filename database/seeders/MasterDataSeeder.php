<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TahunAjaran;
use App\Models\Jenjang;
use App\Models\Jurusan;
use App\Models\Kelas;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tahun Ajaran
        $tahunAjaran = [
            [
                'nama' => '2023/2024',
                'tahun_mulai' => 2023,
                'tahun_selesai' => 2024,
                'is_active' => false,
            ],
            [
                'nama' => '2024/2025',
                'tahun_mulai' => 2024,
                'tahun_selesai' => 2025,
                'is_active' => true,
            ],
        ];

        foreach ($tahunAjaran as $data) {
            TahunAjaran::create($data);
        }
        $this->command->info('Tahun Ajaran berhasil ditambahkan.');

        // Jenjang
        $jenjang = [
            ['nama' => 'SD', 'kode' => 'SD', 'keterangan' => 'Sekolah Dasar'],
            ['nama' => 'SMP', 'kode' => 'SMP', 'keterangan' => 'Sekolah Menengah Pertama'],
            ['nama' => 'SMA', 'kode' => 'SMA', 'keterangan' => 'Sekolah Menengah Atas'],
            ['nama' => 'SMK', 'kode' => 'SMK', 'keterangan' => 'Sekolah Menengah Kejuruan'],
        ];

        foreach ($jenjang as $data) {
            Jenjang::create($data);
        }
        $this->command->info('Jenjang berhasil ditambahkan.');

        // Jurusan (untuk SMA/SMK)
        $sma = Jenjang::where('kode', 'SMA')->first();
        $smk = Jenjang::where('kode', 'SMK')->first();

        $jurusan = [
            ['jenjang_id' => $sma->id, 'nama' => 'IPA', 'kode' => 'IPA', 'keterangan' => 'Ilmu Pengetahuan Alam'],
            ['jenjang_id' => $sma->id, 'nama' => 'IPS', 'kode' => 'IPS', 'keterangan' => 'Ilmu Pengetahuan Sosial'],
            ['jenjang_id' => $sma->id, 'nama' => 'Bahasa', 'kode' => 'BHS', 'keterangan' => 'Jurusan Bahasa'],
            ['jenjang_id' => $smk->id, 'nama' => 'Teknik Komputer dan Jaringan', 'kode' => 'TKJ', 'keterangan' => 'Program Keahlian TKJ'],
            ['jenjang_id' => $smk->id, 'nama' => 'Rekayasa Perangkat Lunak', 'kode' => 'RPL', 'keterangan' => 'Program Keahlian RPL'],
            ['jenjang_id' => $smk->id, 'nama' => 'Multimedia', 'kode' => 'MM', 'keterangan' => 'Program Keahlian Multimedia'],
        ];

        foreach ($jurusan as $data) {
            Jurusan::create($data);
        }
        $this->command->info('Jurusan berhasil ditambahkan.');

        // Kelas
        // Ambil ID tahun ajaran aktif dan jenjang
        $tahunAjaranAktif = TahunAjaran::where('is_active', true)->first();
        $smp = Jenjang::where('kode', 'SMP')->first();
        $sma = Jenjang::where('kode', 'SMA')->first();
        $smk = Jenjang::where('kode', 'SMK')->first();

        $ipa = Jurusan::where('kode', 'IPA')->first();
        $ips = Jurusan::where('kode', 'IPS')->first();
        $tkj = Jurusan::where('kode', 'TKJ')->first();
        $rpl = Jurusan::where('kode', 'RPL')->first();

        $kelas = [];

        // Kelas SMP (VII, VIII, IX)
        if ($smp) {
            for ($tingkat = 7; $tingkat <= 9; $tingkat++) {
                for ($rombel = 1; $rombel <= 3; $rombel++) {
                    $tingkatRomawi = ['VII', 'VIII', 'IX'][$tingkat - 7];
                    $huruf = chr(64 + $rombel); // A, B, C
                    $kelas[] = [
                        'tahun_ajaran_id' => $tahunAjaranAktif->id,
                        'jenjang_id' => $smp->id,
                        'jurusan_id' => null,
                        'nama' => $tingkatRomawi . '-' . $huruf,
                        'tingkat' => $tingkat,
                        'nama_kelas' => $huruf,
                        'kapasitas' => 36,
                    ];
                }
            }
        }

        // Kelas SMA (X, XI, XII) - IPA dan IPS
        if ($sma) {
            for ($tingkat = 10; $tingkat <= 12; $tingkat++) {
                $tingkatRomawi = ['X', 'XI', 'XII'][$tingkat - 10];

                // Kelas X (belum ada jurusan)
                if ($tingkat == 10) {
                    for ($rombel = 1; $rombel <= 3; $rombel++) {
                        $huruf = chr(64 + $rombel); // A, B, C
                        $kelas[] = [
                            'tahun_ajaran_id' => $tahunAjaranAktif->id,
                            'jenjang_id' => $sma->id,
                            'jurusan_id' => null,
                            'nama' => $tingkatRomawi . '-' . $huruf,
                            'tingkat' => $tingkat,
                            'nama_kelas' => $huruf,
                            'kapasitas' => 36,
                        ];
                    }
                } else {
                    // Kelas XI dan XII (IPA dan IPS)
                    if ($ipa) {
                        for ($rombel = 1; $rombel <= 2; $rombel++) {
                            $kelas[] = [
                                'tahun_ajaran_id' => $tahunAjaranAktif->id,
                                'jenjang_id' => $sma->id,
                                'jurusan_id' => $ipa->id,
                                'nama' => $tingkatRomawi . ' IPA-' . $rombel,
                                'tingkat' => $tingkat,
                                'nama_kelas' => 'IPA-' . $rombel,
                                'kapasitas' => 36,
                            ];
                        }
                    }
                    if ($ips) {
                        for ($rombel = 1; $rombel <= 2; $rombel++) {
                            $kelas[] = [
                                'tahun_ajaran_id' => $tahunAjaranAktif->id,
                                'jenjang_id' => $sma->id,
                                'jurusan_id' => $ips->id,
                                'nama' => $tingkatRomawi . ' IPS-' . $rombel,
                                'tingkat' => $tingkat,
                                'nama_kelas' => 'IPS-' . $rombel,
                                'kapasitas' => 36,
                            ];
                        }
                    }
                }
            }
        }

        // Kelas SMK (X, XI, XII) - TKJ dan RPL
        if ($smk) {
            for ($tingkat = 10; $tingkat <= 12; $tingkat++) {
                $tingkatRomawi = ['X', 'XI', 'XII'][$tingkat - 10];

                if ($tkj) {
                    for ($rombel = 1; $rombel <= 2; $rombel++) {
                        $kelas[] = [
                            'tahun_ajaran_id' => $tahunAjaranAktif->id,
                            'jenjang_id' => $smk->id,
                            'jurusan_id' => $tkj->id,
                            'nama' => $tingkatRomawi . ' TKJ-' . $rombel,
                            'tingkat' => $tingkat,
                            'nama_kelas' => 'TKJ-' . $rombel,
                            'kapasitas' => 36,
                        ];
                    }
                }

                if ($rpl) {
                    for ($rombel = 1; $rombel <= 2; $rombel++) {
                        $kelas[] = [
                            'tahun_ajaran_id' => $tahunAjaranAktif->id,
                            'jenjang_id' => $smk->id,
                            'jurusan_id' => $rpl->id,
                            'nama' => $tingkatRomawi . ' RPL-' . $rombel,
                            'tingkat' => $tingkat,
                            'nama_kelas' => 'RPL-' . $rombel,
                            'kapasitas' => 36,
                        ];
                    }
                }
            }
        }

        foreach ($kelas as $data) {
            Kelas::create($data);
        }

        $this->command->info('Kelas berhasil ditambahkan. Total: ' . count($kelas) . ' kelas.');
    }
}
