<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Kelas;
use App\Models\Siswa;
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
                'is_active' => 'boolean',
                'roles' => 'required|array|min:1',
                'roles.*' => 'exists:roles,id',
                'kelas_id' => 'nullable|exists:kelas,id',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'institution_id' => Auth::user()->institution_id,
            ]);

            // Attach roles to user
            $user->roles()->sync($validated['roles']);

            // Check if user has 'siswa' role
            $roles = Role::whereIn('id', $validated['roles'])->pluck('name')->toArray();
            if (in_array('siswa', $roles)) {
                // Create siswa entry
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
    public function syncSiswaToMasterData()
    {
        try {
            // Get siswa role
            $siswaRole = Role::where('name', 'siswa')->first();

            if (!$siswaRole) {
                return redirect()->back()->with('error', 'Role siswa tidak ditemukan');
            }

            // Get all users with siswa role
            $siswaUsers = User::whereHas('roles', function ($q) use ($siswaRole) {
                $q->where('roles.id', $siswaRole->id);
            })->get();

            $synced = 0;
            $skipped = 0;

            foreach ($siswaUsers as $user) {
                // Check if siswa entry already exists
                $existingSiswa = Siswa::where('user_id', $user->id)->first();

                if (!$existingSiswa) {
                    // Create new siswa entry
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
                    $synced++;
                } else {
                    $skipped++;
                }
            }

            return redirect()->back()->with(
                'success',
                "Sinkronisasi selesai! {$synced} siswa berhasil ditambahkan ke master data, {$skipped} sudah ada."
            );
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal sinkronisasi: ' . $e->getMessage());
        }
    }
}
