<?php

namespace App\Http\Controllers;

use App\Models\Ujian;
use App\Models\UjianSiswa;
use App\Models\JawabanSiswa;
use App\Models\SoalUjian;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class UjianSiswaController extends Controller
{
    /**
     * Tampilkan daftar ujian yang tersedia untuk siswa
     */
    public function index()
    {
        // Ambil data siswa berdasarkan user yang login
        $siswa = Siswa::where('user_id', Auth::id())->first();

        if (!$siswa) {
            return redirect()->route('dashboard')
                ->with('error', 'Data siswa tidak ditemukan');
        }

        // Get guru_ids and mata_pelajaran_ids yang mengajar di kelas siswa
        $jadwalKelas = \App\Models\JadwalPelajaran::where('kelas_id', $siswa->kelas_id)
            ->get();

        $guruIds = $jadwalKelas->pluck('guru_id')->unique()->toArray();
        $mapelIds = $jadwalKelas->pluck('mata_pelajaran_id')->unique()->toArray();

        // Ambil ujian yang tersedia untuk kelas siswa, HANYA dari guru dan mapel di jadwal
        $ujian = Ujian::with(['mataPelajaran', 'guru', 'kelas'])
            ->where('kelas_id', $siswa->kelas_id)
            ->whereIn('guru_id', $guruIds)
            ->whereIn('mata_pelajaran_id', $mapelIds)
            ->whereIn('status', ['dijadwalkan', 'berlangsung'])
            ->orderBy('tanggal_ujian', 'asc')
            ->get()
            ->map(function ($item) use ($siswa) {
                // Cek apakah siswa sudah mengerjakan ujian ini
                $ujianSiswa = UjianSiswa::where('ujian_id', $item->id)
                    ->where('siswa_id', $siswa->id)
                    ->first();

                $item->status_pengerjaan = $ujianSiswa ? $ujianSiswa->status : 'belum_mulai';
                $item->nilai = $ujianSiswa ? $ujianSiswa->nilai : null;
                $item->waktu_mulai = $ujianSiswa ? $ujianSiswa->waktu_mulai : null;
                $item->waktu_selesai = $ujianSiswa ? $ujianSiswa->waktu_selesai : null;
                $item->ujian_siswa_id = $ujianSiswa ? $ujianSiswa->id : null;

                return $item;
            });

        return Inertia::render('Siswa/Ujian/Index', [
            'ujian' => $ujian,
            'siswa' => $siswa,
        ]);
    }

    /**
     * Akses ujian dengan kode/nomor ujian
     */
    public function aksesKode(Request $request)
    {
        $validated = $request->validate([
            'kode_ujian' => 'required|string',
        ]);

        $siswa = Siswa::where('user_id', Auth::id())->first();

        if (!$siswa) {
            return redirect()->route('dashboard')
                ->with('error', 'Data siswa tidak ditemukan');
        }

        // Get guru_ids and mata_pelajaran_ids yang mengajar di kelas siswa
        $jadwalKelas = \App\Models\JadwalPelajaran::where('kelas_id', $siswa->kelas_id)
            ->get();

        $guruIds = $jadwalKelas->pluck('guru_id')->unique()->toArray();
        $mapelIds = $jadwalKelas->pluck('mata_pelajaran_id')->unique()->toArray();

        // Cari ujian berdasarkan ID dengan filter jadwal
        $ujian = Ujian::where('id', $validated['kode_ujian'])
            ->where('kelas_id', $siswa->kelas_id)
            ->whereIn('guru_id', $guruIds)
            ->whereIn('mata_pelajaran_id', $mapelIds)
            ->whereIn('status', ['dijadwalkan', 'berlangsung'])
            ->first();

        if (!$ujian) {
            return redirect()->route('siswa.ujian.index')
                ->with('error', 'Kode ujian tidak valid atau ujian tidak tersedia untuk kelas Anda');
        }

        // Redirect ke halaman mulai ujian
        return redirect()->route('siswa.ujian.mulai', $ujian->id);
    }

    /**
     * Mulai mengerjakan ujian
     */
    public function mulai($ujianId)
    {
        $siswa = Siswa::where('user_id', Auth::id())->first();

        if (!$siswa) {
            return redirect()->route('dashboard')
                ->with('error', 'Data siswa tidak ditemukan');
        }

        $ujian = Ujian::with(['mataPelajaran', 'guru', 'kelas'])->findOrFail($ujianId);

        // Cek apakah ujian untuk kelas siswa
        if ($ujian->kelas_id !== $siswa->kelas_id) {
            return redirect()->route('siswa.ujian.index')
                ->with('error', 'Ujian ini bukan untuk kelas Anda');
        }

        // Validasi apakah ujian dari guru yang mengajar di kelas siswa
        $jadwalKelas = \App\Models\JadwalPelajaran::where('kelas_id', $siswa->kelas_id)
            ->get();

        $guruIds = $jadwalKelas->pluck('guru_id')->unique()->toArray();
        $mapelIds = $jadwalKelas->pluck('mata_pelajaran_id')->unique()->toArray();

        if (!in_array($ujian->guru_id, $guruIds) || !in_array($ujian->mata_pelajaran_id, $mapelIds)) {
            return redirect()->route('siswa.ujian.index')
                ->with('error', 'Ujian ini tidak tersedia untuk Anda. Hanya ujian dari guru dan mata pelajaran yang mengajar di kelas Anda yang dapat diakses.');
        }

        // Cek apakah ujian sudah berlangsung atau dijadwalkan
        if (!in_array($ujian->status, ['dijadwalkan', 'berlangsung'])) {
            return redirect()->route('siswa.ujian.index')
                ->with('error', 'Ujian sudah selesai atau dibatalkan');
        }

        // Cek apakah siswa sudah pernah mengerjakan ujian ini
        $ujianSiswa = UjianSiswa::where('ujian_id', $ujianId)
            ->where('siswa_id', $siswa->id)
            ->first();

        if ($ujianSiswa && $ujianSiswa->status === 'selesai') {
            return redirect()->route('siswa.ujian.hasil', $ujianSiswa->id)
                ->with('info', 'Anda sudah menyelesaikan ujian ini');
        }

        // Jika belum ada record, buat baru
        if (!$ujianSiswa) {
            $ujianSiswa = UjianSiswa::create([
                'ujian_id' => $ujianId,
                'siswa_id' => $siswa->id,
                'waktu_mulai' => now(),
                'status' => 'sedang_mengerjakan',
            ]);
        } else {
            // Update status jika masih belum_mulai
            if ($ujianSiswa->status === 'belum_mulai') {
                $ujianSiswa->update([
                    'waktu_mulai' => now(),
                    'status' => 'sedang_mengerjakan',
                ]);
            }
        }

        return redirect()->route('siswa.ujian.kerjakan', $ujianSiswa->id);
    }

    /**
     * Tampilkan halaman mengerjakan ujian
     */
    public function kerjakan($ujianSiswaId)
    {
        $ujianSiswa = UjianSiswa::with([
            'ujian.mataPelajaran',
            'ujian.guru',
            'ujian.kelas',
            'siswa'
        ])->findOrFail($ujianSiswaId);

        // Cek apakah ujian ini milik siswa yang login
        $siswa = Siswa::where('user_id', Auth::id())->first();
        if ($ujianSiswa->siswa_id !== $siswa->id) {
            return redirect()->route('siswa.ujian.index')
                ->with('error', 'Anda tidak memiliki akses ke ujian ini');
        }

        // Cek apakah ujian sudah selesai
        if ($ujianSiswa->status === 'selesai') {
            return redirect()->route('siswa.ujian.hasil', $ujianSiswaId)
                ->with('info', 'Anda sudah menyelesaikan ujian ini');
        }

        // Ambil semua soal ujian (hanya pilihan ganda)
        $soal = SoalUjian::where('ujian_id', $ujianSiswa->ujian_id)
            ->where('tipe_soal', 'pilihan_ganda')
            ->orderBy('nomor_soal')
            ->get()
            ->map(function ($item) {
                // Hilangkan jawaban benar dari response
                return [
                    'id' => $item->id,
                    'nomor_soal' => $item->nomor_soal,
                    'pertanyaan' => $item->pertanyaan,
                    'opsi_a' => $item->opsi_a,
                    'opsi_b' => $item->opsi_b,
                    'opsi_c' => $item->opsi_c,
                    'opsi_d' => $item->opsi_d,
                    'opsi_e' => $item->opsi_e,
                    'file_soal' => $item->file_soal,
                    'bobot' => $item->bobot,
                ];
            });

        // Debug: Log jika soal kosong
        if ($soal->isEmpty()) {
            Log::warning('Soal ujian kosong', [
                'ujian_id' => $ujianSiswa->ujian_id,
                'ujian_siswa_id' => $ujianSiswaId,
                'mata_pelajaran' => $ujianSiswa->ujian->mataPelajaran->nama ?? 'N/A',
                'judul_ujian' => $ujianSiswa->ujian->judul_ujian,
            ]);
        }

        // Ambil jawaban siswa yang sudah disimpan
        $jawaban = JawabanSiswa::where('ujian_siswa_id', $ujianSiswaId)
            ->get()
            ->keyBy('soal_ujian_id');

        // Hitung sisa waktu
        $waktuMulai = Carbon::parse($ujianSiswa->waktu_mulai);
        $waktuSekarang = now();
        $durasiUjian = $ujianSiswa->ujian->durasi_menit;
        $waktuBerakhir = $waktuMulai->copy()->addMinutes($durasiUjian);
        $sisaWaktu = max(0, $waktuSekarang->diffInSeconds($waktuBerakhir, false));

        // Jika waktu habis, otomatis submit
        if ($sisaWaktu <= 0) {
            $this->submitUjian($ujianSiswaId);
            return redirect()->route('siswa.ujian.hasil', $ujianSiswaId)
                ->with('warning', 'Waktu ujian telah habis. Ujian Anda telah disubmit otomatis.');
        }

        return Inertia::render('Siswa/Ujian/Kerjakan', [
            'ujianSiswa' => $ujianSiswa,
            'soal' => $soal,
            'jawaban' => $jawaban,
            'sisaWaktu' => $sisaWaktu, // dalam detik
        ]);
    }

    /**
     * Simpan jawaban siswa
     */
    public function simpanJawaban(Request $request, $ujianSiswaId)
    {
        $validated = $request->validate([
            'soal_ujian_id' => 'required|exists:soal_ujian,id',
            'jawaban' => 'required|string|in:A,B,C,D,E',
        ]);

        $ujianSiswa = UjianSiswa::findOrFail($ujianSiswaId);

        // Cek apakah ujian ini milik siswa yang login
        $siswa = Siswa::where('user_id', Auth::id())->first();
        if ($ujianSiswa->siswa_id !== $siswa->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Cek apakah ujian masih dalam status mengerjakan
        if ($ujianSiswa->status !== 'sedang_mengerjakan') {
            return response()->json(['error' => 'Ujian sudah selesai'], 400);
        }

        // Simpan atau update jawaban
        JawabanSiswa::updateOrCreate(
            [
                'ujian_siswa_id' => $ujianSiswaId,
                'soal_ujian_id' => $validated['soal_ujian_id'],
            ],
            [
                'jawaban' => $validated['jawaban'],
            ]
        );

        return response()->json(['success' => true]);
    }

    /**
     * Submit ujian
     */
    public function submit($ujianSiswaId)
    {
        $this->submitUjian($ujianSiswaId);

        return redirect()->route('siswa.ujian.hasil', $ujianSiswaId)
            ->with('success', 'Ujian berhasil disubmit');
    }

    /**
     * Proses submit ujian (helper method)
     */
    private function submitUjian($ujianSiswaId)
    {
        $ujianSiswa = UjianSiswa::findOrFail($ujianSiswaId);

        // Cek apakah ujian ini milik siswa yang login
        $siswa = Siswa::where('user_id', Auth::id())->first();
        if ($ujianSiswa->siswa_id !== $siswa->id) {
            abort(403);
        }

        // Jika sudah selesai, skip
        if ($ujianSiswa->status === 'selesai') {
            return;
        }

        DB::transaction(function () use ($ujianSiswa) {
            // Ambil semua soal
            $soal = SoalUjian::where('ujian_id', $ujianSiswa->ujian_id)
                ->where('tipe_soal', 'pilihan_ganda')
                ->get();

            // Ambil semua jawaban siswa
            $jawaban = JawabanSiswa::where('ujian_siswa_id', $ujianSiswa->id)
                ->get()
                ->keyBy('soal_ujian_id');

            $jumlahBenar = 0;
            $jumlahSalah = 0;
            $jumlahKosong = 0;
            $totalNilai = 0;
            $totalBobot = 0;

            // Periksa setiap jawaban
            foreach ($soal as $item) {
                $totalBobot += $item->bobot;

                if (isset($jawaban[$item->id])) {
                    $jawabanSiswa = $jawaban[$item->id];
                    $isBenar = $jawabanSiswa->jawaban === $item->jawaban_benar;
                    $nilai = $isBenar ? $item->bobot : 0;

                    // Update status jawaban
                    $jawabanSiswa->update([
                        'is_benar' => $isBenar,
                        'nilai' => $nilai,
                    ]);

                    if ($isBenar) {
                        $jumlahBenar++;
                        $totalNilai += $nilai;
                    } else {
                        $jumlahSalah++;
                    }
                } else {
                    // Soal tidak dijawab
                    $jumlahKosong++;
                }
            }

            // Hitung nilai akhir (skala 0-100)
            $nilaiAkhir = $totalBobot > 0 ? ($totalNilai / $totalBobot) * 100 : 0;

            // Hitung durasi pengerjaan
            $waktuMulai = Carbon::parse($ujianSiswa->waktu_mulai);
            $waktuSelesai = now();
            $durasiPengerjaan = $waktuMulai->diffInMinutes($waktuSelesai);

            // Update ujian siswa
            $ujianSiswa->update([
                'waktu_selesai' => $waktuSelesai,
                'durasi_pengerjaan' => $durasiPengerjaan,
                'nilai' => $nilaiAkhir,
                'jumlah_benar' => $jumlahBenar,
                'jumlah_salah' => $jumlahSalah,
                'jumlah_kosong' => $jumlahKosong,
                'status' => 'selesai',
            ]);
        });
    }

    /**
     * Tampilkan hasil ujian
     */
    public function hasil($ujianSiswaId)
    {
        $ujianSiswa = UjianSiswa::with([
            'ujian.mataPelajaran',
            'ujian.guru',
            'ujian.kelas',
            'siswa',
            'jawaban.soalUjian'
        ])->findOrFail($ujianSiswaId);

        // Cek apakah ujian ini milik siswa yang login
        $siswa = Siswa::where('user_id', Auth::id())->first();
        if ($ujianSiswa->siswa_id !== $siswa->id) {
            return redirect()->route('siswa.ujian.index')
                ->with('error', 'Anda tidak memiliki akses ke hasil ujian ini');
        }

        // Cek apakah ujian sudah selesai
        if ($ujianSiswa->status !== 'selesai') {
            return redirect()->route('siswa.ujian.kerjakan', $ujianSiswaId)
                ->with('info', 'Selesaikan ujian terlebih dahulu');
        }

        return Inertia::render('Siswa/Ujian/Hasil', [
            'ujianSiswa' => $ujianSiswa,
        ]);
    }
}
