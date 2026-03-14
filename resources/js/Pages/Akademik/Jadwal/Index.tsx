import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Props {
    jadwal?: any;
    kelas?: any[];
    selectedKelas?: any;
}

const hariOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

const hariLabels: Record<string, string> = {
    'senin': 'Senin',
    'selasa': 'Selasa',
    'rabu': 'Rabu',
    'kamis': 'Kamis',
    'jumat': 'Jumat',
    'sabtu': 'Sabtu',
};

const colorSchemes = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-green-500 to-green-600',
    'from-yellow-500 to-yellow-600',
    'from-red-500 to-red-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
];

export default function Index({ jadwal = {}, kelas = [], selectedKelas }: Props) {
    const [selectedKelasId, setSelectedKelasId] = useState<number | null>(
        selectedKelas?.id || null
    );

    const handleKelasChange = (kelasId: number | null) => {
        setSelectedKelasId(kelasId);
        if (kelasId) {
            router.get(route('akademik.jadwal.index', { kelas_id: kelasId }));
        } else {
            router.get(route('akademik.jadwal.index'));
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            router.delete(route('akademik.jadwal.destroy', id));
        }
    };

    const getColorScheme = (index: number) => {
        return colorSchemes[index % colorSchemes.length];
    };

    const hasJadwal = jadwal && typeof jadwal === 'object' && Object.keys(jadwal).length > 0;

    return (
        <SidebarLayout>
            <Head title="Jadwal Pelajaran" />

            {/* Header with 3D Effect */}
            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            📅 Jadwal Pelajaran
                        </h1>
                        <p className="text-white/90 text-lg">
                            Kelola jadwal pelajaran dengan mudah dan efisien
                        </p>
                    </div>
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                </div>
            </div>

            {/* Filter and Action Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter Berdasarkan Kelas
                    </label>
                    <select
                        value={selectedKelasId || ''}
                        onChange={(e) => handleKelasChange(e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <option value="">Semua Kelas</option>
                        {kelas && Array.isArray(kelas) && kelas.map((k: any) => (
                            <option key={k.id} value={k.id}>
                                {k.jenjang?.nama || ''} - {k.nama_kelas}
                            </option>
                        ))}
                    </select>
                </div>

                <Link
                    href={route('akademik.jadwal.create')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Jadwal
                </Link>
            </div>

            {/* Schedule Display */}
            {!hasJadwal ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="mb-4 text-6xl">📚</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Belum Ada Jadwal
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {selectedKelas 
                                ? `Belum ada jadwal untuk kelas ${selectedKelas.nama_kelas}`
                                : 'Mulai tambahkan jadwal pelajaran untuk kelas Anda'
                            }
                        </p>
                        <Link
                            href={route('akademik.jadwal.create')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Jadwal Pertama
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {jadwal && hariOrder.map((hari) => {
                        const jadwalHari = jadwal[hari] || [];
                        if (!Array.isArray(jadwalHari) || jadwalHari.length === 0) return null;

                        return (
                            <div key={hari} className="group">
                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-gray-100">
                                    {/* Day Header */}
                                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                                        <h3 className="text-2xl font-bold text-white flex items-center">
                                            <span className="mr-3 text-3xl">📖</span>
                                            {hariLabels[hari] || hari}
                                        </h3>
                                        <p className="text-gray-300 text-sm mt-1">
                                            {jadwalHari.length} Mata Pelajaran
                                        </p>
                                    </div>

                                    {/* Schedule Items */}
                                    <div className="p-4 space-y-3">
                                        {jadwalHari.map((item: any, index: number) => {
                                            const bgColor = getColorScheme(index);
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="relative rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                >
                                                    <div className={`bg-gradient-to-br ${bgColor} p-4 text-white`}>
                                                        {/* Time Badge */}
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-sm font-semibold">
                                                                    {item.jam_mulai} - {item.jam_selesai}
                                                                </span>
                                                            </div>
                                                            {item.ruangan && (
                                                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                                                    <span className="text-sm font-semibold">
                                                                        🏫 {item.ruangan}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Subject Name */}
                                                        <h4 className="text-lg font-bold mb-2">
                                                            {item.mata_pelajaran?.nama || 'N/A'}
                                                        </h4>

                                                        {/* Teacher Info */}
                                                        <div className="flex items-center space-x-2 mb-3 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                                                            <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center font-bold">
                                                                {item.guru?.nama_lengkap?.charAt(0) || 'G'}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold truncate">
                                                                    {item.guru?.nama_lengkap || 'Guru'}
                                                                </p>
                                                                <p className="text-xs text-white/80">
                                                                    NIP: {item.guru?.nip || '-'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Class Info */}
                                                        <div className="flex items-center space-x-2 text-sm bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg mb-3">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                                                            </svg>
                                                            <span className="font-semibold">
                                                                {item.kelas?.jenjang?.nama || ''} - {item.kelas?.nama_kelas || ''}
                                                            </span>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={route('akademik.jadwal.edit', item.id)}
                                                                className="flex-1 text-center bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                                                            >
                                                                ✏️ Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="flex-1 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                                                            >
                                                                🗑️ Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Info Footer */}
            {selectedKelas && (
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                                ℹ️
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-1">
                                Menampilkan Jadwal Kelas
                            </h4>
                            <p className="text-gray-700">
                                <span className="font-semibold">{selectedKelas.jenjang?.nama || ''} - {selectedKelas.nama_kelas}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
