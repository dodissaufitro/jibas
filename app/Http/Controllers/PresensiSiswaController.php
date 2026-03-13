<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\PresensiSiswa;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PresensiSiswaController extends Controller
{
    public function index()
    {
        $presensi = PresensiSiswa::with(['siswa.kelas', 'kelas'])
            ->orderBy('tanggal', 'desc')
            ->paginate(15);

        return Inertia::render('Presensi/Siswa/Index', [
            'presensi' => $presensi
        ]);
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
