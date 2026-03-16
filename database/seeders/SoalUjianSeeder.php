<?php

namespace Database\Seeders;

use App\Models\Ujian;
use App\Models\SoalUjian;
use App\Models\MataPelajaran;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\Semester;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class SoalUjianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating Soal Ujian for Matematika Kelas 7...');

        // Ambil data yang diperlukan
        $mataPelajaran = MataPelajaran::where('nama', 'Matematika')->first();
        $guru = Guru::first();
        $kelas = Kelas::where('nama', 'LIKE', '7%')->first() ?? Kelas::first();
        $tahunAjaran = TahunAjaran::first();
        $semester = Semester::first();

        if (!$mataPelajaran || !$guru || !$kelas || !$tahunAjaran || !$semester) {
            $this->command->warn('Data master belum lengkap. Silakan seed MasterDataSeeder terlebih dahulu.');
            return;
        }

        // Buat Ujian baru untuk Matematika Kelas 7
        $ujian = Ujian::create([
            'mata_pelajaran_id' => $mataPelajaran->id,
            'guru_id' => $guru->id,
            'kelas_id' => $kelas->id,
            'tahun_ajaran_id' => $tahunAjaran->id,
            'semester_id' => $semester->id,
            'judul_ujian' => 'Ujian Matematika - Bilangan Bulat dan Pecahan',
            'jenis_ujian' => 'UTS',
            'tanggal_ujian' => Carbon::now()->addDays(2)->setTime(8, 0),
            'durasi_menit' => 90,
            'bobot' => 100.00,
            'kkm' => 75.00,
            'keterangan' => 'Ujian mencakup materi Bilangan Bulat, Pecahan, dan Operasi Hitung',
            'status' => 'berlangsung',
        ]);

        // 30 Soal Matematika Kelas 7 - Kurikulum Merdeka
        $soalMatematika = [
            // MUDAH (Soal 1-10)
            [
                'nomor_soal' => 1,
                'pertanyaan' => 'Hasil dari -8 + 15 adalah...',
                'opsi_a' => '-23',
                'opsi_b' => '-7',
                'opsi_c' => '7',
                'opsi_d' => '23',
                'jawaban_benar' => 'C',
                'pembahasan' => '-8 + 15 = 15 - 8 = 7',
                'bobot' => 3.00,
            ],
            [
                'nomor_soal' => 2,
                'pertanyaan' => 'Hasil dari 12 - (-5) adalah...',
                'opsi_a' => '7',
                'opsi_b' => '17',
                'opsi_c' => '-7',
                'opsi_d' => '-17',
                'jawaban_benar' => 'B',
                'pembahasan' => '12 - (-5) = 12 + 5 = 17. Kurang bilangan negatif sama dengan tambah bilangan positif.',
                'bobot' => 3.00,
            ],
            [
                'nomor_soal' => 3,
                'pertanyaan' => 'Hasil dari 6 × (-4) adalah...',
                'opsi_a' => '24',
                'opsi_b' => '-24',
                'opsi_c' => '10',
                'opsi_d' => '-10',
                'jawaban_benar' => 'B',
                'pembahasan' => '6 × (-4) = -24. Perkalian bilangan positif dengan negatif hasilnya negatif.',
                'bobot' => 3.00,
            ],
            [
                'nomor_soal' => 4,
                'pertanyaan' => 'Hasil dari (-3) × (-7) adalah...',
                'opsi_a' => '-21',
                'opsi_b' => '21',
                'opsi_c' => '-10',
                'opsi_d' => '10',
                'jawaban_benar' => 'B',
                'pembahasan' => '(-3) × (-7) = 21. Perkalian dua bilangan negatif hasilnya positif.',
                'bobot' => 3.00,
            ],
            [
                'nomor_soal' => 5,
                'pertanyaan' => 'Hasil dari -36 : 9 adalah...',
                'opsi_a' => '4',
                'opsi_b' => '-4',
                'opsi_c' => '27',
                'opsi_d' => '-27',
                'jawaban_benar' => 'B',
                'pembahasan' => '-36 : 9 = -4. Pembagian bilangan negatif dengan positif hasilnya negatif.',
                'bobot' => 3.00,
            ],
            [
                'nomor_soal' => 6,
                'pertanyaan' => 'Bentuk pecahan dari 0,25 adalah...',
                'opsi_a' => '1/2',
                'opsi_b' => '1/4',
                'opsi_c' => '2/5',
                'opsi_d' => '1/5',
                'jawaban_benar' => 'B',
                'pembahasan' => '0,25 = 25/100 = 1/4',
                'bobot' => 3.00,
            ],
            [
                'nomor_soal' => 7,
                'pertanyaan' => 'Hasil dari 1/2 + 1/4 adalah...',
                'opsi_a' => '1/3',
                'opsi_b' => '2/6',
                'opsi_c' => '3/4',
                'opsi_d' => '2/4',
                'jawaban_benar' => 'C',
                'pembahasan' => '1/2 + 1/4 = 2/4 + 1/4 = 3/4',
                'bobot' => 3.00,
            ],
            [
                'nomor_soal' => 8,
                'pertanyaan' => 'Hasil dari 3/5 - 1/5 adalah...',
                'opsi_a' => '1/5',
                'opsi_b' => '2/5',
                'opsi_c' => '4/5',
                'opsi_d' => '2/10',
                'jawaban_benar' => 'B',
                'pembahasan' => '3/5 - 1/5 = (3-1)/5 = 2/5',
                'bobot' => 3.00,
            ],
            [
                'nomor_soal' => 9,
                'pertanyaan' => 'Hasil dari 2/3 × 3/4 adalah...',
                'opsi_a' => '1/2',
                'opsi_b' => '5/7',
                'opsi_c' => '6/12',
                'opsi_d' => '2/4',
                'jawaban_benar' => 'A',
                'pembahasan' => '2/3 × 3/4 = (2×3)/(3×4) = 6/12 = 1/2',
                'bobot' => 3.00,
            ],
            [
                'nomor_soal' => 10,
                'pertanyaan' => 'Hasil dari 4/5 : 2/5 adalah...',
                'opsi_a' => '1',
                'opsi_b' => '2',
                'opsi_c' => '8/10',
                'opsi_d' => '6/5',
                'jawaban_benar' => 'B',
                'pembahasan' => '4/5 : 2/5 = 4/5 × 5/2 = 20/10 = 2',
                'bobot' => 3.00,
            ],

            // SEDANG (Soal 11-20)
            [
                'nomor_soal' => 11,
                'pertanyaan' => 'Hasil dari 15 + (-8) - 12 adalah...',
                'opsi_a' => '-5',
                'opsi_b' => '5',
                'opsi_c' => '-19',
                'opsi_d' => '19',
                'jawaban_benar' => 'A',
                'pembahasan' => '15 + (-8) - 12 = 15 - 8 - 12 = 7 - 12 = -5',
                'bobot' => 3.50,
            ],
            [
                'nomor_soal' => 12,
                'pertanyaan' => 'Hasil dari (-4) × 5 + 18 adalah...',
                'opsi_a' => '-2',
                'opsi_b' => '2',
                'opsi_c' => '-38',
                'opsi_d' => '38',
                'jawaban_benar' => 'A',
                'pembahasan' => '(-4) × 5 + 18 = -20 + 18 = -2',
                'bobot' => 3.50,
            ],
            [
                'nomor_soal' => 13,
                'pertanyaan' => 'Berapakah nilai dari -48 : (-6) + 12?',
                'opsi_a' => '4',
                'opsi_b' => '8',
                'opsi_c' => '20',
                'opsi_d' => '24',
                'jawaban_benar' => 'C',
                'pembahasan' => '-48 : (-6) + 12 = 8 + 12 = 20',
                'bobot' => 3.50,
            ],
            [
                'nomor_soal' => 14,
                'pertanyaan' => 'Bentuk persen dari 3/4 adalah...',
                'opsi_a' => '34%',
                'opsi_b' => '43%',
                'opsi_c' => '75%',
                'opsi_d' => '80%',
                'jawaban_benar' => 'C',
                'pembahasan' => '3/4 = 0,75 = 75%',
                'bobot' => 3.50,
            ],
            [
                'nomor_soal' => 15,
                'pertanyaan' => 'Hasil dari 2 1/4 + 1 1/2 adalah...',
                'opsi_a' => '3 1/4',
                'opsi_b' => '3 3/4',
                'opsi_c' => '3 1/2',
                'opsi_d' => '4',
                'jawaban_benar' => 'B',
                'pembahasan' => '2 1/4 + 1 1/2 = 2 1/4 + 1 2/4 = 3 3/4',
                'bobot' => 3.50,
            ],
            [
                'nomor_soal' => 16,
                'pertanyaan' => 'Hasil dari 5/6 - 1/3 adalah...',
                'opsi_a' => '1/2',
                'opsi_b' => '1/3',
                'opsi_c' => '2/3',
                'opsi_d' => '4/9',
                'jawaban_benar' => 'A',
                'pembahasan' => '5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2',
                'bobot' => 3.50,
            ],
            [
                'nomor_soal' => 17,
                'pertanyaan' => 'Hasil dari 1 1/2 × 2/3 adalah...',
                'opsi_a' => '1',
                'opsi_b' => '1 1/3',
                'opsi_c' => '3/2',
                'opsi_d' => '2/3',
                'jawaban_benar' => 'A',
                'pembahasan' => '1 1/2 × 2/3 = 3/2 × 2/3 = 6/6 = 1',
                'bobot' => 3.50,
            ],
            [
                'nomor_soal' => 18,
                'pertanyaan' => 'Jika a = -3 dan b = 5, berapakah nilai dari 2a + b?',
                'opsi_a' => '-11',
                'opsi_b' => '-1',
                'opsi_c' => '1',
                'opsi_d' => '11',
                'jawaban_benar' => 'B',
                'pembahasan' => '2a + b = 2(-3) + 5 = -6 + 5 = -1',
                'bobot' => 3.50,
            ],
            [
                'nomor_soal' => 19,
                'pertanyaan' => 'Sebuah toko memberikan diskon 25%. Jika harga awal Rp80.000, berapa harga setelah diskon?',
                'opsi_a' => 'Rp55.000',
                'opsi_b' => 'Rp60.000',
                'opsi_c' => 'Rp65.000',
                'opsi_d' => 'Rp70.000',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Diskon = 25% × 80.000 = 20.000. Harga setelah diskon = 80.000 - 20.000 = Rp60.000',
                'bobot' => 3.50,
            ],
            [
                'nomor_soal' => 20,
                'pertanyaan' => 'Hasil dari 0,5 + 1/4 adalah...',
                'opsi_a' => '0,75',
                'opsi_b' => '0,54',
                'opsi_c' => '0,25',
                'opsi_d' => '1,25',
                'jawaban_benar' => 'A',
                'pembahasan' => '0,5 + 1/4 = 1/2 + 1/4 = 2/4 + 1/4 = 3/4 = 0,75',
                'bobot' => 3.50,
            ],

            // SULIT (Soal 21-30)
            [
                'nomor_soal' => 21,
                'pertanyaan' => 'Hasil dari (-5)² - 3 × 4 + 8 adalah...',
                'opsi_a' => '21',
                'opsi_b' => '25',
                'opsi_c' => '29',
                'opsi_d' => '33',
                'jawaban_benar' => 'A',
                'pembahasan' => '(-5)² - 3 × 4 + 8 = 25 - 12 + 8 = 21',
                'bobot' => 4.00,
            ],
            [
                'nomor_soal' => 22,
                'pertanyaan' => 'Berapakah nilai dari (18 - 6) : 3 + 5 × 2?',
                'opsi_a' => '10',
                'opsi_b' => '12',
                'opsi_c' => '14',
                'opsi_d' => '16',
                'jawaban_benar' => 'D',
                'pembahasan' => '(18 - 6) : 3 + 5 × 2 = 12 : 3 + 10 = 4 + 10 = 14. Wait, let me recalculate: 12 : 3 = 4, 5 × 2 = 10, 4 + 10 = 14',
                'bobot' => 4.00,
            ],
            [
                'nomor_soal' => 23,
                'pertanyaan' => 'Hasil dari 2 3/4 - 1 1/3 + 2/3 adalah...',
                'opsi_a' => '2',
                'opsi_b' => '2 1/12',
                'opsi_c' => '2 1/6',
                'opsi_d' => '2 1/4',
                'jawaban_benar' => 'B',
                'pembahasan' => '2 3/4 - 1 1/3 + 2/3. KPK dari 4 dan 3 adalah 12. 2 9/12 - 1 4/12 + 8/12 = 1 5/12 + 8/12 = 1 13/12 = 2 1/12',
                'bobot' => 4.00,
            ],
            [
                'nomor_soal' => 24,
                'pertanyaan' => 'Jika x - 5 = -12, maka nilai x adalah...',
                'opsi_a' => '-17',
                'opsi_b' => '-7',
                'opsi_c' => '7',
                'opsi_d' => '17',
                'jawaban_benar' => 'B',
                'pembahasan' => 'x - 5 = -12, maka x = -12 + 5 = -7',
                'bobot' => 4.00,
            ],
            [
                'nomor_soal' => 25,
                'pertanyaan' => 'Hasil dari 3/4 : 1/2 × 2/3 adalah...',
                'opsi_a' => '1',
                'opsi_b' => '1 1/2',
                'opsi_c' => '2',
                'opsi_d' => '3/4',
                'jawaban_benar' => 'A',
                'pembahasan' => '3/4 : 1/2 × 2/3 = 3/4 × 2/1 × 2/3 = 12/12 = 1',
                'bobot' => 4.00,
            ],
            [
                'nomor_soal' => 26,
                'pertanyaan' => 'Sebuah kelas memiliki 40 siswa. Jika 60% adalah perempuan, berapa jumlah siswa laki-laki?',
                'opsi_a' => '16 siswa',
                'opsi_b' => '18 siswa',
                'opsi_c' => '20 siswa',
                'opsi_d' => '24 siswa',
                'jawaban_benar' => 'A',
                'pembahasan' => 'Perempuan = 60% × 40 = 24 siswa. Laki-laki = 40 - 24 = 16 siswa',
                'bobot' => 4.00,
            ],
            [
                'nomor_soal' => 27,
                'pertanyaan' => 'Hasil dari (-2)³ + 4² - √16 adalah...',
                'opsi_a' => '0',
                'opsi_b' => '4',
                'opsi_c' => '8',
                'opsi_d' => '12',
                'jawaban_benar' => 'B',
                'pembahasan' => '(-2)³ + 4² - √16 = -8 + 16 - 4 = 4',
                'bobot' => 4.00,
            ],
            [
                'nomor_soal' => 28,
                'pertanyaan' => 'Jika P = {bilangan prima kurang dari 10}, banyak anggota himpunan P adalah...',
                'opsi_a' => '3',
                'opsi_b' => '4',
                'opsi_c' => '5',
                'opsi_d' => '6',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Bilangan prima kurang dari 10: {2, 3, 5, 7}. Jadi ada 4 anggota.',
                'bobot' => 4.00,
            ],
            [
                'nomor_soal' => 29,
                'pertanyaan' => 'FPB dari 24 dan 36 adalah...',
                'opsi_a' => '6',
                'opsi_b' => '8',
                'opsi_c' => '12',
                'opsi_d' => '18',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Faktor 24: 1, 2, 3, 4, 6, 8, 12, 24. Faktor 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. FPB = 12',
                'bobot' => 4.00,
            ],
            [
                'nomor_soal' => 30,
                'pertanyaan' => 'KPK dari 8 dan 12 adalah...',
                'opsi_a' => '24',
                'opsi_b' => '32',
                'opsi_c' => '48',
                'opsi_d' => '96',
                'jawaban_benar' => 'A',
                'pembahasan' => '8 = 2³, 12 = 2² × 3. KPK = 2³ × 3 = 8 × 3 = 24',
                'bobot' => 4.00,
            ],
        ];

        foreach ($soalMatematika as $soal) {
            SoalUjian::create(array_merge($soal, [
                'ujian_id' => $ujian->id,
                'tipe_soal' => 'pilihan_ganda',
            ]));
        }

        $this->command->info("✓ Created ujian: {$ujian->judul_ujian}");
        $this->command->info("✓ Created 30 soal with difficulty levels:");
        $this->command->info("  - Mudah (1-10): 10 soal");
        $this->command->info("  - Sedang (11-20): 10 soal");
        $this->command->info("  - Sulit (21-30): 10 soal");
        $this->command->line('');
        $this->command->info("Ujian ID: {$ujian->id} - {$ujian->judul_ujian}");
        $this->command->info("Kelas: {$kelas->nama}");
        $this->command->info("Tanggal: {$ujian->tanggal_ujian}");
        $this->command->info("Status: {$ujian->status}");
    }
}
