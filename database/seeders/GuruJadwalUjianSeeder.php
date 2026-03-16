<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class GuruJadwalUjianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeder ini membuat:
     * 1. Guru-guru pengajar
     * 2. User untuk login guru
     * 3. Jadwal pelajaran di Kelas A
     * 4. Ujian dari guru-guru tersebut
     * 5. Soal-soal ujian
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting GuruJadwalUjianSeeder...');

        // Clean up existing data dari seeder sebelumnya
        $this->command->info('🧹 Cleaning up existing data...');
        DB::table('soal_ujian')->whereIn('ujian_id', function ($query) {
            $query->select('id')->from('ujian')->whereIn('guru_id', function ($q) {
                $q->select('id')->from('guru')->whereIn('email', [
                    'guru.matematika@jibas.com',
                    'guru.ipa@jibas.com',
                    'guru.bahasa@jibas.com'
                ]);
            });
        })->delete();

        DB::table('ujian')->whereIn('guru_id', function ($query) {
            $query->select('id')->from('guru')->whereIn('email', [
                'guru.matematika@jibas.com',
                'guru.ipa@jibas.com',
                'guru.bahasa@jibas.com'
            ]);
        })->delete();

        DB::table('jadwal_pelajaran')->whereIn('guru_id', function ($query) {
            $query->select('id')->from('guru')->whereIn('email', [
                'guru.matematika@jibas.com',
                'guru.ipa@jibas.com',
                'guru.bahasa@jibas.com'
            ]);
        })->delete();

        $guruIds = DB::table('guru')->whereIn('email', [
            'guru.matematika@jibas.com',
            'guru.ipa@jibas.com',
            'guru.bahasa@jibas.com'
        ])->pluck('user_id');

        DB::table('user_roles')->whereIn('user_id', $guruIds)->delete();
        DB::table('guru')->whereIn('email', [
            'guru.matematika@jibas.com',
            'guru.ipa@jibas.com',
            'guru.bahasa@jibas.com'
        ])->delete();

        DB::table('users')->whereIn('email', [
            'guru.matematika@jibas.com',
            'guru.ipa@jibas.com',
            'guru.bahasa@jibas.com'
        ])->delete();

        $this->command->info('✅ Cleanup completed');

        // Get IDs yang sudah ada - menggunakan kelas pertama (VII-A)
        $kelasA = DB::table('kelas')->where('id', 1)->first();
        $tahunAjaran = DB::table('tahun_ajaran')->first();
        $semester = DB::table('semester')->first();

        if (!$kelasA) {
            $this->command->error('Kelas tidak ditemukan! Jalankan migration terlebih dahulu.');
            return;
        }

        $this->command->info("Using Kelas: {$kelasA->nama} (ID: {$kelasA->id})");

        // Get mata pelajaran
        $matematika = DB::table('mata_pelajaran')->where('nama', 'Matematika')->first();
        $ipa = DB::table('mata_pelajaran')->where('nama', 'IPA')->first();
        $bahasaIndonesia = DB::table('mata_pelajaran')->where('nama', 'Bahasa Indonesia')->first();
        $bahasaInggris = DB::table('mata_pelajaran')->where('nama', 'Bahasa Inggris')->first();

        // ==========================================
        // 1. CREATE GURU
        // ==========================================
        $this->command->info('📚 Creating Guru...');

        // Guru 1: Matematika
        $userMatematika = DB::table('users')->insertGetId([
            'name' => 'Budi Santoso, S.Pd',
            'email' => 'guru.matematika@jibas.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $guruMatematika = DB::table('guru')->insertGetId([
            'user_id' => $userMatematika,
            'institution_id' => 1,
            'nip' => '198501012010011001',
            'nik' => '3171051985010001',
            'nama_lengkap' => 'Budi Santoso, S.Pd',
            'gelar_depan' => null,
            'gelar_belakang' => 'S.Pd',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1985-01-01',
            'no_hp' => '081234567801',
            'email' => 'guru.matematika@jibas.com',
            'alamat' => 'Jl. Pendidikan No. 10, Jakarta',
            'status' => 'aktif',
            'tanggal_masuk' => '2010-07-01',
            'pendidikan_terakhir' => 'S1',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Guru 2: IPA
        $userIPA = DB::table('users')->insertGetId([
            'name' => 'Siti Nurhaliza, M.Pd',
            'email' => 'guru.ipa@jibas.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $guruIPA = DB::table('guru')->insertGetId([
            'user_id' => $userIPA,
            'institution_id' => 1,
            'nip' => '198703152011012002',
            'nik' => '3273155198703002',
            'nama_lengkap' => 'Siti Nurhaliza, M.Pd',
            'gelar_depan' => null,
            'gelar_belakang' => 'M.Pd',
            'jenis_kelamin' => 'P',
            'tempat_lahir' => 'Bandung',
            'tanggal_lahir' => '1987-03-15',
            'no_hp' => '081234567802',
            'email' => 'guru.ipa@jibas.com',
            'alamat' => 'Jl. Sains No. 25, Bandung',
            'status' => 'aktif',
            'tanggal_masuk' => '2011-07-01',
            'pendidikan_terakhir' => 'S2',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Guru 3: Bahasa Indonesia
        $userBahasaIndonesia = DB::table('users')->insertGetId([
            'name' => 'Ahmad Yani, S.S',
            'email' => 'guru.bahasa@jibas.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $guruBahasaIndonesia = DB::table('guru')->insertGetId([
            'user_id' => $userBahasaIndonesia,
            'institution_id' => 1,
            'nip' => '199002202012011003',
            'nik' => '3578201990022003',
            'nama_lengkap' => 'Ahmad Yani, S.S',
            'gelar_depan' => null,
            'gelar_belakang' => 'S.S',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Surabaya',
            'tanggal_lahir' => '1990-02-20',
            'no_hp' => '081234567803',
            'email' => 'guru.bahasa@jibas.com',
            'alamat' => 'Jl. Sastra No. 15, Surabaya',
            'status' => 'aktif',
            'tanggal_masuk' => '2012-07-01',
            'pendidikan_terakhir' => 'S1',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info("✅ Created 3 Guru");

        // Assign role 'guru' to all guru users
        $guruRole = DB::table('roles')->where('name', 'guru')->first();
        if ($guruRole) {
            DB::table('user_roles')->insert([
                ['role_id' => $guruRole->id, 'user_id' => $userMatematika],
                ['role_id' => $guruRole->id, 'user_id' => $userIPA],
                ['role_id' => $guruRole->id, 'user_id' => $userBahasaIndonesia],
            ]);
            $this->command->info("✅ Assigned 'guru' role to all teachers");
        }

        // ==========================================
        // 2. CREATE JADWAL PELAJARAN
        // ==========================================
        $this->command->info('📅 Creating Jadwal Pelajaran...');

        $jadwalData = [
            // Matematika - Senin & Rabu
            [
                'tahun_ajaran_id' => $tahunAjaran->id,
                'kelas_id' => $kelasA->id,
                'mata_pelajaran_id' => $matematika->id,
                'guru_id' => $guruMatematika,
                'hari' => 'Senin',
                'jam_mulai' => '07:30:00',
                'jam_selesai' => '09:00:00',
                'ruangan' => 'Ruang 101',
            ],
            [
                'tahun_ajaran_id' => $tahunAjaran->id,
                'kelas_id' => $kelasA->id,
                'mata_pelajaran_id' => $matematika->id,
                'guru_id' => $guruMatematika,
                'hari' => 'Rabu',
                'jam_mulai' => '07:30:00',
                'jam_selesai' => '09:00:00',
                'ruangan' => 'Ruang 101',
            ],
            // IPA - Selasa & Kamis
            [
                'tahun_ajaran_id' => $tahunAjaran->id,
                'kelas_id' => $kelasA->id,
                'mata_pelajaran_id' => $ipa->id,
                'guru_id' => $guruIPA,
                'hari' => 'Selasa',
                'jam_mulai' => '09:15:00',
                'jam_selesai' => '10:45:00',
                'ruangan' => 'Lab IPA',
            ],
            [
                'tahun_ajaran_id' => $tahunAjaran->id,
                'kelas_id' => $kelasA->id,
                'mata_pelajaran_id' => $ipa->id,
                'guru_id' => $guruIPA,
                'hari' => 'Kamis',
                'jam_mulai' => '09:15:00',
                'jam_selesai' => '10:45:00',
                'ruangan' => 'Lab IPA',
            ],
            // Bahasa Indonesia - Senin & Jumat
            [
                'tahun_ajaran_id' => $tahunAjaran->id,
                'kelas_id' => $kelasA->id,
                'mata_pelajaran_id' => $bahasaIndonesia->id,
                'guru_id' => $guruBahasaIndonesia,
                'hari' => 'Senin',
                'jam_mulai' => '09:15:00',
                'jam_selesai' => '10:45:00',
                'ruangan' => 'Ruang 102',
            ],
            [
                'tahun_ajaran_id' => $tahunAjaran->id,
                'kelas_id' => $kelasA->id,
                'mata_pelajaran_id' => $bahasaIndonesia->id,
                'guru_id' => $guruBahasaIndonesia,
                'hari' => 'Jumat',
                'jam_mulai' => '07:30:00',
                'jam_selesai' => '09:00:00',
                'ruangan' => 'Ruang 102',
            ],
        ];

        foreach ($jadwalData as $jadwal) {
            DB::table('jadwal_pelajaran')->insert(array_merge($jadwal, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $this->command->info("✅ Created " . count($jadwalData) . " Jadwal Pelajaran");

        // ==========================================
        // 3. CREATE UJIAN
        // ==========================================
        $this->command->info('📝 Creating Ujian...');

        $ujianData = [
            // Ujian Matematika 1
            [
                'mata_pelajaran_id' => $matematika->id,
                'guru_id' => $guruMatematika,
                'kelas_id' => $kelasA->id,
                'tahun_ajaran_id' => $tahunAjaran->id,
                'semester_id' => $semester->id,
                'judul_ujian' => 'Ulangan Harian Matematika - Aljabar',
                'jenis_ujian' => 'Harian',
                'tanggal_ujian' => Carbon::now()->addDays(2)->setTime(8, 0, 0),
                'durasi_menit' => 90,
                'bobot' => 100,
                'kkm' => 75,
                'keterangan' => 'Ulangan Harian materi Aljabar dan Persamaan Linear',
                'status' => 'berlangsung',
            ],
            // Ujian Matematika 2
            [
                'mata_pelajaran_id' => $matematika->id,
                'guru_id' => $guruMatematika,
                'kelas_id' => $kelasA->id,
                'tahun_ajaran_id' => $tahunAjaran->id,
                'semester_id' => $semester->id,
                'judul_ujian' => 'UTS Matematika',
                'jenis_ujian' => 'UTS',
                'tanggal_ujian' => Carbon::now()->addDays(7)->setTime(8, 0, 0),
                'durasi_menit' => 120,
                'bobot' => 100,
                'kkm' => 70,
                'keterangan' => 'Ujian Tengah Semester Matematika',
                'status' => 'dijadwalkan',
            ],
            // Ujian IPA
            [
                'mata_pelajaran_id' => $ipa->id,
                'guru_id' => $guruIPA,
                'kelas_id' => $kelasA->id,
                'tahun_ajaran_id' => $tahunAjaran->id,
                'semester_id' => $semester->id,
                'judul_ujian' => 'Ulangan Harian IPA - Sistem Pencernaan',
                'jenis_ujian' => 'Harian',
                'tanggal_ujian' => Carbon::now()->addDays(3)->setTime(10, 0, 0),
                'durasi_menit' => 80,
                'bobot' => 100,
                'kkm' => 75,
                'keterangan' => 'Materi tentang sistem pencernaan manusia',
                'status' => 'berlangsung',
            ],
            // Ujian Bahasa Indonesia
            [
                'mata_pelajaran_id' => $bahasaIndonesia->id,
                'guru_id' => $guruBahasaIndonesia,
                'kelas_id' => $kelasA->id,
                'tahun_ajaran_id' => $tahunAjaran->id,
                'semester_id' => $semester->id,
                'judul_ujian' => 'Ulangan Harian - Teks Eksposisi',
                'jenis_ujian' => 'Harian',
                'tanggal_ujian' => Carbon::now()->addDays(5)->setTime(9, 0, 0),
                'durasi_menit' => 90,
                'bobot' => 100,
                'kkm' => 75,
                'keterangan' => 'Pemahaman dan analisis teks eksposisi',
                'status' => 'dijadwalkan',
            ],
        ];

        $ujianIds = [];
        foreach ($ujianData as $ujian) {
            $ujianIds[] = DB::table('ujian')->insertGetId(array_merge($ujian, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $this->command->info("✅ Created " . count($ujianData) . " Ujian");

        // ==========================================
        // 4. CREATE SOAL UJIAN
        // ==========================================
        $this->command->info('📋 Creating Soal Ujian...');

        // Soal untuk Ujian Matematika - Aljabar (15 soal)
        $this->createSoalMatematika($ujianIds[0]);

        // Soal untuk Ujian IPA - Sistem Pencernaan (12 soal)
        $this->createSoalIPA($ujianIds[2]);

        // Soal untuk Ujian Bahasa Indonesia (10 soal)
        $this->createSoalBahasaIndonesia($ujianIds[3]);

        $this->command->info('✅ All soal created successfully!');
        $this->command->info('');
        $this->command->newLine();
        $this->command->info('🎉 GuruJadwalUjianSeeder completed!');
        $this->command->info('');
        $this->command->info('📌 Login Credentials:');
        $this->command->table(
            ['Email', 'Password', 'Role'],
            [
                ['guru.matematika@jibas.com', 'password123', 'Guru Matematika'],
                ['guru.ipa@jibas.com', 'password123', 'Guru IPA'],
                ['guru.bahasa@jibas.com', 'password123', 'Guru Bahasa Indonesia'],
            ]
        );
    }

    private function createSoalMatematika($ujianId)
    {
        $soalData = [
            [
                'nomor_soal' => 1,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Jika 2x + 5 = 15, maka nilai x adalah...',
                'opsi_a' => '3',
                'opsi_b' => '5',
                'opsi_c' => '7',
                'opsi_d' => '10',
                'opsi_e' => '15',
                'jawaban_benar' => 'B',
                'pembahasan' => '2x + 5 = 15 → 2x = 10 → x = 5',
                'bobot' => 5,
            ],
            [
                'nomor_soal' => 2,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Hasil dari 3x - 2x + 7 adalah...',
                'opsi_a' => 'x + 7',
                'opsi_b' => '5x + 7',
                'opsi_c' => 'x - 7',
                'opsi_d' => '3x + 7',
                'opsi_e' => '2x + 7',
                'jawaban_benar' => 'A',
                'pembahasan' => '3x - 2x + 7 = (3-2)x + 7 = x + 7',
                'bobot' => 5,
            ],
            [
                'nomor_soal' => 3,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Jika x = 4, maka nilai dari 5x - 8 adalah...',
                'opsi_a' => '8',
                'opsi_b' => '10',
                'opsi_c' => '12',
                'opsi_d' => '15',
                'opsi_e' => '20',
                'jawaban_benar' => 'C',
                'pembahasan' => '5(4) - 8 = 20 - 8 = 12',
                'bobot' => 5,
            ],
            [
                'nomor_soal' => 4,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Bentuk sederhana dari 4(2x + 3) adalah...',
                'opsi_a' => '8x + 3',
                'opsi_b' => '6x + 12',
                'opsi_c' => '8x + 12',
                'opsi_d' => '4x + 7',
                'opsi_e' => '8x + 7',
                'jawaban_benar' => 'C',
                'pembahasan' => '4(2x + 3) = 8x + 12',
                'bobot' => 6,
            ],
            [
                'nomor_soal' => 5,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Jika 3x - 7 = 2x + 5, maka x = ...',
                'opsi_a' => '10',
                'opsi_b' => '12',
                'opsi_c' => '14',
                'opsi_d' => '16',
                'opsi_e' => '18',
                'jawaban_benar' => 'B',
                'pembahasan' => '3x - 7 = 2x + 5 → 3x - 2x = 5 + 7 → x = 12',
                'bobot' => 7,
            ],
            [
                'nomor_soal' => 6,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Hasil dari (x + 3)(x - 2) adalah...',
                'opsi_a' => 'x² + x - 6',
                'opsi_b' => 'x² - x - 6',
                'opsi_c' => 'x² + x + 6',
                'opsi_d' => 'x² - 5x - 6',
                'opsi_e' => 'x² + 5x - 6',
                'jawaban_benar' => 'A',
                'pembahasan' => '(x + 3)(x - 2) = x² - 2x + 3x - 6 = x² + x - 6',
                'bobot' => 8,
            ],
            [
                'nomor_soal' => 7,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Jika y = 2x + 3 dan x = 5, maka y = ...',
                'opsi_a' => '10',
                'opsi_b' => '11',
                'opsi_c' => '12',
                'opsi_d' => '13',
                'opsi_e' => '15',
                'jawaban_benar' => 'D',
                'pembahasan' => 'y = 2(5) + 3 = 10 + 3 = 13',
                'bobot' => 5,
            ],
            [
                'nomor_soal' => 8,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Faktorisasi dari x² + 5x + 6 adalah...',
                'opsi_a' => '(x + 2)(x + 3)',
                'opsi_b' => '(x + 1)(x + 6)',
                'opsi_c' => '(x - 2)(x - 3)',
                'opsi_d' => '(x + 4)(x + 2)',
                'opsi_e' => '(x - 1)(x - 6)',
                'jawaban_benar' => 'A',
                'pembahasan' => 'x² + 5x + 6 = (x + 2)(x + 3)',
                'bobot' => 8,
            ],
            [
                'nomor_soal' => 9,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Jika a = 3 dan b = 5, maka nilai dari 2a + 3b adalah...',
                'opsi_a' => '19',
                'opsi_b' => '20',
                'opsi_c' => '21',
                'opsi_d' => '22',
                'opsi_e' => '23',
                'jawaban_benar' => 'C',
                'pembahasan' => '2(3) + 3(5) = 6 + 15 = 21',
                'bobot' => 5,
            ],
            [
                'nomor_soal' => 10,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Persamaan garis yang melalui titik (0, 3) dengan gradien 2 adalah...',
                'opsi_a' => 'y = 2x + 3',
                'opsi_b' => 'y = 3x + 2',
                'opsi_c' => 'y = 2x - 3',
                'opsi_d' => 'y = 3x - 2',
                'opsi_e' => 'y = x + 3',
                'jawaban_benar' => 'A',
                'pembahasan' => 'Rumus: y = mx + c, dengan m = 2 dan c = 3',
                'bobot' => 8,
            ],
            [
                'nomor_soal' => 11,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Jika 5x = 25, maka x² = ...',
                'opsi_a' => '5',
                'opsi_b' => '10',
                'opsi_c' => '15',
                'opsi_d' => '20',
                'opsi_e' => '25',
                'jawaban_benar' => 'E',
                'pembahasan' => '5x = 25 → x = 5, maka x² = 25',
                'bobot' => 6,
            ],
            [
                'nomor_soal' => 12,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Himpunan penyelesaian dari x + 3 < 7 adalah...',
                'opsi_a' => 'x < 4',
                'opsi_b' => 'x < 10',
                'opsi_c' => 'x > 4',
                'opsi_d' => 'x > 10',
                'opsi_e' => 'x = 4',
                'jawaban_benar' => 'A',
                'pembahasan' => 'x + 3 < 7 → x < 4',
                'bobot' => 7,
            ],
            [
                'nomor_soal' => 13,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Bentuk sederhana dari 6x + 3x - 4x adalah...',
                'opsi_a' => '3x',
                'opsi_b' => '5x',
                'opsi_c' => '7x',
                'opsi_d' => '9x',
                'opsi_e' => '13x',
                'jawaban_benar' => 'B',
                'pembahasan' => '6x + 3x - 4x = (6 + 3 - 4)x = 5x',
                'bobot' => 5,
            ],
            [
                'nomor_soal' => 14,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Jika x/3 = 4, maka x = ...',
                'opsi_a' => '7',
                'opsi_b' => '9',
                'opsi_c' => '12',
                'opsi_d' => '15',
                'opsi_e' => '18',
                'jawaban_benar' => 'C',
                'pembahasan' => 'x/3 = 4 → x = 4 × 3 = 12',
                'bobot' => 5,
            ],
            [
                'nomor_soal' => 15,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Sebuah persegi panjang memiliki panjang (x + 5) cm dan lebar (x - 2) cm. Keliling persegi panjang tersebut adalah...',
                'opsi_a' => '4x + 6 cm',
                'opsi_b' => '2x + 3 cm',
                'opsi_c' => '4x + 3 cm',
                'opsi_d' => '2x + 6 cm',
                'opsi_e' => 'x + 3 cm',
                'jawaban_benar' => 'A',
                'pembahasan' => 'K = 2(p + l) = 2((x + 5) + (x - 2)) = 2(2x + 3) = 4x + 6',
                'bobot' => 10,
            ],
        ];

        foreach ($soalData as $soal) {
            DB::table('soal_ujian')->insert(array_merge($soal, [
                'ujian_id' => $ujianId,
                'file_soal' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $this->command->info("✅ Created 15 soal for Ujian Matematika - Aljabar");
    }

    private function createSoalIPA($ujianId)
    {
        $soalData = [
            [
                'nomor_soal' => 1,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Organ pencernaan yang berfungsi mencerna makanan secara kimiawi adalah...',
                'opsi_a' => 'Mulut',
                'opsi_b' => 'Lambung',
                'opsi_c' => 'Usus besar',
                'opsi_d' => 'Kerongkongan',
                'opsi_e' => 'Anus',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Lambung menghasilkan asam lambung dan enzim pepsin untuk mencerna protein',
                'bobot' => 8,
            ],
            [
                'nomor_soal' => 2,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Enzim yang terdapat di mulut dan berfungsi mencerna karbohidrat adalah...',
                'opsi_a' => 'Pepsin',
                'opsi_b' => 'Tripsin',
                'opsi_c' => 'Amilase',
                'opsi_d' => 'Lipase',
                'opsi_e' => 'Renin',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Enzim amilase (ptialin) di mulut mengubah amilum menjadi maltosa',
                'bobot' => 8,
            ],
            [
                'nomor_soal' => 3,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Organ yang berfungsi menyerap air dan membentuk feses adalah...',
                'opsi_a' => 'Usus halus',
                'opsi_b' => 'Usus besar',
                'opsi_c' => 'Lambung',
                'opsi_d' => 'Hati',
                'opsi_e' => 'Pankreas',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Usus besar menyerap air dari sisa makanan dan membentuk feses',
                'bobot' => 8,
            ],
            [
                'nomor_soal' => 4,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Fungsi utama dari usus halus adalah...',
                'opsi_a' => 'Menyerap air',
                'opsi_b' => 'Menyimpan makanan',
                'opsi_c' => 'Penyerapan sari-sari makanan',
                'opsi_d' => 'Pembusukan makanan',
                'opsi_e' => 'Mengeluarkan enzim',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Usus halus memiliki jonjot usus untuk menyerap sari-sari makanan',
                'bobot' => 8,
            ],
            [
                'nomor_soal' => 5,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Kelenjar yang menghasilkan empedu adalah...',
                'opsi_a' => 'Pankreas',
                'opsi_b' => 'Hati',
                'opsi_c' => 'Lambung',
                'opsi_d' => 'Usus halus',
                'opsi_e' => 'Kelenjar ludah',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Hati menghasilkan empedu yang disimpan di kantung empedu',
                'bobot' => 8,
            ],
            [
                'nomor_soal' => 6,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Fungsi empedu adalah...',
                'opsi_a' => 'Mencerna protein',
                'opsi_b' => 'Mencerna karbohidrat',
                'opsi_c' => 'Mengemulsikan lemak',
                'opsi_d' => 'Membunuh bakteri',
                'opsi_e' => 'Menyerap vitamin',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Empedu mengemulsikan lemak menjadi butiran-butiran kecil',
                'bobot' => 9,
            ],
            [
                'nomor_soal' => 7,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Enzim pepsin bekerja mencerna protein di dalam...',
                'opsi_a' => 'Mulut',
                'opsi_b' => 'Lambung',
                'opsi_c' => 'Usus halus',
                'opsi_d' => 'Usus besar',
                'opsi_e' => 'Kerongkongan',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Pepsin diproduksi lambung dan bekerja dalam suasana asam',
                'bobot' => 8,
            ],
            [
                'nomor_soal' => 8,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Makanan yang telah dicerna di mulut akan masuk ke lambung melalui...',
                'opsi_a' => 'Trakea',
                'opsi_b' => 'Kerongkongan',
                'opsi_c' => 'Usus halus',
                'opsi_d' => 'Pankreas',
                'opsi_e' => 'Farinks',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Kerongkongan (esofagus) menghubungkan mulut dengan lambung',
                'bobot' => 7,
            ],
            [
                'nomor_soal' => 9,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Pankreas menghasilkan enzim tripsin yang berfungsi mencerna...',
                'opsi_a' => 'Karbohidrat',
                'opsi_b' => 'Protein',
                'opsi_c' => 'Lemak',
                'opsi_d' => 'Vitamin',
                'opsi_e' => 'Mineral',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Tripsin dari pankreas mencerna protein menjadi peptida',
                'bobot' => 9,
            ],
            [
                'nomor_soal' => 10,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Gangguan pencernaan akibat peradangan pada lambung disebut...',
                'opsi_a' => 'Diare',
                'opsi_b' => 'Sembelit',
                'opsi_c' => 'Maag',
                'opsi_d' => 'Apendisitis',
                'opsi_e' => 'Hepatitis',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Maag adalah peradangan pada dinding lambung',
                'bobot' => 8,
            ],
            [
                'nomor_soal' => 11,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Vitamin yang larut dalam lemak adalah...',
                'opsi_a' => 'Vitamin C',
                'opsi_b' => 'Vitamin B',
                'opsi_c' => 'Vitamin A',
                'opsi_d' => 'Vitamin B12',
                'opsi_e' => 'Asam folat',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Vitamin A, D, E, K adalah vitamin yang larut dalam lemak',
                'bobot' => 9,
            ],
            [
                'nomor_soal' => 12,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Bagian usus halus yang berbentuk seperti huruf C adalah...',
                'opsi_a' => 'Yeyunum',
                'opsi_b' => 'Ileum',
                'opsi_c' => 'Duodenum',
                'opsi_d' => 'Kolon',
                'opsi_e' => 'Rektum',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Duodenum adalah bagian pertama usus halus berbentuk seperti huruf C',
                'bobot' => 10,
            ],
        ];

        foreach ($soalData as $soal) {
            DB::table('soal_ujian')->insert(array_merge($soal, [
                'ujian_id' => $ujianId,
                'file_soal' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $this->command->info("✅ Created 12 soal for Ujian IPA - Sistem Pencernaan");
    }

    private function createSoalBahasaIndonesia($ujianId)
    {
        $soalData = [
            [
                'nomor_soal' => 1,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Teks eksposisi adalah teks yang berisi...',
                'opsi_a' => 'Cerita imajinatif',
                'opsi_b' => 'Informasi dan penjelasan',
                'opsi_c' => 'Dialog antara tokoh',
                'opsi_d' => 'Puisi dan sajak',
                'opsi_e' => 'Deskripsi tempat',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Teks eksposisi bertujuan menyampaikan informasi dan penjelasan tentang suatu topik',
                'bobot' => 10,
            ],
            [
                'nomor_soal' => 2,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Struktur teks eksposisi yang benar adalah...',
                'opsi_a' => 'Orientasi - komplikasi - resolusi',
                'opsi_b' => 'Tesis - argumen - penegasan ulang',
                'opsi_c' => 'Pembuka - isi - penutup',
                'opsi_d' => 'Abstrak - orientasi - koda',
                'opsi_e' => 'Identifikasi - klasifikasi - deskripsi',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Struktur teks eksposisi: tesis - argumen - penegasan ulang',
                'bobot' => 10,
            ],
            [
                'nomor_soal' => 3,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Bagian yang berisi pendapat atau pandangan penulis tentang suatu masalah disebut...',
                'opsi_a' => 'Argumen',
                'opsi_b' => 'Tesis',
                'opsi_c' => 'Penegasan ulang',
                'opsi_d' => 'Orientasi',
                'opsi_e' => 'Abstrak',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Tesis adalah bagian yang menyatakan pendapat atau pandangan penulis',
                'bobot' => 10,
            ],
            [
                'nomor_soal' => 4,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Ciri kebahasaan teks eksposisi adalah...',
                'opsi_a' => 'Menggunakan kata ganti orang pertama',
                'opsi_b' => 'Banyak menggunakan kata kerja mental',
                'opsi_c' => 'Menggunakan kata-kata emotif',
                'opsi_d' => 'Menggunakan konjungsi kausalitas',
                'opsi_e' => 'Menggunakan rima dan irama',
                'jawaban_benar' => 'D',
                'pembahasan' => 'Teks eksposisi menggunakan konjungsi kausalitas seperti sebab, karena, akibat',
                'bobot' => 10,
            ],
            [
                'nomor_soal' => 5,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Kata "oleh karena itu" dalam teks eksposisi termasuk konjungsi...',
                'opsi_a' => 'Temporal',
                'opsi_b' => 'Kausalitas',
                'opsi_c' => 'Pertentangan',
                'opsi_d' => 'Perbandingan',
                'opsi_e' => 'Penegasan',
                'jawaban_benar' => 'B',
                'pembahasan' => '"Oleh karena itu" menunjukkan hubungan sebab-akibat',
                'bobot' => 10,
            ],
            [
                'nomor_soal' => 6,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Tujuan utama teks eksposisi adalah...',
                'opsi_a' => 'Menghibur pembaca',
                'opsi_b' => 'Meyakinkan pembaca',
                'opsi_c' => 'Menjelaskan informasi',
                'opsi_d' => 'Menceritakan pengalaman',
                'opsi_e' => 'Mendeskripsikan objek',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Teks eksposisi bertujuan menjelaskan atau memaparkan informasi',
                'bobot' => 10,
            ],
            [
                'nomor_soal' => 7,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Bagian yang berisi alasan-alasan untuk memperkuat tesis disebut...',
                'opsi_a' => 'Orientasi',
                'opsi_b' => 'Tesis',
                'opsi_c' => 'Argumen',
                'opsi_d' => 'Penegasan ulang',
                'opsi_e' => 'Abstrak',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Argumen berisi alasan-alasan yang mendukung tesis',
                'bobot' => 10,
            ],
            [
                'nomor_soal' => 8,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Kata hubung yang menyatakan pertentangan adalah...',
                'opsi_a' => 'Karena',
                'opsi_b' => 'Tetapi',
                'opsi_c' => 'Kemudian',
                'opsi_d' => 'Sehingga',
                'opsi_e' => 'Dan',
                'jawaban_benar' => 'B',
                'pembahasan' => '"Tetapi" adalah konjungsi yang menyatakan pertentangan',
                'bobot' => 10,
            ],
            [
                'nomor_soal' => 9,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Penegasan ulang dalam teks eksposisi berfungsi untuk...',
                'opsi_a' => 'Memulai pembahasan',
                'opsi_b' => 'Memberikan contoh',
                'opsi_c' => 'Menegaskan kembali pendapat',
                'opsi_d' => 'Membantah argumen',
                'opsi_e' => 'Mengajukan pertanyaan',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Penegasan ulang menegaskan kembali tesis dengan kata-kata berbeda',
                'bobot' => 10,
            ],
            [
                'nomor_soal' => 10,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Fakta dalam teks eksposisi berfungsi sebagai...',
                'opsi_a' => 'Hiasan tulisan',
                'opsi_b' => 'Pendapat penulis',
                'opsi_c' => 'Data pendukung argumen',
                'opsi_d' => 'Kesimpulan teks',
                'opsi_e' => 'Pembuka paragraf',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Fakta digunakan sebagai data untuk memperkuat argumen',
                'bobot' => 10,
            ],
        ];

        foreach ($soalData as $soal) {
            DB::table('soal_ujian')->insert(array_merge($soal, [
                'ujian_id' => $ujianId,
                'file_soal' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $this->command->info("✅ Created 10 soal for Ujian Bahasa Indonesia - Teks Eksposisi");
    }
}
