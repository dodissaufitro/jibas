<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index()
    {
        $guru = Guru::orderBy('nama_lengkap')->paginate(15);

        return Inertia::render('Akademik/Guru/Index', [
            'guru' => $guru
        ]);
    }

    public function create()
    {
        return Inertia::render('Akademik/Guru/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'required|string|max:20|unique:guru,nip',
            'nuptk' => 'nullable|string|max:20',
            'nik' => 'nullable|string|max:20',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'email' => 'nullable|email|max:255',
            'no_hp' => 'required|string|max:15',
            'pendidikan_terakhir' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
            'status_kepegawaian' => 'required|in:PNS,PPPK,GTY,PTY',
            'status' => 'required|in:aktif,cuti,pensiun',
            'tanggal_masuk' => 'required|date',
        ]);

        Guru::create($validated);

        return redirect()->route('akademik.guru.index')
            ->with('success', 'Data guru berhasil ditambahkan');
    }

    public function edit(Guru $guru)
    {
        return Inertia::render('Akademik/Guru/Edit', [
            'guru' => $guru
        ]);
    }

    public function update(Request $request, Guru $guru)
    {
        $validated = $request->validate([
            'nip' => 'required|string|max:20|unique:guru,nip,' . $guru->id,
            'nuptk' => 'nullable|string|max:20',
            'nik' => 'nullable|string|max:20',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'email' => 'nullable|email|max:255',
            'no_hp' => 'required|string|max:15',
            'pendidikan_terakhir' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
            'status_kepegawaian' => 'required|in:PNS,PPPK,GTY,PTY',
            'status' => 'required|in:aktif,cuti,pensiun',
            'tanggal_masuk' => 'required|date',
            'tanggal_keluar' => 'nullable|date',
        ]);

        $guru->update($validated);

        return redirect()->route('akademik.guru.index')
            ->with('success', 'Data guru berhasil diperbarui');
    }

    public function destroy(Guru $guru)
    {
        $guru->delete();

        return redirect()->route('akademik.guru.index')
            ->with('success', 'Data guru berhasil dihapus');
    }
}
