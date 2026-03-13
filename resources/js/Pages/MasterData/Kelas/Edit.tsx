import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface TahunAjaran {
    id: number;
    nama: string;
}

interface Jenjang {
    id: number;
    nama: string;
}

interface Jurusan {
    id: number;
    nama: string;
}

interface Guru {
    id: number;
    name: string;
}

interface Kelas {
    id: number;
    tahun_ajaran_id: number;
    jenjang_id: number;
    jurusan_id: number | null;
    nama: string;
    tingkat: number;
    nama_kelas: string;
    kapasitas: number;
    wali_kelas_id: number | null;
}

interface Props {
    kelas: Kelas;
    tahunAjaran: TahunAjaran[];
    jenjang: Jenjang[];
    jurusan: Jurusan[];
    guru: Guru[];
}

export default function Edit({ kelas, tahunAjaran, jenjang, jurusan, guru }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        tahun_ajaran_id: kelas.tahun_ajaran_id.toString(),
        jenjang_id: kelas.jenjang_id.toString(),
        jurusan_id: kelas.jurusan_id?.toString() || '',
        nama: kelas.nama,
        tingkat: kelas.tingkat.toString(),
        nama_kelas: kelas.nama_kelas,
        kapasitas: kelas.kapasitas.toString(),
        wali_kelas_id: kelas.wali_kelas_id?.toString() || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('master.kelas.update', kelas.id));
    };

    return (
        <SidebarLayout>
            <Head title="Edit Kelas" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Edit Kelas
            </h2>

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Tahun Ajaran */}
                            <div>
                                <label htmlFor="tahun_ajaran_id" className="block text-sm font-medium text-gray-700">
                                    Tahun Ajaran <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="tahun_ajaran_id"
                                    value={data.tahun_ajaran_id}
                                    onChange={(e) => setData('tahun_ajaran_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoFocus
                                >
                                    <option value="">Pilih Tahun Ajaran</option>
                                    {tahunAjaran.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama}
                                        </option>
                                    ))}
                                </select>
                                {errors.tahun_ajaran_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tahun_ajaran_id}</p>
                                )}
                            </div>

                            {/* Jenjang */}
                            <div>
                                <label htmlFor="jenjang_id" className="block text-sm font-medium text-gray-700">
                                    Jenjang <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="jenjang_id"
                                    value={data.jenjang_id}
                                    onChange={(e) => setData('jenjang_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Jenjang</option>
                                    {jenjang.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama}
                                        </option>
                                    ))}
                                </select>
                                {errors.jenjang_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.jenjang_id}</p>
                                )}
                            </div>

                            {/* Jurusan (Optional) */}
                            <div>
                                <label htmlFor="jurusan_id" className="block text-sm font-medium text-gray-700">
                                    Jurusan
                                </label>
                                <select
                                    id="jurusan_id"
                                    value={data.jurusan_id}
                                    onChange={(e) => setData('jurusan_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Jurusan (Opsional)</option>
                                    {jurusan.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama}
                                        </option>
                                    ))}
                                </select>
                                {errors.jurusan_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.jurusan_id}</p>
                                )}
                            </div>

                            {/* Tingkat */}
                            <div>
                                <label htmlFor="tingkat" className="block text-sm font-medium text-gray-700">
                                    Tingkat <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="tingkat"
                                    type="number"
                                    value={data.tingkat}
                                    onChange={(e) => setData('tingkat', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: 1, 2, 3, dst."
                                    min="1"
                                    max="12"
                                />
                                {errors.tingkat && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tingkat}</p>
                                )}
                            </div>

                            {/* Nama Kelas */}
                            <div>
                                <label htmlFor="nama_kelas" className="block text-sm font-medium text-gray-700">
                                    Nama Kelas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="nama_kelas"
                                    type="text"
                                    value={data.nama_kelas}
                                    onChange={(e) => setData('nama_kelas', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: A, B, C"
                                />
                                {errors.nama_kelas && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nama_kelas}</p>
                                )}
                            </div>

                            {/* Nama (Auto-generated name will be shown) */}
                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                                    Nama Lengkap Kelas
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: Kelas 10 IPA 1"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Opsional: Jika tidak diisi, akan dibuat otomatis berdasarkan tingkat dan nama kelas
                                </p>
                                {errors.nama && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
                                )}
                            </div>

                            {/* Kapasitas */}
                            <div>
                                <label htmlFor="kapasitas" className="block text-sm font-medium text-gray-700">
                                    Kapasitas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="kapasitas"
                                    type="number"
                                    value={data.kapasitas}
                                    onChange={(e) => setData('kapasitas', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: 30"
                                    min="1"
                                />
                                {errors.kapasitas && (
                                    <p className="mt-1 text-sm text-red-600">{errors.kapasitas}</p>
                                )}
                            </div>

                            {/* Wali Kelas (Optional) */}
                            <div>
                                <label htmlFor="wali_kelas_id" className="block text-sm font-medium text-gray-700">
                                    Wali Kelas
                                </label>
                                <select
                                    id="wali_kelas_id"
                                    value={data.wali_kelas_id}
                                    onChange={(e) => setData('wali_kelas_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Wali Kelas (Opsional)</option>
                                    {guru.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.wali_kelas_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.wali_kelas_id}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Link
                                    href={route('master.kelas.index')}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
