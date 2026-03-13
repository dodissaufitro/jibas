import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Siswa {
    id: number;
    nis: string;
    nama_lengkap: string;
}

interface Penguji {
    id: number;
    nama: string;
}

interface Hafalan {
    id: number;
    siswa: Siswa;
    juz: number;
    surat: string;
    ayat_dari: number;
    ayat_sampai: number;
    tanggal_setoran: string;
    nilai: 'A' | 'B' | 'C' | 'D';
    keterangan: string | null;
    penguji?: Penguji;
}

interface PaginatedHafalan {
    data: Hafalan[];
    links: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    hafalan: PaginatedHafalan;
    filters: {
        search?: string;
    };
}

export default function Index({ hafalan, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('pesantren.hafalan.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id: number, santriName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data hafalan ${santriName}?`)) {
            router.delete(route('pesantren.hafalan.destroy', id));
        }
    };

    const getNilaiBadge = (nilai: string) => {
        const badges = {
            A: 'bg-green-100 text-green-800',
            B: 'bg-blue-100 text-blue-800',
            C: 'bg-yellow-100 text-yellow-800',
            D: 'bg-red-100 text-red-800',
        };
        return badges[nilai as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <SidebarLayout>
            <Head title="Hafalan Quran" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="font-semibold text-2xl text-gray-800">
                                Hafalan Al-Qur'an
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Manajemen data hafalan santri
                            </p>
                        </div>
                        <Link
                            href={route('pesantren.hafalan.create')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Hafalan
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari berdasarkan nama santri, surat..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            {search && (
                                <Link
                                    href={route('pesantren.hafalan.index')}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                                >
                                    Reset
                                </Link>
                            )}
                        </form>
                    </div>

                    {/* Table */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            NIS
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Santri
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Juz
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Surat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ayat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nilai
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {hafalan.data.length > 0 ? (
                                        hafalan.data.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {(hafalan.current_page - 1) * hafalan.per_page + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.siswa?.nis || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.siswa?.nama_lengkap || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Juz {item.juz}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.surat}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.ayat_dari} - {item.ayat_sampai}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {formatDate(item.tanggal_setoran)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNilaiBadge(item.nilai)}`}>
                                                        {item.nilai}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route('pesantren.hafalan.edit', item.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(item.id, item.siswa?.nama_lengkap || '')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    <p className="text-lg font-medium">Belum ada data hafalan</p>
                                                    <p className="text-sm mt-1">Klik tombol "Tambah Hafalan" untuk menambahkan data</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {hafalan.data.length > 0 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {hafalan.links[0] && (
                                        <Link
                                            href={hafalan.links[0].url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {hafalan.links[hafalan.links.length - 1] && (
                                        <Link
                                            href={hafalan.links[hafalan.links.length - 1].url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Menampilkan{' '}
                                            <span className="font-medium">{(hafalan.current_page - 1) * hafalan.per_page + 1}</span>
                                            {' '}-{' '}
                                            <span className="font-medium">
                                                {Math.min(hafalan.current_page * hafalan.per_page, hafalan.total)}
                                            </span>
                                            {' '}dari{' '}
                                            <span className="font-medium">{hafalan.total}</span>
                                            {' '}data
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {hafalan.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${
                                                        index === 0 ? 'rounded-l-md' : ''
                                                    } ${
                                                        index === hafalan.links.length - 1 ? 'rounded-r-md' : ''
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
