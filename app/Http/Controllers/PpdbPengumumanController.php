<?php

namespace App\Http\Controllers;

use App\Models\PpdbPengumuman;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PpdbPengumumanController extends Controller
{
    public function index()
    {
        $pengumuman = PpdbPengumuman::with('tahunAjaran')
            ->orderBy('tanggal_pengumuman', 'desc')
            ->paginate(15);

        return Inertia::render('PPDB/Pengumuman/Index', [
            'pengumuman' => $pengumuman
        ]);
    }

    public function create()
    {
        $tahunAjaran = TahunAjaran::orderBy('tahun_mulai', 'desc')->get();

        return Inertia::render('PPDB/Pengumuman/Create', [
            'tahunAjaran' => $tahunAjaran,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'tanggal_pengumuman' => 'required|date',
            'is_published' => 'required|boolean',
        ]);

        PpdbPengumuman::create($validated);

        return redirect()->route('ppdb.pengumuman.index')
            ->with('success', 'Pengumuman berhasil disimpan');
    }

    public function edit(PpdbPengumuman $pengumuman)
    {
        $tahunAjaran = TahunAjaran::orderBy('tahun_mulai', 'desc')->get();

        return Inertia::render('PPDB/Pengumuman/Edit', [
            'pengumuman' => $pengumuman->load('tahunAjaran'),
            'tahunAjaran' => $tahunAjaran,
        ]);
    }

    public function update(Request $request, PpdbPengumuman $pengumuman)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'tanggal_pengumuman' => 'required|date',
            'is_published' => 'required|boolean',
        ]);

        $pengumuman->update($validated);

        return redirect()->route('ppdb.pengumuman.index')
            ->with('success', 'Pengumuman berhasil diperbarui');
    }

    public function destroy(PpdbPengumuman $pengumuman)
    {
        $pengumuman->delete();

        return redirect()->route('ppdb.pengumuman.index')
            ->with('success', 'Pengumuman berhasil dihapus');
    }
}
