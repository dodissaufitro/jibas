<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        try {
            $roles = Role::withCount('users', 'permissions')->get();

            return Inertia::render('RoleManagement/Index', [
                'roles' => $roles,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function create()
    {
        try {
            $permissions = Permission::orderBy('module')->orderBy('name')->get()->groupBy('module');

            return Inertia::render('RoleManagement/Create', [
                'permissions' => $permissions,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name',
                'display_name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'permissions' => 'array',
                'permissions.*' => 'exists:permissions,id',
            ]);

            $role = Role::create([
                'name' => $validated['name'],
                'display_name' => $validated['display_name'],
                'description' => $validated['description'] ?? '',
            ]);

            // Attach permissions to role
            if (!empty($validated['permissions'])) {
                $role->permissions()->sync($validated['permissions']);
            }

            return redirect()->route('roles.index')
                ->with('success', 'Role berhasil ditambahkan');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal menyimpan: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        try {
            $role = Role::with(['permissions', 'users'])->findOrFail($id);
            $permissions = Permission::orderBy('module')->orderBy('name')->get()->groupBy('module');

            return Inertia::render('RoleManagement/Edit', [
                'role' => $role,
                'permissions' => $permissions,
                'rolePermissions' => $role->permissions->pluck('id')->toArray(),
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $role = Role::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name,' . $id,
                'display_name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'permissions' => 'array',
                'permissions.*' => 'exists:permissions,id',
            ]);

            $role->update([
                'name' => $validated['name'],
                'display_name' => $validated['display_name'],
                'description' => $validated['description'] ?? '',
            ]);

            // Sync permissions
            if (isset($validated['permissions'])) {
                $role->permissions()->sync($validated['permissions']);
            }

            return redirect()->route('roles.index')
                ->with('success', 'Role berhasil diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Gagal memperbarui: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $role = Role::findOrFail($id);

            // Prevent deleting system roles
            $systemRoles = ['super_admin', 'admin', 'guru', 'siswa', 'orang_tua'];
            if (in_array($role->name, $systemRoles)) {
                return redirect()->back()->with('error', 'Tidak dapat menghapus role sistem');
            }

            // Check if role has users
            if ($role->users()->count() > 0) {
                return redirect()->back()->with('error', 'Tidak dapat menghapus role yang masih digunakan oleh user');
            }

            $role->delete();

            return redirect()->route('roles.index')
                ->with('success', 'Role berhasil dihapus');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus: ' . $e->getMessage());
        }
    }
}
