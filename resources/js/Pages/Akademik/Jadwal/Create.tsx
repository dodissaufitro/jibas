import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Props {
    kelas?: any[];
    mataPelajaran?: any[];
    guru?: any[];
    tahunAjaran?: any;
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

    const hariOptions = [
        { value: 'senin', label: 'Senin' },
        { value: 'selasa', label: 'Selasa' },
        { value: 'rabu', label: 'Rabu' },
        { value: 'kamis', label: 'Kamis' },
        { value: 'jumat', label: 'Jumat' },
        { value: 'sabtu', label: 'Sabtu' },
    ];

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

            {/* Form Card */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden">
                    <form onSubmit={submit} className="p-8 space-y-6">
                        {/* Tahun Ajaran Info */}
                        {tahunAjaran && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">
                                        📅
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tahun Ajaran Aktif</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {tahunAjaran.nama || `${tahunAjaran.tahun_mulai}/${tahunAjaran.tahun_selesai}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kelas */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Kelas <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kelas_id}
                                    onChange={(e) => setData('kelas_id', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm ${
                                        errors.kelas_id ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Pilih Kelas</option>
                                    {kelas && kelas.map((k: any) => (
                                        <option key={k.id} value={k.id}>
                                            {k.jenjang?.nama || ''} - {k.nama_kelas}
                                        </option>
                                    ))}
                                </select>
                                {errors.kelas_id && <p className="mt-1 text-sm text-red-600">{errors.kelas_id}</p>}
                            </div>

                            {/* Hari */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Hari <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.hari}
                                    onChange={(e) => setData('hari', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm ${
                                        errors.hari ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Pilih Hari</option>
                                    {hariOptions.map((hari) => (
                                        <option key={hari.value} value={hari.value}>{hari.label}</option>
                                    ))}
                                </select>
                                {errors.hari && <p className="mt-1 text-sm text-red-600">{errors.hari}</p>}
                            </div>

                            {/* Mata Pelajaran */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Mata Pelajaran <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.mata_pelajaran_id}
                                    onChange={(e) => setData('mata_pelajaran_id', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm ${
                                        errors.mata_pelajaran_id ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Pilih Mata Pelajaran</option>
                                    {mataPelajaran && mataPelajaran.map((mapel: any) => (
                                        <option key={mapel.id} value={mapel.id}>
                                            {mapel.nama}
                                        </option>
                                    ))}
                                </select>
                                {errors.mata_pelajaran_id && <p className="mt-1 text-sm text-red-600">{errors.mata_pelajaran_id}</p>}
                            </div>

                            {/* Guru */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Guru Pengajar <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.guru_id}
                                    onChange={(e) => setData('guru_id', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm ${
                                        errors.guru_id ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Pilih Guru</option>
                                    {guru && guru.map((g: any) => (
                                        <option key={g.id} value={g.id}>
                                            {g.nama_lengkap}
                                        </option>
                                    ))}
                                </select>
                                {errors.guru_id && <p className="mt-1 text-sm text-red-600">{errors.guru_id}</p>}
                            </div>

                            {/* Jam Mulai */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Jam Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.jam_mulai}
                                    onChange={(e) => setData('jam_mulai', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm ${
                                        errors.jam_mulai ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.jam_mulai && <p className="mt-1 text-sm text-red-600">{errors.jam_mulai}</p>}
                            </div>

                            {/* Jam Selesai */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Jam Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.jam_selesai}
                                    onChange={(e) => setData('jam_selesai', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm ${
                                        errors.jam_selesai ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.jam_selesai && <p className="mt-1 text-sm text-red-600">{errors.jam_selesai}</p>}
                            </div>

                            {/* Ruangan */}
                            <div className="group md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Ruangan (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.ruangan}
                                    onChange={(e) => setData('ruangan', e.target.value)}
                                    placeholder="Contoh: Lab Komputer, Ruang 201"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                                />
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
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : '💾 Simpan Jadwal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
