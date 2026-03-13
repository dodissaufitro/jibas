<?php

namespace App\Http\Controllers;

use App\Models\JenisPembayaran;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Tagihan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagihanController extends Controller
{
    public function index()
    {
        $tagihan = Tagihan::with(['siswa.kelas', 'jenisPembayaran'])
            ->orderBy('jatuh_tempo', 'desc')
            ->paginate(15);

        return Inertia::render('Keuangan/Tagihan/Index', [
            'tagihan' => $tagihan
        ]);
    }

    public function create()
    {
        $siswa = Siswa::with('kelas')->where('status', 'aktif')->orderBy('nama_lengkap')->get();
        $jenisPembayaran = JenisPembayaran::where('is_active', true)->orderBy('nama')->get();

        return Inertia::render('Keuangan/Tagihan/Create', [
            'siswa' => $siswa,
            'jenisPembayaran' => $jenisPembayaran,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'jenis_pembayaran_id' => 'required|exists:jenis_pembayaran,id',
            'bulan' => 'nullable|integer|min:1|max:12',
            'tahun' => 'required|integer',
            'jumlah' => 'required|integer|min:0',
            'denda' => 'nullable|integer|min:0',
            'jatuh_tempo' => 'required|date',
            'status' => 'required|in:belum_bayar,dibayar_sebagian,lunas',
            'keterangan' => 'nullable|string',
        ]);

        Tagihan::create($validated);

        return redirect()->route('keuangan.tagihan.index')
            ->with('success', 'Tagihan berhasil ditambahkan');
    }

    public function edit(Tagihan $tagihan)
    {
        $siswa = Siswa::with('kelas')->where('status', 'aktif')->orderBy('nama_lengkap')->get();
        $jenisPembayaran = JenisPembayaran::where('is_active', true)->orderBy('nama')->get();

        return Inertia::render('Keuangan/Tagihan/Edit', [
            'tagihan' => $tagihan->load(['siswa.kelas', 'jenisPembayaran']),
            'siswa' => $siswa,
            'jenisPembayaran' => $jenisPembayaran,
        ]);
    }

    public function update(Request $request, Tagihan $tagihan)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'jenis_pembayaran_id' => 'required|exists:jenis_pembayaran,id',
            'bulan' => 'nullable|integer|min:1|max:12',
            'tahun' => 'required|integer',
            'jumlah' => 'required|integer|min:0',
            'denda' => 'nullable|integer|min:0',
            'jatuh_tempo' => 'required|date',
            'status' => 'required|in:belum_bayar,dibayar_sebagian,lunas',
            'keterangan' => 'nullable|string',
        ]);

        $tagihan->update($validated);

        return redirect()->route('keuangan.tagihan.index')
            ->with('success', 'Tagihan berhasil diperbarui');
    }

    public function destroy(Tagihan $tagihan)
    {
        $tagihan->delete();

        return redirect()->route('keuangan.tagihan.index')
            ->with('success', 'Tagihan berhasil dihapus');
    }
}
