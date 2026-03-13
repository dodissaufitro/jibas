import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Santri {
    id: number;
    nis: string;
    nama_lengkap: string;
}

interface Props {
    santri: Santri[];
}

export default function Create({ santri }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        juz: '',
        surat: '',
        ayat_dari: '',
        ayat_sampai: '',
        tanggal_setoran: new Date().toISOString().split('T')[0],
        nilai: 'B',
        keterangan: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('pesantren.hafalan.store'));
    };

    return (
        <SidebarLayout>
            <Head title="Tambah Hafalan" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route('pesantren.hafalan.index')}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </Link>
                        <h2 className="font-semibold text-2xl text-gray-800">
                            Tambah Data Hafalan
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Input data setoran hafalan Al-Qur'an santri
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Santri Selection */}
                            <div>
                                <label htmlFor="siswa_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Santri <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="siswa_id"
                                    value={data.siswa_id}
                                    onChange={(e) => setData('siswa_id', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        errors.siswa_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">-- Pilih Santri --</option>
                                    {santri.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nis} - {s.nama_lengkap}
                                        </option>
                                    ))}
                                </select>
                                {errors.siswa_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.siswa_id}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Juz */}
                                <div>
                                    <label htmlFor="juz" className="block text-sm font-medium text-gray-700 mb-2">
                                        Juz <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="juz"
                                        min="1"
                                        max="30"
                                        value={data.juz}
                                        onChange={(e) => setData('juz', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.juz ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="1-30"
                                        required
                                    />
                                    {errors.juz && (
                                        <p className="mt-1 text-sm text-red-600">{errors.juz}</p>
                                    )}
                                </div>

                                {/* Surat */}
                                <div>
                                    <label htmlFor="surat" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Surat <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="surat"
                                        value={data.surat}
                                        onChange={(e) => setData('surat', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.surat ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Contoh: Al-Baqarah"
                                        required
                                    />
                                    {errors.surat && (
                                        <p className="mt-1 text-sm text-red-600">{errors.surat}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Ayat Dari */}
                                <div>
                                    <label htmlFor="ayat_dari" className="block text-sm font-medium text-gray-700 mb-2">
                                        Ayat Dari <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="ayat_dari"
                                        min="1"
                                        value={data.ayat_dari}
                                        onChange={(e) => setData('ayat_dari', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.ayat_dari ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nomor ayat awal"
                                        required
                                    />
                                    {errors.ayat_dari && (
                                        <p className="mt-1 text-sm text-red-600">{errors.ayat_dari}</p>
                                    )}
                                </div>

                                {/* Ayat Sampai */}
                                <div>
                                    <label htmlFor="ayat_sampai" className="block text-sm font-medium text-gray-700 mb-2">
                                        Ayat Sampai <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="ayat_sampai"
                                        min="1"
                                        value={data.ayat_sampai}
                                        onChange={(e) => setData('ayat_sampai', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.ayat_sampai ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nomor ayat akhir"
                                        required
                                    />
                                    {errors.ayat_sampai && (
                                        <p className="mt-1 text-sm text-red-600">{errors.ayat_sampai}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tanggal Setoran */}
                                <div>
                                    <label htmlFor="tanggal_setoran" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Setoran <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggal_setoran"
                                        value={data.tanggal_setoran}
                                        onChange={(e) => setData('tanggal_setoran', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.tanggal_setoran ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {errors.tanggal_setoran && (
                                        <p className="mt-1 text-sm text-red-600">{errors.tanggal_setoran}</p>
                                    )}
                                </div>

                                {/* Nilai */}
                                <div>
                                    <label htmlFor="nilai" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nilai <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="nilai"
                                        value={data.nilai}
                                        onChange={(e) => setData('nilai', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.nilai ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="A">A - Sangat Baik</option>
                                        <option value="B">B - Baik</option>
                                        <option value="C">C - Cukup</option>
                                        <option value="D">D - Perlu Perbaikan</option>
                                    </select>
                                    {errors.nilai && (
                                        <p className="mt-1 text-sm text-red-600">{errors.nilai}</p>
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
                                    rows={4}
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        errors.keterangan ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Catatan tambahan (opsional)"
                                />
                                {errors.keterangan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                                <Link
                                    href={route('pesantren.hafalan.index')}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
