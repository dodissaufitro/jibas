import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Jenjang {
    id: number;
    nama: string;
}

interface MataPelajaran {
    id: number;
    jenjang_id: number;
    nama: string;
    kode: string;
    kelompok: string;
    urutan: number | null;
}

interface Props {
    mataPelajaran: MataPelajaran;
    jenjang: Jenjang[];
}

export default function Edit({ mataPelajaran, jenjang }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        jenjang_id: mataPelajaran.jenjang_id.toString(),
        kode: mataPelajaran.kode,
        nama: mataPelajaran.nama,
        kelompok: mataPelajaran.kelompok,
        urutan: mataPelajaran.urutan?.toString() || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('master.mata-pelajaran.update', mataPelajaran.id));
    };

    return (
        <SidebarLayout>
            <Head title="Edit Mata Pelajaran" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Edit Mata Pelajaran
            </h2>

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
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
                                    autoFocus
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

                            {/* Kode */}
                            <div>
                                <label htmlFor="kode" className="block text-sm font-medium text-gray-700">
                                    Kode Mata Pelajaran <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="kode"
                                    type="text"
                                    value={data.kode}
                                    onChange={(e) => setData('kode', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: MTK"
                                />
                                {errors.kode && (
                                    <p className="mt-1 text-sm text-red-600">{errors.kode}</p>
                                )}
                            </div>

                            {/* Nama */}
                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                                    Nama Mata Pelajaran <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: Matematika"
                                />
                                {errors.nama && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
                                )}
                            </div>

                            {/* Kelompok */}
                            <div>
                                <label htmlFor="kelompok" className="block text-sm font-medium text-gray-700">
                                    Kelompok <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="kelompok"
                                    value={data.kelompok}
                                    onChange={(e) => setData('kelompok', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Kelompok</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                </select>
                                {errors.kelompok && (
                                    <p className="mt-1 text-sm text-red-600">{errors.kelompok}</p>
                                )}
                            </div>

                            {/* Urutan */}
                            <div>
                                <label htmlFor="urutan" className="block text-sm font-medium text-gray-700">
                                    Urutan
                                </label>
                                <input
                                    id="urutan"
                                    type="number"
                                    value={data.urutan}
                                    onChange={(e) => setData('urutan', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: 1"
                                    min="1"
                                />
                                {errors.urutan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.urutan}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Opsional. Untuk mengurutkan mata pelajaran dalam raport atau jadwal.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Link
                                    href={route('master.mata-pelajaran.index')}
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
