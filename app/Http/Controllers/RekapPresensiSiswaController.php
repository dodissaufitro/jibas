<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\PresensiSiswa;
use App\Models\RekapPresensiSiswa;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RekapPresensiSiswaController extends Controller
{
    /**
     * Display rekap presensi siswa
     */
    public function index(Request $request)
    {
        $bulan = $request->input('bulan', date('m'));
        $tahun = $request->input('tahun', date('Y'));
        $kelasId = $request->input('kelas_id');

        // Auto-filter by guru's assigned kelas if user is a guru with specific kelas access
        $user = Auth::user();
        $kelasIds = [];
        
        if ($user && $user->guru && $user->guru->kelas()->exists()) {
            $kelasIds = $user->guru->kelas()->pluck('kelas.id')->toArray();
        }

        // Query rekap presensi
        $query = DB::table('presensi_siswa')
            ->select(
                'siswa.id as siswa_id',
                'siswa.nis',
                'siswa.nama_lengkap',
                'kelas.id as kelas_id',
                'kelas.nama_kelas',
                DB::raw('COUNT(CASE WHEN presensi_siswa.status = "hadir" THEN 1 END) as total_hadir'),
                DB::raw('COUNT(CASE WHEN presensi_siswa.status = "izin" THEN 1 END) as total_izin'),
                DB::raw('COUNT(CASE WHEN presensi_siswa.status = "sakit" THEN 1 END) as total_sakit'),
                DB::raw('COUNT(CASE WHEN presensi_siswa.status = "alpha" THEN 1 END) as total_alpha'),
                DB::raw('COUNT(*) as total_hari')
            )
            ->join('siswa', 'presensi_siswa.siswa_id', '=', 'siswa.id')
            ->join('kelas', 'presensi_siswa.kelas_id', '=', 'kelas.id')
            ->whereYear('presensi_siswa.tanggal', $tahun)
            ->whereMonth('presensi_siswa.tanggal', $bulan);

        // Apply kelas filter based on user role
        if (!empty($kelasIds)) {
            $query->whereIn('presensi_siswa.kelas_id', $kelasIds);
        }

        // Apply user-selected kelas filter
        if ($kelasId) {
            $query->where('presensi_siswa.kelas_id', $kelasId);
        }

        $rekap = $query
            ->groupBy('siswa.id', 'siswa.nis', 'siswa.nama_lengkap', 'kelas.id', 'kelas.nama_kelas')
            ->orderBy('kelas.nama_kelas')
            ->orderBy('siswa.nama_lengkap')
            ->get();

        // Calculate persentase kehadiran
        $rekap = $rekap->map(function ($item) {
            $persentase = $item->total_hari > 0 
                ? round(($item->total_hadir / $item->total_hari) * 100, 1) 
                : 0;
            
            return (object) array_merge((array) $item, [
                'persentase_kehadiran' => $persentase,
            ]);
        });

        // Get kelas list for filter
        $kelasQuery = Kelas::with('jenjang', 'jurusan')
            ->orderBy('tingkat')
            ->orderBy('nama_kelas');

        if (!empty($kelasIds)) {
            $kelasQuery->whereIn('id', $kelasIds);
        }

        $kelasList = $kelasQuery->get();

        // Generate month and year options
        $bulanList = [
            ['value' => '01', 'label' => 'Januari'],
            ['value' => '02', 'label' => 'Februari'],
            ['value' => '03', 'label' => 'Maret'],
            ['value' => '04', 'label' => 'April'],
            ['value' => '05', 'label' => 'Mei'],
            ['value' => '06', 'label' => 'Juni'],
            ['value' => '07', 'label' => 'Juli'],
            ['value' => '08', 'label' => 'Agustus'],
            ['value' => '09', 'label' => 'September'],
            ['value' => '10', 'label' => 'Oktober'],
            ['value' => '11', 'label' => 'November'],
            ['value' => '12', 'label' => 'Desember'],
        ];

        $currentYear = date('Y');
        $tahunList = range($currentYear - 2, $currentYear + 1);

        // Calculate summary statistics
        $summary = [
            'total_siswa' => $rekap->count(),
            'rata_rata_kehadiran' => $rekap->avg('persentase_kehadiran') ?? 0,
            'total_hadir' => $rekap->sum('total_hadir'),
            'total_izin' => $rekap->sum('total_izin'),
            'total_sakit' => $rekap->sum('total_sakit'),
            'total_alpha' => $rekap->sum('total_alpha'),
        ];

        return Inertia::render('Presensi/Rekap/Index', [
            'rekap' => $rekap,
            'kelasList' => $kelasList,
            'bulanList' => $bulanList,
            'tahunList' => $tahunList,
            'filters' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
                'kelas_id' => $kelasId,
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Generate monthly recap (simpan ke tabel rekap_presensi_siswa)
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'bulan' => 'required|numeric|between:1,12',
            'tahun' => 'required|numeric|min:2000|max:2099',
            'kelas_id' => 'nullable|exists:kelas,id',
        ]);

        $bulan = str_pad($validated['bulan'], 2, '0', STR_PAD_LEFT);
        $tahun = $validated['tahun'];
        $kelasId = $validated['kelas_id'] ?? null;

        DB::beginTransaction();
        try {
            // Query to get recap data
            $query = DB::table('presensi_siswa')
                ->select(
                    'siswa_id',
                    'kelas_id',
                    DB::raw('COUNT(CASE WHEN status = "hadir" THEN 1 END) as total_hadir'),
                    DB::raw('COUNT(CASE WHEN status = "izin" THEN 1 END) as total_izin'),
                    DB::raw('COUNT(CASE WHEN status = "sakit" THEN 1 END) as total_sakit'),
                    DB::raw('COUNT(CASE WHEN status = "alpha" THEN 1 END) as total_alpha')
                )
                ->whereYear('tanggal', $tahun)
                ->whereMonth('tanggal', $bulan)
                ->groupBy('siswa_id', 'kelas_id');

            if ($kelasId) {
                $query->where('kelas_id', $kelasId);
            }

            $rekapData = $query->get();

            // Delete existing recap for this period
            $deleteQuery = RekapPresensiSiswa::where('bulan', $bulan)->where('tahun', $tahun);
            if ($kelasId) {
                $deleteQuery->where('kelas_id', $kelasId);
            }
            $deleteQuery->delete();

            // Insert new recap data
            $insertCount = 0;
            foreach ($rekapData as $data) {
                RekapPresensiSiswa::create([
                    'siswa_id' => $data->siswa_id,
                    'kelas_id' => $data->kelas_id,
                    'bulan' => $bulan,
                    'tahun' => $tahun,
                    'total_hadir' => $data->total_hadir,
                    'total_izin' => $data->total_izin,
                    'total_sakit' => $data->total_sakit,
                    'total_alpha' => $data->total_alpha,
                ]);
                $insertCount++;
            }

            DB::commit();

            return back()->with('success', "Rekap presensi berhasil digenerate untuk {$insertCount} siswa");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal generate rekap: ' . $e->getMessage()]);
        }
    }

    /**
     * Show detail rekap for specific siswa
     */
    public function show(Request $request, $siswaId)
    {
        $bulan = $request->input('bulan', date('m'));
        $tahun = $request->input('tahun', date('Y'));

        $siswa = Siswa::with('kelas')->findOrFail($siswaId);

        // Get all presensi records for this siswa in the selected month
        $presensi = PresensiSiswa::where('siswa_id', $siswaId)
            ->whereYear('tanggal', $tahun)
            ->whereMonth('tanggal', $bulan)
            ->orderBy('tanggal')
            ->get();

        // Calculate summary
        $summary = [
            'total_hadir' => $presensi->where('status', 'hadir')->count(),
            'total_izin' => $presensi->where('status', 'izin')->count(),
            'total_sakit' => $presensi->where('status', 'sakit')->count(),
            'total_alpha' => $presensi->where('status', 'alpha')->count(),
            'total_hari' => $presensi->count(),
        ];

        $summary['persentase_kehadiran'] = $summary['total_hari'] > 0
            ? round(($summary['total_hadir'] / $summary['total_hari']) * 100, 1)
            : 0;

        return Inertia::render('Presensi/Rekap/Detail', [
            'siswa' => $siswa,
            'presensi' => $presensi,
            'summary' => $summary,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);
    }
}
