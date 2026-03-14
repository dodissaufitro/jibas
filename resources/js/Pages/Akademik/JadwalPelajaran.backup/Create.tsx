import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Jenjang {
    id: number;
    nama: string;
}

interface Kelas {
    id: number;
    nama: string;
    tingkat: number;
    nama_kelas: string;
    jenjang: Jenjang;
}

interface MataPelajaran {
    id: number;
    nama: string;
    kode: string;
}

interface Guru {
    id: number;
    nama_lengkap: string;
    nip: string;
}

interface TahunAjaran {
    id: number;
    nama: string;
    tahun_mulai: number;
    tahun_selesai: number;
    is_active: boolean;
}

interface Props {
    kelas: Kelas[];
    mataPelajaran: MataPelajaran[];
    guru: Guru[];
    tahunAjaran: TahunAjaran | null;
}

export default function Create({ kelas, mataPelajaran, guru, tahunAjaran }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tahun_ajaran_id: tahunAjaran?.id || '',
        kelas_id: '',
        mata_pelajaran_id: '',
        guru_id: '',
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
        ruangan: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('akademik.jadwal.store'));
    };

    const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Warning jika tidak ada tahun ajaran
    if (!tahunAjaran) {
        return (
            <SidebarLayout>
                <Head title="Tambah Jadwal Pelajaran" />
                <div className="max-w-2xl mx-auto mt-8">
                    <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-8 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-2xl font-bold text-red-800 mb-2">
                            Tahun Ajaran Tidak Tersedia
                        </h3>
                        <p className="text-red-600 mb-6">
                            Silakan buat tahun ajaran terlebih dahulu sebelum menambahkan jadwal pelajaran.
                        </p>
                        <Link
                            href={route('akademik.jadwal.index')}
                            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition-all"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <Head title="Tambah Jadwal Pelajaran" />

            {/* Header */}
            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <Link
                            href={route('akademik.jadwal.index')}
                            className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </Link>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            ➕ Tambah Jadwal Pelajaran
                        </h1>
                        <p className="text-white/90 text-lg">
                            Isi formulir untuk menambahkan jadwal pelajaran baru
                        </p>
                    </div>
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                </div>
            </div>

            {/* Form Card with 3D Effect */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden transform hover:shadow-3xl transition-shadow duration-300">
                    <form onSubmit={submit} className="p-8 space-y-6">
                        {/* Tahun Ajaran Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">
                                    📅
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tahun Ajaran Aktif</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {tahunAjaran?.nama || `${tahunAjaran?.tahun_mulai}/${tahunAjaran?.tahun_selesai}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Grid Layout for Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kelas */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                                    Kelas <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kelas_id}
                                    onChange={(e) => setData('kelas_id', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md ${
                                        errors.kelas_id ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Pilih Kelas</option>
                                    {kelas.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.jenjang?.nama} - {k.nama_kelas}
                                        </option>
                                    ))}
                                </select>
                                {errors.kelas_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.kelas_id}</p>
                                )}
                            </div>

                            {/* Hari */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                                    Hari <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.hari}
                                    onChange={(e) => setData('hari', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md ${
                                        errors.hari ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Pilih Hari</option>
                                    {hariOptions.map((hari) => (
                                        <option key={hari} value={hari}>
                                            {hari}
                                        </option>
                                    ))}
                                </select>
                                {errors.hari && (
                                    <p className="mt-1 text-sm text-red-600">{errors.hari}</p>
                                )}
                            </div>

                            {/* Mata Pelajaran */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                                    Mata Pelajaran <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.mata_pelajaran_id}
                                    onChange={(e) => setData('mata_pelajaran_id', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md ${
                                        errors.mata_pelajaran_id ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Pilih Mata Pelajaran</option>
                                    {mataPelajaran.map((mapel) => (
                                        <option key={mapel.id} value={mapel.id}>
                                            {mapel.nama} ({mapel.kode})
                                        </option>
                                    ))}
                                </select>
                                {errors.mata_pelajaran_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.mata_pelajaran_id}</p>
                                )}
                            </div>

                            {/* Guru */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                                    Guru Pengajar <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.guru_id}
                                    onChange={(e) => setData('guru_id', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md ${
                                        errors.guru_id ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Pilih Guru</option>
                                    {guru.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.nama_lengkap} (NIP: {g.nip})
                                        </option>
                                    ))}
                                </select>
                                {errors.guru_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.guru_id}</p>
                                )}
                            </div>

                            {/* Jam Mulai */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                                    Jam Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.jam_mulai}
                                    onChange={(e) => setData('jam_mulai', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md ${
                                        errors.jam_mulai ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.jam_mulai && (
                                    <p className="mt-1 text-sm text-red-600">{errors.jam_mulai}</p>
                                )}
                            </div>

                            {/* Jam Selesai */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                                    Jam Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.jam_selesai}
                                    onChange={(e) => setData('jam_selesai', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md ${
                                        errors.jam_selesai ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.jam_selesai && (
                                    <p className="mt-1 text-sm text-red-600">{errors.jam_selesai}</p>
                                )}
                            </div>

                            {/* Ruangan */}
                            <div className="group md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                                    Ruangan (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.ruangan}
                                    onChange={(e) => setData('ruangan', e.target.value)}
                                    placeholder="Contoh: Lab Komputer, Ruang 201"
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md ${
                                        errors.ruangan ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.ruangan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.ruangan}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                            <Link
                                href={route('akademik.jadwal.index')}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    '💾 Simpan Jadwal'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
