<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tagihan;
use App\Models\JenisPembayaran;
use App\Models\Siswa;
use Carbon\Carbon;

class TagihanSeeder extends Seeder
{
    /**
     * Generate nomor tagihan unik
     */
    private function generateNomorTagihan($tahun, $bulan = null): string
    {
        $prefix = 'TGH';
        $bulanStr = $bulan ? str_pad($bulan, 2, '0', STR_PAD_LEFT) : 'XX';
        $lastTagihan = Tagihan::where('nomor_tagihan', 'like', "{$prefix}-{$tahun}-{$bulanStr}-%")
            ->orderBy('nomor_tagihan', 'desc')
            ->first();

        if ($lastTagihan) {
            // Extract last number and increment
            $lastNumber = (int) substr($lastTagihan->nomor_tagihan, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf("%s-%s-%s-%04d", $prefix, $tahun, $bulanStr, $newNumber);
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $siswaList = Siswa::where('status', 'aktif')->get();

        if ($siswaList->isEmpty()) {
            $this->command->warn('Tidak ada data siswa aktif. Silakan jalankan SiswaSeeder terlebih dahulu.');
            return;
        }

        $jenisPembayaran = JenisPembayaran::where('is_active', true)->get();

        if ($jenisPembayaran->isEmpty()) {
            $this->command->warn('Tidak ada data jenis pembayaran. Silakan jalankan JenisPembayaranSeeder terlebih dahulu.');
            return;
        }

        $spp = $jenisPembayaran->where('kode', 'SPP')->first();
        $uts = $jenisPembayaran->where('kode', 'UTS')->first();
        $uas = $jenisPembayaran->where('kode', 'UAS')->first();
        $uangGedung = $jenisPembayaran->where('kode', 'GEDUNG')->first();
        $seragam = $jenisPembayaran->where('kode', 'SERAGAM')->first();
        $buku = $jenisPembayaran->where('kode', 'BUKU')->first();

        $tagihanCount = 0;
        $currentYear = date('Y');
        $currentMonth = date('n');

        foreach ($siswaList as $siswa) {
            // 1. Tagihan SPP untuk 6 bulan terakhir
            if ($spp) {
                for ($i = 5; $i >= 0; $i--) {
                    $bulan = $currentMonth - $i;
                    $tahun = $currentYear;

                    if ($bulan <= 0) {
                        $bulan += 12;
                        $tahun--;
                    }

                    $jatuhTempo = Carbon::create($tahun, $bulan, 10);

                    // Tentukan status berdasarkan jatuh tempo
                    $status = 'belum_bayar';
                    $denda = 0;

                    // Jika sudah lewat jatuh tempo, tambahkan denda dan ubah status
                    if ($jatuhTempo->isPast()) {
                        $hariTerlambat = $jatuhTempo->diffInDays(now());
                        if ($hariTerlambat > 7) {
                            $denda = min($hariTerlambat * 5000, 50000); // Maksimal denda 50rb
                        }

                        // Random status: beberapa sudah lunas, sebagian belum
                        $rand = rand(1, 100);
                        if ($i >= 4) { // Bulan yang lebih lama
                            $status = $rand <= 80 ? 'lunas' : ($rand <= 95 ? 'dibayar_sebagian' : 'belum_bayar');
                        } elseif ($i >= 2) { // Bulan pertengahan
                            $status = $rand <= 50 ? 'lunas' : ($rand <= 75 ? 'dibayar_sebagian' : 'belum_bayar');
                        } else { // Bulan terbaru
                            $status = $rand <= 30 ? 'lunas' : ($rand <= 50 ? 'dibayar_sebagian' : 'belum_bayar');
                        }
                    }

                    Tagihan::create([
                        'nomor_tagihan' => $this->generateNomorTagihan($tahun, $bulan),
                        'siswa_id' => $siswa->id,
                        'jenis_pembayaran_id' => $spp->id,
                        'bulan' => $bulan,
                        'tahun' => $tahun,
                        'jumlah' => $spp->nominal,
                        'denda' => $denda,
                        'jatuh_tempo' => $jatuhTempo,
                        'status' => $status,
                        'keterangan' => $status === 'lunas' ? 'Sudah dibayar' : null,
                    ]);

                    $tagihanCount++;
                }
            }

            // 2. Tagihan UTS semester ini (hanya untuk beberapa siswa)
            if ($uts && rand(1, 3) === 1) {
                $bulanUts = $currentMonth <= 6 ? 3 : 9; // Maret atau September
                $jatuhTempoUts = Carbon::create($currentYear, $bulanUts, 1);

                Tagihan::create([
                    'nomor_tagihan' => $this->generateNomorTagihan($currentYear),
                    'siswa_id' => $siswa->id,
                    'jenis_pembayaran_id' => $uts->id,
                    'bulan' => null,
                    'tahun' => $currentYear,
                    'jumlah' => $uts->nominal,
                    'denda' => 0,
                    'jatuh_tempo' => $jatuhTempoUts,
                    'status' => $jatuhTempoUts->isPast() ? 'lunas' : 'belum_bayar',
                    'keterangan' => 'Ujian Tengah Semester ' . ($currentMonth <= 6 ? 'Genap' : 'Ganjil'),
                ]);

                $tagihanCount++;
            }

            // 3. Tagihan UAS semester lalu (untuk beberapa siswa)
            if ($uas && rand(1, 3) === 1) {
                $bulanUas = $currentMonth <= 6 ? 12 : 6; // Juni atau Desember
                $tahunUas = $bulanUas === 12 ? $currentYear - 1 : $currentYear;
                $jatuhTempoUas = Carbon::create($tahunUas, $bulanUas, 1);

                Tagihan::create([
                    'nomor_tagihan' => $this->generateNomorTagihan($tahunUas),
                    'siswa_id' => $siswa->id,
                    'jenis_pembayaran_id' => $uas->id,
                    'bulan' => null,
                    'tahun' => $tahunUas,
                    'jumlah' => $uas->nominal,
                    'denda' => 0,
                    'jatuh_tempo' => $jatuhTempoUas,
                    'status' => 'lunas',
                    'keterangan' => 'Ujian Akhir Semester ' . ($bulanUas === 12 ? 'Ganjil' : 'Genap'),
                ]);

                $tagihanCount++;
            }

            // 4. Tagihan Uang Gedung tahunan (hanya untuk siswa angkatan 2024)
            if ($uangGedung && $siswa->nis && str_starts_with($siswa->nis, '2024')) {
                Tagihan::create([
                    'nomor_tagihan' => $this->generateNomorTagihan(2024),
                    'siswa_id' => $siswa->id,
                    'jenis_pembayaran_id' => $uangGedung->id,
                    'bulan' => null,
                    'tahun' => 2024,
                    'jumlah' => $uangGedung->nominal,
                    'denda' => 0,
                    'jatuh_tempo' => Carbon::create(2024, 7, 15),
                    'status' => rand(1, 100) <= 70 ? 'lunas' : 'dibayar_sebagian',
                    'keterangan' => 'Uang gedung tahun ajaran 2024/2025',
                ]);

                $tagihanCount++;
            }

            // 5. Tagihan Seragam (untuk siswa baru)
            if ($seragam && $siswa->nis && str_starts_with($siswa->nis, '2024') && rand(1, 2) === 1) {
                Tagihan::create([
                    'nomor_tagihan' => $this->generateNomorTagihan(2024),
                    'siswa_id' => $siswa->id,
                    'jenis_pembayaran_id' => $seragam->id,
                    'bulan' => null,
                    'tahun' => 2024,
                    'jumlah' => $seragam->nominal,
                    'denda' => 0,
                    'jatuh_tempo' => Carbon::create(2024, 7, 20),
                    'status' => rand(1, 100) <= 85 ? 'lunas' : 'belum_bayar',
                    'keterangan' => 'Seragam sekolah (3 stel)',
                ]);

                $tagihanCount++;
            }

            // 6. Tagihan Buku Pelajaran (untuk semua siswa di awal tahun ajaran)
            if ($buku && rand(1, 100) <= 60) {
                Tagihan::create([
                    'nomor_tagihan' => $this->generateNomorTagihan($currentYear),
                    'siswa_id' => $siswa->id,
                    'jenis_pembayaran_id' => $buku->id,
                    'bulan' => null,
                    'tahun' => $currentYear,
                    'jumlah' => $buku->nominal,
                    'denda' => 0,
                    'jatuh_tempo' => Carbon::create($currentYear, 7, 25),
                    'status' => rand(1, 100) <= 75 ? 'lunas' : 'belum_bayar',
                    'keterangan' => 'Buku pelajaran tahun ajaran ' . $currentYear . '/' . ($currentYear + 1),
                ]);

                $tagihanCount++;
            }
        }

        $this->command->info("Berhasil menambahkan {$tagihanCount} data tagihan untuk {$siswaList->count()} siswa.");
    }
}
