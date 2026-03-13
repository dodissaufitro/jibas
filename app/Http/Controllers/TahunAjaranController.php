<?php

namespace App\Http\Controllers;

use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TahunAjaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tahunAjaran = TahunAjaran::orderBy('tahun_mulai', 'desc')->paginate(10);

        return Inertia::render('MasterData/TahunAjaran/Index', [
            'tahunAjaran' => $tahunAjaran
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('MasterData/TahunAjaran/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tahun_mulai' => 'required|integer|digits:4',
            'tahun_selesai' => 'required|integer|digits:4|gt:tahun_mulai',
            'is_active' => 'boolean',
        ]);

        // Jika set active, nonaktifkan yang lain
        if ($validated['is_active'] ?? false) {
            TahunAjaran::where('is_active', true)->update(['is_active' => false]);
        }

        TahunAjaran::create($validated);

        return redirect()->route('master.tahun-ajaran.index')
            ->with('success', 'Tahun Ajaran berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(TahunAjaran $tahunAjaran)
    {
        return Inertia::render('MasterData/TahunAjaran/Show', [
            'tahunAjaran' => $tahunAjaran
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TahunAjaran $tahunAjaran)
    {
        return Inertia::render('MasterData/TahunAjaran/Edit', [
            'tahunAjaran' => $tahunAjaran
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TahunAjaran $tahunAjaran)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tahun_mulai' => 'required|integer|digits:4',
            'tahun_selesai' => 'required|integer|digits:4|gt:tahun_mulai',
            'is_active' => 'boolean',
        ]);

        // Jika set active, nonaktifkan yang lain
        if ($validated['is_active'] ?? false) {
            TahunAjaran::where('id', '!=', $tahunAjaran->id)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $tahunAjaran->update($validated);

        return redirect()->route('master.tahun-ajaran.index')
            ->with('success', 'Tahun Ajaran berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TahunAjaran $tahunAjaran)
    {
        $tahunAjaran->delete();

        return redirect()->route('master.tahun-ajaran.index')
            ->with('success', 'Tahun Ajaran berhasil dihapus');
    }
}
