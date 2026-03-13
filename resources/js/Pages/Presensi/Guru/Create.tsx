import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Guru {
    id: number;
    nip: string;
    nama_lengkap: string;
}

interface Props {
    guru: Guru[];
}

export default function Create({ guru }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        guru_id: '',
        tanggal: '',
        status: '',
        jam_masuk: '',
        jam_keluar: '',
        keterangan: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('presensi.guru.store'));
    };

    // Filter guru based on search term
    const filteredGuru = guru.filter((g) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            g.nama_lengkap.toLowerCase().includes(searchLower) ||
            g.nip.toLowerCase().includes(searchLower)
        );
    });

    return (
        <SidebarLayout>
            <Head title="Tambah Presensi Guru" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Tambah Presensi Guru
            </h2>

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Guru */}
                            <div>
                                <label htmlFor="guru_search" className="block text-sm font-medium text-gray-700">
                                    Cari Guru <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="guru_search"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Cari berdasarkan nama atau NIP..."
                                />
                                <select
                                    id="guru_id"
                                    value={data.guru_id}
                                    onChange={(e) => setData('guru_id', e.target.value)}
                                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    size={8}
                                >
                                    <option value="">Pilih Guru</option>
                                    {filteredGuru.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama_lengkap} - NIP: {item.nip}
                                        </option>
                                    ))}
                                </select>
                                {errors.guru_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.guru_id}</p>
                                )}
                            </div>

                            {/* Tanggal */}
                            <div>
                                <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">
                                    Tanggal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.tanggal && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Status</option>
                                    <option value="hadir">Hadir</option>
                                    <option value="izin">Izin</option>
                                    <option value="sakit">Sakit</option>
                                    <option value="alpha">Alpha</option>
                                    <option value="dinas_luar">Dinas Luar</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                )}
                            </div>

                            {/* Jam Masuk & Jam Keluar - Show if status is hadir or dinas_luar */}
                            {(data.status === 'hadir' || data.status === 'dinas_luar') && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="jam_masuk" className="block text-sm font-medium text-gray-700">
                                            Jam Masuk
                                        </label>
                                        <input
                                            id="jam_masuk"
                                            type="time"
                                            value={data.jam_masuk}
                                            onChange={(e) => setData('jam_masuk', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.jam_masuk && (
                                            <p className="mt-1 text-sm text-red-600">{errors.jam_masuk}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="jam_keluar" className="block text-sm font-medium text-gray-700">
                                            Jam Keluar
                                        </label>
                                        <input
                                            id="jam_keluar"
                                            type="time"
                                            value={data.jam_keluar}
                                            onChange={(e) => setData('jam_keluar', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.jam_keluar && (
                                            <p className="mt-1 text-sm text-red-600">{errors.jam_keluar}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Keterangan */}
                            <div>
                                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">
                                    Keterangan
                                </label>
                                <textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Keterangan tambahan (opsional)"
                                />
                                {errors.keterangan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                                <Link
                                    href={route('presensi.guru.index')}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
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
