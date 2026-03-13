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
    status_pengerjaan: 'belum_mulai' | 'sedang_mengerjakan' | 'selesai';
    nilai: number | null;
    waktu_mulai: string | null;
    waktu_selesai: string | null;
    ujian_siswa_id: number | null;
}

interface Siswa {
    id: number;
    nama_lengkap: string;
    nis: string;
}

interface Props {
    ujian: Ujian[];
    siswa: Siswa;
}

export default function Index({ ujian, siswa }: Props) {
    const [kodeUjian, setKodeUjian] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleAksesKode = (e: React.FormEvent) => {
        e.preventDefault();
        if (!kodeUjian.trim()) return;
        
        setIsSubmitting(true);
        const form = e.target as HTMLFormElement;
        form.submit();
    };

    const getJenisUjianBadge = (jenis: string) => {
        const badges: Record<string, string> = {
            UTS: 'bg-blue-100 text-blue-800 border-blue-200',
            UAS: 'bg-purple-100 text-purple-800 border-purple-200',
            Harian: 'bg-green-100 text-green-800 border-green-200',
            Quiz: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Praktek: 'bg-pink-100 text-pink-800 border-pink-200',
            Tugas: 'bg-orange-100 text-orange-800 border-orange-200',
            Lainnya: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return badges[jenis] || badges['Lainnya'];
    };

    const getStatusPengerjaanBadge = (status: string) => {
        const badges: Record<string, string> = {
            belum_mulai: 'bg-gray-100 text-gray-800 border-gray-200',
            sedang_mengerjakan: 'bg-blue-100 text-blue-800 border-blue-200',
            selesai: 'bg-green-100 text-green-800 border-green-200',
        };
        return badges[status] || badges['belum_mulai'];
    };

    const getStatusPengerjaanText = (status: string) => {
        const text: Record<string, string> = {
            belum_mulai: 'Belum Dikerjakan',
            sedang_mengerjakan: 'Sedang Dikerjakan',
            selesai: 'Selesai',
        };
        return text[status] || 'Belum Dikerjakan';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getNilaiColor = (nilai: number, kkm: number) => {
        if (nilai >= kkm) return 'text-green-600 font-bold';
        return 'text-red-600 font-bold';
    };

    return (
        <SidebarLayout>
            <Head title="Ujian Saya" />

            <div className="relative py-6 sm:py-8">
                {/* Floating Blur Orbs Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 left-10 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />
                    <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Hero Banner */}
                    <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 p-6 text-white shadow-[0_25px_80px_-30px_rgba(99,102,241,0.75)]">
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
                                    Ujian Module
                                </p>
                                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Ujian Saya</h2>
                                <p className="mt-2 text-sm text-indigo-100">
                                    Daftar ujian yang tersedia untuk Anda
                                </p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <div>
                                    <span className="text-white/70">Nama:</span>
                                    <span className="ml-2 font-semibold">{siswa.nama_lengkap}</span>
                                </div>
                                <div>
                                    <span className="text-white/70">NIS:</span>
                                    <span className="ml-2 font-semibold">{siswa.nis}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access - Input Kode Ujian */}
                    <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                        <div className="flex items-center mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-bold text-slate-900">Akses Cepat Ujian</h3>
                                <p className="text-sm text-gray-600">Masukkan nomor ujian untuk langsung memulai</p>
                            </div>
                        </div>
                        <form onSubmit={handleAksesKode} action={route('siswa.ujian.akses-kode')} method="POST" className="flex gap-3">
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                            <input
                                type="text"
                                name="kode_ujian"
                                value={kodeUjian}
                                onChange={(e) => setKodeUjian(e.target.value)}
                                placeholder="Contoh: 1, 2, 3"
                                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-slate-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !kodeUjian.trim()}
                                className="inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memuat...
                                    </>
                                ) : (
                                    <>
                                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Mulai Ujian
                                    </>
                                )}
                            </button>
                        </form>
                        <p className="mt-3 text-xs text-gray-500">
                            💡 <span className="font-semibold">Tips:</span> Nomor ujian dapat dilihat pada kartu ujian di bawah atau dari pengumuman guru Anda
                        </p>
                    </div>

                    {/* Ujian List */}
                    {ujian.length === 0 ? (
                        <div className="rounded-2xl border border-white/70 bg-white/85 p-12 shadow-[0_25px_65px_-35px_rgba(15,23,42,0.45)] backdrop-blur text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Belum Ada Ujian</h3>
                            <p className="mt-2 text-sm text-gray-500">Tidak ada ujian yang tersedia untuk saat ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {ujian.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)]"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                                                    #{item.id}
                                                </span>
                                                <span className={`inline-flex items-center border px-3 py-1 rounded-full text-xs font-semibold ${getJenisUjianBadge(item.jenis_ujian)}`}>
                                                    {item.jenis_ujian}
                                                </span>
                                                <span className={`inline-flex items-center border px-3 py-1 rounded-full text-xs font-semibold ${getStatusPengerjaanBadge(item.status_pengerjaan)}`}>
                                                    {getStatusPengerjaanText(item.status_pengerjaan)}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.judul_ujian}</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Mata Pelajaran</p>
                                                    <p className="font-semibold text-slate-900">{item.mata_pelajaran.nama}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Guru</p>
                                                    <p className="font-semibold text-slate-900">{item.guru.nama_lengkap}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Durasi</p>
                                                    <p className="font-semibold text-slate-900">{item.durasi_menit} menit</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">KKM</p>
                                                    <p className="font-semibold text-slate-900">{item.kkm}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-sm">
                                                <p className="text-gray-500">
                                                    <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(item.tanggal_ujian)}
                                                </p>
                                            </div>
                                            {item.status_pengerjaan === 'selesai' && item.nilai !== null && (
                                                <div className="mt-3 flex items-center space-x-4">
                                                    <div>
                                                        <span className="text-gray-500 text-sm">Nilai: </span>
                                                        <span className={`text-2xl ${getNilaiColor(item.nilai, item.kkm)}`}>
                                                            {item.nilai.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col space-y-2 lg:ml-6">
                                            {item.status_pengerjaan === 'belum_mulai' && (
                                                <Link
                                                    href={route('siswa.ujian.mulai', item.id)}
                                                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-700"
                                                >
                                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Mulai Ujian
                                                </Link>
                                            )}
                                            {item.status_pengerjaan === 'sedang_mengerjakan' && item.ujian_siswa_id && (
                                                <Link
                                                    href={route('siswa.ujian.kerjakan', item.ujian_siswa_id)}
                                                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
                                                >
                                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Lanjutkan
                                                </Link>
                                            )}
                                            {item.status_pengerjaan === 'selesai' && item.ujian_siswa_id && (
                                                <Link
                                                    href={route('siswa.ujian.hasil', item.ujian_siswa_id)}
                                                    className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-green-700"
                                                >
                                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Lihat Hasil
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
