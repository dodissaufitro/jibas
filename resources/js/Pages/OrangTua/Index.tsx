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

interface Siswa {
    id: number;
    nama_lengkap: string;
    nisn: string;
}

interface OrangTua {
    id: number;
    siswa_id: number;
    nama_ayah: string;
    nik_ayah?: string;
    pekerjaan_ayah?: string;
    penghasilan_ayah?: number;
    nama_ibu: string;
    nik_ibu?: string;
    pekerjaan_ibu?: string;
    penghasilan_ibu?: number;
    alamat: string;
    no_hp: string;
    email?: string;
    siswa: Siswa;
}

interface Institution {
    id: number;
    name: string;
}

interface Props {
    orangTua: {
        data: OrangTua[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    kelasList: Kelas[];
    institutions: Institution[];
    filters: {
        search?: string;
        kelas_id?: string;
        institution_id?: string;
    };
}

export default function Index({ orangTua, kelasList, institutions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [kelasId, setKelasId] = useState(filters.kelas_id || '');
    const [institutionId, setInstitutionId] = useState(filters.institution_id || '');

    const handleFilter = () => {
        router.get(route('orangtua.data'), { 
            search, 
            kelas_id: kelasId, 
            institution_id: institutionId 
        }, { preserveState: true });
    };

    const handleDelete = (id: number, namaAyah: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data orang tua ${namaAyah}?`)) {
            router.delete(route('orangtua.destroy', id));
        }
    };

    const formatRupiah = (amount?: number) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <SidebarLayout>
            <Head title="Data Wali Murid" />

            {/* Header */}
            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            👪 Data Wali Murid
                        </h1>
                        <p className="text-white/90 text-lg">
                            Kelola data orang tua / wali murid siswa
                        </p>
                    </div>
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="mb-6">
                <div className="flex justify-end mb-4">
                    <Link
                        href={route('orangtua.create')}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Wali Murid
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-4 items-end flex-wrap">
                    {/* Search */}
                    <div className="flex-1 min-w-[280px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            🔍 Pencarian
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama orang tua, siswa, HP..."
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Kelas Filter */}
                    <div className="w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            🎓 Filter Kelas
                        </label>
                        <select
                            value={kelasId}
                            onChange={(e) => setKelasId(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="">Semua Kelas</option>
                            {kelasList.map((kelas) => (
                                <option key={kelas.id} value={kelas.id}>
                                    {kelas.jenjang.nama} {kelas.nama_kelas}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Institution Filter */}
                    <div className="w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            🏫 Filter Institusi
                        </label>
                        <select
                            value={institutionId}
                            onChange={(e) => setInstitutionId(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="">Semua Institusi</option>
                            {institutions.map((inst) => (
                                <option key={inst.id} value={inst.id}>
                                    {inst.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleFilter}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Filter
                    </button>
                    {(search || kelasId || institutionId) && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setKelasId('');
                                setInstitutionId('');
                                router.get(route('orangtua.data'));
                            }}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Wali Murid</p>
                            <p className="text-3xl font-bold text-gray-900">{orangTua.total}</p>
                        </div>
                        <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-3xl">
                            👪
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Data Lengkap</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {orangTua.data.filter(o => o.email).length}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center text-3xl">
                            ✓
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Halaman</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {orangTua.current_page} / {orangTua.last_page}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center text-3xl">
                            📄
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Siswa
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Nama Ayah
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Nama Ibu
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Kontak
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Alamat
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orangTua.data.length > 0 ? (
                                orangTua.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-purple-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {item.siswa.nama_lengkap}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    NISN: {item.siswa.nisn}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.nama_ayah}
                                                </div>
                                                {item.pekerjaan_ayah && (
                                                    <div className="text-xs text-gray-500">
                                                        {item.pekerjaan_ayah}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.nama_ibu}
                                                </div>
                                                {item.pekerjaan_ibu && (
                                                    <div className="text-xs text-gray-500">
                                                        {item.pekerjaan_ibu}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="flex items-center text-gray-900">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {item.no_hp}
                                                </div>
                                                {item.email && (
                                                    <div className="flex items-center text-gray-500 mt-1">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        {item.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 max-w-xs truncate">
                                                {item.alamat}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={route('orangtua.edit', item.id)}
                                                    className="inline-flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all"
                                                >
                                                    ✏️ Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.nama_ayah)}
                                                    className="inline-flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all"
                                                >
                                                    🗑️ Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-gray-400 text-lg">
                                            <div className="text-6xl mb-4">👪</div>
                                            <p className="font-semibold">Tidak ada data wali murid</p>
                                            <p className="text-sm mt-2">
                                                {search ? 'Coba gunakan kata kunci lain' : 'Tambahkan data wali murid baru'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orangTua.last_page > 1 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {orangTua.data.length} dari {orangTua.total} data
                            </div>
                            <div className="flex gap-2">
                                {orangTua.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                            link.active
                                                ? 'bg-purple-600 text-white'
                                                : link.url
                                                ? 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-300'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
