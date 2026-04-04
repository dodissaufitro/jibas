<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Nilai;
use App\Models\Semester;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class NilaiController extends Controller
{
    /**
     * Tampilkan daftar nilai berdasarkan filter kelas, semester, mata pelajaran.
     */
    public function index(Request $request)
    {
        $kelasId = $request->get('kelas_id');
        $semesterId = $request->get('semester_id');
        $mataPelajaranId = $request->get('mata_pelajaran_id');

        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $semester = Semester::with('tahunAjaran')->orderBy('id', 'desc')->get();
        $mataPelajaran = MataPelajaran::orderBy('nama')->get();

        $nilaiData = [];
        $selectedKelas = null;
        $selectedSemester = null;
        $selectedMapel = null;

        if ($kelasId && $semesterId && $mataPelajaranId) {
            $selectedKelas = Kelas::with(['jenjang', 'jurusan'])->find($kelasId);
            $selectedSemester = Semester::with('tahunAjaran')->find($semesterId);
            $selectedMapel = MataPelajaran::find($mataPelajaranId);

            $siswaList = Siswa::where('kelas_id', $kelasId)
                ->where('status', 'aktif')
                ->orderBy('nama_lengkap')
                ->get();

            foreach ($siswaList as $siswa) {
                $nilai = Nilai::where('siswa_id', $siswa->id)
                    ->where('semester_id', $semesterId)
                    ->where('mata_pelajaran_id', $mataPelajaranId)
                    ->first();

                $nilaiData[] = [
                    'siswa' => $siswa,
                    'nilai' => $nilai,
                ];
            }
        }

        return Inertia::render('Akademik/Nilai/Index', [
            'kelas' => $kelas,
            'semester' => $semester,
            'mataPelajaran' => $mataPelajaran,
            'nilaiData' => $nilaiData,
            'selectedKelas' => $selectedKelas,
            'selectedSemester' => $selectedSemester,
            'selectedMapel' => $selectedMapel,
            'filters' => [
                'kelas_id' => $kelasId,
                'semester_id' => $semesterId,
                'mata_pelajaran_id' => $mataPelajaranId,
            ],
        ]);
    }

    /**
     * Tampilkan form input nilai massal per kelas.
     */
    public function input(Request $request)
    {
        $kelasId = $request->get('kelas_id');
        $semesterId = $request->get('semester_id');
        $mataPelajaranId = $request->get('mata_pelajaran_id');

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $semester = Semester::with('tahunAjaran')->orderBy('id', 'desc')->get();

        // Guru hanya bisa inputkan nilai untuk mata pelajaran yang diampu
        $mapelQuery = MataPelajaran::orderBy('nama');
        if ($user->hasRole('guru')) {
            $guru = Guru::where('user_id', $user->id)->first();
            if ($guru) {
                $mapelIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id');
                $mapelQuery->whereIn('id', $mapelIds);
            }
        }
        $mataPelajaran = $mapelQuery->get();

        $siswaWithNilai = [];
        $selectedKelas = null;
        $selectedSemester = null;
        $selectedMapel = null;
        $guruId = null;

        if ($kelasId && $semesterId && $mataPelajaranId) {
            $selectedKelas = Kelas::with(['jenjang', 'jurusan'])->find($kelasId);
            $selectedSemester = Semester::with('tahunAjaran')->find($semesterId);
            $selectedMapel = MataPelajaran::find($mataPelajaranId);

            if ($user->hasRole('guru')) {
                $guru = Guru::where('user_id', $user->id)->first();
                $guruId = $guru?->id;
            }

            // Admin: ambil guru pertama dari jadwal untuk mapel+kelas ini
            if (!$guruId) {
                $jadwal = \App\Models\JadwalPelajaran::where('kelas_id', $kelasId)
                    ->where('mata_pelajaran_id', $mataPelajaranId)
                    ->first();
                $guruId = $jadwal?->guru_id;
            }

            $siswaList = Siswa::where('kelas_id', $kelasId)
                ->where('status', 'aktif')
                ->orderBy('nama_lengkap')
                ->get();

            foreach ($siswaList as $siswa) {
                $nilai = Nilai::where('siswa_id', $siswa->id)
                    ->where('semester_id', $semesterId)
                    ->where('mata_pelajaran_id', $mataPelajaranId)
                    ->first();

                $siswaWithNilai[] = [
                    'id' => $siswa->id,
                    'nis' => $siswa->nis,
                    'nama_lengkap' => $siswa->nama_lengkap,
                    'nilai_harian' => $nilai?->nilai_harian,
                    'nilai_uts' => $nilai?->nilai_uts,
                    'nilai_uas' => $nilai?->nilai_uas,
                    'nilai_praktik' => $nilai?->nilai_praktik,
                    'nilai_akhir' => $nilai?->nilai_akhir,
                    'nilai_sikap' => $nilai?->nilai_sikap,
                    'catatan' => $nilai?->catatan,
                    'nilai_id' => $nilai?->id,
                ];
            }
        }

        return Inertia::render('Akademik/Nilai/Input', [
            'kelas' => $kelas,
            'semester' => $semester,
            'mataPelajaran' => $mataPelajaran,
            'siswaWithNilai' => $siswaWithNilai,
            'selectedKelas' => $selectedKelas,
            'selectedSemester' => $selectedSemester,
            'selectedMapel' => $selectedMapel,
            'guruId' => $guruId,
            'filters' => [
                'kelas_id' => $kelasId,
                'semester_id' => $semesterId,
                'mata_pelajaran_id' => $mataPelajaranId,
            ],
        ]);
    }

    /**
     * Simpan nilai massal untuk satu kelas, satu mata pelajaran, satu semester.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'semester_id' => 'required|exists:semester,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
            'guru_id' => 'required|exists:guru,id',
            'kelas_id' => 'required|exists:kelas,id',
            'nilai' => 'required|array|min:1',
            'nilai.*.siswa_id' => 'required|exists:siswa,id',
            'nilai.*.nilai_harian' => 'nullable|numeric|min:0|max:100',
            'nilai.*.nilai_uts' => 'nullable|numeric|min:0|max:100',
            'nilai.*.nilai_uas' => 'nullable|numeric|min:0|max:100',
            'nilai.*.nilai_praktik' => 'nullable|numeric|min:0|max:100',
            'nilai.*.nilai_sikap' => 'nullable|in:A,B,C,D',
            'nilai.*.catatan' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['nilai'] as $item) {
                $components = array_filter([
                    $item['nilai_harian'] ?? null,
                    $item['nilai_uts'] ?? null,
                    $item['nilai_uas'] ?? null,
                    $item['nilai_praktik'] ?? null,
                ], fn($v) => $v !== null);

                $nilaiAkhir = count($components) > 0
                    ? round(array_sum($components) / count($components), 2)
                    : null;

                Nilai::updateOrCreate(
                    [
                        'siswa_id' => $item['siswa_id'],
                        'semester_id' => $validated['semester_id'],
                        'mata_pelajaran_id' => $validated['mata_pelajaran_id'],
                    ],
                    [
                        'guru_id' => $validated['guru_id'],
                        'nilai_harian' => $item['nilai_harian'] ?? null,
                        'nilai_uts' => $item['nilai_uts'] ?? null,
                        'nilai_uas' => $item['nilai_uas'] ?? null,
                        'nilai_praktik' => $item['nilai_praktik'] ?? null,
                        'nilai_akhir' => $nilaiAkhir,
                        'nilai_sikap' => $item['nilai_sikap'] ?? null,
                        'catatan' => $item['catatan'] ?? null,
                    ]
                );
            }
        });

        return redirect()->route('akademik.nilai', [
            'kelas_id' => $validated['kelas_id'],
            'semester_id' => $validated['semester_id'],
            'mata_pelajaran_id' => $validated['mata_pelajaran_id'],
        ])->with('success', 'Nilai berhasil disimpan.');
    }
}
