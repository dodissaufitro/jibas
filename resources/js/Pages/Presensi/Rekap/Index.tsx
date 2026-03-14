import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Rekap {
    siswa_id: number;
    nis: string;
    nama_lengkap: string;
    kelas_id: number;
    nama_kelas: string;
    total_hadir: number;
    total_izin: number;
    total_sakit: number;
    total_alpha: number;
    total_hari: number;
    persentase_kehadiran: number;
}

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface Summary {
    total_siswa: number;
    rata_rata_kehadiran: number;
    total_hadir: number;
    total_izin: number;
    total_sakit: number;
    total_alpha: number;
}

interface Props {
    rekap: Rekap[];
    kelasList: Kelas[];
    bulanList: Array<{ value: string; label: string }>;
    tahunList: number[];
    filters: {
        bulan: string;
        tahun: string;
        kelas_id?: number;
    };
    summary: Summary;
}

export default function Index({ rekap, kelasList, bulanList, tahunList, filters, summary }: Props) {
    const [selectedBulan, setSelectedBulan] = useState(filters.bulan);
    const [selectedTahun, setSelectedTahun] = useState(filters.tahun);
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas_id?.toString() || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            const params: any = {
                bulan: selectedBulan,
                tahun: selectedTahun,
            };
            if (selectedKelas) {
                params.kelas_id = selectedKelas;
            }
            router.get(route('presensi.rekap'), params, { preserveState: true });
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedBulan, selectedTahun, selectedKelas]);

    const getPersentaseBadge = (persentase: number) => {
        if (persentase >= 90) return 'bg-green-100 text-green-800 border-green-200';
        if (persentase >= 75) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (persentase >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    const handleGenerateRekap = () => {
        if (confirm(`Generate rekap presensi untuk ${bulanList.find(b => b.value === selectedBulan)?.label} ${selectedTahun}?`)) {
            router.post(route('presensi.rekap.generate'), {
                bulan: selectedBulan,
                tahun: selectedTahun,
                kelas_id: selectedKelas || null,
            });
        }
    };

    return (
        <SidebarLayout>
            <Head title="Rekap Presensi Siswa" />

            <div className="relative py-6 sm:py-8">
                {/* Floating Blur Orbs Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-purple-300/40 blur-3xl" />
                    <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Hero Banner */}
                    <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 p-6 text-white shadow-[0_25px_80px_-30px_rgba(139,92,246,0.75)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight">
                                    📊 Rekap Presensi Siswa
                                </h1>
                                <p className="mt-2 text-base text-white/80">
                                    Laporan rekapitulasi kehadiran siswa per bulan
                                </p>
                            </div>
                            <div className="hidden sm:block">
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="h-20 w-20 text-white/20"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-6 shadow-xl">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="rounded-xl bg-green-500 p-3">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Hadir
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {summary.total_hadir}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-6 shadow-xl">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="rounded-xl bg-blue-500 p-3">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Izin
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {summary.total_izin}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-6 shadow-xl">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="rounded-xl bg-yellow-500 p-3">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Sakit
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {summary.total_sakit}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-6 shadow-xl">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="rounded-xl bg-red-500 p-3">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Alpha
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {summary.total_alpha}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Actions */}
                    <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-6 shadow-xl">
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bulan
                                </label>
                                <select
                                    value={selectedBulan}
                                    onChange={(e) => setSelectedBulan(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {bulanList.map((bulan) => (
                                        <option key={bulan.value} value={bulan.value}>
                                            {bulan.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tahun
                                </label>
                                <select
                                    value={selectedTahun}
                                    onChange={(e) => setSelectedTahun(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {tahunList.map((tahun) => (
                                        <option key={tahun} value={tahun}>
                                            {tahun}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kelas
                                </label>
                                <select
                                    value={selectedKelas}
                                    onChange={(e) => setSelectedKelas(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasList.map((kelas) => (
                                        <option key={kelas.id} value={kelas.id}>
                                            {kelas.nama_kelas}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <button
                                    onClick={handleGenerateRekap}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg
                                        className="h-5 w-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Generate Rekap
                                </button>
                            </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    Total Siswa: <span className="font-semibold text-gray-900">{summary.total_siswa}</span>
                                </span>
                                <span className="text-gray-600">
                                    Rata-rata Kehadiran:{' '}
                                    <span className="font-semibold text-gray-900">
                                        {summary.rata_rata_kehadiran.toFixed(1)}%
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            NIS
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Nama Siswa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Hadir
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Izin
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Sakit
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Alpha
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Kehadiran
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/50 divide-y divide-gray-200">
                                    {rekap.length === 0 ? (
                                        <tr>
                                            <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <svg
                                                        className="h-12 w-12 text-gray-400 mb-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                    <p>Tidak ada data rekap presensi untuk periode ini</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        rekap.map((item, index) => (
                                            <tr key={item.siswa_id} className="hover:bg-indigo-50/50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {item.nis}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.nama_lengkap}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.nama_kelas}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {item.total_hadir}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {item.total_izin}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        {item.total_sakit}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        {item.total_alpha}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900">
                                                    {item.total_hari}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPersentaseBadge(
                                                            item.persentase_kehadiran
                                                        )}`}
                                                    >
                                                        {item.persentase_kehadiran}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    <Link
                                                        href={route('presensi.rekap.show', {
                                                            siswaId: item.siswa_id,
                                                            bulan: selectedBulan,
                                                            tahun: selectedTahun,
                                                        })}
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
