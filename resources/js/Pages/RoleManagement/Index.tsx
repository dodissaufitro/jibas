import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Role {
    id: number;
    name: string;
    display_name: string;
    description: string;
    users_count: number;
    permissions_count: number;
    created_at: string;
}

interface Props {
    roles: Role[];
}

export default function Index({ roles }: Props) {
    const handleDelete = (id: number, name: string, isSystem: boolean, userCount: number) => {
        if (isSystem) {
            alert('Tidak dapat menghapus role sistem');
            return;
        }
        if (userCount > 0) {
            alert('Tidak dapat menghapus role yang masih digunakan oleh user');
            return;
        }
        if (confirm(`Apakah Anda yakin ingin menghapus role ${name}?`)) {
            router.delete(route('roles.destroy', id));
        }
    };

    const getRoleBadgeColor = (roleName: string) => {
        const colors: Record<string, string> = {
            'super_admin': 'from-red-500 to-red-600',
            'admin': 'from-purple-500 to-purple-600',
            'guru': 'from-blue-500 to-blue-600',
            'siswa': 'from-green-500 to-green-600',
            'orang_tua': 'from-yellow-500 to-yellow-600',
        };
        return colors[roleName] || 'from-gray-500 to-gray-600';
    };

    const isSystemRole = (roleName: string) => {
        return ['super_admin', 'admin', 'guru', 'siswa', 'orang_tua'].includes(roleName);
    };

    return (
        <SidebarLayout>
            <Head title="Manajemen Role" />

            {/* Header */}
            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-red-600 to-pink-500 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            👔 Manajemen Role
                        </h1>
                        <p className="text-white/90 text-lg">
                            Kelola role dan hak akses sistem
                        </p>
                    </div>
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="mb-6 flex justify-between items-center">
                <div className="text-gray-600">
                    Total: <span className="font-bold text-gray-800">{roles.length}</span> role
                </div>
                <Link
                    href={route('roles.create')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Role
                </Link>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles && roles.length > 0 ? (
                    roles.map((role) => (
                        <div
                            key={role.id}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-gray-100"
                        >
                            {/* Header */}
                            <div className={`bg-gradient-to-r ${getRoleBadgeColor(role.name)} p-6 relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                <div className="relative">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mb-4">
                                        {role.name === 'super_admin' ? '⭐' : 
                                         role.name === 'admin' ? '👔' :
                                         role.name === 'guru' ? '👨‍🏫' :
                                         role.name === 'siswa' ? '👨‍🎓' :
                                         role.name === 'orang_tua' ? '👪' : '🎭'}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-1">
                                        {role.display_name}
                                    </h3>
                                    {isSystemRole(role.name) && (
                                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                                            Role Sistem
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-600 mb-4 min-h-[48px]">
                                    {role.description || 'Tidak ada deskripsi'}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {role.users_count}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">User</div>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {role.permissions_count}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">Permission</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={route('roles.edit', role.id)}
                                        className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                                    >
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(role.id, role.display_name, isSystemRole(role.name), role.users_count)}
                                        disabled={isSystemRole(role.name) || role.users_count > 0}
                                        className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all shadow-md ${
                                            isSystemRole(role.name) || role.users_count > 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg'
                                        }`}
                                    >
                                        🗑️ Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">👔</div>
                        <p className="text-xl font-semibold text-gray-800">Tidak ada role</p>
                        <p className="text-sm text-gray-600 mt-2">Tambahkan role baru untuk memulai</p>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                            ℹ️
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Informasi Role</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Role Sistem</strong> tidak dapat dihapus untuk menjaga integritas sistem</li>
                            <li>• Role yang masih digunakan oleh user tidak dapat dihapus</li>
                            <li>• Setiap role dapat memiliki multiple permissions</li>
                            <li>• User dapat memiliki multiple roles</li>
                        </ul>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
