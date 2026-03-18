import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Guru {
    id: number;
    nip: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    pendidikan_terakhir: string;
    status_kepegawaian: string;
    status: string;
}

interface Institution {
    id: number;
    name: string;
}

interface Props {
    guru: {
        data: Guru[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    institutions: Institution[];
    filters: {
        institution_id?: string;
    };
}

export default function Index({ guru, institutions, filters }: Props) {
    const [institutionId, setInstitutionId] = useState(filters.institution_id || '');
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

    const handleFilter = () => {
        router.get(route('akademik.guru.index'), { institution_id: institutionId }, { preserveState: true });
    };
    
    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data guru "${nama}"?`)) {
            router.delete(route('akademik.guru.destroy', id));
        }
    };

    const handleSyncData = () => {
        if (confirm('Sinkronkan data guru dengan data user yang terhubung?\n\nData nama, email, no HP, dan alamat akan diperbarui dari data user.')) {
            router.post(route('akademik.guru.sync'));
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'aktif':
                return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/50';
            case 'cuti':
                return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/50';
            case 'pensiun':
                return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/50';
            default:
                return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-500/50';
        }
    };

    const getStatusKepegawaianBadgeClass = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PNS':
                return 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/50';
            case 'PPPK':
                return 'bg-gradient-to-r from-purple-600 to-violet-700 text-white shadow-lg shadow-purple-500/50';
            case 'GTY':
                return 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-lg shadow-teal-500/50';
            case 'PTY':
                return 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg shadow-orange-500/50';
            default:
                return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/50';
        }
    };

    return (
        <SidebarLayout>
            <Head title="Data Guru" />

            {/* Hero Header dengan Gradient 3D */}
            <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/30 transform hover:scale-110 transition-transform duration-300">
                                <span className="text-4xl">👨‍🏫</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-2">
                                    Data Guru
                                </h1>
                                <p className="text-white/90 text-lg font-medium">
                                    Kelola data pendidik dengan mudah
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={handleSyncData}
                                className="group relative px-6 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white/30 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                                <div className="relative flex items-center gap-2">
                                    <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Sinkronkan
                                </div>
                            </button>
                            <Link
                                href={route('akademik.guru.create')}
                                className="group relative px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <div className="relative flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tambah Guru
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Filters dalam Hero */}
                    <div className="mt-6 flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[250px] max-w-md">
                            <label className="block text-sm font-bold text-white mb-2 drop-shadow">
                                🏫 Filter Institusi
                            </label>
                            <select
                                value={institutionId}
                                onChange={(e) => setInstitutionId(e.target.value)}
                                className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-xl focus:ring-4 focus:ring-white/50 text-white font-medium shadow-lg hover:bg-white/30 transition-all duration-300"
                                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
                            >
                                <option value="" className="text-gray-800">Semua Institusi</option>
                                {institutions.map((inst) => (
                                    <option key={inst.id} value={inst.id} className="text-gray-800">
                                        {inst.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleFilter}
                            className="px-6 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white/30 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            🔍 Filter
                        </button>
                        {institutionId && (
                            <button
                                onClick={() => {
                                    setInstitutionId('');
                                    router.get(route('akademik.guru.index'));
                                }}
                                className="px-6 py-3 bg-red-500/80 backdrop-blur-md hover:bg-red-600 border-2 border-red-400/50 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                ✖ Reset
                            </button>
                        )}
                        
                        {/* View Toggle */}
                        <div className="flex gap-2 bg-white/20 backdrop-blur-md p-1.5 rounded-xl border-2 border-white/30 shadow-lg">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                                    viewMode === 'card'
                                        ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                                        : 'text-white hover:bg-white/20'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                                    viewMode === 'table'
                                        ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                                        : 'text-white hover:bg-white/20'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-6">
                <div className="max-w-7xl mx-auto">
                    {guru.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300">
                                    <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="mt-6 text-2xl font-bold text-gray-700">Belum Ada Data Guru</h3>
                            <p className="mt-2 text-gray-500">Mulai tambahkan data guru untuk mengelola informasi pendidik</p>
                        </div>
                    ) : viewMode === 'card' ? (
                        /* Card View - 3D Cards */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {guru.data.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-2 border-gray-100 hover:border-indigo-200"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    {/* Card Header dengan Gradient */}
                                    <div className="relative h-36 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
                                        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl"></div>
                                        
                                        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border-2 border-white/50 transform group-hover:scale-110 transition-transform duration-300">
                                                        <span className="text-3xl">
                                                            {item.jenis_kelamin === 'L' ? '👨‍🏫' : '👩‍🏫'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/80 text-xs font-bold uppercase tracking-wide">NIP</p>
                                                        <p className="text-white font-extrabold text-sm drop-shadow">{item.nip}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                                            {item.nama_lengkap}
                                        </h3>
                                        
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold">Pendidikan</p>
                                                    <p className="font-bold text-gray-700">{item.pendidikan_terakhir}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                <span className={`px-3 py-1.5 text-xs font-bold rounded-xl ${getStatusKepegawaianBadgeClass(item.status_kepegawaian)} transform hover:scale-110 transition-transform duration-300`}>
                                                    {item.status_kepegawaian}
                                                </span>
                                                <span className={`px-3 py-1.5 text-xs font-bold rounded-xl ${getStatusBadgeClass(item.status)} transform hover:scale-110 transition-transform duration-300`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-4 border-t-2 border-gray-100">
                                            <Link
                                                href={route('akademik.guru.edit', item.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id, item.nama_lengkap)}
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hover Border Effect */}
                                    <div className="absolute inset-0 border-2 border-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Table View - Enhanced 3D Table */
                        <div className="bg-white overflow-hidden shadow-2xl rounded-2xl border-2 border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">No</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">NIP</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Nama Lengkap</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Jenis Kelamin</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Pendidikan</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status Kepegawaian</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {guru.data.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {(guru.current_page - 1) * guru.per_page + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {item.nip}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {item.nama_lengkap}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                                    {item.jenis_kelamin === 'L' ? '👨 Laki-laki' : '👩 Perempuan'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                                    {item.pendidikan_terakhir}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-xl ${getStatusKepegawaianBadgeClass(item.status_kepegawaian)} transform hover:scale-110 transition-transform duration-300 inline-block`}>
                                                        {item.status_kepegawaian}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-xl ${getStatusBadgeClass(item.status)} transform hover:scale-110 transition-transform duration-300 inline-block`}>
                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route('akademik.guru.edit', item.id)}
                                                            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(item.id, item.nama_lengkap)}
                                                            className="p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pagination - Enhanced 3D */}
                    {guru.last_page > 1 && (
                        <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl border-2 border-gray-100">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm font-bold text-gray-700">
                                    Menampilkan <span className="text-indigo-600 text-base">{(guru.current_page - 1) * guru.per_page + 1}</span> sampai{' '}
                                    <span className="text-indigo-600 text-base">
                                        {Math.min(guru.current_page * guru.per_page, guru.total)}
                                    </span>{' '}
                                    dari <span className="text-indigo-600 text-base">{guru.total}</span> data
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {guru.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                                link.active
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                                                    : link.url
                                                    ? 'bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 shadow-md'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </SidebarLayout>
    );
}
