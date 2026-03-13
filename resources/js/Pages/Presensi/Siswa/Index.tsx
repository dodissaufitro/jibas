import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Siswa {
    nama_lengkap: string;
    nis: string;
}

interface Kelas {
    nama_kelas: string;
}

interface PresensiSiswa {
    id: number;
    tanggal: string;
    siswa: Siswa;
    kelas: Kelas;
    status: 'hadir' | 'izin' | 'sakit' | 'alpha';
    jam_masuk: string | null;
    jam_keluar: string | null;
    keterangan: string | null;
}

interface Props {
    presensi: {
        data: PresensiSiswa[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        search?: string;
    };
}

export default function Index({ presensi, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('presensi.siswa.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus presensi siswa "${nama}"?`)) {
            router.delete(route('presensi.siswa.destroy', id));
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            hadir: 'bg-green-100 text-green-800 border-green-200',
            izin: 'bg-blue-100 text-blue-800 border-blue-200',
            sakit: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            alpha: 'bg-red-100 text-red-800 border-red-200',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString: string | null) => {
        if (!timeString) return '-';
        return timeString.slice(0, 5); // HH:mm
    };

    // Calculate stats
    const stats = {
        hadir: presensi.data.filter((p) => p.status === 'hadir').length,
        izin: presensi.data.filter((p) => p.status === 'izin').length,
        sakit: presensi.data.filter((p) => p.status === 'sakit').length,
        alpha: presensi.data.filter((p) => p.status === 'alpha').length,
    };

    return (
        <SidebarLayout>
            <Head title="Presensi Siswa" />

            <div className="relative py-6 sm:py-8">
                {/* Floating Blur Orbs Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-teal-300/40 blur-3xl" />
                    <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Hero Banner */}
                    <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900 p-6 text-white shadow-[0_25px_80px_-30px_rgba(20,184,166,0.75)]">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
                                    Presensi Module
                                </p>
                                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Presensi Siswa</h2>
                                <p className="mt-2 max-w-xl text-sm text-teal-100">
                                    Monitor kehadiran siswa secara real-time dengan sistem presensi digital yang akurat dan efisien.
                                </p>
                            </div>
                            <Link
                                href={route('presensi.siswa.create')}
                                className="inline-flex items-center justify-center rounded-xl border border-teal-200/40 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Presensi
                            </Link>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border border-green-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(34,197,94,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Hadir</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.hadir}</p>
                        </div>
                        <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(59,130,246,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Izin</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.izin}</p>
                        </div>
                        <div className="rounded-2xl border border-yellow-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(234,179,8,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-yellow-700">Sakit</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.sakit}</p>
                        </div>
                        <div className="rounded-2xl border border-red-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(239,68,68,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Alpha</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.alpha}</p>
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
                                    placeholder="Cari berdasarkan nama siswa, kelas..."
                                    className="w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm shadow-inner focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-700"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            {search && (
                                <Link
                                    href={route('presensi.siswa.index')}
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
                                <thead className="bg-gradient-to-r from-teal-50 to-cyan-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            NIS
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Siswa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jam Masuk
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jam Keluar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {presensi.data.length > 0 ? (
                                        presensi.data.map((item, index) => (
                                            <tr key={item.id} className="transition hover:bg-teal-50/40">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {(presensi.current_page - 1) * presensi.per_page + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(item.tanggal)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.siswa?.nis || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.siswa?.nama_lengkap || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.kelas?.nama_kelas || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {formatTime(item.jam_masuk)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {formatTime(item.jam_keluar)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route('presensi.siswa.edit', item.id)}
                                                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-100 hover:text-blue-900"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(item.id, item.siswa?.nama_lengkap || '')}
                                                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 hover:text-red-900"
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
                                                Tidak ada data presensi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {presensi.data.length > 0 && (
                            <div className="flex justify-between items-center border-t border-gray-200 bg-white px-6 py-3">
                                <div className="text-sm text-gray-700">
                                    Menampilkan <span className="font-medium">{(presensi.current_page - 1) * presensi.per_page + 1}</span> hingga{' '}
                                    <span className="font-medium">{Math.min(presensi.current_page * presensi.per_page, presensi.total)}</span> dari{' '}
                                    <span className="font-medium">{presensi.total}</span> data
                                </div>
                                <div className="flex space-x-2">
                                    {presensi.links.map((link, index) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`rounded-lg px-3 py-1 text-sm ${
                                                    link.active
                                                        ? 'bg-teal-600 text-white'
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
