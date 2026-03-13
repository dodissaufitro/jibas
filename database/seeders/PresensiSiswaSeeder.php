<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PresensiSiswa;
use App\Models\Siswa;
use App\Models\User;
use Carbon\Carbon;

class PresensiSiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $siswaList = Siswa::with('kelas')->get();

        if ($siswaList->isEmpty()) {
            $this->command->warn('Tidak ada data siswa. Silakan jalankan SiswaSeeder terlebih dahulu.');
            return;
        }

        $adminUser = User::first();
        if (!$adminUser) {
            $this->command->warn('Tidak ada user untuk input_by. Membuat presensi tanpa input_by.');
        }

        // Generate presensi untuk 30 hari terakhir (kecuali weekend)
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        $statuses = ['hadir', 'sakit', 'izin', 'alpha'];
        $statusWeights = [85, 5, 7, 3]; // Probabilitas: 85% hadir, 5% sakit, 7% izin, 3% alpha

        $presensiCount = 0;

        foreach ($siswaList as $siswa) {
            $currentDate = $startDate->copy();

            while ($currentDate <= $endDate) {
                // Skip weekend (Sabtu dan Minggu)
                if ($currentDate->isWeekend()) {
                    $currentDate->addDay();
                    continue;
                }

                // Random status berdasarkan probabilitas
                $rand = rand(1, 100);
                if ($rand <= 85) {
                    $status = 'hadir';
                } elseif ($rand <= 90) {
                    $status = 'sakit';
                } elseif ($rand <= 97) {
                    $status = 'izin';
                } else {
                    $status = 'alpha';
                }

                // Jam masuk dan keluar (hanya untuk status hadir)
                $jamMasuk = null;
                $jamKeluar = null;
                $keterangan = null;

                if ($status === 'hadir') {
                    // Jam masuk: 07:00 - 07:30 (dengan variasi keterlambatan)
                    $masukHour = 7;
                    $masukMinute = rand(0, 30);
                    $jamMasuk = sprintf('%02d:%02d', $masukHour, $masukMinute);

                    // Jam keluar: 14:00 - 15:00
                    $keluarHour = rand(14, 15);
                    $keluarMinute = rand(0, 59);
                    $jamKeluar = sprintf('%02d:%02d', $keluarHour, $keluarMinute);

                    if ($masukMinute > 15) {
                        $keterangan = 'Terlambat ' . ($masukMinute - 15) . ' menit';
                    }
                } elseif ($status === 'sakit') {
                    $keterangan = rand(0, 1) ? 'Sakit demam' : 'Sakit flu';
                } elseif ($status === 'izin') {
                    $keteranganOptions = [
                        'Izin keperluan keluarga',
                        'Izin acara keluarga',
                        'Izin mengikuti lomba',
                        'Izin keperluan pribadi'
                    ];
                    $keterangan = $keteranganOptions[array_rand($keteranganOptions)];
                } else {
                    $keterangan = null; // Alpha tanpa keterangan
                }

                PresensiSiswa::create([
                    'siswa_id' => $siswa->id,
                    'kelas_id' => $siswa->kelas_id,
                    'tanggal' => $currentDate->format('Y-m-d'),
                    'status' => $status,
                    'jam_masuk' => $jamMasuk,
                    'jam_keluar' => $jamKeluar,
                    'keterangan' => $keterangan,
                    'input_by' => $adminUser ? $adminUser->id : null,
                ]);

                $presensiCount++;
                $currentDate->addDay();
            }
        }

        $this->command->info("Berhasil menambahkan {$presensiCount} data presensi siswa untuk {$siswaList->count()} siswa.");
    }
}
