import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface SoalUjian {
    id: number;
    nomor_soal: number;
    pertanyaan: string;
    opsi_a: string;
    opsi_b: string;
    opsi_c: string;
    opsi_d: string;
    opsi_e: string | null;
    jawaban_benar: string;
    pembahasan: string | null;
    bobot: number;
}

interface Jawaban {
    jawaban: string;
    jawaban_essay: string | null;
    is_benar: boolean;
    nilai: number;
    soal_ujian: SoalUjian;
}

interface MataPelajaran {
    nama: string;
}

interface Guru {
    nama_lengkap: string;
}

interface Ujian {
    id: number;
    judul_ujian: string;
    jenis_ujian: string;
    durasi_menit: number;
    kkm: number;
    mata_pelajaran: MataPelajaran;
    guru: Guru;
}

interface Siswa {
    nama_lengkap: string;
    nis: string;
}

interface UjianSiswa {
    id: number;
    nilai: number;
    jumlah_benar: number;
    jumlah_salah: number;
    jumlah_kosong: number;
    waktu_mulai: string;
    waktu_selesai: string;
    durasi_pengerjaan: number;
    ujian: Ujian;
    siswa: Siswa;
    jawaban: Jawaban[];
}

interface Props {
    ujianSiswa: UjianSiswa;
}

export default function Hasil({ ujianSiswa }: Props) {
    const isLulus = ujianSiswa.nilai >= ujianSiswa.ujian.kkm;
    const totalSoal = ujianSiswa.jumlah_benar + ujianSiswa.jumlah_salah + ujianSiswa.jumlah_kosong;
    const persentaseBenar = totalSoal > 0 ? ((ujianSiswa.jumlah_benar / totalSoal) * 100).toFixed(1) : 0;

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

    const getOpsiLabel = (soal: SoalUjian, opsi: string): string => {
        const key = `opsi_${opsi.toLowerCase()}` as keyof SoalUjian;
        return soal[key] as string || '';
    };

    return (
        <SidebarLayout>
            <Head title={`Hasil Ujian - ${ujianSiswa.ujian.judul_ujian}`} />

            <div className="relative py-6 sm:py-8">
                {/* Floating Blur Orbs Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 left-10 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />
                    <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Hero Result Banner */}
                    <div className={`rounded-3xl border border-white/60 p-8 text-white shadow-[0_25px_80px_-30px_rgba(99,102,241,0.75)] ${
                        isLulus
                            ? 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600'
                            : 'bg-gradient-to-br from-red-600 via-rose-600 to-pink-600'
                    }`}>
                        <div className="text-center">
                            {isLulus ? (
                                <svg className="mx-auto h-20 w-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="mx-auto h-20 w-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            <h2 className="text-3xl font-bold mb-2">
                                {isLulus ? 'Selamat! Anda Lulus' : 'Anda Belum Mencapai KKM'}
                            </h2>
                            <p className="text-lg mb-6 text-white/90">{ujianSiswa.ujian.judul_ujian}</p>
                            <div className="inline-flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-6xl font-bold">{ujianSiswa.nilai.toFixed(2)}</p>
                                    <p className="text-sm text-white/80 mt-2">KKM: {ujianSiswa.ujian.kkm}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="rounded-2xl border border-green-100 bg-white/80 p-5 shadow-[0_18px_40px_-24px_rgba(34,197,94,0.55)] backdrop-blur">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-full bg-green-100 p-3">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Benar</p>
                                    <p className="text-2xl font-bold text-slate-900">{ujianSiswa.jumlah_benar}</p>
                                    <p className="text-xs text-gray-500">{persentaseBenar}%</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-red-100 bg-white/80 p-5 shadow-[0_18px_40px_-24px_rgba(239,68,68,0.55)] backdrop-blur">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-full bg-red-100 p-3">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Salah</p>
                                    <p className="text-2xl font-bold text-slate-900">{ujianSiswa.jumlah_salah}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-[0_18px_40px_-24px_rgba(75,85,99,0.55)] backdrop-blur">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-full bg-gray-100 p-3">
                                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tidak Dijawab</p>
                                    <p className="text-2xl font-bold text-slate-900">{ujianSiswa.jumlah_kosong}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-blue-100 bg-white/80 p-5 shadow-[0_18px_40px_-24px_rgba(59,130,246,0.55)] backdrop-blur">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-full bg-blue-100 p-3">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Durasi</p>
                                    <p className="text-2xl font-bold text-slate-900">{ujianSiswa.durasi_pengerjaan}</p>
                                    <p className="text-xs text-gray-500">menit</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detail Info */}
                    <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Detail Ujian</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Mata Pelajaran</p>
                                <p className="font-semibold text-slate-900">{ujianSiswa.ujian.mata_pelajaran.nama}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Guru</p>
                                <p className="font-semibold text-slate-900">{ujianSiswa.ujian.guru.nama_lengkap}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Nama Siswa</p>
                                <p className="font-semibold text-slate-900">{ujianSiswa.siswa.nama_lengkap}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">NIS</p>
                                <p className="font-semibold text-slate-900">{ujianSiswa.siswa.nis}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Waktu Mulai</p>
                                <p className="font-semibold text-slate-900">{formatDate(ujianSiswa.waktu_mulai)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Waktu Selesai</p>
                                <p className="font-semibold text-slate-900">{formatDate(ujianSiswa.waktu_selesai)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pembahasan */}
                    <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Pembahasan Soal</h3>
                        <div className="space-y-4">
                            {ujianSiswa.jawaban.map((jawaban, index) => (
                                <div
                                    key={jawaban.soal_ujian.id}
                                    className={`rounded-xl border-2 p-4 ${
                                        jawaban.is_benar
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-red-200 bg-red-50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                                {jawaban.soal_ujian.nomor_soal}
                                            </span>
                                            {jawaban.is_benar ? (
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                                    <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Benar
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                                                    <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Salah
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-600">Bobot: {jawaban.soal_ujian.bobot} poin</span>
                                    </div>

                                    <div className="mb-3">
                                        <div className="prose max-w-none text-slate-900" dangerouslySetInnerHTML={{ __html: jawaban.soal_ujian.pertanyaan }} />
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start space-x-2">
                                            <span className="font-semibold text-gray-700">Jawaban Anda:</span>
                                            <span className={`font-semibold ${jawaban.is_benar ? 'text-green-700' : 'text-red-700'}`}>
                                                {jawaban.jawaban} - {getOpsiLabel(jawaban.soal_ujian, jawaban.jawaban)}
                                            </span>
                                        </div>
                                        {!jawaban.is_benar && (
                                            <div className="flex items-start space-x-2">
                                                <span className="font-semibold text-gray-700">Jawaban Benar:</span>
                                                <span className="font-semibold text-green-700">
                                                    {jawaban.soal_ujian.jawaban_benar} - {getOpsiLabel(jawaban.soal_ujian, jawaban.soal_ujian.jawaban_benar)}
                                                </span>
                                            </div>
                                        )}
                                        {jawaban.soal_ujian.pembahasan && (
                                            <div className="mt-3 rounded-lg bg-blue-50 p-3 border border-blue-200">
                                                <p className="font-semibold text-blue-900 mb-1">Pembahasan:</p>
                                                <p className="text-blue-800">{jawaban.soal_ujian.pembahasan}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center">
                        <Link
                            href={route('siswa.ujian.index')}
                            className="inline-flex items-center rounded-xl bg-indigo-600 px-8 py-3 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-700"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Daftar Ujian
                        </Link>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
