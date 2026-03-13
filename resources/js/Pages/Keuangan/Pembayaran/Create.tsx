import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Tagihan {
    id: number;
    siswa: {
        nama_lengkap: string;
        nis: string;
    };
    jenis_tagihan: string;
    jumlah: number;
    status: string;
}

interface Props {
    tagihan: Tagihan[];
}

export default function Create({ tagihan }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tagihan_id: '',
        tanggal_bayar: new Date().toISOString().split('T')[0],
        jumlah_bayar: '',
        metode_pembayaran: '',
        bukti_pembayaran: '',
        keterangan: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('keuangan.pembayaran.store'));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const selectedTagihan = tagihan.find(t => t.id === parseInt(data.tagihan_id));

    return (
        <SidebarLayout>
            <Head title="Tambah Pembayaran" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Tambah Pembayaran
            </h2>

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Tagihan */}
                            <div>
                                <label htmlFor="tagihan_id" className="block text-sm font-medium text-gray-700">
                                    Tagihan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="tagihan_id"
                                    value={data.tagihan_id}
                                    onChange={(e) => {
                                        setData('tagihan_id', e.target.value);
                                        const selected = tagihan.find(t => t.id === parseInt(e.target.value));
                                        if (selected) {
                                            setData('jumlah_bayar', selected.jumlah.toString());
                                        }
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoFocus
                                >
                                    <option value="">Pilih Tagihan</option>
                                    {tagihan.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.siswa.nis} - {item.siswa.nama_lengkap} | {item.jenis_tagihan} | {formatCurrency(item.jumlah)}
                                        </option>
                                    ))}
                                </select>
                                {errors.tagihan_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tagihan_id}</p>
                                )}
                                {selectedTagihan && (
                                    <div className="mt-2 p-3 bg-blue-50 rounded-md">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">Siswa:</span> {selectedTagihan.siswa.nama_lengkap} ({selectedTagihan.siswa.nis})
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">Jenis Tagihan:</span> {selectedTagihan.jenis_tagihan}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">Jumlah Tagihan:</span> {formatCurrency(selectedTagihan.jumlah)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Tanggal Bayar */}
                            <div>
                                <label htmlFor="tanggal_bayar" className="block text-sm font-medium text-gray-700">
                                    Tanggal Bayar <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="tanggal_bayar"
                                    type="date"
                                    value={data.tanggal_bayar}
                                    onChange={(e) => setData('tanggal_bayar', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.tanggal_bayar && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tanggal_bayar}</p>
                                )}
                            </div>

                            {/* Jumlah Bayar */}
                            <div>
                                <label htmlFor="jumlah_bayar" className="block text-sm font-medium text-gray-700">
                                    Jumlah Bayar <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">Rp</span>
                                    </div>
                                    <input
                                        id="jumlah_bayar"
                                        type="number"
                                        value={data.jumlah_bayar}
                                        onChange={(e) => setData('jumlah_bayar', e.target.value)}
                                        className="block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="0"
                                        min="0"
                                        step="1000"
                                    />
                                </div>
                                {errors.jumlah_bayar && (
                                    <p className="mt-1 text-sm text-red-600">{errors.jumlah_bayar}</p>
                                )}
                            </div>

                            {/* Metode Pembayaran */}
                            <div>
                                <label htmlFor="metode_pembayaran" className="block text-sm font-medium text-gray-700">
                                    Metode Pembayaran <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="metode_pembayaran"
                                    value={data.metode_pembayaran}
                                    onChange={(e) => setData('metode_pembayaran', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Metode</option>
                                    <option value="tunai">Tunai</option>
                                    <option value="transfer">Transfer</option>
                                    <option value="qris">QRIS</option>
                                </select>
                                {errors.metode_pembayaran && (
                                    <p className="mt-1 text-sm text-red-600">{errors.metode_pembayaran}</p>
                                )}
                            </div>

                            {/* Bukti Pembayaran */}
                            <div>
                                <label htmlFor="bukti_pembayaran" className="block text-sm font-medium text-gray-700">
                                    Bukti Pembayaran
                                </label>
                                <input
                                    id="bukti_pembayaran"
                                    type="text"
                                    value={data.bukti_pembayaran}
                                    onChange={(e) => setData('bukti_pembayaran', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="No. Referensi / Nama file bukti"
                                />
                                {errors.bukti_pembayaran && (
                                    <p className="mt-1 text-sm text-red-600">{errors.bukti_pembayaran}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Isi dengan nomor referensi transfer atau nama file bukti pembayaran
                                </p>
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
                                    placeholder="Catatan tambahan (opsional)"
                                />
                                {errors.keterangan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Link
                                    href={route('keuangan.pembayaran.index')}
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
