import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Permission {
    id: number;
    name: string;
    display_name: string;
    module: string;
    description: string;
}

interface Role {
    id: number;
    name: string;
    display_name: string;
    description: string;
    permissions: Permission[];
}

interface Props {
    permissions: Record<string, Permission[]>;
    roles: Role[];
}

export default function Permissions({ permissions, roles }: Props) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0] || null);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        roles[0]?.permissions.map(p => p.id) || []
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleRoleChange = (roleId: number) => {
        const role = roles.find(r => r.id === roleId);
        if (role) {
            setSelectedRole(role);
            setSelectedPermissions(role.permissions.map(p => p.id));
        }
    };

    const handlePermissionToggle = (permissionId: number) => {
        setSelectedPermissions(prev => 
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSelectAllModule = (modulePermissions: Permission[]) => {
        const moduleIds = modulePermissions.map(p => p.id);
        const allSelected = moduleIds.every(id => selectedPermissions.includes(id));
        
        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !moduleIds.includes(id)));
        } else {
            setSelectedPermissions(prev => {
                const newIds = moduleIds.filter(id => !prev.includes(id));
                return [...prev, ...newIds];
            });
        }
    };

    const handleSave = () => {
        if (!selectedRole) return;
        
        setIsSaving(true);
        router.put(
            route('users.roles.permissions.update', selectedRole.id),
            { permissions: selectedPermissions },
            {
                onSuccess: () => {
                    setIsSaving(false);
                },
                onError: () => {
                    setIsSaving(false);
                },
            }
        );
    };

    const getModuleIcon = (module: string) => {
        const icons: Record<string, string> = {
            dashboard: '📊',
            master: '📚',
            akademik: '🎓',
            ppdb: '📝',
            presensi: '✅',
            ujian: '📋',
            keuangan: '💰',
            komunikasi: '💬',
            asrama: '🏠',
            arsip: '📁',
            user_management: '👥',
            settings: '⚙️',
        };
        return icons[module] || '📌';
    };

    const getModuleColor = (module: string) => {
        const colors: Record<string, string> = {
            dashboard: 'from-blue-500 to-blue-600',
            master: 'from-purple-500 to-purple-600',
            akademik: 'from-green-500 to-green-600',
            ppdb: 'from-orange-500 to-orange-600',
            presensi: 'from-teal-500 to-teal-600',
            ujian: 'from-indigo-500 to-indigo-600',
            keuangan: 'from-yellow-500 to-yellow-600',
            komunikasi: 'from-pink-500 to-pink-600',
            asrama: 'from-red-500 to-red-600',
            arsip: 'from-gray-500 to-gray-600',
            user_management: 'from-purple-600 to-indigo-600',
            settings: 'from-slate-500 to-slate-600',
        };
        return colors[module] || 'from-gray-500 to-gray-600';
    };

    return (
        <SidebarLayout>
            <Head title="Kelola Permission" />

            {/* Header */}
            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <Link
                            href={route('users.index')}
                            className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </Link>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            🔒 Kelola Permission
                        </h1>
                        <p className="text-white/90 text-lg">
                            Atur hak akses untuk setiap role
                        </p>
                    </div>
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Role Selector Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 sticky top-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            Pilih Role
                        </h3>
                        <div className="space-y-3">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleChange(role.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                        selectedRole?.id === role.id
                                            ? 'border-purple-500 bg-purple-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="font-bold text-gray-800">{role.display_name}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {role.permissions?.length || 0} permissions
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Permissions Grid */}
                <div className="lg:col-span-3">
                    {selectedRole ? (
                        <div className="space-y-6">
                            {/* Role Info */}
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Mengatur Permission untuk: {selectedRole.display_name}
                                </h2>
                                <p className="text-gray-600">{selectedRole.description}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-purple-700 font-semibold">
                                        {selectedPermissions.length} dari {Object.values(permissions).flat().length} permissions dipilih
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </div>

                            {/* Permissions by Module */}
                            {Object.entries(permissions).map(([module, modulePermissions]) => {
                                const selectedCount = modulePermissions.filter(p => selectedPermissions.includes(p.id)).length;
                                const isAllSelected = selectedCount === modulePermissions.length;

                                return (
                                    <div key={module} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
                                        <div className={`bg-gradient-to-r ${getModuleColor(module)} p-6`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <span className="text-4xl mr-4">{getModuleIcon(module)}</span>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white capitalize">
                                                            {module.replace(/_/g, ' ')}
                                                        </h3>
                                                        <p className="text-white/80 text-sm">
                                                            {selectedCount} dari {modulePermissions.length} permissions dipilih
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleSelectAllModule(modulePermissions)}
                                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold transition-all"
                                                >
                                                    {isAllSelected ? 'Hapus Semua' : 'Pilih Semua'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {modulePermissions.map((permission) => (
                                                    <label
                                                        key={permission.id}
                                                        className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                                                            selectedPermissions.includes(permission.id)
                                                                ? 'border-purple-500 bg-purple-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPermissions.includes(permission.id)}
                                                            onChange={() => handlePermissionToggle(permission.id)}
                                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-1 flex-shrink-0"
                                                        />
                                                        <div className="ml-3 flex-1">
                                                            <div className="font-semibold text-gray-800">
                                                                {permission.display_name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {permission.name}
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="text-6xl mb-4">🔒</div>
                            <p className="text-xl text-gray-600">Pilih role untuk mengatur permissions</p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
