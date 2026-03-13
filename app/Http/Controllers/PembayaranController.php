<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use App\Models\Tagihan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembayaranController extends Controller
{
    public function index()
    {
        $pembayaran = Pembayaran::with('tagihan.siswa')
            ->orderBy('tanggal_bayar', 'desc')
            ->paginate(15);

        return Inertia::render('Keuangan/Pembayaran/Index', [
            'pembayaran' => $pembayaran
        ]);
    }

    public function create()
    {
        $tagihan = Tagihan::with('siswa.kelas')
            ->where('status', 'belum_bayar')
            ->orderBy('tanggal_jatuh_tempo')
            ->get();

        return Inertia::render('Keuangan/Pembayaran/Create', [
            'tagihan' => $tagihan
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tagihan_id' => 'required|exists:tagihan,id',
            'tanggal_bayar' => 'required|date',
            'jumlah_bayar' => 'required|integer|min:1',
            'metode_pembayaran' => 'required|in:tunai,transfer,qris',
            'bukti_pembayaran' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        // Generate nomor transaksi
        $tahun = date('Y');
        $bulan = date('m');
        $lastNumber = Pembayaran::where('no_transaksi', 'like', "TRX-{$tahun}{$bulan}%")
            ->orderBy('created_at', 'desc')
            ->first();

        $nextNumber = $lastNumber ? (int)substr($lastNumber->no_transaksi, -5) + 1 : 1;
        $validated['no_transaksi'] = sprintf("TRX-%s%s-%05d", $tahun, $bulan, $nextNumber);

        $pembayaran = Pembayaran::create($validated);

        // Update status tagihan jika lunas
        $tagihan = Tagihan::find($validated['tagihan_id']);
        if ($validated['jumlah_bayar'] >= $tagihan->jumlah) {
            $tagihan->update(['status' => 'lunas']);
        }

        return redirect()->route('keuangan.pembayaran.index')
            ->with('success', 'Pembayaran berhasil disimpan');
    }

    public function edit(Pembayaran $pembayaran)
    {
        $tagihan = Tagihan::with('siswa.kelas')->orderBy('tanggal_jatuh_tempo')->get();

        return Inertia::render('Keuangan/Pembayaran/Edit', [
            'pembayaran' => $pembayaran->load('tagihan.siswa'),
            'tagihan' => $tagihan
        ]);
    }

    public function update(Request $request, Pembayaran $pembayaran)
    {
        $validated = $request->validate([
            'tagihan_id' => 'required|exists:tagihan,id',
            'tanggal_bayar' => 'required|date',
            'jumlah_bayar' => 'required|integer|min:1',
            'metode_pembayaran' => 'required|in:tunai,transfer,qris',
            'bukti_pembayaran' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        $pembayaran->update($validated);

        // Update status tagihan
        $tagihan = Tagihan::find($validated['tagihan_id']);
        if ($validated['jumlah_bayar'] >= $tagihan->jumlah) {
            $tagihan->update(['status' => 'lunas']);
        } else {
            $tagihan->update(['status' => 'belum_bayar']);
        }

        return redirect()->route('keuangan.pembayaran.index')
            ->with('success', 'Pembayaran berhasil diperbarui');
    }

    public function destroy(Pembayaran $pembayaran)
    {
        // Update status tagihan kembali ke belum bayar
        $tagihan = $pembayaran->tagihan;
        $tagihan->update(['status' => 'belum_bayar']);

        $pembayaran->delete();

        return redirect()->route('keuangan.pembayaran.index')
            ->with('success', 'Pembayaran berhasil dihapus');
    }
}
