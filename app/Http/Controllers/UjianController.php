<?php

namespace App\Http\Controllers;

use App\Models\Ujian;
use App\Models\MataPelajaran;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UjianController extends Controller
{
    public function index()
    {
        $ujian = Ujian::with(['mataPelajaran', 'guru', 'kelas', 'tahunAjaran', 'semester'])
            ->orderBy('tanggal_ujian', 'desc')
            ->paginate(15);

        // Statistics
        $stats = [
            'total' => Ujian::count(),
            'dijadwalkan' => Ujian::where('status', 'dijadwalkan')->count(),
            'berlangsung' => Ujian::where('status', 'berlangsung')->count(),
            'selesai' => Ujian::where('status', 'selesai')->count(),
        ];

        return Inertia::render('Ujian/Index', [
            'ujian' => $ujian,
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        $mataPelajaran = MataPelajaran::orderBy('id')->get();
        $guru = Guru::orderBy('nama_lengkap')->get();
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $tahunAjaran = TahunAjaran::orderBy('id')->get();
        $semester = Semester::orderBy('id')->get();

        return Inertia::render('Ujian/Create', [
            'mataPelajaran' => $mataPelajaran,
            'guru' => $guru,
            'kelas' => $kelas,
            'tahunAjaran' => $tahunAjaran,
            'semester' => $semester,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
            'guru_id' => 'required|exists:guru,id',
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'semester_id' => 'required|exists:semester,id',
            'judul_ujian' => 'required|string|max:255',
            'jenis_ujian' => 'required|in:UTS,UAS,Harian,Quiz,Praktek,Tugas,Lainnya',
            'tanggal_ujian' => 'required|date',
            'durasi_menit' => 'required|integer|min:1',
            'bobot' => 'required|numeric|min:0|max:100',
            'kkm' => 'required|numeric|min:0|max:100',
            'keterangan' => 'nullable|string',
            'status' => 'required|in:dijadwalkan,berlangsung,selesai,batal',
        ]);

        Ujian::create($validated);

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil dibuat');
    }

    public function edit(Ujian $ujian)
    {
        $mataPelajaran = MataPelajaran::orderBy('id')->get();
        $guru = Guru::orderBy('nama_lengkap')->get();
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $tahunAjaran = TahunAjaran::orderBy('id')->get();
        $semester = Semester::orderBy('id')->get();

        return Inertia::render('Ujian/Edit', [
            'ujian' => $ujian->load(['mataPelajaran', 'guru', 'kelas', 'tahunAjaran', 'semester']),
            'mataPelajaran' => $mataPelajaran,
            'guru' => $guru,
            'kelas' => $kelas,
            'tahunAjaran' => $tahunAjaran,
            'semester' => $semester,
        ]);
    }

    public function update(Request $request, Ujian $ujian)
    {
        $validated = $request->validate([
            'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
            'guru_id' => 'required|exists:guru,id',
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'semester_id' => 'required|exists:semester,id',
            'judul_ujian' => 'required|string|max:255',
            'jenis_ujian' => 'required|in:UTS,UAS,Harian,Quiz,Praktek,Tugas,Lainnya',
            'tanggal_ujian' => 'required|date',
            'durasi_menit' => 'required|integer|min:1',
            'bobot' => 'required|numeric|min:0|max:100',
            'kkm' => 'required|numeric|min:0|max:100',
            'keterangan' => 'nullable|string',
            'status' => 'required|in:dijadwalkan,berlangsung,selesai,batal',
        ]);

        $ujian->update($validated);

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil diperbarui');
    }

    public function jadwal()
    {
        /** @var User $user */
        $user = Auth::user();

        // Get ujian grouped by date
        $ujian = Ujian::with(['mataPelajaran', 'guru', 'kelas'])
            ->whereIn('status', ['dijadwalkan', 'berlangsung'])
            ->orderBy('tanggal_ujian', 'asc')
            ->get();

        // If user is siswa, add status pengerjaan for each ujian
        if ($user && $user->hasRole('siswa')) {
            $siswa = \App\Models\Siswa::where('user_id', $user->id)->first();

            if ($siswa) {
                $ujian = $ujian->map(function ($item) use ($siswa) {
                    // Check if siswa already has record for this ujian
                    $ujianSiswa = \App\Models\UjianSiswa::where('ujian_id', $item->id)
                        ->where('siswa_id', $siswa->id)
                        ->first();

                    $item->status_pengerjaan = $ujianSiswa ? $ujianSiswa->status : 'belum_mulai';
                    $item->nilai = $ujianSiswa ? $ujianSiswa->nilai : null;
                    $item->ujian_siswa_id = $ujianSiswa ? $ujianSiswa->id : null;

                    return $item;
                });
            }
        }

        // Group by date
        $ujian = $ujian->groupBy(function ($item) {
            return $item->tanggal_ujian->format('Y-m-d');
        });

        // Stats
        $stats = [
            'bulan_ini' => Ujian::whereMonth('tanggal_ujian', date('m'))
                ->whereYear('tanggal_ujian', date('Y'))
                ->count(),
            'minggu_ini' => Ujian::whereBetween('tanggal_ujian', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
            'hari_ini' => Ujian::whereDate('tanggal_ujian', today())->count(),
            'mendatang' => Ujian::where('tanggal_ujian', '>', now())
                ->where('status', 'dijadwalkan')
                ->count(),
        ];

        return Inertia::render('Ujian/Jadwal', [
            'ujian' => $ujian,
            'stats' => $stats,
        ]);
    }

    public function destroy(Ujian $ujian)
    {
        $ujian->delete();

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil dihapus');
    }
}
