<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Institution;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use App\Imports\SiswaImport;
use App\Imports\SiswaUpdateImport;
use App\Exports\SiswaTemplateExport;
use App\Exports\SiswaUpdateTemplateExport;
use App\Exports\SiswaExport;
use App\Rules\SecureFileUpload;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SiswaController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    public function index(Request $request)
    {
        $query = Siswa::with(['kelas.jenjang', 'kelas.jurusan', 'institution'])
            ->orderBy('nama_lengkap');

        $user = Auth::user();
        $userInstitutionId = $user ? $user->institution_id : null;

        // Filter by institution ONLY if explicitly requested
        if ($request->filled('institution_id')) {
            $query->where('institution_id', $request->institution_id);
        }

        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('jenis_kelamin')) {
            $query->where('jenis_kelamin', $request->jenis_kelamin);
        }

        // Search by name or NIS
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        $siswa = $query->paginate(15)->withQueryString();
        $kelasList = Kelas::with('jenjang', 'jurusan')
            ->orderBy('tingkat')
            ->orderBy('nama_kelas')
            ->get();
        $institutions = Institution::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $statsQuery = $userInstitutionId
            ? Siswa::where('institution_id', $userInstitutionId)
            : Siswa::query();

        $stats = [
            'totalSiswa'     => (clone $statsQuery)->count(),
            'totalAktif'     => (clone $statsQuery)->where('status', 'aktif')->count(),
            'totalLakiLaki'  => (clone $statsQuery)->where('jenis_kelamin', 'L')->count(),
            'totalPerempuan' => (clone $statsQuery)->where('jenis_kelamin', 'P')->count(),
        ];

        return Inertia::render('Akademik/Siswa/Index', [
            'siswa'             => $siswa,
            'kelasList'         => $kelasList,
            'institutions'      => $institutions,
            'filters'           => $request->only(['kelas_id', 'institution_id', 'search', 'status', 'jenis_kelamin']),
            'userInstitutionId' => $userInstitutionId,
            'stats'             => $stats,
        ]);
    }

    public function create()
    {
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();

        return Inertia::render('Akademik/Siswa/Create', [
            'kelas' => $kelas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis'           => 'required|string|max:20|unique:siswa,nis',
            'nisn'          => 'nullable|string|max:20|unique:siswa,nisn',
            'nik'           => 'nullable|string|max:20',
            'nama_lengkap'  => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir'  => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'alamat'        => 'required|string',
            'email'         => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')],
            'no_hp'         => 'nullable|string|max:15',
            'nama_ayah'     => 'required|string|max:255',
            'nama_ibu'      => 'required|string|max:255',
            'no_hp_ortu'    => 'required|string|max:15',
            'kelas_id'      => 'required|exists:kelas,id',
            'status'        => 'required|in:aktif,lulus,pindah,keluar',
            'tanggal_masuk' => 'required|date',
            'foto'          => ['nullable', SecureFileUpload::photo(2048)],
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('siswa/foto', 'public');
        }

        $validated['institution_id'] = Auth::user()?->institution_id;
        $generatedPassword = null;

        DB::transaction(function () use ($validated, &$generatedPassword) {
            $siswa = Siswa::create($validated);

            if (!empty($validated['email'])) {
                // Check if user already exists
                $existingUser = User::where('email', $validated['email'])->first();

                if ($existingUser) {
                    $userAccount = $existingUser;
                    $generatedPassword = null; // User already has password
                } else {
                    // Create new user with secure password
                    $result = $this->userService->createUser([
                        'name'           => $validated['nama_lengkap'],
                        'email'          => $validated['email'],
                        'institution_id' => $validated['institution_id'],
                    ]);

                    $userAccount = $result['user'];
                    $generatedPassword = $result['plainPassword'];

                    if (method_exists($userAccount, 'assignRole')) {
                        $userAccount->assignRole('siswa');
                    }
                }

                $siswa->update(['user_id' => $userAccount->id]);
            }

            ActivityLog::log('create', $siswa, "Siswa {$siswa->nama_lengkap} (NIS: {$siswa->nis}) ditambahkan", [], $siswa->toArray());
        });

        $message = 'Data siswa berhasil ditambahkan';
        if (isset($generatedPassword) && $generatedPassword) {
            $message .= ". Password login: {$generatedPassword} (Harap dicatat dan diberikan kepada siswa)";
        }

        return redirect()->route('akademik.siswa.index')
            ->with('success', $message);
    }

    public function edit(Siswa $siswa)
    {
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();

        return Inertia::render('Akademik/Siswa/Edit', [
            'siswa' => $siswa->load('kelas'),
            'kelas' => $kelas
        ]);
    }

    public function update(Request $request, Siswa $siswa)
    {
        $validated = $request->validate([
            'nis'            => 'required|string|max:20|unique:siswa,nis,' . $siswa->id,
            'nisn'           => 'nullable|string|max:20|unique:siswa,nisn,' . $siswa->id,
            'nik'            => 'nullable|string|max:20',
            'nama_lengkap'   => 'required|string|max:255',
            'jenis_kelamin'  => 'required|in:L,P',
            'tempat_lahir'   => 'required|string|max:255',
            'tanggal_lahir'  => 'required|date',
            'alamat'         => 'required|string',
            'email'          => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($siswa->user_id)],
            'no_hp'          => 'nullable|string|max:15',
            'nama_ayah'      => 'required|string|max:255',
            'nama_ibu'       => 'required|string|max:255',
            'no_hp_ortu'     => 'required|string|max:15',
            'kelas_id'       => 'required|exists:kelas,id',
            'status'         => 'required|in:aktif,lulus,pindah,keluar',
            'tanggal_masuk'  => 'required|date',
            'tanggal_keluar' => 'nullable|date',
            'foto'           => ['nullable', SecureFileUpload::photo(2048)],
        ]);

        $oldValues = $siswa->toArray();

        if ($request->hasFile('foto')) {
            if ($siswa->foto) {
                Storage::disk('public')->delete($siswa->foto);
            }
            $validated['foto'] = $request->file('foto')->store('siswa/foto', 'public');
        }

        DB::transaction(function () use ($siswa, $validated, $oldValues) {
            $siswa->update($validated);

            if ($siswa->user) {
                $userUpdate = ['name' => $validated['nama_lengkap']];
                if (!empty($validated['email'])) {
                    $userUpdate['email'] = $validated['email'];
                }
                $siswa->user->update($userUpdate);
            } elseif (!empty($validated['email'])) {
                $userAccount = User::firstOrCreate(
                    ['email' => $validated['email']],
                    [
                        'name'           => $validated['nama_lengkap'],
                        'password'       => Hash::make($validated['nis']),
                        'institution_id' => $siswa->institution_id,
                    ]
                );
                if (method_exists($userAccount, 'assignRole')) {
                    $userAccount->assignRole('siswa');
                }
                $siswa->update(['user_id' => $userAccount->id]);
            }

            ActivityLog::log('update', $siswa, "Siswa {$siswa->nama_lengkap} (NIS: {$siswa->nis}) diperbarui", $oldValues, $siswa->fresh()->toArray());
        });

        return redirect()->route('akademik.siswa.index')
            ->with('success', 'Data siswa berhasil diperbarui');
    }

    public function destroy(Siswa $siswa)
    {
        $nama    = $siswa->nama_lengkap;
        $nis     = $siswa->nis;
        $oldData = $siswa->toArray();

        if ($siswa->foto) {
            Storage::disk('public')->delete($siswa->foto);
        }

        if ($siswa->user && method_exists($siswa->user, 'removeRole')) {
            $siswa->user->removeRole('siswa');
        }

        ActivityLog::log('delete', $siswa, "Siswa {$nama} (NIS: {$nis}) dihapus", $oldData, []);
        $siswa->delete();

        return redirect()->route('akademik.siswa.index')
            ->with('success', 'Data siswa berhasil dihapus');
    }

    /**
     * Show import form
     */
    public function importForm()
    {
        $kelas = Kelas::with(['jenjang', 'jurusan'])->orderBy('tingkat')->orderBy('nama_kelas')->get();
        $institutions = Institution::select('id', 'name')->where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Akademik/Siswa/Import', [
            'kelas'        => $kelas,
            'institutions' => $institutions,
        ]);
    }

    /**
     * Import siswa from Excel
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ], [
            'file.required' => 'File Excel wajib dipilih',
            'file.mimes' => 'File harus berformat Excel (.xlsx, .xls, atau .csv)',
            'file.max' => 'Ukuran file maksimal 2MB',
        ]);

        try {
            $import = new SiswaImport();
            Excel::import($import, $request->file('file'));

            $successCount = $import->getSuccessCount();
            $errorCount = $import->getErrorCount();
            $errors = $import->getErrors();

            if ($errorCount > 0) {
                $errorMessage = "Berhasil import {$successCount} data, {$errorCount} data gagal. Errors: " . implode('; ', $errors);
                return redirect()->route('akademik.siswa.index')
                    ->with('warning', $errorMessage);
            }

            return redirect()->route('akademik.siswa.index')
                ->with('success', "Berhasil import {$successCount} data siswa");
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->with('error', 'Validasi gagal: ' . implode('; ', array_map(fn($err) => implode(', ', $err), $e->errors())));
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Download template Excel for import
     */
    public function downloadTemplate()
    {
        return Excel::download(new SiswaTemplateExport(), 'template_import_siswa.xlsx');
    }

    public function export(Request $request)
    {
        return Excel::download(
            new SiswaExport(
                $request->input('kelas_id'),
                $request->input('institution_id'),
                $request->input('search'),
                $request->input('status')
            ),
            'data_siswa_' . date('Y-m-d_His') . '.xlsx'
        );
    }

    public function show(Siswa $siswa)
    {
        $siswa->load([
            'kelas.jenjang',
            'kelas.jurusan',
            'institution',
            'user',
            'presensi' => fn($q) => $q->orderBy('tanggal', 'desc')->limit(30),
            'tagihan',
            'nilai.mataPelajaran',
            'orangTua',
        ]);

        $rekapPresensi = $siswa->presensi()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $activityLog = ActivityLog::where('model', Siswa::class)
            ->where('model_id', $siswa->id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return Inertia::render('Akademik/Siswa/Show', [
            'siswa'         => $siswa,
            'rekapPresensi' => $rekapPresensi,
            'activityLog'   => $activityLog,
        ]);
    }

    public function resetPassword(Siswa $siswa)
    {
        $userAccount = $siswa->user;
        if (!$userAccount) {
            return redirect()->back()->with('error', 'Siswa ini belum memiliki akun user.');
        }

        // Generate new secure password
        $newPassword = $this->userService->resetPassword($userAccount);

        ActivityLog::log('reset_password', $siswa, "Password siswa {$siswa->nama_lengkap} direset", [], ['user_id' => $userAccount->id]);

        return redirect()->back()->with('success', "Password {$siswa->nama_lengkap} berhasil direset. Password baru: {$newPassword} (Harap dicatat dan diberikan kepada siswa)");
    }

    public function generateUserAccount(Siswa $siswa)
    {
        if ($siswa->user_id) {
            return redirect()->back()->with('error', 'Siswa ini sudah memiliki akun user.');
        }

        if (empty($siswa->email)) {
            return redirect()->back()->with('error', 'Siswa tidak memiliki email. Tambahkan email terlebih dahulu untuk membuat akun.');
        }

        $generatedPassword = null;

        DB::transaction(function () use ($siswa, &$generatedPassword) {
            // Create user with secure password
            $result = $this->userService->createUser([
                'name'           => $siswa->nama_lengkap,
                'email'          => $siswa->email,
                'institution_id' => $siswa->institution_id,
            ]);

            $userAccount = $result['user'];
            $generatedPassword = $result['plainPassword'];

            if (method_exists($userAccount, 'assignRole')) {
                $userAccount->assignRole('siswa');
            }
            $siswa->update(['user_id' => $userAccount->id]);
            ActivityLog::log('generate_account', $siswa, "Akun user dibuat untuk siswa {$siswa->nama_lengkap} (NIS: {$siswa->nis})");
        });

        return redirect()->back()->with('success', "Akun user untuk {$siswa->nama_lengkap} berhasil dibuat. Password: {$generatedPassword} (Harap dicatat dan diberikan kepada siswa)");
    }

    public function bulkUpdateForm()
    {
        return Inertia::render('Akademik/Siswa/BulkUpdate');
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate(['file' => 'required|mimes:xlsx,xls,csv|max:5120']);
        try {
            $import = new SiswaUpdateImport();
            Excel::import($import, $request->file('file'));
            $successCount = $import->getSuccessCount();
            $errorCount   = $import->getErrorCount();
            $errors       = $import->getErrors();
            if ($errorCount > 0) {
                return redirect()->route('akademik.siswa.index')
                    ->with('warning', "Berhasil update {$successCount} data, {$errorCount} gagal: " . implode('; ', $errors));
            }
            return redirect()->route('akademik.siswa.index')
                ->with('success', "Berhasil update {$successCount} data siswa");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function downloadUpdateTemplate()
    {
        return Excel::download(new SiswaUpdateTemplateExport(), 'template_update_siswa.xlsx');
    }

    public function dashboard()
    {
        $statsPerKelas = Kelas::withCount(['siswa as total_siswa' => fn($q) => $q->where('status', 'aktif')])
            ->with('jenjang')->orderBy('tingkat')->get()
            ->map(fn($k) => [
                'nama'        => ($k->jenjang->nama ?? '') . ' ' . $k->nama_kelas,
                'total_siswa' => $k->total_siswa,
            ]);

        $statsPerStatus   = Siswa::selectRaw('status, COUNT(*) as total')->groupBy('status')->pluck('total', 'status');
        $statsGender      = ['laki_laki' => Siswa::where('jenis_kelamin', 'L')->count(), 'perempuan' => Siswa::where('jenis_kelamin', 'P')->count()];
        $recentActivities = ActivityLog::where('model', Siswa::class)->with('user')->orderBy('created_at', 'desc')->limit(10)->get();

        return Inertia::render('Akademik/Siswa/Dashboard', [
            'statsPerKelas'    => $statsPerKelas,
            'statsPerStatus'   => $statsPerStatus,
            'statsGender'      => $statsGender,
            'recentActivities' => $recentActivities,
            'totalSiswa'       => Siswa::count(),
            'totalAktif'       => Siswa::where('status', 'aktif')->count(),
        ]);
    }
}
