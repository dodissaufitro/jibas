<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Nilai;
use App\Models\PresensiSiswa;
use App\Models\Raport;
use App\Models\Semester;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RaportController extends Controller
{
    /**
     * Tampilkan daftar raport per kelas dan semester.
     */
    public function index(Request $request)
    {
        $kelasId = $request->get('kelas_id');
        $semesterId = $request->get('semester_id');

        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $semester = Semester::with('tahunAjaran')->orderBy('id', 'desc')->get();

        $raportData = [];
        $selectedKelas = null;
        $selectedSemester = null;

        if ($kelasId && $semesterId) {
            $selectedKelas = Kelas::with(['jenjang', 'jurusan'])->find($kelasId);
            $selectedSemester = Semester::with('tahunAjaran')->find($semesterId);

            $siswaList = Siswa::where('kelas_id', $kelasId)
                ->where('status', 'aktif')
                ->orderBy('nama_lengkap')
                ->get();

            foreach ($siswaList as $siswa) {
                $raport = Raport::where('siswa_id', $siswa->id)
                    ->where('semester_id', $semesterId)
                    ->where('kelas_id', $kelasId)
                    ->first();

                $nilaiCount = Nilai::where('siswa_id', $siswa->id)
                    ->where('semester_id', $semesterId)
                    ->whereNotNull('nilai_akhir')
                    ->count();

                $rataRata = Nilai::where('siswa_id', $siswa->id)
                    ->where('semester_id', $semesterId)
                    ->whereNotNull('nilai_akhir')
                    ->avg('nilai_akhir');

                $raportData[] = [
                    'siswa' => $siswa,
                    'raport' => $raport,
                    'jumlah_mapel' => $nilaiCount,
                    'rata_rata' => $rataRata ? round($rataRata, 2) : null,
                ];
            }
        }

        return Inertia::render('Akademik/Raport/Index', [
            'kelas' => $kelas,
            'semester' => $semester,
            'raportData' => $raportData,
            'selectedKelas' => $selectedKelas,
            'selectedSemester' => $selectedSemester,
            'filters' => [
                'kelas_id' => $kelasId,
                'semester_id' => $semesterId,
            ],
        ]);
    }

    /**
     * Generate raport untuk seluruh siswa di kelas & semester tertentu.
     * Menghitung rata-rata, ranking, dan rekap presensi.
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'semester_id' => 'required|exists:semester,id',
        ]);

        $kelasId = $validated['kelas_id'];
        $semesterId = $validated['semester_id'];

        $semesterData = Semester::findOrFail($semesterId);

        $siswaList = Siswa::where('kelas_id', $kelasId)
            ->where('status', 'aktif')
            ->orderBy('nama_lengkap')
            ->get();

        DB::transaction(function () use ($siswaList, $kelasId, $semesterId, $semesterData) {
            $rataRataList = [];

            foreach ($siswaList as $siswa) {
                // Rekap presensi berdasarkan rentang tanggal semester
                $presensiQuery = PresensiSiswa::where('siswa_id', $siswa->id)
                    ->where('kelas_id', $kelasId);

                if ($semesterData->tanggal_mulai && $semesterData->tanggal_selesai) {
                    $presensiQuery->whereBetween('tanggal', [
                        $semesterData->tanggal_mulai,
                        $semesterData->tanggal_selesai,
                    ]);
                }

                $presensi = $presensiQuery->get();

                $rataRata = Nilai::where('siswa_id', $siswa->id)
                    ->where('semester_id', $semesterId)
                    ->whereNotNull('nilai_akhir')
                    ->avg('nilai_akhir');

                $rataRataList[$siswa->id] = [
                    'rata_rata' => $rataRata ? round($rataRata, 2) : 0,
                    'total_sakit' => $presensi->where('status', 'sakit')->count(),
                    'total_izin' => $presensi->where('status', 'izin')->count(),
                    'total_alpha' => $presensi->where('status', 'alpha')->count(),
                ];
            }

            // Hitung ranking berdasarkan rata-rata tertinggi
            uasort($rataRataList, fn($a, $b) => $b['rata_rata'] <=> $a['rata_rata']);
            $ranking = 1;
            $rankedIds = [];
            foreach ($rataRataList as $siswaId => $data) {
                $rankedIds[$siswaId] = $ranking++;
            }

            foreach ($siswaList as $siswa) {
                $data = $rataRataList[$siswa->id];
                $existing = Raport::where('siswa_id', $siswa->id)
                    ->where('semester_id', $semesterId)
                    ->where('kelas_id', $kelasId)
                    ->first();

                Raport::updateOrCreate(
                    [
                        'siswa_id' => $siswa->id,
                        'semester_id' => $semesterId,
                        'kelas_id' => $kelasId,
                    ],
                    [
                        'rata_rata' => $data['rata_rata'],
                        'ranking' => $rankedIds[$siswa->id],
                        'total_sakit' => $data['total_sakit'],
                        'total_izin' => $data['total_izin'],
                        'total_alpha' => $data['total_alpha'],
                        'is_published' => $existing->is_published ?? false,
                        'catatan_wali_kelas' => $existing->catatan_wali_kelas ?? null,
                    ]
                );
            }
        });

        return redirect()->back()->with('success', 'Raport berhasil di-generate untuk ' . count($siswaList) . ' siswa.');
    }

    /**
     * Tampilkan detail raport satu siswa beserta daftar nilai per mata pelajaran.
     */
    public function show(int $siswaId, Request $request)
    {
        $semesterId = $request->get('semester_id');
        $kelasId = $request->get('kelas_id');

        $siswa = Siswa::with(['kelas.jenjang', 'kelas.jurusan'])->findOrFail($siswaId);
        $semester = Semester::with('tahunAjaran')->findOrFail($semesterId);

        $raport = Raport::where('siswa_id', $siswaId)
            ->where('semester_id', $semesterId)
            ->where('kelas_id', $kelasId)
            ->first();

        $nilaiList = Nilai::with(['mataPelajaran', 'guru'])
            ->where('siswa_id', $siswaId)
            ->where('semester_id', $semesterId)
            ->get()
            ->sortBy('mataPelajaran.nama')
            ->values();

        return Inertia::render('Akademik/Raport/Show', [
            'siswa' => $siswa,
            'semester' => $semester,
            'raport' => $raport,
            'nilaiList' => $nilaiList,
            'filters' => [
                'kelas_id' => $kelasId,
                'semester_id' => $semesterId,
            ],
        ]);
    }

    /**
     * Simpan catatan wali kelas pada raport.
     */
    public function updateCatatan(Request $request, int $id)
    {
        $validated = $request->validate([
            'catatan_wali_kelas' => 'nullable|string|max:1000',
        ]);

        $raport = Raport::findOrFail($id);
        $raport->update($validated);

        return redirect()->back()->with('success', 'Catatan wali kelas berhasil disimpan.');
    }

    /**
     * Publikasikan semua raport untuk kelas & semester tertentu.
     */
    public function publish(Request $request)
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'semester_id' => 'required|exists:semester,id',
        ]);

        $updated = Raport::where('kelas_id', $validated['kelas_id'])
            ->where('semester_id', $validated['semester_id'])
            ->update([
                'is_published' => true,
                'tanggal_terbit' => now()->toDateString(),
            ]);

        return redirect()->back()->with('success', "Raport berhasil dipublikasikan ({$updated} siswa).");
    }
}
