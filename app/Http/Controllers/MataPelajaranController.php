<?php

namespace App\Http\Controllers;

use App\Models\Jenjang;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MataPelajaranController extends Controller
{
    public function index()
    {
        $mataPelajaran = MataPelajaran::with('jenjang')->orderBy('kode')->paginate(10);

        return Inertia::render('MasterData/MataPelajaran/Index', [
            'mataPelajaran' => $mataPelajaran
        ]);
    }

    public function create()
    {
        $jenjang = Jenjang::orderBy('kode')->get();

        return Inertia::render('MasterData/MataPelajaran/Create', [
            'jenjang' => $jenjang
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenjang_id' => 'required|exists:jenjang,id',
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:10|unique:mata_pelajaran,kode',
            'kelompok' => 'required|in:A,B,C',
            'urutan' => 'nullable|integer',
        ]);

        MataPelajaran::create($validated);

        return redirect()->route('master.mata-pelajaran.index')
            ->with('success', 'Mata pelajaran berhasil ditambahkan');
    }

    public function edit(MataPelajaran $mataPelajaran)
    {
        $jenjang = Jenjang::orderBy('kode')->get();

        return Inertia::render('MasterData/MataPelajaran/Edit', [
            'mataPelajaran' => $mataPelajaran->load('jenjang'),
            'jenjang' => $jenjang
        ]);
    }

    public function update(Request $request, MataPelajaran $mataPelajaran)
    {
        $validated = $request->validate([
            'jenjang_id' => 'required|exists:jenjang,id',
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:10|unique:mata_pelajaran,kode,' . $mataPelajaran->id,
            'kelompok' => 'required|in:A,B,C',
            'urutan' => 'nullable|integer',
        ]);

        $mataPelajaran->update($validated);

        return redirect()->route('master.mata-pelajaran.index')
            ->with('success', 'Mata pelajaran berhasil diperbarui');
    }

    public function destroy(MataPelajaran $mataPelajaran)
    {
        $mataPelajaran->delete();

        return redirect()->route('master.mata-pelajaran.index')
            ->with('success', 'Mata pelajaran berhasil dihapus');
    }
}
