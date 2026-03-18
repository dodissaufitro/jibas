import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Jenjang {
    nama: string;
}

interface Jurusan {
    nama: string;
}

interface Kelas {
    id: number;
    nama: string;
    nama_kelas: string;
    tingkat: number;
    jenjang: Jenjang;
    jurusan?: Jurusan;
}

interface SiswaKelas {
    nama: string;
    nama_kelas: string;
    jenjang: Jenjang;
}

interface SiswaInstitution {
    id: number;
    name: string;
}

interface Siswa {
    id: number;
    nis: string;
    nisn: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    kelas: SiswaKelas;
    institution: SiswaInstitution;
    status: 'aktif' | 'lulus' | 'pindah' | 'keluar';
}

interface Institution {
    id: number;
    name: string;
}

interface Props {
    siswa: {
        data: Siswa[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    kelasList: Kelas[];
    institutions: Institution[];
    filters: {
        kelas_id?: string;
        institution_id?: string;
        search?: string;
    };
}

export default function Index({ siswa, kelasList, institutions, filters }: Props) {
    const [kelasId, setKelasId] = useState(filters.kelas_id || '');
    const [institutionId, setInstitutionId] = useState(filters.institution_id || '');
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = () => {
        router.get(route('akademik.siswa.index'), { 
            kelas_id: kelasId, 
            institution_id: institutionId,
            search: search 
        }, { preserveState: true });
    };
    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus siswa "${nama}"?`)) {
            router.delete(route('akademik.siswa.destroy', id));
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            aktif: 'bg-green-100 text-green-800',
            lulus: 'bg-blue-100 text-blue-800',
            pindah: 'bg-yellow-100 text-yellow-800',
            keluar: 'bg-red-100 text-red-800',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    return (
        <SidebarLayout>
            <Head title="Data Siswa" />

            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="font-semibold text-2xl text-gray-800">
                            Data Siswa
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Total: <span className="font-semibold text-blue-600">{siswa.total}</span> siswa terdaftar
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={route('akademik.siswa.import-form')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Import Excel
                        </Link>
                        <button
                            onClick={() => window.location.href = route('akademik.siswa.export', { kelas_id: kelasId, institution_id: institutionId })}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Excel
                        </button>
                        <Link
                            href={route('akademik.siswa.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Siswa
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🔍 Cari Siswa
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                placeholder="Nama, NIS, atau NISN..."
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🎓 Filter Kelas
                            </label>
                            <select
                                value={kelasId}
                                onChange={(e) => setKelasId(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Semua Kelas</option>
                                {kelasList.map((kelas) => (
                                    <option key={kelas.id} value={kelas.id}>
                                        {kelas.jenjang.nama} {kelas.nama_kelas}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🏫 Filter Institusi
                            </label>
                            <select
                                value={institutionId}
                                onChange={(e) => setInstitutionId(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Semua Institusi</option>
                            {institutions.map((inst) => (
                                <option key={inst.id} value={inst.id}>
                                    {inst.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end gap-2">
                        <button
                            onClick={handleFilter}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Filter
                        </button>
                        {(kelasId || institutionId || search) && (
                            <button
                                onClick={() => {
                                    setKelasId('');
                                    setInstitutionId('');
                                    setSearch('');
                                    router.get(route('akademik.siswa.index'));
                                }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>
            </div>

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            {/* Table */}
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
                                                NISN
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama Lengkap
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                JK
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kelas
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Institusi
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
                                        {siswa.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                                                    {(kelasId || institutionId || search) ? 'Tidak ada data dengan filter tersebut' : 'Belum ada data siswa'}
                                                </td>
                                            </tr>
                                        ) : (
                                            siswa.data.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {(siswa.current_page - 1) * siswa.per_page + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                        {item.nis}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.nisn}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.nama_lengkap}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.jenis_kelamin === 'L' ? '👨 L' : '👩 P'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.kelas ? `${item.kelas.jenjang.nama} ${item.kelas.nama_kelas}` : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.institution ? item.institution.name : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('akademik.siswa.edit', item.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(item.id, item.nama_lengkap)}
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
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {siswa.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan <span className="font-medium">{(siswa.current_page - 1) * siswa.per_page + 1}</span> sampai{' '}
                                        <span className="font-medium">
                                            {Math.min(siswa.current_page * siswa.per_page, siswa.total)}
                                        </span>{' '}
                                        dari <span className="font-medium">{siswa.total}</span> data
                                    </div>
                                    <div className="flex space-x-1">
                                        {siswa.links.map((link, index) => (
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
        </SidebarLayout>
    );
}
