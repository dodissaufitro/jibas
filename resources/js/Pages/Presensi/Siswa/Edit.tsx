import React, { FormEvent, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Jenjang {
    nama: string;
}

interface Jurusan {
    nama: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    jenjang?: Jenjang;
    jurusan?: Jurusan;
}

interface Siswa {
    id: number;
    nis: string;
    nama_lengkap: string;
    kelas?: {
        nama_kelas: string;
        jenjang?: Jenjang;
    };
}

interface PresensiSiswa {
    id: number;
    siswa_id: number;
    kelas_id: number;
    tanggal: string;
    status: 'hadir' | 'izin' | 'sakit' | 'alpha';
    jam_masuk: string | null;
    jam_keluar: string | null;
    keterangan: string | null;
}

interface Props {
    presensi: PresensiSiswa;
    siswa: Siswa[];
    kelas: Kelas[];
}

export default function Edit({ presensi, siswa, kelas }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    
    const { data, setData, put, processing, errors } = useForm({
        siswa_id: presensi.siswa_id.toString(),
        kelas_id: presensi.kelas_id.toString(),
        tanggal: presensi.tanggal.split('T')[0] || presensi.tanggal,
        status: presensi.status,
        jam_masuk: presensi.jam_masuk || '',
        jam_keluar: presensi.jam_keluar || '',
        keterangan: presensi.keterangan || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('presensi.siswa.update', presensi.id));
    };

    // Filter siswa based on search term
    const filteredSiswa = siswa.filter((s) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            s.nama_lengkap.toLowerCase().includes(searchLower) ||
            s.nis.toLowerCase().includes(searchLower)
        );
    });

    return (
        <SidebarLayout>
            <Head title="Edit Presensi Siswa" />

            <div className="relative py-6 sm:py-8">
                {/* Floating Blur Orbs Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 left-10 h-56 w-56 rounded-full bg-teal-200/40 blur-3xl" />
                    <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route('presensi.siswa.index')}
                            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4 transition"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </Link>
                        <h2 className="font-semibold text-2xl text-slate-900">
                            Edit Presensi Siswa
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Perbarui data kehadiran siswa
                        </p>
                    </div>

                    {/* Form */}
                    <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_25px_65px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Tanggal */}
                            <div>
                                <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="tanggal"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                        errors.tanggal ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.tanggal && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
                                )}
                            </div>

                            {/* Siswa - Search & Select */}
                            <div>
                                <label htmlFor="siswa_search" className="block text-sm font-medium text-gray-700 mb-2">
                                    Cari Siswa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="siswa_search"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-2"
                                    placeholder="Ketik nama atau NIS siswa..."
                                />
                                <select
                                    id="siswa_id"
                                    value={data.siswa_id}
                                    onChange={(e) => setData('siswa_id', e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                        errors.siswa_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    size={8}
                                    required
                                >
                                    <option value="">-- Pilih Siswa --</option>
                                    {filteredSiswa.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama_lengkap} - {item.nis} {item.kelas ? `(${item.kelas.nama_kelas})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.siswa_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.siswa_id}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kelas */}
                                <div>
                                    <label htmlFor="kelas_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Kelas <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="kelas_id"
                                        value={data.kelas_id}
                                        onChange={(e) => setData('kelas_id', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                            errors.kelas_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">-- Pilih Kelas --</option>
                                        {kelas.map((k) => (
                                            <option key={k.id} value={k.id}>
                                                {k.nama_kelas}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.kelas_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.kelas_id}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                        Status Kehadiran <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as 'hadir' | 'izin' | 'sakit' | 'alpha')}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                            errors.status ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="hadir">Hadir</option>
                                        <option value="izin">Izin</option>
                                        <option value="sakit">Sakit</option>
                                        <option value="alpha">Alpha</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Jam Masuk */}
                                <div>
                                    <label htmlFor="jam_masuk" className="block text-sm font-medium text-gray-700 mb-2">
                                        Jam Masuk
                                    </label>
                                    <input
                                        type="time"
                                        id="jam_masuk"
                                        value={data.jam_masuk}
                                        onChange={(e) => setData('jam_masuk', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                            errors.jam_masuk ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.jam_masuk && (
                                        <p className="mt-1 text-sm text-red-600">{errors.jam_masuk}</p>
                                    )}
                                </div>

                                {/* Jam Keluar */}
                                <div>
                                    <label htmlFor="jam_keluar" className="block text-sm font-medium text-gray-700 mb-2">
                                        Jam Keluar
                                    </label>
                                    <input
                                        type="time"
                                        id="jam_keluar"
                                        value={data.jam_keluar}
                                        onChange={(e) => setData('jam_keluar', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                            errors.jam_keluar ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.jam_keluar && (
                                        <p className="mt-1 text-sm text-red-600">{errors.jam_keluar}</p>
                                    )}
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div>
                                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
                                    Keterangan
                                </label>
                                <textarea
                                    id="keterangan"
                                    rows={3}
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                        errors.keterangan ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Catatan tambahan..."
                                />
                                {errors.keterangan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Link
                                    href={route('presensi.siswa.index')}
                                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-teal-600 text-white rounded-xl hover:-translate-y-0.5 hover:bg-teal-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Menyimpan...' : 'Update Presensi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
