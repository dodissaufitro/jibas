import React, { useState, FormEventHandler } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Pembayaran {
    id: number;
    jenis_pembayaran: string;
    jumlah: number;
    status_bayar: string;
    bukti_bayar: string | null;
    tanggal_bayar: string;
}

interface Pendaftaran {
    id: number;
    no_pendaftaran: string;
    nama_lengkap: string;
    nisn: string;
    jenis_kelamin: string;
    no_hp_ortu: string;
    tahun_ajaran: {
        nama: string;
    };
    jenjang: {
        nama: string;
    };
    jurusan?: {
        nama: string;
    };
    pembayaran: Pembayaran[];
    created_at: string;
}

interface Stats {
    total_lulus: number;
    sudah_bayar: number;
    belum_bayar: number;
    total_nominal: number;
}

interface Jenjang {
    id: number;
    nama: string;
}

interface Props {
    pendaftaran: {
        data: Pendaftaran[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: Stats;
    jenjangs: Jenjang[];
    filters: {
        status_bayar?: string;
        jenjang_id?: string;
        search?: string;
    };
}

export default function Pembayaran({ pendaftaran, stats, jenjangs, filters }: Props) {
    const [selectedPendaftaran, setSelectedPendaftaran] = useState<Pendaftaran | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        jenis_pembayaran: 'formulir',
        jumlah: 0,
        status_bayar: 'lunas',
        tanggal_bayar: new Date().toISOString().split('T')[0],
        bukti_bayar: '',
    });

