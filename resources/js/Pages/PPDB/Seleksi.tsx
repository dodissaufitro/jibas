import React, { useState, FormEventHandler } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Pendaftaran {
    id: number;
    no_pendaftaran: string;
    nama_lengkap: string;
    nisn: string;
    nik: string | null;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    alamat: string;
    email: string | null;
    no_hp: string | null;
    nama_ayah: string;
    nama_ibu: string;
    pekerjaan_ayah: string;
    pekerjaan_ibu: string;
    no_hp_ortu: string;
    penghasilan_ortu: number;
    jalur: string;
    status: string;
    catatan: string | null;
    tahun_ajaran: {
        nama: string;
    };
    jenjang: {
        nama: string;
    };
    jurusan?: {
        nama: string;
    };
    created_at: string;
}

interface Stats {
    total: number;
    pending: number;
    verifikasi: number;
    lulus: number;
    tidak_lulus: number;
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
        status?: string;
        jalur?: string;
        jenjang_id?: string;
        search?: string;
    };
}

export default function Seleksi({ pendaftaran, stats, jenjangs, filters }: Props) {
    const [selectedPendaftaran, setSelectedPendaftaran] = useState<Pendaftaran | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        status: '',
        catatan: '',
    });

    // Filter state
    const [filterStatus, setFilterStatus] = useState(filters.status || 'all');
    const [filterJalur, setFilterJalur] = useState(filters.jalur || 'all');
    const [filterJenjang, setFilterJenjang] = useState(filters.jenjang_id || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            verifikasi: 'bg-blue-100 text-blue-800',
            lulus: 'bg-green-100 text-green-800',
            tidak_lulus: 'bg-red-100 text-red-800',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            pending: 'Pending',
            verifikasi: 'Verifikasi',
            lulus: 'Lulus',
            tidak_lulus: 'Tidak Lulus',
        };
        return labels[status as keyof typeof labels] || status;
    };

    const getJalurBadge = (jalur: string) => {
        const badges = {
            reguler: 'bg-gray-100 text-gray-800',
            prestasi: 'bg-purple-100 text-purple-800',
            afirmasi: 'bg-orange-100 text-orange-800',
        };
        return badges[jalur as keyof typeof badges] || 'bg-gray-100 text-gray-800';
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

    const handleFilter = () => {
        router.get(route('ppdb.seleksi'), {
            status: filterStatus !== 'all' ? filterStatus : undefined,
            jalur: filterJalur !== 'all' ? filterJalur : undefined,
            jenjang_id: filterJenjang !== 'all' ? filterJenjang : undefined,
            search: searchQuery || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilter = () => {
        setFilterStatus('all');
        setFilterJalur('all');
        setFilterJenjang('all');
        setSearchQuery('');
        router.get(route('ppdb.seleksi'));
    };

    const handleUpdateStatus = (item: Pendaftaran, newStatus: string) => {
        setSelectedPendaftaran(item);
        setData({ status: newStatus, catatan: '' });
        setShowStatusModal(true);
    };

    const submitStatusUpdate: FormEventHandler = (e) => {
        e.preventDefault();

        if (!selectedPendaftaran) return;

        post(route('ppdb.seleksi.updateStatus', selectedPendaftaran.id), {
            onSuccess: () => {
                setShowStatusModal(false);
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
            <Head title="Seleksi PPDB" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-2xl text-gray-800">
                    Seleksi PPDB
                </h2>
                <Link
                    href={route('ppdb.pendaftaran.index')}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Data Pendaftaran
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gray-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Pending</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Verifikasi</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.verifikasi}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Lulus</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.lulus}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Tidak Lulus</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.tidak_lulus}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="verifikasi">Verifikasi</option>
                            <option value="lulus">Lulus</option>
                            <option value="tidak_lulus">Tidak Lulus</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jalur</label>
                        <select
                            value={filterJalur}
                            onChange={(e) => setFilterJalur(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="all">Semua Jalur</option>
                            <option value="reguler">Reguler</option>
                            <option value="prestasi">Prestasi</option>
                            <option value="afirmasi">Afirmasi</option>
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
                                                Jalur
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal Daftar
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pendaftaran.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                                    Tidak ada data pendaftaran
                                                </td>
                                            </tr>
                                        ) : (
                                            pendaftaran.data.map((item, index) => (
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
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getJalurBadge(item.jalur)}`}>
                                                            {item.jalur.charAt(0).toUpperCase() + item.jalur.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                                                            {getStatusLabel(item.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(item.created_at)}
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
                                                            
                                                            {item.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(item, 'verifikasi')}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    title="Verifikasi"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            
                                                            {(item.status === 'pending' || item.status === 'verifikasi') && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleUpdateStatus(item, 'lulus')}
                                                                        className="text-green-600 hover:text-green-900"
                                                                        title="Terima / Lulus"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleUpdateStatus(item, 'tidak_lulus')}
                                                                        className="text-red-600 hover:text-red-900"
                                                                        title="Tolak / Tidak Lulus"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
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

            {/* Status Update Modal */}
            {showStatusModal && selectedPendaftaran && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowStatusModal(false)}>
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Update Status</h3>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={submitStatusUpdate}>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Nama Pendaftar</p>
                                <p className="font-medium">{selectedPendaftaran.nama_lengkap}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">No. Pendaftaran</p>
                                <p className="font-mono font-semibold">{selectedPendaftaran.no_pendaftaran}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status Baru
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Pilih Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="verifikasi">Verifikasi</option>
                                    <option value="lulus">Lulus</option>
                                    <option value="tidak_lulus">Tidak Lulus</option>
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Tambahkan catatan jika diperlukan..."
                                />
                                {errors.catatan && <p className="mt-1 text-sm text-red-600">{errors.catatan}</p>}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowStatusModal(false)}
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
                                    {processing ? 'Menyimpan...' : 'Update Status'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedPendaftaran && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowDetailModal(false)}>
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Detail Pendaftaran</h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Data Pendaftaran */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Data Pendaftaran</h4>
                                <div>
                                    <p className="text-sm text-gray-600">No. Pendaftaran</p>
                                    <p className="font-mono font-semibold">{selectedPendaftaran.no_pendaftaran}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tanggal Daftar</p>
                                    <p className="font-medium">{formatDate(selectedPendaftaran.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tahun Ajaran</p>
                                    <p className="font-medium">{selectedPendaftaran.tahun_ajaran.nama}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Jenjang</p>
                                    <p className="font-medium">{selectedPendaftaran.jenjang.nama}</p>
                                </div>
                                {selectedPendaftaran.jurusan && (
                                    <div>
                                        <p className="text-sm text-gray-600">Jurusan</p>
                                        <p className="font-medium">{selectedPendaftaran.jurusan.nama}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600">Jalur</p>
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getJalurBadge(selectedPendaftaran.jalur)}`}>
                                        {selectedPendaftaran.jalur.charAt(0).toUpperCase() + selectedPendaftaran.jalur.slice(1)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(selectedPendaftaran.status)}`}>
                                        {getStatusLabel(selectedPendaftaran.status)}
                                    </span>
                                </div>
                                {selectedPendaftaran.catatan && (
                                    <div>
                                        <p className="text-sm text-gray-600">Catatan</p>
                                        <p className="font-medium text-sm bg-gray-50 p-2 rounded">{selectedPendaftaran.catatan}</p>
                                    </div>
                                )}
                            </div>

                            {/* Data Pribadi */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Data Pribadi</h4>
                                <div>
                                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                                    <p className="font-medium">{selectedPendaftaran.nama_lengkap}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">NISN</p>
                                    <p className="font-medium">{selectedPendaftaran.nisn}</p>
                                </div>
                                {selectedPendaftaran.nik && (
                                    <div>
                                        <p className="text-sm text-gray-600">NIK</p>
                                        <p className="font-medium">{selectedPendaftaran.nik}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600">Jenis Kelamin</p>
                                    <p className="font-medium">{selectedPendaftaran.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tempat, Tanggal Lahir</p>
                                    <p className="font-medium">{selectedPendaftaran.tempat_lahir}, {formatDate(selectedPendaftaran.tanggal_lahir)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Alamat</p>
                                    <p className="font-medium">{selectedPendaftaran.alamat}</p>
                                </div>
                                {selectedPendaftaran.email && (
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{selectedPendaftaran.email}</p>
                                    </div>
                                )}
                                {selectedPendaftaran.no_hp && (
                                    <div>
                                        <p className="text-sm text-gray-600">No. HP</p>
                                        <p className="font-medium">{selectedPendaftaran.no_hp}</p>
                                    </div>
                                )}
                            </div>

                            {/* Data Orang Tua */}
                            <div className="space-y-4 md:col-span-2">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Data Orang Tua</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Nama Ayah</p>
                                        <p className="font-medium">{selectedPendaftaran.nama_ayah}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nama Ibu</p>
                                        <p className="font-medium">{selectedPendaftaran.nama_ibu}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pekerjaan Ayah</p>
                                        <p className="font-medium">{selectedPendaftaran.pekerjaan_ayah}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pekerjaan Ibu</p>
                                        <p className="font-medium">{selectedPendaftaran.pekerjaan_ibu}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">No. HP Orang Tua</p>
                                        <p className="font-medium">{selectedPendaftaran.no_hp_ortu}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Penghasilan Orang Tua</p>
                                        <p className="font-medium">{formatCurrency(selectedPendaftaran.penghasilan_ortu)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            >
                                Tutup
                            </button>
                            <Link
                                href={route('ppdb.pendaftaran.edit', selectedPendaftaran.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Edit Data
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
