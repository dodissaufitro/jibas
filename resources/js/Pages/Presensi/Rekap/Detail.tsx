import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Siswa {
    id: number;
    nis: string;
    nama_lengkap: string;
    kelas: {
        nama_kelas: string;
    };
}

interface Presensi {
    id: number;
    tanggal: string;
    status: 'hadir' | 'izin' | 'sakit' | 'alpha';
    jam_masuk: string | null;
    jam_keluar: string | null;
    keterangan: string | null;
}

interface Summary {
    total_hadir: number;
    total_izin: number;
    total_sakit: number;
    total_alpha: number;
    total_hari: number;
    persentase_kehadiran: number;
}

interface Props {
    siswa: Siswa;
    presensi: Presensi[];
    summary: Summary;
    bulan: string;
    tahun: string;
}

export default function Detail({ siswa, presensi, summary, bulan, tahun }: Props) {
    const getStatusBadge = (status: string) => {
        const badges = {
            hadir: 'bg-green-100 text-green-800 border-green-200',
            izin: 'bg-blue-100 text-blue-800 border-blue-200',
            sakit: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            alpha: 'bg-red-100 text-red-800 border-red-200',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            hadir: 'Hadir',
            izin: 'Izin',
            sakit: 'Sakit',
            alpha: 'Alpha',
        };
        return labels[status as keyof typeof labels] || status;
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

    const bulanList = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
    ];

    const namaBulan = bulanList[parseInt(bulan) - 1];

    return (
        <SidebarLayout>
            <Head title={`Detail Presensi - ${siswa.nama_lengkap}`} />

            <div className="relative py-6 sm:py-8">
                {/* Floating Blur Orbs Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-purple-300/40 blur-3xl" />
                    <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Back Button */}
                    <div>
                        <Link
                            href={route('presensi.rekap')}
                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            <svg
                                className="mr-2 h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Kembali ke Rekap
                        </Link>
                    </div>

                    {/* Hero Banner */}
                    <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 p-6 text-white shadow-[0_25px_80px_-30px_rgba(139,92,246,0.75)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight">
                                    Detail Presensi Siswa
                                </h1>
                                <p className="mt-2 text-base text-white/80">
                                    {siswa.nama_lengkap} - {siswa.kelas.nama_kelas}
                                </p>
                                <p className="text-sm text-white/70">
                                    Periode: {namaBulan} {tahun}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Student Info Card */}
                    <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-6 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">NIS</p>
                                <p className="text-lg font-semibold text-gray-900">{siswa.nis}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Nama Lengkap</p>
                                <p className="text-lg font-semibold text-gray-900">{siswa.nama_lengkap}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Kelas</p>
                                <p className="text-lg font-semibold text-gray-900">{siswa.kelas.nama_kelas}</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-4 shadow-xl">
                            <div className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
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
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{summary.total_hadir}</p>
                                <p className="text-xs text-gray-500">Hadir</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-4 shadow-xl">
                            <div className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
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
                                <p className="text-2xl font-bold text-gray-900">{summary.total_izin}</p>
                                <p className="text-xs text-gray-500">Izin</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-4 shadow-xl">
                            <div className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500">
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
                                <p className="text-2xl font-bold text-gray-900">{summary.total_sakit}</p>
                                <p className="text-xs text-gray-500">Sakit</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-4 shadow-xl">
                            <div className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500">
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
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{summary.total_alpha}</p>
                                <p className="text-xs text-gray-500">Alpha</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-4 shadow-xl">
                            <div className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-500">
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
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{summary.total_hari}</p>
                                <p className="text-xs text-gray-500">Total Hari</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm p-4 shadow-xl">
                            <div className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
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
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{summary.persentase_kehadiran}%</p>
                                <p className="text-xs text-gray-500">Kehadiran</p>
                            </div>
                        </div>
                    </div>

                    {/* Presensi Detail Table */}
                    <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-sm shadow-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                            <h2 className="text-lg font-semibold text-gray-900">Riwayat Presensi</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Jam Masuk
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Jam Keluar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/50 divide-y divide-gray-200">
                                    {presensi.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                Tidak ada data presensi untuk periode ini
                                            </td>
                                        </tr>
                                    ) : (
                                        presensi.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-indigo-50/50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(item.tanggal)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(item.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                    {formatTime(item.jam_masuk)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                    {formatTime(item.jam_keluar)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {item.keterangan || '-'}
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