    // Filter state
    const [filterStatusBayar, setFilterStatusBayar] = useState(filters.status_bayar || 'all');
    const [filterJenjang, setFilterJenjang] = useState(filters.jenjang_id || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const getJenisPembayaranLabel = (jenis: string) => {
        const labels: { [key: string]: string } = {
            formulir: 'Formulir',
            daftar_ulang: 'Daftar Ulang',
            seragam: 'Seragam',
            spp_awal: 'SPP Awal',
        };
        return labels[jenis] || jenis;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getPaymentStatus = (item: Pendaftaran) => {
        if (item.pembayaran && item.pembayaran.length > 0) {
            const allLunas = item.pembayaran.every(p => p.status_bayar === 'lunas');
            return allLunas ? 'lunas' : 'sebagian';
        }
        return 'belum';
    };

    const getTotalPembayaran = (item: Pendaftaran) => {
        if (item.pembayaran && item.pembayaran.length > 0) {
            return item.pembayaran
                .filter(p => p.status_bayar === 'lunas')
                .reduce((sum, p) => sum + p.jumlah, 0);
        }
        return 0;
    };

    const handleFilter = () => {
        router.get(route('ppdb.pembayaran'), {
            status_bayar: filterStatusBayar !== 'all' ? filterStatusBayar : undefined,
            jenjang_id: filterJenjang !== 'all' ? filterJenjang : undefined,
            search: searchQuery || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilter = () => {
        setFilterStatusBayar('all');
        setFilterJenjang('all');
        setSearchQuery('');
        router.get(route('ppdb.pembayaran'));
    };

    const handleAddPayment = (item: Pendaftaran) => {
        setSelectedPendaftaran(item);
        setData({
            jenis_pembayaran: 'formulir',
            jumlah: 0,
            status_bayar: 'lunas',
            tanggal_bayar: new Date().toISOString().split('T')[0],
            bukti_bayar: '',
        });
        setShowPaymentModal(true);
    };

    const submitPayment: FormEventHandler = (e) => {
        e.preventDefault();

        if (!selectedPendaftaran) return;

        post(route('ppdb.pembayaran.bayar', selectedPendaftaran.id), {
            onSuccess: () => {
                setShowPaymentModal(false);
                reset();
                setSelectedPendaftaran(null);
            },
        });
    };

    const handleViewDetail = (item: Pendaftaran) => {
        setSelectedPendaftaran(item);
        setShowDetailModal(true);
    };

    return (
        <SidebarLayout>
            <Head title="Pembayaran PPDB" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-2xl text-gray-800">
                    Pembayaran PPDB
                </h2>
                <Link
                    href={route('ppdb.seleksi')}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Data Seleksi
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Total Siswa Lulus</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total_lulus}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Sudah Bayar</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.sudah_bayar}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Belum Bayar</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.belum_bayar}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Total Diterima</p>
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(stats.total_nominal)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status Bayar</label>
                        <select
                            value={filterStatusBayar}
                            onChange={(e) => setFilterStatusBayar(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="all">Semua Status</option>
                            <option value="lunas">Sudah Bayar</option>
                            <option value="belum">Belum Bayar</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenjang</label>
                        <select
                            value={filterJenjang}
                            onChange={(e) => setFilterJenjang(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="all">Semua Jenjang</option>
                            {jenjangs.map((jenjang) => (
                                <option key={jenjang.id} value={jenjang.id}>
                                    {jenjang.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pencarian</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Nama, NISN, No. Pendaftaran"
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                        />
                    </div>

                    <div className="flex items-end space-x-2">
                        <button
                            onClick={handleFilter}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Filter
                        </button>
                        <button
                            onClick={handleResetFilter}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No. Pendaftaran
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama / NISN
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jenjang
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Bayar
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pendaftaran.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                    Tidak ada data siswa lulus
                                                </td>
                                            </tr>
                                        ) : (
                                            pendaftaran.data.map((item, index) => {
                                                const status = getPaymentStatus(item);
                                                const total = getTotalPembayaran(item);
                                                
                                                return (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {(pendaftaran.current_page - 1) * pendaftaran.per_page + index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <span className="font-mono font-semibold">{item.no_pendaftaran}</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{item.nama_lengkap}</div>
                                                            <div className="text-sm text-gray-500">{item.nisn}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div>{item.jenjang.nama}</div>
                                                            {item.jurusan && (
                                                                <div className="text-xs text-gray-500">{item.jurusan.nama}</div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {formatCurrency(total)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                status === 'lunas' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : status === 'sebagian'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {status === 'lunas' ? 'Lunas' : status === 'sebagian' ? 'Sebagian' : 'Belum Bayar'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleViewDetail(item)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    title="Lihat Detail"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                </button>
                                                                
                                                                <button
                                                                    onClick={() => handleAddPayment(item)}
                                                                    className="text-green-600 hover:text-green-900"
                                                                    title="Tambah Pembayaran"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {pendaftaran.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan <span className="font-medium">{(pendaftaran.current_page - 1) * pendaftaran.per_page + 1}</span> sampai{' '}
                                        <span className="font-medium">
                                            {Math.min(pendaftaran.current_page * pendaftaran.per_page, pendaftaran.total)}
                                        </span>{' '}
                                        dari <span className="font-medium">{pendaftaran.total}</span> data
                                    </div>
                                    <div className="flex space-x-1">
                                        {pendaftaran.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedPendaftaran && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowPaymentModal(false)}>
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Tambah Pembayaran</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={submitPayment}>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Nama Siswa</p>
                                <p className="font-medium">{selectedPendaftaran.nama_lengkap}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">No. Pendaftaran</p>
                                <p className="font-mono font-semibold">{selectedPendaftaran.no_pendaftaran}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Pembayaran
                                </label>
                                <select
                                    value={data.jenis_pembayaran}
                                    onChange={(e) => setData('jenis_pembayaran', e.target.value as any)}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="formulir">Formulir</option>
                                    <option value="daftar_ulang">Daftar Ulang</option>
                                    <option value="seragam">Seragam</option>
                                    <option value="spp_awal">SPP Awal</option>
                                </select>
                                {errors.jenis_pembayaran && <p className="mt-1 text-sm text-red-600">{errors.jenis_pembayaran}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jumlah (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={data.jumlah}
                                    onChange={(e) => setData('jumlah', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    min="0"
                                />
                                {errors.jumlah && <p className="mt-1 text-sm text-red-600">{errors.jumlah}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Bayar
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_bayar}
                                    onChange={(e) => setData('tanggal_bayar', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.tanggal_bayar && <p className="mt-1 text-sm text-red-600">{errors.tanggal_bayar}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status Bayar
                                </label>
                                <select
                                    value={data.status_bayar}
                                    onChange={(e) => setData('status_bayar', e.target.value as any)}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="belum">Belum Lunas</option>
                                    <option value="lunas">Lunas</option>
                                </select>
                                {errors.status_bayar && <p className="mt-1 text-sm text-red-600">{errors.status_bayar}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bukti Bayar (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.bukti_bayar}
                                    onChange={(e) => setData('bukti_bayar', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Nomor bukti / referensi"
                                />
                                {errors.bukti_bayar && <p className="mt-1 text-sm text-red-600">{errors.bukti_bayar}</p>}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                    disabled={processing}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedPendaftaran && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowDetailModal(false)}>
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Detail Pembayaran</h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 border-b pb-2 mb-4">Data Siswa</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">No. Pendaftaran</p>
                                    <p className="font-mono font-semibold">{selectedPendaftaran.no_pendaftaran}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                                    <p className="font-medium">{selectedPendaftaran.nama_lengkap}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">NISN</p>
                                    <p className="font-medium">{selectedPendaftaran.nisn}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Jenjang</p>
                                    <p className="font-medium">
                                        {selectedPendaftaran.jenjang.nama}
                                        {selectedPendaftaran.jurusan && ` - ${selectedPendaftaran.jurusan.nama}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 border-b pb-2 mb-4">Riwayat Pembayaran</h4>
                            {selectedPendaftaran.pembayaran && selectedPendaftaran.pembayaran.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedPendaftaran.pembayaran.map((payment) => (
                                        <div key={payment.id} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {getJenisPembayaranLabel(payment.jenis_pembayaran)}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Tanggal: {formatDate(payment.tanggal_bayar)}
                                                    </p>
                                                    {payment.bukti_bayar && (
                                                        <p className="text-sm text-gray-600">
                                                            Bukti: {payment.bukti_bayar}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {formatCurrency(payment.jumlah)}
                                                    </p>
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        payment.status_bayar === 'lunas' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {payment.status_bayar === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-gray-900">Total Pembayaran</p>
                                            <p className="text-xl font-bold text-blue-600">
                                                {formatCurrency(getTotalPembayaran(selectedPendaftaran))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Belum ada riwayat pembayaran</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    handleAddPayment(selectedPendaftaran);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Tambah Pembayaran
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
