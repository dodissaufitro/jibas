import React, { useState, FormEvent } from 'react';
import { router, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface MataPelajaran {
    id: number;
    nama_mata_pelajaran: string;
}

interface Guru {
    id: number;
    nama: string;
}

interface JadwalPelajaran {
    id: number;
    kelas_id: number;
    mata_pelajaran_id: number;
    guru_id: number;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    ruangan: string;
}

interface EditProps {
    jadwal?: JadwalPelajaran;
    kelas?: Kelas[];
    mata_pelajaran?: MataPelajaran[];
    guru?: Guru[];
}

const Edit: React.FC<EditProps> = ({ 
    jadwal,
    kelas = [], 
    mata_pelajaran = [], 
    guru = [] 
}) => {
    if (!jadwal) {
        return (
            <SidebarLayout>
                <div className="p-6">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        Data jadwal tidak ditemukan
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    const { data, setData, put, processing, errors } = useForm({
        kelas_id: jadwal.kelas_id || '',
        mata_pelajaran_id: jadwal.mata_pelajaran_id || '',
        guru_id: jadwal.guru_id || '',
        hari: jadwal.hari || '',
        jam_mulai: jadwal.jam_mulai || '',
        jam_selesai: jadwal.jam_selesai || '',
        ruangan: jadwal.ruangan || '',
    });

    const hariOptions = [
        { value: 'senin', label: 'Senin' },
        { value: 'selasa', label: 'Selasa' },
        { value: 'rabu', label: 'Rabu' },
        { value: 'kamis', label: 'Kamis' },
        { value: 'jumat', label: 'Jumat' },
        { value: 'sabtu', label: 'Sabtu' },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('akademik.jadwal.update', jadwal.id));
    };

    return (
        <SidebarLayout>
            <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Header dengan efek 3D */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-20 transform translate-y-2"></div>
                    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
                                    Edit Jadwal Pelajaran
                                </h1>
                                <p className="text-blue-100 text-lg">
                                    Perbarui jadwal pelajaran yang sudah ada
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card dengan efek 3D */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl blur-2xl transform translate-y-4"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/50">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Hari */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                                        Hari <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.hari}
                                        onChange={(e) => setData('hari', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                                    >
                                        <option value="">Pilih Hari</option>
                                        {hariOptions.map((hari) => (
                                            <option key={hari.value} value={hari.value}>
                                                {hari.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.hari && (
                                        <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.hari}</p>
                                    )}
                                </div>

                                {/* Kelas */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                                        Kelas <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.kelas_id}
                                        onChange={(e) => setData('kelas_id', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                                    >
                                        <option value="">Pilih Kelas</option>
                                        {Array.isArray(kelas) && kelas.map((k) => (
                                            <option key={k.id} value={k.id}>
                                                {k.nama_kelas}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.kelas_id && (
                                        <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.kelas_id}</p>
                                    )}
                                </div>

                                {/* Mata Pelajaran */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                                        Mata Pelajaran <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.mata_pelajaran_id}
                                        onChange={(e) => setData('mata_pelajaran_id', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                                    >
                                        <option value="">Pilih Mata Pelajaran</option>
                                        {Array.isArray(mata_pelajaran) && mata_pelajaran.map((mp) => (
                                            <option key={mp.id} value={mp.id}>
                                                {mp.nama_mata_pelajaran}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.mata_pelajaran_id && (
                                        <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.mata_pelajaran_id}</p>
                                    )}
                                </div>

                                {/* Guru */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                                        Guru Pengajar <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.guru_id}
                                        onChange={(e) => setData('guru_id', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                                    >
                                        <option value="">Pilih Guru</option>
                                        {Array.isArray(guru) && guru.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.guru_id && (
                                        <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.guru_id}</p>
                                    )}
                                </div>

                                {/* Jam Mulai */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                                        Jam Mulai <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={data.jam_mulai}
                                        onChange={(e) => setData('jam_mulai', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                                    />
                                    {errors.jam_mulai && (
                                        <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.jam_mulai}</p>
                                    )}
                                </div>

                                {/* Jam Selesai */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                                        Jam Selesai <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={data.jam_selesai}
                                        onChange={(e) => setData('jam_selesai', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                                    />
                                    {errors.jam_selesai && (
                                        <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.jam_selesai}</p>
                                    )}
                                </div>

                                {/* Ruangan */}
                                <div className="md:col-span-2 group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                                        Ruangan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.ruangan}
                                        onChange={(e) => setData('ruangan', e.target.value)}
                                        placeholder="Contoh: Lab Komputer 1"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                                    />
                                    {errors.ruangan && (
                                        <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.ruangan}</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={() => router.visit(route('akademik.jadwal.index'))}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {processing ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menyimpan...
                                        </span>
                                    ) : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
};

export default Edit;
