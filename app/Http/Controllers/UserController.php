<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
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

            $query = User::with(['roles', 'institution']);

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

            return Inertia::render('UserManagement/Index', [
                'users' => $users,
                'roles' => $roles,
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

            return Inertia::render('UserManagement/Create', [
                'roles' => $roles,
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
            $user = User::with(['roles', 'institution'])->findOrFail($id);
            $roles = Role::with('permissions')->get();

            return Inertia::render('UserManagement/Edit', [
                'user' => $user,
                'roles' => $roles,
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
}
