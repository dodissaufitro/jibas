import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface CalonSiswa {
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
    tahun_ajaran: {
        nama: string;
    };
    jenjang: {
        nama: string;
    };
    jurusan?: {
        nama: string;
    };
}

interface Stats {
    total: number;
    verifikasi: number;
    lulus: number;
    per_jalur: {
        reguler: number;
        prestasi: number;
        afirmasi: number;
    };
}

interface Props {
    calon: {
        data: CalonSiswa[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: Stats;
}

export default function Calon({ calon, stats }: Props) {
    const [selectedCalon, setSelectedCalon] = useState<CalonSiswa | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    const getStatusBadge = (status: string) => {
        const badges = {
            verifikasi: 'bg-blue-100 text-blue-800',
            lulus: 'bg-green-100 text-green-800',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
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

    const handleViewDetail = (item: CalonSiswa) => {
        setSelectedCalon(item);
        setShowDetail(true);
    };

    return (
        <SidebarLayout>
            <Head title="Data Calon Siswa" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-2xl text-gray-800">
                    Data Calon Siswa
                </h2>
                <Link
                    href={route('ppdb.pendaftaran.index')}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Lihat Semua Pendaftaran
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
                            <p className="text-sm font-medium text-gray-500">Total Calon Siswa</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
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
                            <p className="text-sm font-medium text-gray-500">Lulus Seleksi</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.lulus}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Jalur Prestasi</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.per_jalur.prestasi}</p>
                        </div>
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
                                                Nama Lengkap
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                NISN
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
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {calon.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                                    Belum ada data calon siswa
                                                </td>
                                            </tr>
                                        ) : (
                                            calon.data.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {(calon.current_page - 1) * calon.per_page + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <span className="font-mono font-semibold">{item.no_pendaftaran}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{item.nama_lengkap}</div>
                                                        <div className="text-sm text-gray-500">{item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.nisn}
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
                                                            {item.status === 'verifikasi' ? 'Verifikasi' : 'Lulus'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleViewDetail(item)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {calon.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan <span className="font-medium">{(calon.current_page - 1) * calon.per_page + 1}</span> sampai{' '}
                                        <span className="font-medium">
                                            {Math.min(calon.current_page * calon.per_page, calon.total)}
                                        </span>{' '}
                                        dari <span className="font-medium">{calon.total}</span> data
                                    </div>
                                    <div className="flex space-x-1">
                                        {calon.links.map((link, index) => (
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

            {/* Detail Modal */}
            {showDetail && selectedCalon && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowDetail(false)}>
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Detail Calon Siswa</h3>
                            <button
                                onClick={() => setShowDetail(false)}
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
                                    <p className="font-mono font-semibold">{selectedCalon.no_pendaftaran}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tahun Ajaran</p>
                                    <p className="font-medium">{selectedCalon.tahun_ajaran.nama}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Jenjang</p>
                                    <p className="font-medium">{selectedCalon.jenjang.nama}</p>
                                </div>
                                {selectedCalon.jurusan && (
                                    <div>
                                        <p className="text-sm text-gray-600">Jurusan</p>
                                        <p className="font-medium">{selectedCalon.jurusan.nama}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600">Jalur</p>
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getJalurBadge(selectedCalon.jalur)}`}>
                                        {selectedCalon.jalur.charAt(0).toUpperCase() + selectedCalon.jalur.slice(1)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(selectedCalon.status)}`}>
                                        {selectedCalon.status === 'verifikasi' ? 'Verifikasi' : 'Lulus'}
                                    </span>
                                </div>
                            </div>

                            {/* Data Pribadi */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Data Pribadi</h4>
                                <div>
                                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                                    <p className="font-medium">{selectedCalon.nama_lengkap}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">NISN</p>
                                    <p className="font-medium">{selectedCalon.nisn}</p>
                                </div>
                                {selectedCalon.nik && (
                                    <div>
                                        <p className="text-sm text-gray-600">NIK</p>
                                        <p className="font-medium">{selectedCalon.nik}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600">Jenis Kelamin</p>
                                    <p className="font-medium">{selectedCalon.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tempat, Tanggal Lahir</p>
                                    <p className="font-medium">{selectedCalon.tempat_lahir}, {formatDate(selectedCalon.tanggal_lahir)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Alamat</p>
                                    <p className="font-medium">{selectedCalon.alamat}</p>
                                </div>
                                {selectedCalon.email && (
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{selectedCalon.email}</p>
                                    </div>
                                )}
                                {selectedCalon.no_hp && (
                                    <div>
                                        <p className="text-sm text-gray-600">No. HP</p>
                                        <p className="font-medium">{selectedCalon.no_hp}</p>
                                    </div>
                                )}
                            </div>

                            {/* Data Orang Tua */}
                            <div className="space-y-4 md:col-span-2">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Data Orang Tua</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Nama Ayah</p>
                                        <p className="font-medium">{selectedCalon.nama_ayah}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nama Ibu</p>
                                        <p className="font-medium">{selectedCalon.nama_ibu}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pekerjaan Ayah</p>
                                        <p className="font-medium">{selectedCalon.pekerjaan_ayah}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pekerjaan Ibu</p>
                                        <p className="font-medium">{selectedCalon.pekerjaan_ibu}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">No. HP Orang Tua</p>
                                        <p className="font-medium">{selectedCalon.no_hp_ortu}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Penghasilan Orang Tua</p>
                                        <p className="font-medium">{formatCurrency(selectedCalon.penghasilan_ortu)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDetail(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            >
                                Tutup
                            </button>
                            <Link
                                href={route('ppdb.pendaftaran.edit', selectedCalon.id)}
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
