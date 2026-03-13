<?php

namespace App\Http\Controllers;

use App\Models\Jenjang;
use App\Models\Jurusan;
use App\Models\PpdbPembayaran;
use App\Models\PpdbPendaftaran;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PpdbPendaftaranController extends Controller
{
    public function index()
    {
        $pendaftaran = PpdbPendaftaran::with(['tahunAjaran', 'jenjang', 'jurusan'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('PPDB/Pendaftaran/Index', [
            'pendaftaran' => $pendaftaran
        ]);
    }

    public function create()
    {
        $tahunAjaran = TahunAjaran::where('is_active', true)->orderBy('tahun_mulai', 'desc')->get();
        $jenjang = Jenjang::orderBy('kode')->get();
        $jurusan = Jurusan::with('jenjang')->orderBy('kode')->get();

        return Inertia::render('PPDB/Pendaftaran/Create', [
            'tahunAjaran' => $tahunAjaran,
            'jenjang' => $jenjang,
            'jurusan' => $jurusan,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'jenjang_id' => 'required|exists:jenjang,id',
            'jurusan_id' => 'nullable|exists:jurusan,id',
            'nama_lengkap' => 'required|string|max:255',
            'nisn' => 'required|string|max:20',
            'nik' => 'nullable|string|max:20',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'email' => 'nullable|email',
            'no_hp' => 'nullable|string|max:15',
            'nama_ayah' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'pekerjaan_ayah' => 'required|string|max:255',
            'pekerjaan_ibu' => 'required|string|max:255',
            'no_hp_ortu' => 'required|string|max:15',
            'penghasilan_ortu' => 'required|integer',
            'jalur' => 'required|in:reguler,prestasi,afirmasi',
            'status' => 'required|in:pending,verifikasi,lulus,tidak_lulus',
        ]);

        // Generate nomor pendaftaran
        $tahun = date('Y');
        $lastNumber = PpdbPendaftaran::where('no_pendaftaran', 'like', "PPDB-{$tahun}%")
            ->orderBy('created_at', 'desc')
            ->first();

        $nextNumber = $lastNumber ? (int)substr($lastNumber->no_pendaftaran, -4) + 1 : 1;
        $validated['no_pendaftaran'] = sprintf("PPDB-%s-%04d", $tahun, $nextNumber);

        PpdbPendaftaran::create($validated);

        return redirect()->route('ppdb.pendaftaran.index')
            ->with('success', 'Pendaftaran berhasil disimpan');
    }

    public function edit(PpdbPendaftaran $pendaftaran)
    {
        $tahunAjaran = TahunAjaran::orderBy('tahun_mulai', 'desc')->get();
        $jenjang = Jenjang::orderBy('kode')->get();
        $jurusan = Jurusan::with('jenjang')->orderBy('kode')->get();

        return Inertia::render('PPDB/Pendaftaran/Edit', [
            'pendaftaran' => $pendaftaran->load(['tahunAjaran', 'jenjang', 'jurusan']),
            'tahunAjaran' => $tahunAjaran,
            'jenjang' => $jenjang,
            'jurusan' => $jurusan,
        ]);
    }

    public function update(Request $request, PpdbPendaftaran $pendaftaran)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'jenjang_id' => 'required|exists:jenjang,id',
            'jurusan_id' => 'nullable|exists:jurusan,id',
            'nama_lengkap' => 'required|string|max:255',
            'nisn' => 'required|string|max:20',
            'nik' => 'nullable|string|max:20',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'email' => 'nullable|email',
            'no_hp' => 'nullable|string|max:15',
            'nama_ayah' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'pekerjaan_ayah' => 'required|string|max:255',
            'pekerjaan_ibu' => 'required|string|max:255',
            'no_hp_ortu' => 'required|string|max:15',
            'penghasilan_ortu' => 'required|integer',
            'jalur' => 'required|in:reguler,prestasi,afirmasi',
            'status' => 'required|in:pending,verifikasi,lulus,tidak_lulus',
        ]);

        $pendaftaran->update($validated);

        return redirect()->route('ppdb.pendaftaran.index')
            ->with('success', 'Pendaftaran berhasil diperbarui');
    }

    public function destroy(PpdbPendaftaran $pendaftaran)
    {
        $pendaftaran->delete();

        return redirect()->route('ppdb.pendaftaran.index')
            ->with('success', 'Pendaftaran berhasil dihapus');
    }

    public function calon()
    {
        $calon = PpdbPendaftaran::with(['tahunAjaran', 'jenjang', 'jurusan'])
            ->whereIn('status', ['verifikasi', 'lulus'])
            ->orderBy('nama_lengkap')
            ->paginate(15);

        // Statistik
        $stats = [
            'total' => PpdbPendaftaran::whereIn('status', ['verifikasi', 'lulus'])->count(),
            'verifikasi' => PpdbPendaftaran::where('status', 'verifikasi')->count(),
            'lulus' => PpdbPendaftaran::where('status', 'lulus')->count(),
            'per_jalur' => [
                'reguler' => PpdbPendaftaran::whereIn('status', ['verifikasi', 'lulus'])->where('jalur', 'reguler')->count(),
                'prestasi' => PpdbPendaftaran::whereIn('status', ['verifikasi', 'lulus'])->where('jalur', 'prestasi')->count(),
                'afirmasi' => PpdbPendaftaran::whereIn('status', ['verifikasi', 'lulus'])->where('jalur', 'afirmasi')->count(),
            ],
        ];

        return Inertia::render('PPDB/Calon', [
            'calon' => $calon,
            'stats' => $stats,
        ]);
    }

    public function seleksi(Request $request)
    {
        $query = PpdbPendaftaran::with(['tahunAjaran', 'jenjang', 'jurusan']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        } else {
            // Default show pending and verifikasi
            $query->whereIn('status', ['pending', 'verifikasi']);
        }

        // Filter by jalur
        if ($request->has('jalur') && $request->jalur !== 'all') {
            $query->where('jalur', $request->jalur);
        }

        // Filter by jenjang
        if ($request->has('jenjang_id') && $request->jenjang_id !== 'all') {
            $query->where('jenjang_id', $request->jenjang_id);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('no_pendaftaran', 'like', "%{$search}%");
            });
        }

        $pendaftaran = $query->orderBy('created_at', 'desc')->paginate(15);

        // Statistik
        $stats = [
            'total' => PpdbPendaftaran::count(),
            'pending' => PpdbPendaftaran::where('status', 'pending')->count(),
            'verifikasi' => PpdbPendaftaran::where('status', 'verifikasi')->count(),
            'lulus' => PpdbPendaftaran::where('status', 'lulus')->count(),
            'tidak_lulus' => PpdbPendaftaran::where('status', 'tidak_lulus')->count(),
        ];

        // Get filter options
        $jenjangs = Jenjang::select('id', 'nama')->get();

        return Inertia::render('PPDB/Seleksi', [
            'pendaftaran' => $pendaftaran,
            'stats' => $stats,
            'jenjangs' => $jenjangs,
            'filters' => $request->only(['status', 'jalur', 'jenjang_id', 'search']),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,verifikasi,lulus,tidak_lulus',
            'catatan' => 'nullable|string|max:500',
        ]);

        $pendaftaran = PpdbPendaftaran::findOrFail($id);
        $pendaftaran->status = $validated['status'];

        if (isset($validated['catatan'])) {
            $pendaftaran->catatan = $validated['catatan'];
        }

        $pendaftaran->save();

        return redirect()->back()
            ->with('success', 'Status pendaftaran berhasil diperbarui');
    }

    public function pembayaran(Request $request)
    {
        $query = PpdbPendaftaran::with(['tahunAjaran', 'jenjang', 'jurusan', 'pembayaran'])
            ->where('status', 'lulus');

        // Filter by status bayar
        if ($request->has('status_bayar') && $request->status_bayar !== 'all') {
            if ($request->status_bayar === 'lunas') {
                $query->whereHas('pembayaran', function ($q) {
                    $q->where('status_bayar', 'lunas');
                });
            } elseif ($request->status_bayar === 'belum') {
                $query->whereDoesntHave('pembayaran');
            }
        }

        // Filter by jenjang
        if ($request->has('jenjang_id') && $request->jenjang_id !== 'all') {
            $query->where('jenjang_id', $request->jenjang_id);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('no_pendaftaran', 'like', "%{$search}%");
            });
        }

        $pendaftaran = $query->orderBy('created_at', 'desc')->paginate(15);

        // Statistik
        $stats = [
            'total_lulus' => PpdbPendaftaran::where('status', 'lulus')->count(),
            'sudah_bayar' => PpdbPembayaran::where('status_bayar', 'lunas')->distinct('ppdb_pendaftaran_id')->count(),
            'belum_bayar' => PpdbPendaftaran::where('status', 'lulus')
                ->whereDoesntHave('pembayaran')
                ->count(),
            'total_nominal' => PpdbPembayaran::where('status_bayar', 'lunas')->sum('jumlah'),
        ];

        // Get filter options
        $jenjangs = Jenjang::select('id', 'nama')->get();

        return Inertia::render('PPDB/Pembayaran', [
            'pendaftaran' => $pendaftaran,
            'stats' => $stats,
            'jenjangs' => $jenjangs,
            'filters' => $request->only(['status_bayar', 'jenjang_id', 'search']),
        ]);
    }

    public function prosesBayar(Request $request, $id)
    {
        $validated = $request->validate([
            'jenis_pembayaran' => 'required|in:formulir,daftar_ulang,seragam,spp_awal',
            'jumlah' => 'required|integer|min:0',
            'status_bayar' => 'required|in:belum,lunas',
            'tanggal_bayar' => 'required|date',
            'bukti_bayar' => 'nullable|string|max:255',
        ]);

        $validated['ppdb_pendaftaran_id'] = $id;

        // Check if payment already exists for this type
        $existingPayment = PpdbPembayaran::where('ppdb_pendaftaran_id', $id)
            ->where('jenis_pembayaran', $validated['jenis_pembayaran'])
            ->first();

        if ($existingPayment) {
            $existingPayment->update($validated);
        } else {
            PpdbPembayaran::create($validated);
        }

        return redirect()->back()
            ->with('success', 'Pembayaran berhasil diproses');
    }
}
