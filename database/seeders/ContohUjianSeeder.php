<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ContohUjianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Ambil data referensi yang dibutuhkan
        $guru = DB::table('guru')->first();
        $kelas = DB::table('kelas')->first();
        $mataPelajaran = DB::table('mata_pelajaran')->first();
        $tahunAjaran = DB::table('tahun_ajaran')->first();
        $semester = DB::table('semester')->first();
        $siswaList = DB::table('siswa')->where('kelas_id', $kelas->id)->limit(10)->get();

        if (!$guru || !$kelas || !$mataPelajaran || !$tahunAjaran || !$semester) {
            $this->command->error('Data master belum lengkap. Pastikan guru, kelas, mata pelajaran, tahun ajaran, dan semester sudah ada.');
            return;
        }

        if ($siswaList->isEmpty()) {
            $this->command->error('Tidak ada siswa di kelas tersebut.');
            return;
        }

        // ==========================================
        // 1. UJIAN YANG SUDAH SELESAI
        // ==========================================
        $ujianSelesaiId = DB::table('ujian')->insertGetId([
            'mata_pelajaran_id' => $mataPelajaran->id,
            'guru_id' => $guru->id,
            'kelas_id' => $kelas->id,
            'tahun_ajaran_id' => $tahunAjaran->id,
            'semester_id' => $semester->id,
            'judul_ujian' => 'Ulangan Harian Matematika - Aljabar (SELESAI)',
            'jenis_ujian' => 'Harian',
            'tanggal_ujian' => $now->copy()->subDays(3)->setTime(8, 0, 0),
            'durasi_menit' => 60,
            'bobot' => 100,
            'kkm' => 75,
            'keterangan' => 'Ujian materi Aljabar dan Persamaan Linear - Contoh ujian yang sudah selesai',
            'status' => 'selesai',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $this->command->info("✓ Ujian Selesai dibuat dengan ID: {$ujianSelesaiId}");

        // Buat soal untuk ujian selesai (10 soal)
        $soalSelesai = [];
        for ($i = 1; $i <= 10; $i++) {
            $soalSelesai[] = [
                'ujian_id' => $ujianSelesaiId,
                'nomor_soal' => $i,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => "Soal Aljabar nomor {$i}: Berapakah hasil dari 2x + 3 = 15?",
                'opsi_a' => '6',
                'opsi_b' => '7',
                'opsi_c' => '8',
                'opsi_d' => '9',
                'opsi_e' => '10',
                'jawaban_benar' => $i % 5 === 1 ? 'A' : ($i % 5 === 2 ? 'B' : ($i % 5 === 3 ? 'C' : ($i % 5 === 4 ? 'D' : 'E'))),
                'pembahasan' => "Pembahasan soal nomor {$i}",
                'bobot' => 10,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('soal_ujian')->insert($soalSelesai);
        $this->command->info("✓ 10 Soal untuk ujian selesai dibuat");

        // Ambil ID soal yang baru dibuat
        $soalIds = DB::table('soal_ujian')->where('ujian_id', $ujianSelesaiId)->pluck('id', 'nomor_soal')->toArray();

        // Buat hasil ujian untuk setiap siswa
        $nilaiBase = [85, 78, 92, 65, 88, 73, 95, 70, 82, 90];
        foreach ($siswaList as $index => $siswa) {
            $waktuMulai = $now->copy()->subDays(3)->setTime(8, rand(0, 10), 0);
            $waktuSelesai = $waktuMulai->copy()->addMinutes(rand(45, 60));
            $durasiMenit = $waktuMulai->diffInMinutes($waktuSelesai);

            $jumlahBenar = isset($nilaiBase[$index]) ? floor($nilaiBase[$index] / 10) : rand(6, 9);
            $jumlahSalah = 10 - $jumlahBenar;
            $nilai = $jumlahBenar * 10;

            $ujianSiswaId = DB::table('ujian_siswa')->insertGetId([
                'ujian_id' => $ujianSelesaiId,
                'siswa_id' => $siswa->id,
                'waktu_mulai' => $waktuMulai,
                'waktu_selesai' => $waktuSelesai,
                'durasi_pengerjaan' => $durasiMenit,
                'nilai' => $nilai,
                'jumlah_benar' => $jumlahBenar,
                'jumlah_salah' => $jumlahSalah,
                'jumlah_kosong' => 0,
                'status' => 'selesai',
                'catatan' => null,
                'created_at' => $waktuMulai,
                'updated_at' => $waktuSelesai,
            ]);

            // Buat jawaban untuk setiap soal
            $jawabanSiswa = [];
            for ($i = 1; $i <= 10; $i++) {
                $soalId = $soalIds[$i];
                $soal = DB::table('soal_ujian')->where('id', $soalId)->first();

                // Tentukan apakah jawaban benar atau salah
                $isBenar = $i <= $jumlahBenar;
                $jawaban = $isBenar ? $soal->jawaban_benar : ($soal->jawaban_benar === 'A' ? 'B' : 'A');

                $jawabanSiswa[] = [
                    'ujian_siswa_id' => $ujianSiswaId,
                    'soal_ujian_id' => $soalId,
                    'jawaban' => $jawaban,
                    'jawaban_essay' => null,
                    'is_benar' => $isBenar,
                    'nilai' => $isBenar ? 10 : 0,
                    'created_at' => $waktuMulai->copy()->addMinutes($i * 5),
                    'updated_at' => $waktuMulai->copy()->addMinutes($i * 5),
                ];
            }
            DB::table('jawaban_siswa')->insert($jawabanSiswa);
        }

        $this->command->info("✓ Hasil ujian untuk {$siswaList->count()} siswa dibuat");

        // ==========================================
        // 2. UJIAN YANG SEDANG BERLANGSUNG
        // ==========================================
        $ujianBerlangsungId = DB::table('ujian')->insertGetId([
            'mata_pelajaran_id' => $mataPelajaran->id,
            'guru_id' => $guru->id,
            'kelas_id' => $kelas->id,
            'tahun_ajaran_id' => $tahunAjaran->id,
            'semester_id' => $semester->id,
            'judul_ujian' => 'Quiz Matematika - Geometri (BERLANGSUNG)',
            'jenis_ujian' => 'Quiz',
            'tanggal_ujian' => $now->copy()->setTime(10, 0, 0),
            'durasi_menit' => 30,
            'bobot' => 100,
            'kkm' => 70,
            'keterangan' => 'Quiz materi Geometri Bangun Datar - Contoh ujian yang sedang berlangsung',
            'status' => 'berlangsung',
            'created_at' => $now->copy()->subHour(),
            'updated_at' => $now,
        ]);

        $this->command->info("✓ Ujian Berlangsung dibuat dengan ID: {$ujianBerlangsungId}");

        // Buat soal untuk ujian berlangsung (5 soal)
        $soalBerlangsung = [];
        for ($i = 1; $i <= 5; $i++) {
            $soalBerlangsung[] = [
                'ujian_id' => $ujianBerlangsungId,
                'nomor_soal' => $i,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => "Soal Geometri nomor {$i}: Berapakah luas persegi dengan sisi 5 cm?",
                'opsi_a' => '20 cm²',
                'opsi_b' => '25 cm²',
                'opsi_c' => '30 cm²',
                'opsi_d' => '35 cm²',
                'opsi_e' => '40 cm²',
                'jawaban_benar' => 'B',
                'pembahasan' => "Luas persegi = sisi × sisi = 5 × 5 = 25 cm²",
                'bobot' => 20,
                'created_at' => $now->copy()->subHour(),
                'updated_at' => $now->copy()->subHour(),
            ];
        }
        DB::table('soal_ujian')->insert($soalBerlangsung);
        $this->command->info("✓ 5 Soal untuk ujian berlangsung dibuat");

        // Beberapa siswa sudah mulai, beberapa belum
        $siswaSubset = $siswaList->take(5); // Ambil 5 siswa pertama
        foreach ($siswaSubset as $index => $siswa) {
            if ($index < 3) {
                // 3 siswa pertama sedang mengerjakan
                $waktuMulai = $now->copy()->subMinutes(rand(10, 20));

                DB::table('ujian_siswa')->insert([
                    'ujian_id' => $ujianBerlangsungId,
                    'siswa_id' => $siswa->id,
                    'waktu_mulai' => $waktuMulai,
                    'waktu_selesai' => null,
                    'durasi_pengerjaan' => 0,
                    'nilai' => 0,
                    'jumlah_benar' => 0,
                    'jumlah_salah' => 0,
                    'jumlah_kosong' => 0,
                    'status' => 'sedang_mengerjakan',
                    'catatan' => null,
                    'created_at' => $waktuMulai,
                    'updated_at' => $now,
                ]);
            } else {
                // 2 siswa lainnya belum mulai
                DB::table('ujian_siswa')->insert([
                    'ujian_id' => $ujianBerlangsungId,
                    'siswa_id' => $siswa->id,
                    'waktu_mulai' => null,
                    'waktu_selesai' => null,
                    'durasi_pengerjaan' => 0,
                    'nilai' => 0,
                    'jumlah_benar' => 0,
                    'jumlah_salah' => 0,
                    'jumlah_kosong' => 0,
                    'status' => 'belum_mulai',
                    'catatan' => null,
                    'created_at' => $now->copy()->subHour(),
                    'updated_at' => $now->copy()->subHour(),
                ]);
            }
        }

        $this->command->info("✓ Status ujian berlangsung untuk 5 siswa dibuat (3 sedang mengerjakan, 2 belum mulai)");

        // ==========================================
        // 3. UJIAN YANG DIJADWALKAN (BONUS)
        // ==========================================
        $ujianDijadwalkanId = DB::table('ujian')->insertGetId([
            'mata_pelajaran_id' => $mataPelajaran->id,
            'guru_id' => $guru->id,
            'kelas_id' => $kelas->id,
            'tahun_ajaran_id' => $tahunAjaran->id,
            'semester_id' => $semester->id,
            'judul_ujian' => 'UTS Matematika Semester Genap',
            'jenis_ujian' => 'UTS',
            'tanggal_ujian' => $now->copy()->addDays(2)->setTime(8, 0, 0),
            'durasi_menit' => 90,
            'bobot' => 100,
            'kkm' => 75,
            'keterangan' => 'Ujian Tengah Semester untuk materi semester genap',
            'status' => 'dijadwalkan',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $this->command->info("✓ Ujian Dijadwalkan dibuat dengan ID: {$ujianDijadwalkanId}");

        // Summary
        $this->command->info("\n" . str_repeat('=', 60));
        $this->command->info("SEEDER BERHASIL DIJALANKAN!");
        $this->command->info(str_repeat('=', 60));
        $this->command->info("✅ Ujian Selesai (ID: {$ujianSelesaiId})");
        $this->command->info("   - Status: selesai");
        $this->command->info("   - Siswa: {$siswaList->count()} siswa sudah mengerjakan");
        $this->command->info("   - Nilai: Rata-rata " . round(collect($nilaiBase)->take($siswaList->count())->avg(), 2));
        $this->command->info("");
        $this->command->info("✅ Ujian Berlangsung (ID: {$ujianBerlangsungId})");
        $this->command->info("   - Status: berlangsung");
        $this->command->info("   - Siswa: 3 sedang mengerjakan, 2 belum mulai");
        $this->command->info("");
        $this->command->info("✅ Ujian Dijadwalkan (ID: {$ujianDijadwalkanId})");
        $this->command->info("   - Status: dijadwalkan");
        $this->command->info("   - Tanggal: " . $now->copy()->addDays(2)->format('d M Y H:i'));
        $this->command->info(str_repeat('=', 60));
        $this->command->info("\nCara melihat:");
        $this->command->info("▸ Guru: Buka menu Ujian → Klik icon hijau 'Lihat Hasil Siswa' pada ujian #{$ujianSelesaiId}");
        $this->command->info("▸ Siswa: Buka menu 'Ujian Saya' untuk melihat daftar ujian");
    }
}
