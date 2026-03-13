import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Jenjang {
    id: number;
    nama: string;
    kode: string;
}

interface Props {
    jenjang: Jenjang[];
}

export default function Create({ jenjang }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        jenjang_id: '',
        kode: '',
        nama: '',
        keterangan: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('master.jurusan.store'));
    };

    return (
        <SidebarLayout>
            <Head title="Tambah Jurusan" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Tambah Jurusan
            </h2>

            <div className="py-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
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

                            <div>
                                <label htmlFor="kode" className="block text-sm font-medium text-gray-700">
                                    Kode Jurusan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="kode"
                                    type="text"
                                    value={data.kode}
                                    onChange={(e) => setData('kode', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: IPA, IPS, TKJ"
                                />
                                {errors.kode && (
                                    <p className="mt-1 text-sm text-red-600">{errors.kode}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                                    Nama Jurusan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: Ilmu Pengetahuan Alam"
                                />
                                {errors.nama && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">
                                    Keterangan
                                </label>
                                <textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Keterangan tambahan (opsional)"
                                />
                                {errors.keterangan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Link
                                    href={route('master.jurusan.index')}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
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
