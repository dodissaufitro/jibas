import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface TahunAjaran {
    id: number;
    nama: string;
}

interface Props {
    tahunAjaran: TahunAjaran[];
}

export default function Create({ tahunAjaran }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tahun_ajaran_id: '',
        judul: '',
        isi: '',
        tanggal_pengumuman: new Date().toISOString().split('T')[0],
        is_published: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('ppdb.pengumuman.store'));
    };

    return (
        <SidebarLayout>
            <Head title="Tambah Pengumuman" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-2xl text-gray-800">
                    Tambah Pengumuman PPDB
                </h2>
                <Link
                    href={route('ppdb.pengumuman.index')}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali
                </Link>
            </div>

            <div className="py-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="tahun_ajaran_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tahun Ajaran <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="tahun_ajaran_id"
                                        value={data.tahun_ajaran_id}
                                        onChange={(e) => setData('tahun_ajaran_id', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Pilih Tahun Ajaran</option>
                                        {tahunAjaran.map((ta) => (
                                            <option key={ta.id} value={ta.id}>
                                                {ta.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.tahun_ajaran_id && <p className="mt-1 text-sm text-red-600">{errors.tahun_ajaran_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
                                        Judul Pengumuman <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="judul"
                                        type="text"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Masukkan judul pengumuman"
                                        required
                                    />
                                    {errors.judul && <p className="mt-1 text-sm text-red-600">{errors.judul}</p>}
                                </div>

                                <div>
                                    <label htmlFor="tanggal_pengumuman" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Pengumuman <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="tanggal_pengumuman"
                                        type="date"
                                        value={data.tanggal_pengumuman}
                                        onChange={(e) => setData('tanggal_pengumuman', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.tanggal_pengumuman && <p className="mt-1 text-sm text-red-600">{errors.tanggal_pengumuman}</p>}
                                </div>

                                <div>
                                    <label htmlFor="isi" className="block text-sm font-medium text-gray-700 mb-2">
                                        Isi Pengumuman <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="isi"
                                        value={data.isi}
                                        onChange={(e) => setData('isi', e.target.value)}
                                        rows={10}
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Masukkan isi pengumuman"
                                        required
                                    />
                                    {errors.isi && <p className="mt-1 text-sm text-red-600">{errors.isi}</p>}
                                </div>

                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Publikasikan pengumuman ini
                                        </span>
                                    </label>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Jika dicentang, pengumuman akan langsung terlihat oleh publik
                                    </p>
                                    {errors.is_published && <p className="mt-1 text-sm text-red-600">{errors.is_published}</p>}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end space-x-3">
                                <Link
                                    href={route('ppdb.pengumuman.index')}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
