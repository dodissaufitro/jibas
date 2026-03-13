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

class UjianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil data yang diperlukan
        $mataPelajaran = MataPelajaran::all();
        $guru = Guru::all();
        $kelas = Kelas::all();
        $tahunAjaran = TahunAjaran::first();
        $semester = Semester::first();

        if ($mataPelajaran->isEmpty() || $guru->isEmpty() || $kelas->isEmpty() || !$tahunAjaran || !$semester) {
            $this->command->warn('Data master (Mata Pelajaran, Guru, Kelas, Tahun Ajaran, Semester) belum ada. Silakan seed terlebih dahulu.');
            return;
        }

        $this->command->info('Creating Ujian data...');

        // Ujian 1: Matematika - UTS
        $ujian1 = Ujian::create([
            'mata_pelajaran_id' => $mataPelajaran->firstWhere('nama', 'Matematika')?->id ?? $mataPelajaran->first()->id,
            'guru_id' => $guru->random()->id,
            'kelas_id' => $kelas->first()->id,
            'tahun_ajaran_id' => $tahunAjaran->id,
            'semester_id' => $semester->id,
            'judul_ujian' => 'UTS Matematika - Aljabar dan Geometri',
            'jenis_ujian' => 'UTS',
            'tanggal_ujian' => Carbon::now()->addDays(3)->setTime(8, 0),
            'durasi_menit' => 90,
            'bobot' => 100.00,
            'kkm' => 75.00,
            'keterangan' => 'Ujian Tengah Semester mencakup materi Aljabar dan Geometri',
            'status' => 'dijadwalkan',
        ]);

        // Soal untuk Ujian Matematika
        $soalMatematika = [
            [
                'nomor_soal' => 1,
                'pertanyaan' => 'Berapakah hasil dari 2x + 5 = 15?',
                'opsi_a' => 'x = 3',
                'opsi_b' => 'x = 5',
                'opsi_c' => 'x = 7',
                'opsi_d' => 'x = 10',
                'opsi_e' => 'x = 12',
                'jawaban_benar' => 'B',
                'pembahasan' => '2x + 5 = 15, maka 2x = 10, sehingga x = 5',
                'bobot' => 5.00,
            ],
            [
                'nomor_soal' => 2,
                'pertanyaan' => 'Luas persegi panjang dengan panjang 8 cm dan lebar 5 cm adalah...',
                'opsi_a' => '13 cm²',
                'opsi_b' => '26 cm²',
                'opsi_c' => '40 cm²',
                'opsi_d' => '45 cm²',
                'opsi_e' => '50 cm²',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Luas = panjang × lebar = 8 × 5 = 40 cm²',
                'bobot' => 5.00,
            ],
            [
                'nomor_soal' => 3,
                'pertanyaan' => 'Hasil dari 3² + 4² adalah...',
                'opsi_a' => '7',
                'opsi_b' => '12',
                'opsi_c' => '25',
                'opsi_d' => '49',
                'opsi_e' => '64',
                'jawaban_benar' => 'C',
                'pembahasan' => '3² = 9, 4² = 16, maka 9 + 16 = 25',
                'bobot' => 5.00,
            ],
            [
                'nomor_soal' => 4,
                'pertanyaan' => 'Jika a = 3 dan b = 4, berapakah nilai dari a² - b + 2?',
                'opsi_a' => '5',
                'opsi_b' => '6',
                'opsi_c' => '7',
                'opsi_d' => '8',
                'opsi_e' => '9',
                'jawaban_benar' => 'C',
                'pembahasan' => 'a² - b + 2 = 3² - 4 + 2 = 9 - 4 + 2 = 7',
                'bobot' => 5.00,
            ],
            [
                'nomor_soal' => 5,
                'pertanyaan' => 'Keliling lingkaran dengan jari-jari 7 cm adalah... (π = 22/7)',
                'opsi_a' => '22 cm',
                'opsi_b' => '44 cm',
                'opsi_c' => '88 cm',
                'opsi_d' => '154 cm',
                'opsi_e' => '224 cm',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Keliling = 2πr = 2 × 22/7 × 7 = 44 cm',
                'bobot' => 5.00,
            ],
            [
                'nomor_soal' => 6,
                'pertanyaan' => 'Faktorisasi dari x² - 9 adalah...',
                'opsi_a' => '(x - 3)(x - 3)',
                'opsi_b' => '(x + 3)(x + 3)',
                'opsi_c' => '(x - 3)(x + 3)',
                'opsi_d' => '(x - 9)(x + 1)',
                'opsi_e' => '(x - 1)(x + 9)',
                'jawaban_benar' => 'C',
                'pembahasan' => 'x² - 9 = x² - 3² = (x - 3)(x + 3)',
                'bobot' => 5.00,
            ],
            [
                'nomor_soal' => 7,
                'pertanyaan' => 'Berapakah nilai dari √64 + √36?',
                'opsi_a' => '10',
                'opsi_b' => '12',
                'opsi_c' => '14',
                'opsi_d' => '16',
                'opsi_e' => '18',
                'jawaban_benar' => 'C',
                'pembahasan' => '√64 = 8, √36 = 6, maka 8 + 6 = 14',
                'bobot' => 5.00,
            ],
            [
                'nomor_soal' => 8,
                'pertanyaan' => 'Volume kubus dengan panjang rusuk 5 cm adalah...',
                'opsi_a' => '25 cm³',
                'opsi_b' => '50 cm³',
                'opsi_c' => '75 cm³',
                'opsi_d' => '100 cm³',
                'opsi_e' => '125 cm³',
                'jawaban_benar' => 'E',
                'pembahasan' => 'Volume kubus = s³ = 5³ = 125 cm³',
                'bobot' => 5.00,
            ],
            [
                'nomor_soal' => 9,
                'pertanyaan' => 'Jika 3x - 7 = 20, maka nilai x adalah...',
                'opsi_a' => '7',
                'opsi_b' => '8',
                'opsi_c' => '9',
                'opsi_d' => '10',
                'opsi_e' => '11',
                'jawaban_benar' => 'C',
                'pembahasan' => '3x - 7 = 20, maka 3x = 27, sehingga x = 9',
                'bobot' => 5.00,
            ],
            [
                'nomor_soal' => 10,
                'pertanyaan' => 'Luas segitiga dengan alas 10 cm dan tinggi 6 cm adalah...',
                'opsi_a' => '30 cm²',
                'opsi_b' => '40 cm²',
                'opsi_c' => '50 cm²',
                'opsi_d' => '60 cm²',
                'opsi_e' => '70 cm²',
                'jawaban_benar' => 'A',
                'pembahasan' => 'Luas segitiga = ½ × alas × tinggi = ½ × 10 × 6 = 30 cm²',
                'bobot' => 5.00,
            ],
        ];

        foreach ($soalMatematika as $soal) {
            SoalUjian::create(array_merge($soal, [
                'ujian_id' => $ujian1->id,
                'tipe_soal' => 'pilihan_ganda',
            ]));
        }

        $this->command->info('Created: ' . $ujian1->judul_ujian . ' with ' . count($soalMatematika) . ' questions');

        // Ujian 2: Bahasa Indonesia - Quiz
        $ujian2 = Ujian::create([
            'mata_pelajaran_id' => $mataPelajaran->firstWhere('nama', 'Bahasa Indonesia')?->id ?? $mataPelajaran->skip(1)->first()->id,
            'guru_id' => $guru->random()->id,
            'kelas_id' => $kelas->first()->id,
            'tahun_ajaran_id' => $tahunAjaran->id,
            'semester_id' => $semester->id,
            'judul_ujian' => 'Quiz Bahasa Indonesia - Tata Bahasa',
            'jenis_ujian' => 'Quiz',
            'tanggal_ujian' => Carbon::now()->addDays(5)->setTime(10, 0),
            'durasi_menit' => 45,
            'bobot' => 100.00,
            'kkm' => 70.00,
            'keterangan' => 'Quiz singkat tentang tata bahasa Indonesia',
            'status' => 'dijadwalkan',
        ]);

        // Soal untuk Ujian Bahasa Indonesia
        $soalBahasaIndonesia = [
            [
                'nomor_soal' => 1,
                'pertanyaan' => 'Kata baku yang benar dari kata "apotek" adalah...',
                'opsi_a' => 'Apotik',
                'opsi_b' => 'Apotek',
                'opsi_c' => 'Apothek',
                'opsi_d' => 'Apoteck',
                'opsi_e' => 'Aphotek',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Penulisan yang baku menurut KBBI adalah "apotek"',
                'bobot' => 10.00,
            ],
            [
                'nomor_soal' => 2,
                'pertanyaan' => 'Kalimat yang menggunakan kata hubung "dan" dengan tepat adalah...',
                'opsi_a' => 'Saya makan dan minum',
                'opsi_b' => 'Dia pergi dan pulang',
                'opsi_c' => 'Mereka belajar dan bermain',
                'opsi_d' => 'Semua jawaban benar',
                'opsi_e' => 'Semua jawaban salah',
                'jawaban_benar' => 'D',
                'pembahasan' => 'Semua kalimat menggunakan kata hubung "dan" dengan tepat',
                'bobot' => 10.00,
            ],
            [
                'nomor_soal' => 3,
                'pertanyaan' => 'Kata yang memiliki awalan "me-" yang benar adalah...',
                'opsi_a' => 'Menyanyi',
                'opsi_b' => 'Menyapu',
                'opsi_c' => 'Menulis',
                'opsi_d' => 'Semua jawaban benar',
                'opsi_e' => 'Hanya A dan B',
                'jawaban_benar' => 'D',
                'pembahasan' => 'Semua kata tersebut menggunakan awalan "me-" dengan benar',
                'bobot' => 10.00,
            ],
            [
                'nomor_soal' => 4,
                'pertanyaan' => 'Jenis kalimat "Tolong ambilkan buku itu!" adalah...',
                'opsi_a' => 'Kalimat berita',
                'opsi_b' => 'Kalimat tanya',
                'opsi_c' => 'Kalimat perintah',
                'opsi_d' => 'Kalimat seruan',
                'opsi_e' => 'Kalimat majemuk',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Kalimat tersebut merupakan kalimat perintah karena mengandung perintah',
                'bobot' => 10.00,
            ],
            [
                'nomor_soal' => 5,
                'pertanyaan' => 'Sinonim dari kata "rajin" adalah...',
                'opsi_a' => 'Malas',
                'opsi_b' => 'Giat',
                'opsi_c' => 'Bodoh',
                'opsi_d' => 'Lambat',
                'opsi_e' => 'Cepat',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Sinonim adalah persamaan kata. Rajin = Giat',
                'bobot' => 10.00,
            ],
        ];

        foreach ($soalBahasaIndonesia as $soal) {
            SoalUjian::create(array_merge($soal, [
                'ujian_id' => $ujian2->id,
                'tipe_soal' => 'pilihan_ganda',
            ]));
        }

        $this->command->info('Created: ' . $ujian2->judul_ujian . ' with ' . count($soalBahasaIndonesia) . ' questions');

        // Ujian 3: IPA - Harian
        $ujian3 = Ujian::create([
            'mata_pelajaran_id' => $mataPelajaran->firstWhere('nama', 'IPA')?->id ?? $mataPelajaran->skip(2)->first()?->id ?? $mataPelajaran->first()->id,
            'guru_id' => $guru->random()->id,
            'kelas_id' => $kelas->skip(1)->first()?->id ?? $kelas->first()->id,
            'tahun_ajaran_id' => $tahunAjaran->id,
            'semester_id' => $semester->id,
            'judul_ujian' => 'Ulangan Harian IPA - Fotosintesis',
            'jenis_ujian' => 'Harian',
            'tanggal_ujian' => Carbon::now()->addDays(7)->setTime(9, 0),
            'durasi_menit' => 60,
            'bobot' => 100.00,
            'kkm' => 75.00,
            'keterangan' => 'Ulangan harian tentang proses fotosintesis',
            'status' => 'dijadwalkan',
        ]);

        // Soal untuk Ujian IPA
        $soalIPA = [
            [
                'nomor_soal' => 1,
                'pertanyaan' => 'Organel sel yang berperan dalam fotosintesis adalah...',
                'opsi_a' => 'Mitokondria',
                'opsi_b' => 'Kloroplas',
                'opsi_c' => 'Ribosom',
                'opsi_d' => 'Nukleus',
                'opsi_e' => 'Lisosom',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Kloroplas adalah organel yang mengandung klorofil untuk fotosintesis',
                'bobot' => 10.00,
            ],
            [
                'nomor_soal' => 2,
                'pertanyaan' => 'Gas yang dihasilkan dalam proses fotosintesis adalah...',
                'opsi_a' => 'Karbon dioksida',
                'opsi_b' => 'Nitrogen',
                'opsi_c' => 'Oksigen',
                'opsi_d' => 'Hidrogen',
                'opsi_e' => 'Helium',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Fotosintesis menghasilkan oksigen sebagai produk sampingan',
                'bobot' => 10.00,
            ],
            [
                'nomor_soal' => 3,
                'pertanyaan' => 'Bahan yang diperlukan tumbuhan untuk fotosintesis adalah...',
                'opsi_a' => 'Air dan oksigen',
                'opsi_b' => 'Air dan karbon dioksida',
                'opsi_c' => 'Oksigen dan nitrogen',
                'opsi_d' => 'Karbon dioksida dan nitrogen',
                'opsi_e' => 'Air dan nitrogen',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Tumbuhan memerlukan air dan karbon dioksida untuk fotosintesis',
                'bobot' => 10.00,
            ],
            [
                'nomor_soal' => 4,
                'pertanyaan' => 'Zat hijau daun yang berperan dalam fotosintesis disebut...',
                'opsi_a' => 'Hemoglobin',
                'opsi_b' => 'Klorofil',
                'opsi_c' => 'Karoten',
                'opsi_d' => 'Xantofil',
                'opsi_e' => 'Melanin',
                'jawaban_benar' => 'B',
                'pembahasan' => 'Klorofil adalah pigmen hijau yang menangkap energi cahaya',
                'bobot' => 10.00,
            ],
            [
                'nomor_soal' => 5,
                'pertanyaan' => 'Hasil akhir dari fotosintesis adalah...',
                'opsi_a' => 'Protein',
                'opsi_b' => 'Lemak',
                'opsi_c' => 'Glukosa',
                'opsi_d' => 'Asam amino',
                'opsi_e' => 'Vitamin',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Fotosintesis menghasilkan glukosa sebagai sumber energi',
                'bobot' => 10.00,
            ],
            [
                'nomor_soal' => 6,
                'pertanyaan' => 'Fotosintesis terjadi pada bagian daun yang disebut...',
                'opsi_a' => 'Batang',
                'opsi_b' => 'Akar',
                'opsi_c' => 'Mesofil',
                'opsi_d' => 'Bunga',
                'opsi_e' => 'Buah',
                'jawaban_benar' => 'C',
                'pembahasan' => 'Mesofil adalah jaringan daun tempat terjadinya fotosintesis',
                'bobot' => 10.00,
            ],
            [
                'nomor_soal' => 7,
                'pertanyaan' => 'Faktor yang mempengaruhi laju fotosintesis adalah...',
                'opsi_a' => 'Cahaya',
                'opsi_b' => 'Suhu',
                'opsi_c' => 'Konsentrasi CO2',
                'opsi_d' => 'Semua jawaban benar',
                'opsi_e' => 'Tidak ada jawaban yang benar',
                'jawaban_benar' => 'D',
                'pembahasan' => 'Cahaya, suhu, dan CO2 semuanya mempengaruhi laju fotosintesis',
                'bobot' => 10.00,
            ],
        ];

        foreach ($soalIPA as $soal) {
            SoalUjian::create(array_merge($soal, [
                'ujian_id' => $ujian3->id,
                'tipe_soal' => 'pilihan_ganda',
            ]));
        }

        $this->command->info('Created: ' . $ujian3->judul_ujian . ' with ' . count($soalIPA) . ' questions');

        $this->command->info('✓ Seeder completed successfully!');
        $this->command->info('Total Ujian: 3');
        $this->command->info('Total Soal: ' . (count($soalMatematika) + count($soalBahasaIndonesia) + count($soalIPA)));
    }
}
