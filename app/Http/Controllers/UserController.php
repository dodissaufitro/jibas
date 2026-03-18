<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->input('search');
            $roleFilter = $request->input('role');

            $query = User::with(['roles', 'institution', 'siswa.kelas.jenjang']);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            }

            if ($roleFilter) {
                $query->whereHas('roles', function ($q) use ($roleFilter) {
                    $q->where('name', $roleFilter);
                });
            }

            $users = $query->latest()->paginate(15);
            $roles = Role::all();
            $kelasList = Kelas::with(['jenjang'])->orderBy('tingkat')->orderBy('nama_kelas')->get();

            return Inertia::render('UserManagement/Index', [
                'users' => $users,
                'roles' => $roles,
                'kelasList' => $kelasList,
                'filters' => [
                    'search' => $search,
                    'role' => $roleFilter,
                ],
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function create()
    {
        try {
            $roles = Role::with('permissions')->get();
            $kelasList = Kelas::with(['jenjang'])->orderBy('tingkat')->orderBy('nama_kelas')->get();

            return Inertia::render('UserManagement/Create', [
                'roles' => $roles,
                'kelasList' => $kelasList,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phone' => 'nullable|string|max:15',
                'address' => 'nullable|string',
                'nik' => 'nullable|string|max:16',
                'jenis_kelamin' => 'required|in:L,P',
                'tempat_lahir' => 'nullable|string|max:100',
                'tanggal_lahir' => 'nullable|date',
                'is_active' => 'boolean',
                'roles' => 'required|array|min:1',
                'roles.*' => 'exists:roles,id',
                'kelas_id' => 'nullable|exists:kelas,id',

                // Guru data validation
                'guru_data.nip' => 'nullable|string|max:50',
                'guru_data.pendidikan_terakhir' => 'nullable|string|in:SMA,D3,S1,S2,S3',
                'guru_data.status_kepegawaian' => 'nullable|string|in:PNS,GTY,GTT,Honorer',
                'guru_data.tanggal_masuk' => 'nullable|date',
                'guru_data.bank' => 'nullable|string|max:50',
                'guru_data.no_rekening' => 'nullable|string|max:50',

                // Siswa data validation
                'siswa_data.nis' => 'nullable|string|max:50',
                'siswa_data.nisn' => 'nullable|string|max:10',
                'siswa_data.nama_ayah' => 'nullable|string|max:255',
                'siswa_data.nama_ibu' => 'nullable|string|max:255',
                'siswa_data.no_hp_ortu' => 'nullable|string|max:15',
                'siswa_data.pekerjaan_ayah' => 'nullable|string|max:100',
                'siswa_data.pekerjaan_ibu' => 'nullable|string|max:100',
                'siswa_data.tahun_masuk' => 'nullable|integer|min:2000|max:' . (date('Y') + 1),
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'nik' => $validated['nik'] ?? null,
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'tempat_lahir' => $validated['tempat_lahir'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'institution_id' => Auth::user()->institution_id,
            ]);

            // Attach roles to user
            $user->roles()->sync($validated['roles']);

            // Check if user has 'siswa' role
            $roles = Role::whereIn('id', $validated['roles'])->pluck('name')->toArray();
            if (in_array('siswa', $roles)) {
                $siswaData = $request->input('siswa_data', []);

                // Create siswa entry with data from form
                Siswa::create([
                    'user_id' => $user->id,
                    'institution_id' => $user->institution_id,
                    'nis' => $siswaData['nis'] ?? null,
                    'nisn' => $siswaData['nisn'] ?? null,
                    'nik' => $user->nik,
                    'nama_lengkap' => $user->name,
                    'jenis_kelamin' => $user->jenis_kelamin,
                    'tempat_lahir' => $user->tempat_lahir ?? '-',
                    'tanggal_lahir' => $user->tanggal_lahir ?? now(),
                    'email' => $user->email,
                    'no_hp' => $user->phone,
                    'alamat' => $user->address,
                    'kelas_id' => $validated['kelas_id'] ?? null,
                    'nama_ayah' => $siswaData['nama_ayah'] ?? null,
                    'nama_ibu' => $siswaData['nama_ibu'] ?? null,
                    'pekerjaan_ayah' => $siswaData['pekerjaan_ayah'] ?? null,
                    'pekerjaan_ibu' => $siswaData['pekerjaan_ibu'] ?? null,
                    'no_hp_ortu' => $siswaData['no_hp_ortu'] ?? null,
                    'tahun_masuk' => $siswaData['tahun_masuk'] ?? date('Y'),
                    'status' => 'aktif',
                    'tanggal_masuk' => now(),
                ]);
            }

            // Check if user has 'guru' role
            if (in_array('guru', $roles)) {
                $guruData = $request->input('guru_data', []);

                // Auto-generate NIP if not provided
                $nip = !empty($guruData['nip'])
                    ? $guruData['nip']
                    : 'GRU' . str_pad($user->id, 6, '0', STR_PAD_LEFT);

                // Create guru entry with data from form
                Guru::create([
                    'user_id' => $user->id,
                    'institution_id' => $user->institution_id,
                    'nip' => $nip,
                    'nik' => $user->nik ?? '-',
                    'nama_lengkap' => $user->name,
                    'jenis_kelamin' => $user->jenis_kelamin,
                    'tempat_lahir' => $user->tempat_lahir ?? '-',
                    'tanggal_lahir' => $user->tanggal_lahir ?? now(),
                    'email' => $user->email,
                    'no_hp' => $user->phone ?? '-',
                    'alamat' => $user->address ?? '-',
                    'pendidikan_terakhir' => $guruData['pendidikan_terakhir'] ?? 'S1',
                    'status_kepegawaian' => $guruData['status_kepegawaian'] ?? 'GTY',
                    'tanggal_masuk' => !empty($guruData['tanggal_masuk']) ? $guruData['tanggal_masuk'] : now(),
                    'bank' => $guruData['bank'] ?? null,
                    'no_rekening' => $guruData['no_rekening'] ?? null,
                    'status' => 'aktif',
                ]);
            }

            return redirect()->route('users.index')
                ->with('success', 'User berhasil ditambahkan');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal menyimpan: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        try {
            $user = User::with(['roles', 'institution', 'siswa.kelas.jenjang'])->findOrFail($id);
            $roles = Role::with('permissions')->get();
            $kelasList = Kelas::with(['jenjang'])->orderBy('tingkat')->orderBy('nama_kelas')->get();

            return Inertia::render('UserManagement/Edit', [
                'user' => $user,
                'roles' => $roles,
                'kelasList' => $kelasList,
                'userRoles' => $user->roles->pluck('id')->toArray(),
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'nullable|string|min:8|confirmed',
                'phone' => 'nullable|string|max:15',
                'address' => 'nullable|string',
                'is_active' => 'boolean',
                'roles' => 'required|array|min:1',
                'roles.*' => 'exists:roles,id',
                'kelas_id' => 'nullable|exists:kelas,id',
            ]);

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Update password if provided
            if (!empty($validated['password'])) {
                $user->update([
                    'password' => Hash::make($validated['password']),
                ]);
            }

            // Sync roles
            $user->roles()->sync($validated['roles']);

            // Check if user has 'siswa' role
            $roles = Role::whereIn('id', $validated['roles'])->pluck('name')->toArray();
            if (in_array('siswa', $roles)) {
                // Check if siswa entry exists
                $siswa = Siswa::where('user_id', $user->id)->first();

                if ($siswa) {
                    // Update existing siswa
                    $siswa->update([
                        'nama_lengkap' => $user->name,
                        'email' => $user->email,
                        'no_hp' => $user->phone,
                        'alamat' => $user->address,
                        'kelas_id' => $validated['kelas_id'] ?? $siswa->kelas_id,
                    ]);
                } else {
                    // Create new siswa entry
                    Siswa::create([
                        'user_id' => $user->id,
                        'institution_id' => $user->institution_id,
                        'nama_lengkap' => $user->name,
                        'email' => $user->email,
                        'no_hp' => $user->phone,
                        'alamat' => $user->address,
                        'kelas_id' => $validated['kelas_id'] ?? null,
                        'status' => 'aktif',
                        'tanggal_masuk' => now(),
                    ]);
                }
            }

            // Check if user has 'guru' role
            if (in_array('guru', $roles)) {
                // Check if guru entry exists
                $guru = Guru::where('user_id', $user->id)->first();

                if ($guru) {
                    // Update existing guru
                    $guru->update([
                        'nama_lengkap' => $user->name,
                        'email' => $user->email,
                        'no_hp' => $user->phone,
                        'alamat' => $user->address,
                    ]);
                } else {
                    // Auto-generate NIP based on user ID
                    $nip = 'GRU' . str_pad($user->id, 6, '0', STR_PAD_LEFT);

                    // Create new guru entry
                    Guru::create([
                        'user_id' => $user->id,
                        'institution_id' => $user->institution_id,
                        'nip' => $nip,
                        'nama_lengkap' => $user->name,
                        'email' => $user->email,
                        'no_hp' => $user->phone ?? '-',
                        'alamat' => $user->address ?? '-',
                        'jenis_kelamin' => 'L', // Default, bisa diubah nanti
                        'tempat_lahir' => '-', // Default, bisa diubah nanti
                        'tanggal_lahir' => now(), // Default, bisa diubah nanti
                        'pendidikan_terakhir' => 'S1', // Default, bisa diubah nanti
                        'status_kepegawaian' => 'GTY', // Default GTY (Guru Tetap Yayasan)
                        'status' => 'aktif',
                        'tanggal_masuk' => now(),
                    ]);
                }
            }

            return redirect()->route('users.index')
                ->with('success', 'User berhasil diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal memperbarui: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // Prevent deleting own account
            if ($user->id === Auth::id()) {
                return redirect()->back()->with('error', 'Tidak dapat menghapus akun sendiri');
            }

            $user->delete();

            return redirect()->route('users.index')
                ->with('success', 'User berhasil dihapus');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus: ' . $e->getMessage());
        }
    }

    public function permissions()
    {
        try {
            $permissions = Permission::orderBy('module')->orderBy('name')->get()->groupBy('module');
            $roles = Role::with('permissions')->get();

            return Inertia::render('UserManagement/Permissions', [
                'permissions' => $permissions,
                'roles' => $roles,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function updateRolePermissions(Request $request, $roleId)
    {
        try {
            $validated = $request->validate([
                'permissions' => 'required|array',
                'permissions.*' => 'exists:permissions,id',
            ]);

            $role = Role::findOrFail($roleId);
            $role->permissions()->sync($validated['permissions']);

            return redirect()->back()
                ->with('success', 'Permission role berhasil diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal memperbarui: ' . $e->getMessage());
        }
    }

    /**
     * Sync users with siswa role to siswa master data table
     */
    public function syncUsersToMasterData()
    {
        try {
            // Get roles
            $siswaRole = Role::where('name', 'siswa')->first();
            $guruRole = Role::where('name', 'guru')->first();

            $syncedSiswa = 0;
            $skippedSiswa = 0;
            $syncedGuru = 0;
            $skippedGuru = 0;

            // Sync Siswa
            if ($siswaRole) {
                $siswaUsers = User::whereHas('roles', function ($q) use ($siswaRole) {
                    $q->where('roles.id', $siswaRole->id);
                })->get();

                foreach ($siswaUsers as $user) {
                    $existingSiswa = Siswa::where('user_id', $user->id)->first();

                    if (!$existingSiswa) {
                        Siswa::create([
                            'user_id' => $user->id,
                            'institution_id' => $user->institution_id,
                            'nama_lengkap' => $user->name,
                            'email' => $user->email,
                            'no_hp' => $user->phone,
                            'alamat' => $user->address,
                            'status' => 'aktif',
                            'tanggal_masuk' => $user->created_at ?? now(),
                        ]);
                        $syncedSiswa++;
                    } else {
                        $skippedSiswa++;
                    }
                }
            }

            // Sync Guru
            if ($guruRole) {
                $guruUsers = User::whereHas('roles', function ($q) use ($guruRole) {
                    $q->where('roles.id', $guruRole->id);
                })->get();

                foreach ($guruUsers as $user) {
                    $existingGuru = Guru::where('user_id', $user->id)->first();

                    if (!$existingGuru) {
                        // Auto-generate NIP based on user ID
                        $nip = 'GRU' . str_pad($user->id, 6, '0', STR_PAD_LEFT);

                        Guru::create([
                            'user_id' => $user->id,
                            'institution_id' => $user->institution_id,
                            'nip' => $nip,
                            'nama_lengkap' => $user->name,
                            'email' => $user->email,
                            'no_hp' => $user->phone ?? '-',
                            'alamat' => $user->address ?? '-',
                            'jenis_kelamin' => 'L', // Default, bisa diubah nanti
                            'tempat_lahir' => '-', // Default, bisa diubah nanti
                            'tanggal_lahir' => $user->created_at ?? now(), // Default, bisa diubah nanti
                            'pendidikan_terakhir' => 'S1', // Default, bisa diubah nanti
                            'status_kepegawaian' => 'GTY', // Default GTY (Guru Tetap Yayasan)
                            'status' => 'aktif',
                            'tanggal_masuk' => $user->created_at ?? now(),
                        ]);
                        $syncedGuru++;
                    } else {
                        $skippedGuru++;
                    }
                }
            }

            $message = "Sinkronisasi selesai! ";
            if ($syncedSiswa > 0 || $skippedSiswa > 0) {
                $message .= "{$syncedSiswa} siswa berhasil disinkronkan, {$skippedSiswa} sudah ada. ";
            }
            if ($syncedGuru > 0 || $skippedGuru > 0) {
                $message .= "{$syncedGuru} guru berhasil disinkronkan, {$skippedGuru} sudah ada.";
            }

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal sinkronisasi: ' . $e->getMessage());
        }
    }
}
