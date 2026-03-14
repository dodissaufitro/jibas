<?php

namespace App\Http\Controllers;

use App\Models\JadwalPelajaran;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Guru;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalPelajaranController extends Controller
{
    public function index(Request $request)
    {
        try {
            $kelasId = $request->input('kelas_id');

            $query = JadwalPelajaran::with([
                'kelas.jenjang',
                'mataPelajaran',
                'guru',
                'tahunAjaran'
            ]);

            if ($kelasId) {
                $query->where('kelas_id', $kelasId);
            }

            $jadwalData = $query->orderBy('hari')->orderBy('jam_mulai')->get();

            // Group by hari
            $jadwalGrouped = (object)[];
            foreach ($jadwalData as $item) {
                $hari = $item->hari;
                if (!isset($jadwalGrouped->$hari)) {
                    $jadwalGrouped->$hari = [];
                }
                $jadwalGrouped->{$hari}[] = $item;
            }

            $kelas = Kelas::with('jenjang')->get();
            $selectedKelas = $kelasId ? Kelas::with('jenjang')->find($kelasId) : null;

            return Inertia::render('Akademik/Jadwal/Index', [
                'jadwal' => $jadwalGrouped,
                'kelas' => $kelas ?? [],
                'selectedKelas' => $selectedKelas,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function create()
    {
        try {
            $kelas = Kelas::with('jenjang')->get();
            $mataPelajaran = MataPelajaran::all();
            $guru = Guru::all();
            $tahunAjaran = TahunAjaran::where('is_active', true)->first()
                ?? TahunAjaran::latest()->first();

            return Inertia::render('Akademik/Jadwal/Create', [
                'kelas' => $kelas,
                'mataPelajaran' => $mataPelajaran,
                'guru' => $guru,
                'tahunAjaran' => $tahunAjaran,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
                'kelas_id' => 'required|exists:kelas,id',
                'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
                'guru_id' => 'required|exists:guru,id',
                'hari' => 'required|in:senin,selasa,rabu,kamis,jumat,sabtu',
                'jam_mulai' => 'required',
                'jam_selesai' => 'required',
                'ruangan' => 'nullable|string',
            ]);

            JadwalPelajaran::create($validated);

            return redirect()->route('akademik.jadwal.index')
                ->with('success', 'Jadwal pelajaran berhasil ditambahkan');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal menyimpan: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        try {
            $jadwal = JadwalPelajaran::with(['kelas.jenjang', 'mataPelajaran', 'guru', 'tahunAjaran'])->findOrFail($id);
            $kelas = Kelas::with('jenjang')->get();
            $mataPelajaran = MataPelajaran::all();
            $guru = Guru::all();
            $tahunAjaran = TahunAjaran::where('is_active', true)->first()
                ?? TahunAjaran::latest()->first();

            return Inertia::render('Akademik/Jadwal/Edit', [
                'jadwal' => $jadwal,
                'kelas' => $kelas,
                'mataPelajaran' => $mataPelajaran,
                'guru' => $guru,
                'tahunAjaran' => $tahunAjaran,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $jadwal = JadwalPelajaran::findOrFail($id);

            $validated = $request->validate([
                'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
                'kelas_id' => 'required|exists:kelas,id',
                'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
                'guru_id' => 'required|exists:guru,id',
                'hari' => 'required|in:senin,selasa,rabu,kamis,jumat,sabtu',
                'jam_mulai' => 'required',
                'jam_selesai' => 'required',
                'ruangan' => 'nullable|string',
            ]);

            $jadwal->update($validated);

            return redirect()->route('akademik.jadwal.index')
                ->with('success', 'Jadwal pelajaran berhasil diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal memperbarui: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $jadwal = JadwalPelajaran::findOrFail($id);
            $jadwal->delete();

            return redirect()->route('akademik.jadwal.index')
                ->with('success', 'Jadwal pelajaran berhasil dihapus');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus: ' . $e->getMessage());
        }
    }
}
