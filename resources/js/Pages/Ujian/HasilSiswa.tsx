import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface MataPelajaran {
    nama: string;
}

interface Guru {
    nama_lengkap: string;
}

interface Kelas {
    nama_kelas: string;
}

interface Ujian {
    id: number;
    judul_ujian: string;
    jenis_ujian: string;
    tanggal_ujian: string;
    durasi_menit: number;
    bobot: number;
    kkm: number;
    status: string;
    mata_pelajaran: MataPelajaran;
    guru: Guru;
    kelas: Kelas;
}

interface Siswa {
    id: number;
    nama_lengkap: string;
    nis: string;
    kelas: {
        nama_kelas: string;
    };
}

interface UjianSiswa {
    id: number;
    siswa: Siswa;
    waktu_mulai: string | null;
    waktu_selesai: string | null;
    durasi_pengerjaan: number | null;
    nilai: number | null;
    jumlah_benar: number | null;
    jumlah_salah: number | null;
    jumlah_kosong: number | null;
    status: string;
}

interface Stats {
    total_siswa: number;
    selesai: number;
    sedang_mengerjakan: number;
    belum_mulai: number;
    rata_rata: number;
    lulus: number;
    tidak_lulus: number;
    nilai_tertinggi: number;
    nilai_terendah: number;
}

interface Props {
    ujian: Ujian;
    ujianSiswa: UjianSiswa[];
    stats: Stats;
}

export default function HasilSiswa({ ujian, ujianSiswa, stats }: Props) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDurasi = (menit: number | null) => {
        if (!menit) return '-';
        const hours = Math.floor(menit / 60);
        const mins = menit % 60;
        if (hours > 0) {
            return `${hours} jam ${mins} menit`;
        }
        return `${mins} menit`;
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            belum_mulai: 'bg-gray-100 text-gray-800 border-gray-200',
            sedang_mengerjakan: 'bg-blue-100 text-blue-800 border-blue-200',
            selesai: 'bg-green-100 text-green-800 border-green-200',
        };
        return badges[status] || badges['belum_mulai'];
    };

    const getStatusText = (status: string) => {
        const text: Record<string, string> = {
            belum_mulai: 'Belum Mulai',
            sedang_mengerjakan: 'Sedang Mengerjakan',
            selesai: 'Selesai',
        };
        return text[status] || 'Belum Mulai';
    };

    const getNilaiColor = (nilai: number | null, kkm: number) => {
        if (nilai === null) return 'text-gray-400';
        if (nilai >= kkm) return 'text-green-600 font-bold';
        return 'text-red-600 font-bold';
    };

    return (
        <SidebarLayout>
            <Head title={`Hasil Ujian - ${ujian.judul_ujian}`} />

            <div className="py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Header with Back Button */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('ujian.index')}
                                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Kembali
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Hasil Ujian Per Siswa</h1>
                                <p className="text-sm text-gray-600">Kode Ujian: #{ujian.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ujian Info Card */}
                    <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                                        {ujian.jenis_ujian}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                                        KKM: {ujian.kkm}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold mb-3">{ujian.judul_ujian}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-white/70">Mata Pelajaran</p>
                                        <p className="font-semibold">{ujian.mata_pelajaran.nama}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/70">Guru</p>
                                        <p className="font-semibold">{ujian.guru.nama_lengkap}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/70">Kelas</p>
                                        <p className="font-semibold">{ujian.kelas.nama_kelas}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/70">Durasi</p>
                                        <p className="font-semibold">{ujian.durasi_menit} menit</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_siswa}</p>
                                    <p className="text-xs text-gray-600">Total Siswa</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.selesai}</p>
                                    <p className="text-xs text-gray-600">Selesai</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.rata_rata.toFixed(2)}</p>
                                    <p className="text-xs text-gray-600">Rata-rata</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600">{stats.lulus}</p>
                                    <p className="text-xs text-gray-600">Lulus</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                    <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-red-600">{stats.tidak_lulus}</p>
                                    <p className="text-xs text-gray-600">Tidak Lulus</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Students Results Table */}
                    <div className="rounded-2xl border border-white/70 bg-white shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Daftar Hasil Siswa</h3>
                            <p className="text-sm text-gray-600">Total {ujianSiswa.length} siswa mengikuti ujian ini</p>
                        </div>

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
                                            Nama Siswa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nilai
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Benar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Salah
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kosong
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Waktu Mulai
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Waktu Selesai
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Durasi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ujianSiswa.length === 0 ? (
                                        <tr>
                                            <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <p className="mt-2 text-sm">Belum ada siswa yang mengikuti ujian ini</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        ujianSiswa.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.siswa.nis}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.siswa.nama_lengkap}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(item.status)}`}>
                                                        {getStatusText(item.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-lg font-bold ${getNilaiColor(item.nilai, ujian.kkm)}`}>
                                                        {item.nilai !== null ? Number(item.nilai).toFixed(2) : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                                    {item.jumlah_benar ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                                                    {item.jumlah_salah ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                                                    {item.jumlah_kosong ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {formatDate(item.waktu_mulai)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {formatDate(item.waktu_selesai)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {formatDurasi(item.durasi_pengerjaan)}
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
