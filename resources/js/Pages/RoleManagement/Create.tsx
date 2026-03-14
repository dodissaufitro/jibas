import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Permission {
    id: number;
    name: string;
    display_name: string;
    description: string;
}

interface GroupedPermissions {
    [module: string]: Permission[];
}

interface Props {
    permissions: GroupedPermissions;
}

export default function Create({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        display_name: '',
        description: '',
        permissions: [] as number[],
    });

    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [selectAllModules, setSelectAllModules] = useState<Record<string, boolean>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    const togglePermission = (permissionId: number) => {
        if (data.permissions.includes(permissionId)) {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        } else {
            setData('permissions', [...data.permissions, permissionId]);
        }
    };

    const toggleModulePermissions = (module: string) => {
        const modulePermissions = permissions[module] || [];
        const modulePermissionIds = modulePermissions.map(p => p.id);
        const allSelected = modulePermissionIds.every(id => data.permissions.includes(id));

        if (allSelected) {
            setData('permissions', data.permissions.filter(id => !modulePermissionIds.includes(id)));
            setSelectAllModules({ ...selectAllModules, [module]: false });
        } else {
            const newPermissions = [...new Set([...data.permissions, ...modulePermissionIds])];
            setData('permissions', newPermissions);
            setSelectAllModules({ ...selectAllModules, [module]: true });
        }
    };

    const getModuleIcon = (module: string) => {
        const icons: Record<string, string> = {
            'dashboard': '📊',
            'master': '🗂️',
            'akademik': '📚',
            'ppdb': '📝',
            'presensi': '✅',
            'ujian': '📋',
            'keuangan': '💰',
            'komunikasi': '💬',
            'asrama': '🏠',
            'arsip': '📁',
            'user_management': '👥',
            'settings': '⚙️',
        };
        return icons[module] || '📄';
    };

    const getModuleName = (module: string) => {
        const names: Record<string, string> = {
            'dashboard': 'Dashboard',
            'master': 'Master Data',
            'akademik': 'Akademik',
            'ppdb': 'PPDB',
            'presensi': 'Presensi',
            'ujian': 'Ujian',
            'keuangan': 'Keuangan',
            'komunikasi': 'Komunikasi',
            'asrama': 'Asrama',
            'arsip': 'Arsip',
            'user_management': 'User Management',
            'settings': 'Settings',
        };
        return names[module] || module;
    };

    const getModuleColor = (module: string) => {
        const colors: Record<string, string> = {
            'dashboard': 'from-blue-500 to-blue-600',
            'master': 'from-purple-500 to-purple-600',
            'akademik': 'from-green-500 to-green-600',
            'ppdb': 'from-yellow-500 to-yellow-600',
            'presensi': 'from-pink-500 to-pink-600',
            'ujian': 'from-red-500 to-red-600',
            'keuangan': 'from-emerald-500 to-emerald-600',
            'komunikasi': 'from-cyan-500 to-cyan-600',
            'asrama': 'from-orange-500 to-orange-600',
            'arsip': 'from-gray-500 to-gray-600',
            'user_management': 'from-indigo-500 to-indigo-600',
            'settings': 'from-slate-500 to-slate-600',
        };
        return colors[module] || 'from-gray-500 to-gray-600';
    };

    return (
        <SidebarLayout>
            <Head title="Tambah Role Baru" />

            {/* Header */}
            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-red-600 to-pink-500 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <Link
                            href={route('roles.index')}
                            className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali
                        </Link>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            ➕ Tambah Role Baru
                        </h1>
                        <p className="text-white/90 text-lg">
                            Buat role baru dan atur hak aksesnya
                        </p>
                    </div>
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Information */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        📋 Informasi Role
                    </h2>

                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nama Role (Slug) *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all"
                                placeholder="contoh: staff_admin"
                                required
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">Gunakan huruf kecil dan underscore, contoh: staff_admin</p>
                        </div>

                        {/* Display Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nama Tampilan *
                            </label>
                            <input
                                type="text"
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all"
                                placeholder="contoh: Staff Admin"
                                required
                            />
                            {errors.display_name && (
                                <p className="mt-2 text-sm text-red-600">{errors.display_name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all"
                                placeholder="Deskripsi singkat tentang role ini..."
                            />
                            {errors.description && (
                                <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Permissions */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            🔐 Hak Akses (Permissions)
                        </h2>
                        <div className="text-sm text-gray-600">
                            Terpilih: <span className="font-bold text-orange-600">{data.permissions.length}</span> permission
                        </div>
                    </div>

                    {errors.permissions && (
                        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600">
                            {errors.permissions}
                        </div>
                    )}

                    {/* Permissions Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.keys(permissions).map((module) => {
                            const modulePermissions = permissions[module] || [];
                            const selectedCount = modulePermissions.filter(p => data.permissions.includes(p.id)).length;
                            const allSelected = modulePermissions.length > 0 && selectedCount === modulePermissions.length;

                            return (
                                <div
                                    key={module}
                                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-300 transition-all"
                                >
                                    {/* Module Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${getModuleColor(module)} rounded-xl flex items-center justify-center text-2xl shadow-lg mr-3`}>
                                                {getModuleIcon(module)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {getModuleName(module)}
                                                </h3>
                                                <p className="text-xs text-gray-600">
                                                    {selectedCount}/{modulePermissions.length} dipilih
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleModulePermissions(module)}
                                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                                allSelected
                                                    ? 'bg-orange-500 text-white shadow-lg'
                                                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500'
                                            }`}
                                        >
                                            {allSelected ? '✓ Semua' : 'Pilih Semua'}
                                        </button>
                                    </div>

                                    {/* Permissions List */}
                                    <div className="space-y-2">
                                        {modulePermissions.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex items-start p-3 bg-white rounded-xl hover:bg-orange-50 transition-all cursor-pointer border-2 border-transparent hover:border-orange-200"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.permissions.includes(permission.id)}
                                                    onChange={() => togglePermission(permission.id)}
                                                    className="mt-1 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <div className="text-sm font-semibold text-gray-800">
                                                        {permission.display_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {permission.description}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <Link
                        href={route('roles.index')}
                        className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Menyimpan...' : '💾 Simpan Role'}
                    </button>
                </div>
            </form>
        </SidebarLayout>
    );
}
