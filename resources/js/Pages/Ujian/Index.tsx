import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface MataPelajaran {
    id: number;
    nama?: string;
}

interface Guru {
    id: number;
    nama: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    jenjang?: { nama: string };
    jurusan?: { nama: string };
}

interface TahunAjaran {
    id: number;
    tahun: string;
}

interface Semester {
    id: number;
    nama: string;
}

interface Ujian {
    id: number;
    mata_pelajaran?: MataPelajaran;
    guru?: Guru;
    kelas?: Kelas;
    tahun_ajaran?: TahunAjaran;
    semester?: Semester;
    judul_ujian: string;
    jenis_ujian: string;
    tanggal_ujian: string;
    durasi_menit: number;
    bobot: number;
    kkm: number;
    keterangan?: string;
    status: 'dijadwalkan' | 'berlangsung' | 'selesai' | 'batal';
}

interface PaginatedUjian {
    data: Ujian[];
    links: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Stats {
    total: number;
    dijadwalkan: number;
    berlangsung: number;
    selesai: number;
}

interface Props {
    ujian: PaginatedUjian;
    stats: Stats;
    filters?: {
        search?: string;
    };
}

export default function Index({ ujian, stats, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('ujian.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id: number, judulUjian: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ujian "${judulUjian}"?`)) {
            router.delete(route('ujian.destroy', id));
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            dijadwalkan: 'bg-blue-100 text-blue-800 border-blue-200',
            berlangsung: 'bg-green-100 text-green-800 border-green-200',
            selesai: 'bg-gray-100 text-gray-800 border-gray-200',
            batal: 'bg-red-100 text-red-800 border-red-200',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getJenisBadge = (jenis: string) => {
        const badges = {
            UTS: 'bg-purple-100 text-purple-800',
            UAS: 'bg-indigo-100 text-indigo-800',
            Harian: 'bg-cyan-100 text-cyan-800',
            Quiz: 'bg-pink-100 text-pink-800',
            Praktek: 'bg-amber-100 text-amber-800',
            Tugas: 'bg-emerald-100 text-emerald-800',
            Lainnya: 'bg-slate-100 text-slate-800',
        };
        return badges[jenis as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <SidebarLayout>
            <Head title="Manajemen Ujian" />

            <div className="relative py-6 sm:py-8">
                {/* Floating Blur Orbs Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-indigo-300/40 blur-3xl" />
                    <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-pink-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Hero Banner */}
                    <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-900 p-6 text-white shadow-[0_25px_80px_-30px_rgba(99,102,241,0.75)]">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
                                    Akademik Module
                                </p>
                                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Manajemen Ujian</h2>
                                <p className="mt-2 max-w-xl text-sm text-indigo-100">
                                    Kelola jadwal ujian, monitoring pelaksanaan, dan evaluasi hasil ujian secara terpusat dan terorganisir.
                                </p>
                            </div>
                            <Link
                                href={route('ujian.create')}
                                className="inline-flex items-center justify-center rounded-xl border border-indigo-200/40 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Ujian
                            </Link>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border border-indigo-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(99,102,241,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Total Ujian</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(59,130,246,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Dijadwalkan</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.dijadwalkan}</p>
                        </div>
                        <div className="rounded-2xl border border-green-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(34,197,94,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Berlangsung</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.berlangsung}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(107,114,128,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">Selesai</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.selesai}</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari berdasarkan judul ujian, mata pelajaran..."
                                    className="w-full rounded-xl border border-indigo-100 bg-white px-4 py-2.5 text-sm shadow-inner focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-700"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            {search && (
                                <Link
                                    href={route('ujian.index')}
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                >
                                    Reset
                                </Link>
                            )}
                        </form>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-[0_25px_65px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Judul Ujian
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jenis
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mata Pelajaran
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Durasi
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
                                    {ujian.data.length > 0 ? (
                                        ujian.data.map((item, index) => (
                                            <tr key={item.id} className="transition hover:bg-indigo-50/40">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {(ujian.current_page - 1) * ujian.per_page + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.judul_ujian}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getJenisBadge(item.jenis_ujian)}`}>
                                                        {item.jenis_ujian}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.mata_pelajaran?.nama || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.kelas?.nama_kelas || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {formatDate(item.tanggal_ujian)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.durasi_menit} menit
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route('ujian.hasil-siswa', item.id)}
                                                            className="rounded-lg bg-green-50 p-2 text-green-600 transition hover:-translate-y-0.5 hover:bg-green-100 hover:text-green-900"
                                                            title="Lihat Hasil Siswa"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                            </svg>
                                                        </Link>
                                                        <Link
                                                            href={route('ujian.soal.index', item.id)}
                                                            className="rounded-lg bg-purple-50 p-2 text-purple-600 transition hover:-translate-y-0.5 hover:bg-purple-100 hover:text-purple-900"
                                                            title="Kelola Soal"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </Link>
                                                        <Link
                                                            href={route('ujian.edit', item.id)}
                                                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-100 hover:text-blue-900"
                                                            title="Edit Ujian"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(item.id, item.judul_ujian)}
                                                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 hover:text-red-900"
                                                            title="Hapus Ujian"
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
                                            <td colSpan={9} className="px-6 py-8 text-center text-sm text-gray-500">
                                                Tidak ada data ujian
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {ujian.data.length > 0 && (
                            <div className="flex justify-between items-center border-t border-gray-200 bg-white px-6 py-3">
                                <div className="text-sm text-gray-700">
                                    Menampilkan <span className="font-medium">{(ujian.current_page - 1) * ujian.per_page + 1}</span> hingga{' '}
                                    <span className="font-medium">{Math.min(ujian.current_page * ujian.per_page, ujian.total)}</span> dari{' '}
                                    <span className="font-medium">{ujian.total}</span> data
                                </div>
                                <div className="flex space-x-2">
                                    {ujian.links.map((link, index) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`rounded-lg px-3 py-1 text-sm ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="rounded-lg px-3 py-1 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
