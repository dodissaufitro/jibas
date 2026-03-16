<?php

namespace App\Http\Controllers;

use App\Models\Ujian;
use App\Models\MataPelajaran;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\Semester;
use App\Models\User;
use App\Models\UjianSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UjianController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $query = Ujian::with(['mataPelajaran', 'guru', 'kelas', 'tahunAjaran', 'semester']);

        // Filter berdasarkan role guru - hanya tampilkan ujian dari mata pelajaran yang diampu
        if ($user->hasRole('guru')) {
            $guru = Guru::where('user_id', $user->id)->first();

            if ($guru) {
                // Ambil ID mata pelajaran yang diampu guru ini dari tabel pivot
                $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();

                if (!empty($mataPelajaranIds)) {
                    // Filter ujian berdasarkan mata pelajaran yang diampu
                    $query->whereIn('mata_pelajaran_id', $mataPelajaranIds);

                    Log::info('Guru filtering ujian', [
                        'guru_id' => $guru->id,
                        'mata_pelajaran_ids' => $mataPelajaranIds
                    ]);
                } else {
                    // Jika guru tidak mengampu mata pelajaran apapun, tampilkan array kosong
                    $query->whereRaw('1 = 0');
                }
            }
        }

        $ujian = $query->orderBy('tanggal_ujian', 'desc')->paginate(15);

        // Statistics - juga sesuai filter
        $statsQuery = Ujian::query();

        if ($user->hasRole('guru')) {
            $guru = Guru::where('user_id', $user->id)->first();
            if ($guru) {
                $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();
                if (!empty($mataPelajaranIds)) {
                    $statsQuery->whereIn('mata_pelajaran_id', $mataPelajaranIds);
                } else {
                    $statsQuery->whereRaw('1 = 0');
                }
            }
        }

        $stats = [
            'total' => $statsQuery->count(),
            'dijadwalkan' => (clone $statsQuery)->where('status', 'dijadwalkan')->count(),
            'berlangsung' => (clone $statsQuery)->where('status', 'berlangsung')->count(),
            'selesai' => (clone $statsQuery)->where('status', 'selesai')->count(),
        ];

        return Inertia::render('Ujian/Index', [
            'ujian' => $ujian,
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Filter mata pelajaran untuk guru - hanya tampilkan yang diampu
        $mataPelajaranQuery = MataPelajaran::orderBy('id');

        if ($user->hasRole('guru')) {
            $guru = Guru::where('user_id', $user->id)->first();

            if ($guru) {
                $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();

                if (!empty($mataPelajaranIds)) {
                    $mataPelajaranQuery->whereIn('id', $mataPelajaranIds);
                } else {
                    // Jika guru tidak punya mata pelajaran yang diampu, return empty
                    $mataPelajaranQuery->whereRaw('1 = 0');
                }
            }
        }

        $mataPelajaran = $mataPelajaranQuery->get();
        $guru = Guru::orderBy('nama_lengkap')->get();
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $tahunAjaran = TahunAjaran::orderBy('id')->get();
        $semester = Semester::orderBy('id')->get();

        return Inertia::render('Ujian/Create', [
            'mataPelajaran' => $mataPelajaran,
            'guru' => $guru,
            'kelas' => $kelas,
            'tahunAjaran' => $tahunAjaran,
            'semester' => $semester,
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
            'guru_id' => 'required|exists:guru,id',
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'semester_id' => 'required|exists:semester,id',
            'judul_ujian' => 'required|string|max:255',
            'jenis_ujian' => 'required|in:UTS,UAS,Harian,Quiz,Praktek,Tugas,Lainnya',
            'tanggal_ujian' => 'required|date',
            'durasi_menit' => 'required|integer|min:1',
            'bobot' => 'required|numeric|min:0|max:100',
            'kkm' => 'required|numeric|min:0|max:100',
            'keterangan' => 'nullable|string',
            'status' => 'required|in:dijadwalkan,berlangsung,selesai,batal',
        ]);

        // Validasi untuk guru - hanya bisa membuat ujian dari mata pelajaran yang diampu
        if ($user->hasRole('guru')) {
            $guru = Guru::where('user_id', $user->id)->first();

            if ($guru) {
                $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();

                if (!in_array($validated['mata_pelajaran_id'], $mataPelajaranIds)) {
                    return redirect()->back()
                        ->withInput()
                        ->with('error', 'Anda tidak dapat membuat ujian untuk mata pelajaran yang tidak Anda ampu.');
                }
            }
        }

        Ujian::create($validated);

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil dibuat');
    }

    public function edit(Ujian $ujian)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Validasi akses untuk guru - hanya bisa edit ujian dari mata pelajaran yang diampu
        if ($user->hasRole('guru')) {
            $guru = Guru::where('user_id', $user->id)->first();

            if ($guru) {
                $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();

                if (!in_array($ujian->mata_pelajaran_id, $mataPelajaranIds)) {
                    return redirect()->route('ujian.index')
                        ->with('error', 'Anda tidak memiliki akses untuk mengedit ujian ini. Hanya ujian dari mata pelajaran yang Anda ampu yang dapat diedit.');
                }
            }
        }

        // Filter mata pelajaran untuk guru - hanya tampilkan yang diampu
        $mataPelajaranQuery = MataPelajaran::orderBy('id');

        if ($user->hasRole('guru')) {
            $guru = Guru::where('user_id', $user->id)->first();

            if ($guru) {
                $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();

                if (!empty($mataPelajaranIds)) {
                    $mataPelajaranQuery->whereIn('id', $mataPelajaranIds);
                } else {
                    $mataPelajaranQuery->whereRaw('1 = 0');
                }
            }
        }

        $mataPelajaran = $mataPelajaranQuery->get();
        $guru = Guru::orderBy('nama_lengkap')->get();
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $tahunAjaran = TahunAjaran::orderBy('id')->get();
        $semester = Semester::orderBy('id')->get();

        return Inertia::render('Ujian/Edit', [
            'ujian' => $ujian->load(['mataPelajaran', 'guru', 'kelas', 'tahunAjaran', 'semester']),
            'mataPelajaran' => $mataPelajaran,
            'guru' => $guru,
            'kelas' => $kelas,
            'tahunAjaran' => $tahunAjaran,
            'semester' => $semester,
        ]);
    }

    public function update(Request $request, Ujian $ujian)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Validasi akses untuk guru - hanya bisa update ujian dari mata pelajaran yang diampu
        if ($user->hasRole('guru')) {
            $guru = Guru::where('user_id', $user->id)->first();

            if ($guru) {
                $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();

                if (!in_array($ujian->mata_pelajaran_id, $mataPelajaranIds)) {
                    return redirect()->route('ujian.index')
                        ->with('error', 'Anda tidak memiliki akses untuk memperbarui ujian ini.');
                }
            }
        }

        $validated = $request->validate([
            'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
            'guru_id' => 'required|exists:guru,id',
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'semester_id' => 'required|exists:semester,id',
            'judul_ujian' => 'required|string|max:255',
            'jenis_ujian' => 'required|in:UTS,UAS,Harian,Quiz,Praktek,Tugas,Lainnya',
            'tanggal_ujian' => 'required|date',
            'durasi_menit' => 'required|integer|min:1',
            'bobot' => 'required|numeric|min:0|max:100',
            'kkm' => 'required|numeric|min:0|max:100',
            'keterangan' => 'nullable|string',
            'status' => 'required|in:dijadwalkan,berlangsung,selesai,batal',
        ]);

        // Validasi mata pelajaran yang baru untuk guru
        if ($user->hasRole('guru')) {
            $guru = Guru::where('user_id', $user->id)->first();

            if ($guru) {
                $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();

                if (!in_array($validated['mata_pelajaran_id'], $mataPelajaranIds)) {
                    return redirect()->back()
                        ->withInput()
                        ->with('error', 'Anda tidak dapat mengubah ujian ke mata pelajaran yang tidak Anda ampu.');
                }
            }
        }

        $ujian->update($validated);

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil diperbarui');
    }

    public function jadwal()
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            Log::info('Jadwal Ujian - User accessing', ['user_id' => $user->id, 'roles' => $user->roles->pluck('name')]);

            // Get ujian grouped by date
            $query = Ujian::with(['mataPelajaran', 'guru', 'kelas'])
                ->whereIn('status', ['dijadwalkan', 'berlangsung'])
                ->orderBy('tanggal_ujian', 'asc');

            // Filter untuk guru - hanya tampilkan ujian dari mata pelajaran yang diampu
            if ($user->hasRole('guru')) {
                $guru = Guru::where('user_id', $user->id)->first();

                if ($guru) {
                    $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();

                    if (!empty($mataPelajaranIds)) {
                        $query->whereIn('mata_pelajaran_id', $mataPelajaranIds);

                        Log::info('Jadwal Ujian - Guru filter', [
                            'guru_id' => $guru->id,
                            'mata_pelajaran_ids' => $mataPelajaranIds
                        ]);
                    } else {
                        $query->whereRaw('1 = 0');
                    }
                }
            }

            $ujian = $query->get();

            Log::info('Jadwal Ujian - Ujian count', ['count' => $ujian->count()]);

            // If user is siswa, add status pengerjaan for each ujian
            if ($user && $user->hasRole('siswa')) {
                $siswa = \App\Models\Siswa::where('user_id', $user->id)->first();

                if ($siswa) {
                    $ujian = $ujian->map(function ($item) use ($siswa) {
                        // Check if siswa already has record for this ujian
                        $ujianSiswa = \App\Models\UjianSiswa::where('ujian_id', $item->id)
                            ->where('siswa_id', $siswa->id)
                            ->first();

                        $item->status_pengerjaan = $ujianSiswa ? $ujianSiswa->status : 'belum_mulai';
                        $item->nilai = $ujianSiswa ? $ujianSiswa->nilai : null;
                        $item->ujian_siswa_id = $ujianSiswa ? $ujianSiswa->id : null;

                        return $item;
                    });
                }
            }

            // Group by date and convert to array for proper JSON serialization
            $ujianGrouped = $ujian->groupBy(function ($item) {
                return $item->tanggal_ujian->format('Y-m-d');
            })->map(function ($items) {
                return $items->values()->toArray();
            })->toArray();

            Log::info('Jadwal Ujian - Grouped dates', ['dates' => array_keys($ujianGrouped)]);

            // Stats - dengan filter untuk guru
            $statsQuery = Ujian::query();

            if ($user->hasRole('guru')) {
                $guru = Guru::where('user_id', $user->id)->first();
                if ($guru) {
                    $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();
                    if (!empty($mataPelajaranIds)) {
                        $statsQuery->whereIn('mata_pelajaran_id', $mataPelajaranIds);
                    } else {
                        $statsQuery->whereRaw('1 = 0');
                    }
                }
            }

            $stats = [
                'bulan_ini' => (clone $statsQuery)->whereMonth('tanggal_ujian', date('m'))
                    ->whereYear('tanggal_ujian', date('Y'))
                    ->count(),
                'minggu_ini' => (clone $statsQuery)->whereBetween('tanggal_ujian', [
                    now()->startOfWeek(),
                    now()->endOfWeek()
                ])->count(),
                'hari_ini' => (clone $statsQuery)->whereDate('tanggal_ujian', today())->count(),
                'mendatang' => (clone $statsQuery)->where('tanggal_ujian', '>', now())
                    ->where('status', 'dijadwalkan')
                    ->count(),
            ];

            Log::info('Jadwal Ujian - Stats', $stats);

            return Inertia::render('Ujian/Jadwal', [
                'ujian' => $ujianGrouped,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in jadwal method', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Terjadi kesalahan saat memuat jadwal ujian.');
        }
    }

    public function destroy(Ujian $ujian)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Validasi akses untuk guru - hanya bisa delete ujian dari mata pelajaran yang diampu
        if ($user->hasRole('guru')) {
            $guru = Guru::where('user_id', $user->id)->first();

            if ($guru) {
                $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();

                if (!in_array($ujian->mata_pelajaran_id, $mataPelajaranIds)) {
                    return redirect()->route('ujian.index')
                        ->with('error', 'Anda tidak memiliki akses untuk menghapus ujian ini. Hanya ujian dari mata pelajaran yang Anda ampu yang dapat dihapus.');
                }
            }
        }

        $ujian->delete();

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil dihapus');
    }

    /**
     * Tampilkan hasil ujian per siswa (untuk guru)
     */
    public function hasilSiswa($ujianId)
    {
        try {
            /** @var \App\Models\User $user */
            $user = Auth::user();

            // Load ujian dengan relasi
            $ujian = Ujian::with(['mataPelajaran', 'guru', 'kelas', 'tahunAjaran', 'semester'])
                ->findOrFail($ujianId);

            // Validasi akses untuk guru - hanya bisa lihat ujian dari mata pelajaran yang diampu
            if ($user->hasRole('guru')) {
                $guru = Guru::where('user_id', $user->id)->first();

                if ($guru) {
                    $mataPelajaranIds = $guru->mataPelajaran()->pluck('mata_pelajaran.id')->toArray();

                    // Cek apakah ujian ini dari mata pelajaran yang diampu
                    if (!in_array($ujian->mata_pelajaran_id, $mataPelajaranIds)) {
                        Log::warning('Guru unauthorized access to ujian hasil', [
                            'guru_id' => $guru->id,
                            'ujian_id' => $ujianId,
                            'ujian_mata_pelajaran_id' => $ujian->mata_pelajaran_id,
                            'guru_mata_pelajaran_ids' => $mataPelajaranIds
                        ]);

                        return redirect()->route('ujian.index')
                            ->with('error', 'Anda tidak memiliki akses untuk melihat hasil ujian ini. Hanya ujian dari mata pelajaran yang Anda ampu yang dapat diakses.');
                    }
                }
            }

            // Get semua siswa yang mengikuti ujian ini
            $ujianSiswa = UjianSiswa::with(['siswa.kelas', 'siswa.user'])
                ->where('ujian_id', $ujianId)
                ->orderBy('nilai', 'desc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'siswa' => [
                            'id' => $item->siswa->id,
                            'nama_lengkap' => $item->siswa->nama_lengkap,
                            'nis' => $item->siswa->nis,
                            'kelas' => [
                                'nama_kelas' => $item->siswa->kelas->nama_kelas ?? $item->siswa->kelas->nama ?? 'N/A'
                            ]
                        ],
                        'waktu_mulai' => $item->waktu_mulai ? $item->waktu_mulai->toISOString() : null,
                        'waktu_selesai' => $item->waktu_selesai ? $item->waktu_selesai->toISOString() : null,
                        'durasi_pengerjaan' => $item->durasi_pengerjaan,
                        'nilai' => $item->nilai,
                        'jumlah_benar' => $item->jumlah_benar,
                        'jumlah_salah' => $item->jumlah_salah,
                        'jumlah_kosong' => $item->jumlah_kosong,
                        'status' => $item->status,
                    ];
                });

            // Hitung statistik
            $totalSiswa = $ujianSiswa->count();
            $selesai = $ujianSiswa->where('status', 'selesai')->count();
            $sedangMengerjakan = $ujianSiswa->where('status', 'sedang_mengerjakan')->count();
            $belumMulai = $ujianSiswa->where('status', 'belum_mulai')->count();

            $nilaiData = $ujianSiswa->where('status', 'selesai')->where('nilai', '!=', null);
            $rataRata = $nilaiData->count() > 0 ? $nilaiData->avg('nilai') : 0;
            $lulus = $nilaiData->where('nilai', '>=', $ujian->kkm)->count();
            $tidakLulus = $nilaiData->where('nilai', '<', $ujian->kkm)->count();
            $nilaiTertinggi = $nilaiData->count() > 0 ? $nilaiData->max('nilai') : 0;
            $nilaiTerendah = $nilaiData->count() > 0 ? $nilaiData->min('nilai') : 0;

            $stats = [
                'total_siswa' => $totalSiswa,
                'selesai' => $selesai,
                'sedang_mengerjakan' => $sedangMengerjakan,
                'belum_mulai' => $belumMulai,
                'rata_rata' => round($rataRata, 2),
                'lulus' => $lulus,
                'tidak_lulus' => $tidakLulus,
                'nilai_tertinggi' => round($nilaiTertinggi, 2),
                'nilai_terendah' => round($nilaiTerendah, 2),
            ];

            return Inertia::render('Ujian/HasilSiswa', [
                'ujian' => [
                    'id' => $ujian->id,
                    'judul_ujian' => $ujian->judul_ujian,
                    'jenis_ujian' => $ujian->jenis_ujian,
                    'tanggal_ujian' => $ujian->tanggal_ujian ? $ujian->tanggal_ujian->toISOString() : null,
                    'durasi_menit' => $ujian->durasi_menit,
                    'bobot' => $ujian->bobot,
                    'kkm' => $ujian->kkm,
                    'status' => $ujian->status,
                    'mata_pelajaran' => [
                        'nama' => $ujian->mataPelajaran->nama ?? 'N/A'
                    ],
                    'guru' => [
                        'nama_lengkap' => $ujian->guru->nama_lengkap ?? 'N/A'
                    ],
                    'kelas' => [
                        'nama_kelas' => $ujian->kelas->nama_kelas ?? $ujian->kelas->nama ?? 'N/A'
                    ],
                ],
                'ujianSiswa' => $ujianSiswa,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in UjianController hasilSiswa method', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return redirect()->route('ujian.index')
                ->with('error', 'Terjadi kesalahan saat memuat hasil ujian: ' . $e->getMessage());
        }
    }
}
