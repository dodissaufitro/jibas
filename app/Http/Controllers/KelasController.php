<?php

namespace App\Http\Controllers;

use App\Models\Jenjang;
use App\Models\Jurusan;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::with(['tahunAjaran', 'jenjang', 'jurusan', 'waliKelas'])
            ->orderBy('tingkat')
            ->orderBy('nama_kelas')
            ->paginate(10);

        return Inertia::render('MasterData/Kelas/Index', [
            'kelas' => $kelas
        ]);
    }

    public function create()
    {
        $tahunAjaran = TahunAjaran::where('is_active', true)->orderBy('tahun_mulai', 'desc')->get();
        $jenjang = Jenjang::orderBy('kode')->get();
        $jurusan = Jurusan::orderBy('kode')->get();
        $guru = User::where('role', 'guru')->orderBy('name')->get();

        return Inertia::render('MasterData/Kelas/Create', [
            'tahunAjaran' => $tahunAjaran,
            'jenjang' => $jenjang,
            'jurusan' => $jurusan,
            'guru' => $guru,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'jenjang_id' => 'required|exists:jenjang,id',
            'jurusan_id' => 'nullable|exists:jurusan,id',
            'nama' => 'required|string|max:255',
            'tingkat' => 'required|integer|min:1|max:12',
            'nama_kelas' => 'required|string|max:10',
            'kapasitas' => 'required|integer|min:1',
            'wali_kelas_id' => 'nullable|exists:users,id',
        ]);

        Kelas::create($validated);

        return redirect()->route('master.kelas.index')
            ->with('success', 'Kelas berhasil ditambahkan');
    }

    public function edit(Kelas $kela)
    {
        $tahunAjaran = TahunAjaran::orderBy('tahun_mulai', 'desc')->get();
        $jenjang = Jenjang::orderBy('kode')->get();
        $jurusan = Jurusan::orderBy('kode')->get();
        $guru = User::where('role', 'guru')->orderBy('name')->get();

        return Inertia::render('MasterData/Kelas/Edit', [
            'kelas' => $kela->load(['tahunAjaran', 'jenjang', 'jurusan', 'waliKelas']),
            'tahunAjaran' => $tahunAjaran,
            'jenjang' => $jenjang,
            'jurusan' => $jurusan,
            'guru' => $guru,
        ]);
    }

    public function update(Request $request, Kelas $kela)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'jenjang_id' => 'required|exists:jenjang,id',
            'jurusan_id' => 'nullable|exists:jurusan,id',
            'nama' => 'required|string|max:255',
            'tingkat' => 'required|integer|min:1|max:12',
            'nama_kelas' => 'required|string|max:10',
            'kapasitas' => 'required|integer|min:1',
            'wali_kelas_id' => 'nullable|exists:users,id',
        ]);

        $kela->update($validated);

        return redirect()->route('master.kelas.index')
            ->with('success', 'Kelas berhasil diperbarui');
    }

    public function destroy(Kelas $kela)
    {
        $kela->delete();

        return redirect()->route('master.kelas.index')
            ->with('success', 'Kelas berhasil dihapus');
    }
}
