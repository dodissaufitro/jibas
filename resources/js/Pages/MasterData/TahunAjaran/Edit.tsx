import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface TahunAjaran {
    id: number;
    nama: string;
    tahun_mulai: number;
    tahun_selesai: number;
    is_active: boolean;
}

interface Props {
    tahunAjaran: TahunAjaran;
}

export default function Edit({ tahunAjaran }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        nama: tahunAjaran.nama,
        tahun_mulai: tahunAjaran.tahun_mulai.toString(),
        tahun_selesai: tahunAjaran.tahun_selesai.toString(),
        is_active: tahunAjaran.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('master.tahun-ajaran.update', tahunAjaran.id));
    };

    return (
        <SidebarLayout>
            <Head title="Edit Tahun Ajaran" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Edit Tahun Ajaran
            </h2>

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Nama */}
                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                                    Nama Tahun Ajaran <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Contoh: 2024/2025"
                                    autoFocus
                                />
                                {errors.nama && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
                                )}
                            </div>

                            {/* Tahun Mulai */}
                            <div>
                                <label htmlFor="tahun_mulai" className="block text-sm font-medium text-gray-700">
                                    Tahun Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="tahun_mulai"
                                    type="number"
                                    value={data.tahun_mulai}
                                    onChange={(e) => setData('tahun_mulai', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="2024"
                                    min="2000"
                                    max="2100"
                                />
                                {errors.tahun_mulai && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tahun_mulai}</p>
                                )}
                            </div>

                            {/* Tahun Selesai */}
                            <div>
                                <label htmlFor="tahun_selesai" className="block text-sm font-medium text-gray-700">
                                    Tahun Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="tahun_selesai"
                                    type="number"
                                    value={data.tahun_selesai}
                                    onChange={(e) => setData('tahun_selesai', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="2025"
                                    min="2000"
                                    max="2100"
                                />
                                {errors.tahun_selesai && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tahun_selesai}</p>
                                )}
                            </div>

                            {/* Is Active */}
                            <div className="flex items-center">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                    Aktifkan tahun ajaran ini?
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 ml-6">
                                Jika dicentang, tahun ajaran lain akan dinonaktifkan secara otomatis
                            </p>

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Link
                                    href={route('master.tahun-ajaran.index')}
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
