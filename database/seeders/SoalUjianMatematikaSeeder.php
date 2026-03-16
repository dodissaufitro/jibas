<?php

namespace Database\Seeders;

use App\Models\SoalUjian;
use Illuminate\Database\Seeder;

class SoalUjianMatematikaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeder ini membuat 15 soal untuk Ujian Matematika - Bilangan Bulat dan Pecahan (ujian_id = 4)
     */
    public function run(): void
    {
        $this->command->info('Creating 15 Soal Ujian Matematika - Bilangan Bulat dan Pecahan...');

        $ujianId = 4; // Ujian Matematika - Bilangan Bulat dan Pecahan

        $soalData = [
            // OPERASI BILANGAN BULAT
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 1,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Berapakah hasil dari -15 + 23 - 8 = ?',
                'opsi_a' => '-6',
                'opsi_b' => '0',
                'opsi_c' => '6',
                'opsi_d' => '16',
                'opsi_e' => null,
                'jawaban_benar' => 'B',
                'bobot' => 5.0,
                'pembahasan' => 'Langkah 1: -15 + 23 = 8. Langkah 2: 8 - 8 = 0. Jadi jawabannya adalah 0.',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 2,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Suhu di kota A adalah -5°C pada pagi hari. Pada siang hari suhu naik 12°C. Berapakah suhu pada siang hari?',
                'opsi_a' => '7°C',
                'opsi_b' => '17°C',
                'opsi_c' => '-7°C',
                'opsi_d' => '-17°C',
                'opsi_e' => null,
                'jawaban_benar' => 'A',
                'bobot' => 5.0,
                'pembahasan' => 'Suhu pagi: -5°C. Naik 12°C berarti: -5 + 12 = 7°C.',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 3,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Hasil dari (-12) × 5 ÷ (-3) adalah...',
                'opsi_a' => '-20',
                'opsi_b' => '20',
                'opsi_c' => '-60',
                'opsi_d' => '60',
                'opsi_e' => null,
                'jawaban_benar' => 'B',
                'bobot' => 7.0,
                'pembahasan' => 'Langkah 1: (-12) × 5 = -60. Langkah 2: -60 ÷ (-3) = 20. (negatif dibagi negatif = positif)',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 4,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Urutan bilangan dari yang terkecil ke terbesar yang benar adalah...',
                'opsi_a' => '-8, -5, 0, 3, 7',
                'opsi_b' => '7, 3, 0, -5, -8',
                'opsi_c' => '0, -5, -8, 3, 7',
                'opsi_d' => '-5, -8, 0, 3, 7',
                'opsi_e' => null,
                'jawaban_benar' => 'A',
                'bobot' => 5.0,
                'pembahasan' => 'Bilangan negatif yang lebih besar nilainya lebih kecil. Semakin jauh dari 0 ke kiri (negatif), semakin kecil nilainya. Urutan yang benar: -8, -5, 0, 3, 7.',
                'file_soal' => null,
            ],

            // OPERASI PECAHAN
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 5,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Hasil dari 2/3 + 1/6 adalah...',
                'opsi_a' => '3/9',
                'opsi_b' => '3/6',
                'opsi_c' => '5/6',
                'opsi_d' => '1/2',
                'opsi_e' => null,
                'jawaban_benar' => 'C',
                'bobot' => 6.0,
                'pembahasan' => 'KPK dari 3 dan 6 adalah 6. Ubah: 2/3 = 4/6. Maka: 4/6 + 1/6 = 5/6.',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 6,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Siti mempunyai 3/4 kg gula. Ia memberikan 1/2 kg kepada tetangga. Berapa kg sisa gula Siti?',
                'opsi_a' => '1/4 kg',
                'opsi_b' => '1/2 kg',
                'opsi_c' => '2/4 kg',
                'opsi_d' => '5/4 kg',
                'opsi_e' => null,
                'jawaban_benar' => 'A',
                'bobot' => 6.0,
                'pembahasan' => 'Ubah ke penyebut sama: 3/4 - 1/2 = 3/4 - 2/4 = 1/4 kg.',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 7,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Hasil dari 2/5 × 15/4 adalah...',
                'opsi_a' => '3/2',
                'opsi_b' => '2/3',
                'opsi_c' => '30/20',
                'opsi_d' => '1 1/2',
                'opsi_e' => null,
                'jawaban_benar' => 'A',
                'bobot' => 7.0,
                'pembahasan' => 'Kalikan pembilang dengan pembilang, penyebut dengan penyebut: (2×15)/(5×4) = 30/20 = 3/2 atau 1 1/2. Jawaban A dan D sama.',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 8,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Pecahan 3/4 jika diubah menjadi desimal adalah...',
                'opsi_a' => '0,5',
                'opsi_b' => '0,6',
                'opsi_c' => '0,75',
                'opsi_d' => '0,8',
                'opsi_e' => null,
                'jawaban_benar' => 'C',
                'bobot' => 5.0,
                'pembahasan' => 'Bagi pembilang dengan penyebut: 3 ÷ 4 = 0,75.',
                'file_soal' => null,
            ],

            // PECAHAN CAMPURAN & KONVERSI
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 9,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Bentuk pecahan biasa dari 2 3/5 adalah...',
                'opsi_a' => '11/5',
                'opsi_b' => '13/5',
                'opsi_c' => '10/5',
                'opsi_d' => '8/5',
                'opsi_e' => null,
                'jawaban_benar' => 'B',
                'bobot' => 5.0,
                'pembahasan' => 'Rumus: (bilangan bulat × penyebut) + pembilang / penyebut = (2 × 5) + 3 / 5 = 13/5.',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 10,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Hasil dari 1 1/2 + 2 2/3 adalah...',
                'opsi_a' => '3 1/6',
                'opsi_b' => '4 1/6',
                'opsi_c' => '3 5/6',
                'opsi_d' => '4 5/6',
                'opsi_e' => null,
                'jawaban_benar' => 'B',
                'bobot' => 8.0,
                'pembahasan' => 'Ubah ke pecahan biasa: 3/2 + 8/3. KPK dari 2 dan 3 adalah 6. Jadi: 9/6 + 16/6 = 25/6 = 4 1/6.',
                'file_soal' => null,
            ],

            // SOAL PERBANDINGAN & APLIKASI
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 11,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Pecahan yang senilai dengan 4/6 adalah...',
                'opsi_a' => '2/3',
                'opsi_b' => '3/4',
                'opsi_c' => '6/8',
                'opsi_d' => '8/10',
                'opsi_e' => null,
                'jawaban_benar' => 'A',
                'bobot' => 5.0,
                'pembahasan' => 'Sederhanakan 4/6 dengan membagi pembilang dan penyebut dengan FPB (2): 4÷2/6÷2 = 2/3.',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 12,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Urutan pecahan dari yang terkecil adalah...',
                'opsi_a' => '1/2, 2/3, 3/4',
                'opsi_b' => '3/4, 2/3, 1/2',
                'opsi_c' => '2/3, 1/2, 3/4',
                'opsi_d' => '1/2, 3/4, 2/3',
                'opsi_e' => null,
                'jawaban_benar' => 'A',
                'bobot' => 7.0,
                'pembahasan' => 'Ubah ke desimal: 1/2 = 0,5; 2/3 = 0,666...; 3/4 = 0,75. Urutan: 0,5 < 0,666 < 0,75.',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 13,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Hasil dari 3/4 ÷ 2/3 adalah...',
                'opsi_a' => '6/12',
                'opsi_b' => '9/8',
                'opsi_c' => '1/2',
                'opsi_d' => '2',
                'opsi_e' => null,
                'jawaban_benar' => 'B',
                'bobot' => 8.0,
                'pembahasan' => 'Pembagian pecahan = kalikan dengan kebalikan: 3/4 × 3/2 = 9/8 atau 1 1/8.',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 14,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Ani membeli 2 1/4 kg apel dan 1 3/4 kg jeruk. Berapa kg total buah yang dibeli Ani?',
                'opsi_a' => '3 kg',
                'opsi_b' => '3 1/2 kg',
                'opsi_c' => '4 kg',
                'opsi_d' => '4 1/2 kg',
                'opsi_e' => null,
                'jawaban_benar' => 'C',
                'bobot' => 8.0,
                'pembahasan' => '2 1/4 + 1 3/4 = (2 + 1) + (1/4 + 3/4) = 3 + 4/4 = 3 + 1 = 4 kg.',
                'file_soal' => null,
            ],
            [
                'ujian_id' => $ujianId,
                'nomor_soal' => 15,
                'tipe_soal' => 'pilihan_ganda',
                'pertanyaan' => 'Sebuah tali sepanjang 3,5 m dipotong menjadi 5 bagian sama panjang. Berapa panjang setiap potongan?',
                'opsi_a' => '0,5 m',
                'opsi_b' => '0,7 m',
                'opsi_c' => '1 m',
                'opsi_d' => '1,5 m',
                'opsi_e' => null,
                'jawaban_benar' => 'B',
                'bobot' => 9.0,
                'pembahasan' => 'Panjang setiap potongan = 3,5 ÷ 5 = 0,7 m. Atau ubah ke pecahan: 7/2 ÷ 5 = 7/10 = 0,7 m.',
                'file_soal' => null,
            ],
        ];

        // Insert soal ke database
        foreach ($soalData as $soal) {
            SoalUjian::create($soal);
        }

        $this->command->info('✓ Successfully created 15 soal for Ujian Matematika (ID: 4)');
        $this->command->info('Total bobot: 100 poin');
    }
}
