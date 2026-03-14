<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\PresensiSiswa;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PresensiSiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = PresensiSiswa::with(['siswa.kelas', 'kelas'])
            ->orderBy('tanggal', 'desc');

        // Auto-filter by guru's assigned kelas if user is a guru with specific kelas access
        $user = Auth::user();
        if ($user && $user->guru && $user->guru->kelas()->exists()) {
            $kelasIds = $user->guru->kelas()->pluck('kelas.id')->toArray();
            if (!empty($kelasIds)) {
                $query->whereIn('kelas_id', $kelasIds);
            }
        }

        // Filter by kelas
        if ($request->has('kelas_id') && $request->kelas_id != '') {
            $query->where('kelas_id', $request->kelas_id);
        }

        // Filter by tanggal
        if ($request->has('tanggal') && $request->tanggal != '') {
            $query->whereDate('tanggal', $request->tanggal);
        }

        $presensi = $query->paginate(15)->withQueryString();

        // Get kelas list for filter
        $kelasList = Kelas::with('jenjang', 'jurusan')->orderBy('tingkat')->orderBy('nama_kelas')->get();

        // If user is guru with specific kelas, filter the kelas list
        if ($user && $user->guru && $user->guru->kelas()->exists()) {
            $kelasIds = $user->guru->kelas()->pluck('kelas.id')->toArray();
            $kelasList = $kelasList->whereIn('id', $kelasIds)->values();
        }

        return Inertia::render('Presensi/Siswa/Index', [
            'presensi' => $presensi,
            'kelasList' => $kelasList,
            'filters' => $request->only(['kelas_id', 'tanggal']),
        ]);
    }

    /**
     * Show form untuk ambil absen (bulk attendance)
     */
    public function ambilAbsen(Request $request)
    {
        $user = Auth::user();

        // Get kelas list
        $query = Kelas::with(['jenjang', 'jurusan', 'siswa'])
            ->orderBy('tingkat')
            ->orderBy('nama_kelas');

        // If user is guru with specific kelas, filter to their assigned kelas
        if ($user && $user->guru && $user->guru->kelas()->exists()) {
            $kelasIds = $user->guru->kelas()->pluck('kelas.id')->toArray();
            $query->whereIn('id', $kelasIds);
        }

        $kelasList = $query->get();

        // If kelas_id and tanggal are provided, get siswa list
        $siswaList = null;
        $existingPresensi = [];

        if ($request->has('kelas_id') && $request->has('tanggal')) {
            $kelasId = $request->kelas_id;
            $tanggal = $request->tanggal;

            // Get all siswa in the selected kelas
            $siswaList = Siswa::where('kelas_id', $kelasId)
                ->where('status', 'aktif')
                ->orderBy('nama_lengkap')
                ->get();

            // Check existing presensi for this date
            $existingPresensi = PresensiSiswa::where('kelas_id', $kelasId)
                ->whereDate('tanggal', $tanggal)
                ->get()
                ->keyBy('siswa_id')
                ->toArray();
        }

        return Inertia::render('Presensi/Siswa/AmbilAbsen', [
            'kelasList' => $kelasList,
            'siswaList' => $siswaList,
            'existingPresensi' => $existingPresensi,
            'selectedKelasId' => $request->kelas_id,
            'selectedTanggal' => $request->tanggal ?? date('Y-m-d'),
        ]);
    }

    /**
     * Store bulk presensi
     */
    public function storeAmbilAbsen(Request $request)
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'tanggal' => 'required|date',
            'presensi' => 'required|array',
            'presensi.*.siswa_id' => 'required|exists:siswa,id',
            'presensi.*.status' => 'required|in:hadir,izin,sakit,alpha',
            'presensi.*.jam_masuk' => 'nullable|date_format:H:i',
            'presensi.*.jam_keluar' => 'nullable|date_format:H:i',
            'presensi.*.keterangan' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            // Delete existing presensi for this kelas and date
            PresensiSiswa::where('kelas_id', $validated['kelas_id'])
                ->whereDate('tanggal', $validated['tanggal'])
                ->delete();

            // Insert new presensi records
            foreach ($validated['presensi'] as $presensiData) {
                PresensiSiswa::create([
                    'siswa_id' => $presensiData['siswa_id'],
                    'kelas_id' => $validated['kelas_id'],
                    'tanggal' => $validated['tanggal'],
                    'status' => $presensiData['status'],
                    'jam_masuk' => $presensiData['jam_masuk'] ?? null,
                    'jam_keluar' => $presensiData['jam_keluar'] ?? null,
                    'keterangan' => $presensiData['keterangan'] ?? null,
                    'input_by' => Auth::id(),
                ]);
            }

            DB::commit();

            return redirect()->route('presensi.siswa.index')
                ->with('success', 'Presensi berhasil disimpan untuk ' . count($validated['presensi']) . ' siswa');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan presensi: ' . $e->getMessage()]);
        }
    }

    public function create()
    {
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $siswa = Siswa::with('kelas')->orderBy('nama_lengkap')->get();

        return Inertia::render('Presensi/Siswa/Create', [
            'kelas' => $kelas,
            'siswa' => $siswa,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'kelas_id' => 'required|exists:kelas,id',
            'tanggal' => 'required|date',
            'status' => 'required|in:hadir,izin,sakit,alpha',
            'jam_masuk' => 'nullable|date_format:H:i',
            'jam_keluar' => 'nullable|date_format:H:i',
            'keterangan' => 'nullable|string',
        ]);

        PresensiSiswa::create(array_merge($validated, [
            'input_by' => Auth::id(),
        ]));

        return redirect()->route('presensi.siswa.index')
            ->with('success', 'Presensi berhasil disimpan');
    }

    public function edit(PresensiSiswa $siswa)
    {
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $siswaList = Siswa::with('kelas')->orderBy('nama_lengkap')->get();

        return Inertia::render('Presensi/Siswa/Edit', [
            'presensi' => $siswa->load(['siswa.kelas', 'kelas']),
            'kelas' => $kelas,
            'siswa' => $siswaList,
        ]);
    }

    public function update(Request $request, PresensiSiswa $siswa)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'kelas_id' => 'required|exists:kelas,id',
            'tanggal' => 'required|date',
            'status' => 'required|in:hadir,izin,sakit,alpha',
            'jam_masuk' => 'nullable|date_format:H:i',
            'jam_keluar' => 'nullable|date_format:H:i',
            'keterangan' => 'nullable|string',
        ]);

        $siswa->update($validated);

        return redirect()->route('presensi.siswa.index')
            ->with('success', 'Presensi berhasil diperbarui');
    }

    public function destroy(PresensiSiswa $siswa)
    {
        $siswa->delete();

        return redirect()->route('presensi.siswa.index')
            ->with('success', 'Presensi berhasil dihapus');
    }
}
