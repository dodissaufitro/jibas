<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\PresensiGuru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresensiGuruController extends Controller
{
    public function index()
    {
        $presensi = PresensiGuru::with('guru')
            ->orderBy('tanggal', 'desc')
            ->paginate(15);

        return Inertia::render('Presensi/Guru/Index', [
            'presensi' => $presensi
        ]);
    }

    public function create()
    {
        $guru = Guru::orderBy('nama_lengkap')->get();

        return Inertia::render('Presensi/Guru/Create', [
            'guru' => $guru,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'guru_id' => 'required|exists:guru,id',
            'tanggal' => 'required|date',
            'status' => 'required|in:hadir,izin,sakit,alpha,dinas_luar',
            'jam_masuk' => 'nullable|date_format:H:i',
            'jam_keluar' => 'nullable|date_format:H:i',
            'keterangan' => 'nullable|string',
        ]);

        PresensiGuru::create($validated);

        return redirect()->route('presensi.guru.index')
            ->with('success', 'Presensi guru berhasil disimpan');
    }

    public function edit(PresensiGuru $guru)
    {
        $guruList = Guru::orderBy('nama_lengkap')->get();

        return Inertia::render('Presensi/Guru/Edit', [
            'presensi' => $guru->load('guru'),
            'guru' => $guruList,
        ]);
    }

    public function update(Request $request, PresensiGuru $guru)
    {
        $validated = $request->validate([
            'guru_id' => 'required|exists:guru,id',
            'tanggal' => 'required|date',
            'status' => 'required|in:hadir,izin,sakit,alpha,dinas_luar',
            'jam_masuk' => 'nullable|date_format:H:i',
            'jam_keluar' => 'nullable|date_format:H:i',
            'keterangan' => 'nullable|string',
        ]);

        $guru->update($validated);

        return redirect()->route('presensi.guru.index')
            ->with('success', 'Presensi guru berhasil diperbarui');
    }

    public function destroy(PresensiGuru $guru)
    {
        $guru->delete();

        return redirect()->route('presensi.guru.index')
            ->with('success', 'Presensi guru berhasil dihapus');
    }
}
