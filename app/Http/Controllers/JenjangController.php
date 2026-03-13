<?php

namespace App\Http\Controllers;

use App\Models\Jenjang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JenjangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jenjang = Jenjang::orderBy('kode')->paginate(10);

        return Inertia::render('MasterData/Jenjang/Index', [
            'jenjang' => $jenjang
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('MasterData/Jenjang/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:10|unique:jenjang,kode',
            'keterangan' => 'nullable|string',
        ]);

        Jenjang::create($validated);

        return redirect()->route('master.jenjang.index')
            ->with('success', 'Jenjang berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Jenjang $jenjang)
    {
        return Inertia::render('MasterData/Jenjang/Edit', [
            'jenjang' => $jenjang
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Jenjang $jenjang)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:10|unique:jenjang,kode,' . $jenjang->id,
            'keterangan' => 'nullable|string',
        ]);

        $jenjang->update($validated);

        return redirect()->route('master.jenjang.index')
            ->with('success', 'Jenjang berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jenjang $jenjang)
    {
        $jenjang->delete();

        return redirect()->route('master.jenjang.index')
            ->with('success', 'Jenjang berhasil dihapus');
    }
}
