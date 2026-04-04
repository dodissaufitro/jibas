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

interface MataPelajaran {
    id: number;
    nama: string;
    kode?: string;
    kkm?: number;
}

interface Siswa {
    id: number;
    nis: string;
    nama_lengkap: string;
}

interface NilaiRow {
    nilai_harian?: number | null;
    nilai_uts?: number | null;
    nilai_uas?: number | null;
    nilai_praktik?: number | null;
    nilai_akhir?: number | null;
    nilai_sikap?: string | null;
    catatan?: string | null;
}

interface NilaiData {
    siswa: Siswa;
    nilai: NilaiRow | null;
}

interface Props {
    kelas: Kelas[];
    semester: Semester[];
    mataPelajaran: MataPelajaran[];
    nilaiData: NilaiData[];
    selectedKelas: Kelas | null;
    selectedSemester: Semester | null;
    selectedMapel: MataPelajaran | null;
    filters: {
        kelas_id?: string | null;
        semester_id?: string | null;
        mata_pelajaran_id?: string | null;
    };
}

export default function Index({
    kelas, semester, mataPelajaran, nilaiData,
    selectedKelas, selectedSemester, selectedMapel, filters
}: Props) {
    const [kelasId, setKelasId] = useState(filters.kelas_id || '');
    const [semesterId, setSemesterId] = useState(filters.semester_id || '');
    const [mapelId, setMapelId] = useState(filters.mata_pelajaran_id || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('akademik.nilai'), {
            kelas_id: kelasId,
            semester_id: semesterId,
            mata_pelajaran_id: mapelId,
        }, { preserveState: true });
    };

    const getNilaiBadge = (nilai: number | null | undefined) => {
        if (nilai === null || nilai === undefined) return 'text-slate-400';
        if (nilai >= 90) return 'text-emerald-700 font-semibold';
        if (nilai >= 75) return 'text-blue-700 font-semibold';
        if (nilai >= 60) return 'text-amber-700 font-semibold';
        return 'text-red-700 font-semibold';
    };

    const getSikapBadge = (sikap: string | null | undefined) => {
        const map: Record<string, string> = {
            A: 'bg-emerald-100 text-emerald-800',
            B: 'bg-blue-100 text-blue-800',
            C: 'bg-amber-100 text-amber-800',
            D: 'bg-red-100 text-red-800',
        };
        return sikap ? map[sikap] || 'bg-gray-100 text-gray-800' : '';
    };

    const isFiltered = selectedKelas && selectedSemester && selectedMapel;
    const inputUrl = isFiltered
        ? route('akademik.nilai.input') + `?kelas_id=${kelasId}&semester_id=${semesterId}&mata_pelajaran_id=${mapelId}`
        : route('akademik.nilai.input');

    return (
        <SidebarLayout>
            <Head title="Penilaian Siswa" />

            <div className="relative py-6 sm:py-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-teal-300/40 blur-3xl" />
                    <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Hero Banner */}
                    <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-teal-800 via-emerald-700 to-cyan-800 p-6 text-white shadow-[0_25px_80px_-30px_rgba(20,184,166,0.75)]">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
                                    Akademik Module
                                </p>
                                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Penilaian Siswa</h2>
                                <p className="mt-2 max-w-xl text-sm text-teal-100">
                                    Lihat dan kelola nilai siswa per mata pelajaran. Pilih filter di bawah untuk menampilkan data.
                                </p>
                            </div>
                            {isFiltered && (
                                <Link
                                    href={inputUrl}
                                    className="inline-flex items-center justify-center rounded-xl border border-teal-200/40 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 whitespace-nowrap"
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Input Nilai
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                        <form onSubmit={handleFilter} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Kelas</label>
                                <select
                                    value={kelasId}
                                    onChange={(e) => setKelasId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                                >
                                    <option value="">-- Pilih Kelas --</option>
                                    {kelas.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.nama_kelas}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Semester</label>
                                <select
                                    value={semesterId}
                                    onChange={(e) => setSemesterId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                                >
                                    <option value="">-- Pilih Semester --</option>
                                    {semester.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.tahun_ajaran?.tahun} — Semester {s.semester}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Mata Pelajaran</label>
                                <select
                                    value={mapelId}
                                    onChange={(e) => setMapelId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                                >
                                    <option value="">-- Pilih Mapel --</option>
                                    {mataPelajaran.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-teal-700"
                                >
                                    Tampilkan
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Selected Info */}
                    {isFiltered && (
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-sm font-medium text-teal-800">
                                Kelas: {selectedKelas.nama_kelas}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-sm font-medium text-emerald-800">
                                {selectedSemester.tahun_ajaran?.tahun} — Semester {selectedSemester.semester}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-sm font-medium text-cyan-800">
                                {selectedMapel.nama} {selectedMapel.kkm ? `(KKM: ${selectedMapel.kkm})` : ''}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
                                {nilaiData.length} siswa
                            </span>
                        </div>
                    )}

                    {/* Table */}
                    {isFiltered ? (
                        nilaiData.length > 0 ? (
                            <div className="rounded-2xl border border-white/70 bg-white/85 shadow-[0_25px_65px_-35px_rgba(15,23,42,0.45)] backdrop-blur overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-100">
                                        <thead className="bg-slate-50/80">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">No</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">NIS</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Siswa</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Harian</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">UTS</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">UAS</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Praktik</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Akhir</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Sikap</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {nilaiData.map((row, index) => (
                                                <tr key={row.siswa.id} className="hover:bg-teal-50/40 transition-colors">
                                                    <td className="px-4 py-3 text-sm text-slate-500">{index + 1}</td>
                                                    <td className="px-4 py-3 text-sm font-mono text-slate-600">{row.siswa.nis}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.siswa.nama_lengkap}</td>
                                                    <td className={`px-4 py-3 text-sm text-center ${getNilaiBadge(row.nilai?.nilai_harian)}`}>
                                                        {row.nilai?.nilai_harian ?? <span className="text-slate-300">—</span>}
                                                    </td>
                                                    <td className={`px-4 py-3 text-sm text-center ${getNilaiBadge(row.nilai?.nilai_uts)}`}>
                                                        {row.nilai?.nilai_uts ?? <span className="text-slate-300">—</span>}
                                                    </td>
                                                    <td className={`px-4 py-3 text-sm text-center ${getNilaiBadge(row.nilai?.nilai_uas)}`}>
                                                        {row.nilai?.nilai_uas ?? <span className="text-slate-300">—</span>}
                                                    </td>
                                                    <td className={`px-4 py-3 text-sm text-center ${getNilaiBadge(row.nilai?.nilai_praktik)}`}>
                                                        {row.nilai?.nilai_praktik ?? <span className="text-slate-300">—</span>}
                                                    </td>
                                                    <td className={`px-4 py-3 text-sm text-center ${getNilaiBadge(row.nilai?.nilai_akhir)}`}>
                                                        {row.nilai?.nilai_akhir ?? <span className="text-slate-300">—</span>}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {row.nilai?.nilai_sikap ? (
                                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getSikapBadge(row.nilai.nilai_sikap)}`}>
                                                                {row.nilai.nilai_sikap}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-300">—</span>
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
                                <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="mt-4 text-sm text-slate-500">Belum ada siswa aktif di kelas ini.</p>
                                <Link href={inputUrl} className="mt-4 inline-flex items-center text-sm text-teal-600 hover:text-teal-700 font-medium">
                                    Input nilai sekarang →
                                </Link>
                            </div>
                        )
                    ) : (
                        <div className="rounded-2xl border border-white/70 bg-white/80 p-16 text-center shadow backdrop-blur">
                            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                            <p className="mt-4 text-sm text-slate-500">Pilih kelas, semester, dan mata pelajaran untuk melihat data nilai.</p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
