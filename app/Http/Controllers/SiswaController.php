<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index()
    {
        $siswa = Siswa::with('kelas.jenjang')->orderBy('nama_lengkap')->paginate(15);

        return Inertia::render('Akademik/Siswa/Index', [
            'siswa' => $siswa
        ]);
    }

    public function create()
    {
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();

        return Inertia::render('Akademik/Siswa/Create', [
            'kelas' => $kelas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:20|unique:siswa,nis',
            'nisn' => 'required|string|max:20|unique:siswa,nisn',
            'nik' => 'nullable|string|max:20',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'email' => 'nullable|email|max:255',
            'no_hp' => 'nullable|string|max:15',
            'nama_ayah' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'no_hp_ortu' => 'required|string|max:15',
            'kelas_id' => 'required|exists:kelas,id',
            'status' => 'required|in:aktif,lulus,pindah,keluar',
            'tanggal_masuk' => 'required|date',
        ]);

        Siswa::create($validated);

        return redirect()->route('akademik.siswa.index')
            ->with('success', 'Data siswa berhasil ditambahkan');
    }

    public function edit(Siswa $siswa)
    {
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();

        return Inertia::render('Akademik/Siswa/Edit', [
            'siswa' => $siswa->load('kelas'),
            'kelas' => $kelas
        ]);
    }

    public function update(Request $request, Siswa $siswa)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:20|unique:siswa,nis,' . $siswa->id,
            'nisn' => 'required|string|max:20|unique:siswa,nisn,' . $siswa->id,
            'nik' => 'nullable|string|max:20',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'email' => 'nullable|email|max:255',
            'no_hp' => 'nullable|string|max:15',
            'nama_ayah' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'no_hp_ortu' => 'required|string|max:15',
            'kelas_id' => 'required|exists:kelas,id',
            'status' => 'required|in:aktif,lulus,pindah,keluar',
            'tanggal_masuk' => 'required|date',
            'tanggal_keluar' => 'nullable|date',
        ]);

        $siswa->update($validated);

        return redirect()->route('akademik.siswa.index')
            ->with('success', 'Data siswa berhasil diperbarui');
    }

    public function destroy(Siswa $siswa)
    {
        $siswa->delete();

        return redirect()->route('akademik.siswa.index')
            ->with('success', 'Data siswa berhasil dihapus');
    }
}
