<?php

namespace App\Http\Controllers;

use App\Models\Jenjang;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JurusanController extends Controller
{
    public function index()
    {
        $jurusan = Jurusan::with('jenjang')->orderBy('kode')->paginate(10);

        return Inertia::render('MasterData/Jurusan/Index', [
            'jurusan' => $jurusan
        ]);
    }

    public function create()
    {
        $jenjang = Jenjang::orderBy('kode')->get();

        return Inertia::render('MasterData/Jurusan/Create', [
            'jenjang' => $jenjang
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenjang_id' => 'required|exists:jenjang,id',
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:10|unique:jurusan,kode',
            'keterangan' => 'nullable|string',
        ]);

        Jurusan::create($validated);

        return redirect()->route('master.jurusan.index')
            ->with('success', 'Jurusan berhasil ditambahkan');
    }

    public function edit(Jurusan $jurusan)
    {
        $jenjang = Jenjang::orderBy('kode')->get();

        return Inertia::render('MasterData/Jurusan/Edit', [
            'jurusan' => $jurusan->load('jenjang'),
            'jenjang' => $jenjang
        ]);
    }

    public function update(Request $request, Jurusan $jurusan)
    {
        $validated = $request->validate([
            'jenjang_id' => 'required|exists:jenjang,id',
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:10|unique:jurusan,kode,' . $jurusan->id,
            'keterangan' => 'nullable|string',
        ]);

        $jurusan->update($validated);

        return redirect()->route('master.jurusan.index')
            ->with('success', 'Jurusan berhasil diperbarui');
    }

    public function destroy(Jurusan $jurusan)
    {
        $jurusan->delete();

        return redirect()->route('master.jurusan.index')
            ->with('success', 'Jurusan berhasil dihapus');
    }
}
