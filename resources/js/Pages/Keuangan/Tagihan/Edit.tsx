import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface JenisPembayaran {
    id: number;
    nama: string;
    kode: string;
    nominal: number;
    tipe: string;
}

interface Siswa {
    id: number;
    nis: string;
    nama_lengkap: string;
    kelas: {
        nama: string;
    };
}

interface Tagihan {
    id: number;
    siswa_id: number;
    jenis_pembayaran_id: number;
    jenis_pembayaran: JenisPembayaran;
    bulan: number | null;
    tahun: number;
    jumlah: number;
    denda: number;
    jatuh_tempo: string;
    status: string;
    keterangan: string | null;
}

interface Props {
    tagihan: Tagihan;
    siswa: Siswa[];
    jenisPembayaran: JenisPembayaran[];
}

export default function Edit({ tagihan, siswa, jenisPembayaran }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, patch, processing, errors } = useForm({
        siswa_id: tagihan.siswa_id.toString(),
        jenis_pembayaran_id: tagihan.jenis_pembayaran_id.toString(),
        bulan: tagihan.bulan ? tagihan.bulan.toString() : '',
        tahun: tagihan.tahun.toString(),
        jumlah: tagihan.jumlah.toString(),
        denda: tagihan.denda.toString(),
        jatuh_tempo: tagihan.jatuh_tempo,
        status: tagihan.status,
        keterangan: tagihan.keterangan || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('keuangan.tagihan.update', tagihan.id));
    };

    const filteredSiswa = siswa.filter((item) =>
        item.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SidebarLayout>
            <Head title="Edit Tagihan" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Edit Tagihan
            </h2>

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Siswa */}
                            <div>
                                <label htmlFor="siswa_id" className="block text-sm font-medium text-gray-700">
                                    Siswa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Cari nama atau NIS siswa..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoFocus
                                />
                                <select
                                    id="siswa_id"
                                    value={data.siswa_id}
                                    onChange={(e) => setData('siswa_id', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    size={5}
                                >
                                    <option value="">Pilih Siswa</option>
                                    {filteredSiswa.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nis} - {item.nama_lengkap} ({item.kelas.nama})
                                        </option>
                                    ))}
                                </select>
                                {errors.siswa_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.siswa_id}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Jenis Pembayaran */}
                                <div>
                                    <label htmlFor="jenis_pembayaran_id" className="block text-sm font-medium text-gray-700">
                                        Jenis Pembayaran <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="jenis_pembayaran_id"
                                        value={data.jenis_pembayaran_id}
                                        onChange={(e) => {
                                            const selected = jenisPembayaran.find(jp => jp.id.toString() === e.target.value);
                                            setData(prev => ({
                                                ...prev,
                                                jenis_pembayaran_id: e.target.value,
                                                jumlah: selected ? selected.nominal.toString() : prev.jumlah
                                            }));
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Pilih Jenis Pembayaran</option>
                                        {jenisPembayaran.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.nama} - Rp {item.nominal.toLocaleString('id-ID')}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.jenis_pembayaran_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.jenis_pembayaran_id}</p>
                                    )}
                                </div>

                                {/* Bulan */}
                                <div>
                                    <label htmlFor="bulan" className="block text-sm font-medium text-gray-700">
                                        Bulan <span className="text-gray-500 text-xs">(opsional untuk SPP)</span>
                                    </label>
                                    <select
                                        id="bulan"
                                        value={data.bulan}
                                        onChange={(e) => setData('bulan', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Pilih Bulan</option>
                                        <option value="1">Januari</option>
                                        <option value="2">Februari</option>
                                        <option value="3">Maret</option>
                                        <option value="4">April</option>
                                        <option value="5">Mei</option>
                                        <option value="6">Juni</option>
                                        <option value="7">Juli</option>
                                        <option value="8">Agustus</option>
                                        <option value="9">September</option>
                                        <option value="10">Oktober</option>
                                        <option value="11">November</option>
                                        <option value="12">Desember</option>
                                    </select>
                                    {errors.bulan && (
                                        <p className="mt-1 text-sm text-red-600">{errors.bulan}</p>
                                    )}
                                </div>

                                {/* Tahun */}
                                <div>
                                    <label htmlFor="tahun" className="block text-sm font-medium text-gray-700">
                                        Tahun <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="tahun"
                                        type="number"
                                        value={data.tahun}
                                        onChange={(e) => setData('tahun', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="2024"
                                        min="2000"
                                        max="2100"
                                    />
                                    {errors.tahun && (
                                        <p className="mt-1 text-sm text-red-600">{errors.tahun}</p>
                                    )}
                                </div>

                                {/* Jumlah */}
                                <div>
                                    <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">
                                        Jumlah <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">Rp</span>
                                        </div>
                                        <input
                                            id="jumlah"
                                            type="number"
                                            value={data.jumlah}
                                            onChange={(e) => setData('jumlah', e.target.value)}
                                            className="block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    {errors.jumlah && (
                                        <p className="mt-1 text-sm text-red-600">{errors.jumlah}</p>
                                    )}
                                </div>

                                {/* Denda */}
                                <div>
                                    <label htmlFor="denda" className="block text-sm font-medium text-gray-700">
                                        Denda <span className="text-gray-500 text-xs">(jika ada)</span>
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">Rp</span>
                                        </div>
                                        <input
                                            id="denda"
                                            type="number"
                                            value={data.denda}
                                            onChange={(e) => setData('denda', e.target.value)}
                                            className="block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    {errors.denda && (
                                        <p className="mt-1 text-sm text-red-600">{errors.denda}</p>
                                    )}
                                </div>

                                {/* Jatuh Tempo */}
                                <div>
                                    <label htmlFor="jatuh_tempo" className="block text-sm font-medium text-gray-700">
                                        Tanggal Jatuh Tempo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="jatuh_tempo"
                                        type="date"
                                        value={data.jatuh_tempo}
                                        onChange={(e) => setData('jatuh_tempo', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.jatuh_tempo && (
                                        <p className="mt-1 text-sm text-red-600">{errors.jatuh_tempo}</p>
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
                                        <option value="belum_bayar">Belum Bayar</option>
                                        <option value="dibayar_sebagian">Dibayar Sebagian</option>
                                        <option value="lunas">Lunas</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            {/* Keterangan */}
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

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                                <Link
                                    href={route('keuangan.tagihan.index')}
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
