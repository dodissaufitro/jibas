import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Jenjang {
    id: number;
    nama: string;
    kode: string;
    keterangan: string | null;
}

interface Props {
    jenjang: Jenjang;
}

export default function Edit({ jenjang }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        nama: jenjang.nama,
        kode: jenjang.kode,
        keterangan: jenjang.keterangan || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('master.jenjang.update', jenjang.id));
    };

    return (
        <SidebarLayout>
            <Head title="Edit Jenjang" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Edit Jenjang
            </h2>

            <div className="py-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <label htmlFor="kode" className="block text-sm font-medium text-gray-700">
                                    Kode Jenjang <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="kode"
                                    type="text"
                                    value={data.kode}
                                    onChange={(e) => setData('kode', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: SD, SMP, SMA"
                                    autoFocus
                                />
                                {errors.kode && (
                                    <p className="mt-1 text-sm text-red-600">{errors.kode}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                                    Nama Jenjang <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: Sekolah Dasar"
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
                                    href={route('master.jenjang.index')}
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
