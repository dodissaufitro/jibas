<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Ujian;
use App\Models\UjianSiswa;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class SiswaExamController extends Controller
{
    /**
     * Display exam dashboard for siswa (full-screen exam mode)
     */
    public function dashboard()
    {
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

        // Get active exams for siswa's class, ONLY from teachers and subjects in their schedule
        $ujianAktif = Ujian::with(['mataPelajaran', 'guru', 'kelas'])
            ->where('kelas_id', $siswa->kelas_id)
            ->whereIn('guru_id', $guruIds)
            ->whereIn('mata_pelajaran_id', $mapelIds)
            ->whereIn('status', ['dijadwalkan', 'berlangsung'])
            ->orderBy('tanggal_ujian', 'asc')
            ->get()
            ->map(function ($item) use ($siswa) {
                // Check if siswa already has record for this ujian
                $ujianSiswa = UjianSiswa::where('ujian_id', $item->id)
                    ->where('siswa_id', $siswa->id)
                    ->first();

                $item->status_pengerjaan = $ujianSiswa ? $ujianSiswa->status : 'belum_mulai';
                $item->nilai = $ujianSiswa ? $ujianSiswa->nilai : null;
                $item->waktu_mulai = $ujianSiswa ? $ujianSiswa->waktu_mulai : null;
                $item->waktu_selesai = $ujianSiswa ? $ujianSiswa->waktu_selesai : null;
                $item->ujian_siswa_id = $ujianSiswa ? $ujianSiswa->id : null;

                // Check if exam is available now
                $now = now();
                $examDate = Carbon::parse($item->tanggal_ujian);
                $item->is_available = $examDate->lte($now) && $item->status === 'berlangsung';

                return $item;
            });

        // Stats for siswa
        $stats = [
            'total_ujian' => $ujianAktif->count(),
            'belum_dikerjakan' => $ujianAktif->where('status_pengerjaan', 'belum_mulai')->count(),
            'sedang_dikerjakan' => $ujianAktif->where('status_pengerjaan', 'sedang_mengerjakan')->count(),
            'selesai' => UjianSiswa::where('siswa_id', $siswa->id)
                ->where('status', 'selesai')
                ->count(),
        ];

        return Inertia::render('Siswa/OnlineExam', [
            'siswa' => $siswa->load('kelas'),
            'ujianAktif' => $ujianAktif,
        ]);
    }

    /**
     * Display jadwal pelajaran for siswa
     */
    public function jadwalPelajaran()
    {
        $siswa = Siswa::where('user_id', Auth::id())->first();

        if (!$siswa) {
            return redirect()->route('dashboard')
                ->with('error', 'Data siswa tidak ditemukan');
        }

        // Get jadwal pelajaran untuk kelas siswa
        $jadwalPelajaran = \App\Models\JadwalPelajaran::with(['mataPelajaran', 'guru.user', 'kelas.jenjang'])
            ->where('kelas_id', $siswa->kelas_id)
            ->orderByRaw("FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')")
            ->orderBy('jam_mulai', 'asc')
            ->get()
            ->groupBy('hari');

        // Daftar hari dalam urutan yang benar
        $hariOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

        // Sort grouped data by day order
        $jadwalPelajaranSorted = collect($hariOrder)
            ->mapWithKeys(function ($hari) use ($jadwalPelajaran) {
                return [$hari => $jadwalPelajaran->get($hari, collect([]))];
            })
            ->filter(function ($jadwal) {
                return $jadwal->isNotEmpty();
            });

        return Inertia::render('Siswa/JadwalPelajaran', [
            'siswa' => $siswa->load('kelas.jenjang'),
            'jadwalPelajaran' => $jadwalPelajaranSorted,
            'hariList' => $hariOrder,
        ]);
    }
}
