import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Jenjang { id: number; nama: string }
interface Jurusan { id: number; nama: string }
interface TahunAjaran { id: number; tahun: string }

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat: number;
    jenjang?: Jenjang;
    jurusan?: Jurusan;
}

interface Semester {
    id: number;
    semester: string;
    tahun_ajaran?: TahunAjaran;
}

interface Siswa {
    id: number;
    nis: string;
    nama_lengkap: string;
}

interface Raport {
    id: number;
    ranking?: number | null;
    rata_rata?: number | null;
    total_sakit: number;
    total_izin: number;
    total_alpha: number;
    is_published: boolean;
    tanggal_terbit?: string | null;
    catatan_wali_kelas?: string | null;
}

interface RaportData {
    siswa: Siswa;
    raport: Raport | null;
    jumlah_mapel: number;
    rata_rata: number | null;
}

interface Props {
    kelas: Kelas[];
    semester: Semester[];
    raportData: RaportData[];
    selectedKelas: Kelas | null;
    selectedSemester: Semester | null;
    filters: {
        kelas_id?: string | null;
        semester_id?: string | null;
    };
    flash?: { success?: string; error?: string };
}

export default function Index({
    kelas, semester, raportData,
    selectedKelas, selectedSemester, filters
}: Props) {
    const [kelasId, setKelasId] = useState(filters.kelas_id || '');
    const [semesterId, setSemesterId] = useState(filters.semester_id || '');
    const [generating, setGenerating] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('akademik.raport'), {
            kelas_id: kelasId,
            semester_id: semesterId,
        }, { preserveState: true });
    };

    const handleGenerate = () => {
        if (!confirm('Generate raport untuk semua siswa di kelas ini? Data yang sudah ada akan diperbarui.')) return;
        setGenerating(true);
        router.post(route('akademik.raport.generate'), {
            kelas_id: filters.kelas_id,
            semester_id: filters.semester_id,
        }, {
            onFinish: () => setGenerating(false),
        });
    };

    const handlePublish = () => {
        if (!confirm('Publikasikan semua raport untuk kelas ini? Siswa dan orang tua akan bisa melihat raport.')) return;
        setPublishing(true);
        router.post(route('akademik.raport.publish'), {
            kelas_id: filters.kelas_id,
            semester_id: filters.semester_id,
        }, {
            onFinish: () => setPublishing(false),
        });
    };

    const isFiltered = selectedKelas && selectedSemester;
    const isAllPublished = raportData.length > 0 && raportData.every((r) => r.raport?.is_published);
    const isAnyGenerated = raportData.some((r) => r.raport !== null);

    return (
        <SidebarLayout>
            <Head title="Raport Siswa" />

            <div className="relative py-6 sm:py-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-violet-300/40 blur-3xl" />
                    <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Hero */}
                    <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-violet-900 via-indigo-800 to-purple-900 p-6 text-white shadow-[0_25px_80px_-30px_rgba(109,40,217,0.75)]">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
                                    Akademik Module
                                </p>
                                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Raport Siswa</h2>
                                <p className="mt-2 max-w-xl text-sm text-violet-100">
                                    Generate, kelola, dan publikasikan raport siswa berdasarkan nilai yang telah diinputkan.
                                </p>
                            </div>
                            {isFiltered && isAnyGenerated && (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={generating}
                                        className="inline-flex items-center rounded-xl border border-violet-200/40 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25 disabled:opacity-60"
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        {generating ? 'Generating...' : 'Perbarui Raport'}
                                    </button>
                                    {!isAllPublished && (
                                        <button
                                            onClick={handlePublish}
                                            disabled={publishing}
                                            className="inline-flex items-center rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30 disabled:opacity-60"
                                        >
                                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {publishing ? 'Mempublikasikan...' : 'Publikasikan Semua'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow backdrop-blur">
                        <form onSubmit={handleFilter} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Kelas</label>
                                <select
                                    value={kelasId}
                                    onChange={(e) => setKelasId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                >
                                    <option value="">-- Pilih Kelas --</option>
                                    {kelas.map((k) => (
                                        <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Semester</label>
                                <select
                                    value={semesterId}
                                    onChange={(e) => setSemesterId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                >
                                    <option value="">-- Pilih Semester --</option>
                                    {semester.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.tahun_ajaran?.tahun} — Semester {s.semester}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-violet-700"
                                >
                                    Tampilkan
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Generate CTA if no raport yet */}
                    {isFiltered && raportData.length > 0 && !isAnyGenerated && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-amber-800">Raport belum di-generate</p>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    Pastikan nilai sudah diinput, lalu klik tombol di samping untuk men-generate raport secara otomatis.
                                </p>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-amber-700 disabled:opacity-60"
                            >
                                {generating ? 'Generating...' : 'Generate Raport'}
                            </button>
                        </div>
                    )}

                    {/* Table */}
                    {isFiltered ? (
                        raportData.length > 0 ? (
                            <div className="rounded-2xl border border-white/70 bg-white/85 shadow-[0_25px_65px_-35px_rgba(15,23,42,0.45)] backdrop-blur overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-100">
                                        <thead className="bg-slate-50/80">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ranking</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Siswa</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Mapel Dinilai</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Rata-Rata</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">S / I / A</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {raportData.map((row) => (
                                                <tr key={row.siswa.id} className="hover:bg-violet-50/40 transition-colors">
                                                    <td className="px-4 py-3 text-center">
                                                        {row.raport?.ranking ? (
                                                            <span className={`inline-flex items-center justify-center rounded-full w-7 h-7 text-xs font-bold ${
                                                                row.raport.ranking === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                                row.raport.ranking === 2 ? 'bg-slate-200 text-slate-700' :
                                                                row.raport.ranking === 3 ? 'bg-amber-100 text-amber-800' :
                                                                'bg-slate-50 text-slate-600'
                                                            }`}>
                                                                {row.raport.ranking}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-300 text-sm">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-sm font-medium text-slate-900">{row.siswa.nama_lengkap}</p>
                                                        <p className="text-xs text-slate-400 font-mono">{row.siswa.nis}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm text-slate-700">
                                                        {row.jumlah_mapel > 0 ? (
                                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">
                                                                {row.jumlah_mapel} mapel
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-300 text-xs">Belum ada nilai</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {row.raport?.rata_rata != null ? (
                                                            <span className={`text-sm font-semibold ${
                                                                row.raport.rata_rata >= 90 ? 'text-emerald-700' :
                                                                row.raport.rata_rata >= 75 ? 'text-blue-700' :
                                                                row.raport.rata_rata >= 60 ? 'text-amber-700' :
                                                                'text-red-700'
                                                            }`}>
                                                                {row.raport.rata_rata}
                                                            </span>
                                                        ) : row.rata_rata != null ? (
                                                            <span className="text-sm text-slate-500">{row.rata_rata}</span>
                                                        ) : (
                                                            <span className="text-slate-300 text-sm">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-xs text-slate-600">
                                                        {row.raport ? (
                                                            <span>
                                                                <span className="text-blue-600">{row.raport.total_sakit}</span>
                                                                {' / '}
                                                                <span className="text-amber-600">{row.raport.total_izin}</span>
                                                                {' / '}
                                                                <span className="text-red-600">{row.raport.total_alpha}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-300">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {row.raport?.is_published ? (
                                                            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">
                                                                Dipublikasikan
                                                            </span>
                                                        ) : row.raport ? (
                                                            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold">
                                                                Draft
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 text-xs">
                                                                Belum Generate
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {row.raport && (
                                                            <Link
                                                                href={route('akademik.raport.show', row.siswa.id) + `?semester_id=${filters.semester_id}&kelas_id=${filters.kelas_id}`}
                                                                className="inline-flex items-center text-xs font-medium text-violet-600 hover:text-violet-800 transition"
                                                            >
                                                                Lihat Detail →
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-white/70 bg-white/80 p-16 text-center shadow backdrop-blur">
                                <p className="text-sm text-slate-500">Tidak ada siswa aktif di kelas ini.</p>
                            </div>
                        )
                    ) : (
                        <div className="rounded-2xl border border-white/70 bg-white/80 p-16 text-center shadow backdrop-blur">
                            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="mt-4 text-sm text-slate-500">Pilih kelas dan semester untuk melihat data raport.</p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
