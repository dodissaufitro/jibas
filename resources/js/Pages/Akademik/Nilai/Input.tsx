import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
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

interface SiswaRow {
    id: number;
    nis: string;
    nama_lengkap: string;
    nilai_harian?: number | null;
    nilai_uts?: number | null;
    nilai_uas?: number | null;
    nilai_praktik?: number | null;
    nilai_akhir?: number | null;
    nilai_sikap?: string | null;
    catatan?: string | null;
    nilai_id?: number | null;
}

interface Props {
    kelas: Kelas[];
    semester: Semester[];
    mataPelajaran: MataPelajaran[];
    siswaWithNilai: SiswaRow[];
    selectedKelas: Kelas | null;
    selectedSemester: Semester | null;
    selectedMapel: MataPelajaran | null;
    guruId: number | null;
    filters: {
        kelas_id?: string | null;
        semester_id?: string | null;
        mata_pelajaran_id?: string | null;
    };
}

type NilaiEntry = {
    siswa_id: number;
    nilai_harian: string;
    nilai_uts: string;
    nilai_uas: string;
    nilai_praktik: string;
    nilai_sikap: string;
    catatan: string;
};

export default function Input({
    kelas, semester, mataPelajaran, siswaWithNilai,
    selectedKelas, selectedSemester, selectedMapel, guruId, filters
}: Props) {
    const [kelasId, setKelasId] = useState(filters.kelas_id || '');
    const [semesterId, setSemesterId] = useState(filters.semester_id || '');
    const [mapelId, setMapelId] = useState(filters.mata_pelajaran_id || '');

    // Build initial entries from existing nilai
    const initialEntries: NilaiEntry[] = siswaWithNilai.map((s) => ({
        siswa_id: s.id,
        nilai_harian: s.nilai_harian?.toString() ?? '',
        nilai_uts: s.nilai_uts?.toString() ?? '',
        nilai_uas: s.nilai_uas?.toString() ?? '',
        nilai_praktik: s.nilai_praktik?.toString() ?? '',
        nilai_sikap: s.nilai_sikap ?? '',
        catatan: s.catatan ?? '',
    }));

    const [entries, setEntries] = useState<NilaiEntry[]>(initialEntries);
    const [submitting, setSubmitting] = useState(false);

    const handleFilterChange = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('akademik.nilai.input'), {
            kelas_id: kelasId,
            semester_id: semesterId,
            mata_pelajaran_id: mapelId,
        }, { preserveState: false });
    };

    const updateEntry = (index: number, field: keyof NilaiEntry, value: string) => {
        setEntries((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const computeAkhir = (entry: NilaiEntry): string => {
        const parts = [
            entry.nilai_harian,
            entry.nilai_uts,
            entry.nilai_uas,
            entry.nilai_praktik,
        ].filter((v) => v !== '').map(Number);

        if (parts.length === 0) return '—';
        const avg = parts.reduce((a, b) => a + b, 0) / parts.length;
        return avg.toFixed(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guruId) {
            alert('Guru tidak terdeteksi. Pastikan ada jadwal pelajaran untuk kelas & mata pelajaran ini.');
            return;
        }
        setSubmitting(true);
        router.post(route('akademik.nilai.store'), {
            kelas_id: filters.kelas_id,
            semester_id: filters.semester_id,
            mata_pelajaran_id: filters.mata_pelajaran_id,
            guru_id: guruId,
            nilai: entries,
        }, {
            onFinish: () => setSubmitting(false),
        });
    };

    const isFiltered = selectedKelas && selectedSemester && selectedMapel;
    const backUrl = isFiltered
        ? route('akademik.nilai') + `?kelas_id=${filters.kelas_id}&semester_id=${filters.semester_id}&mata_pelajaran_id=${filters.mata_pelajaran_id}`
        : route('akademik.nilai');

    return (
        <SidebarLayout>
            <Head title="Input Nilai Siswa" />

            <div className="relative py-6 sm:py-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 left-10 h-56 w-56 rounded-full bg-teal-200/40 blur-3xl" />
                    <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="mb-2">
                        <Link
                            href={backUrl}
                            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4 transition"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali ke Daftar Nilai
                        </Link>
                        <h2 className="font-semibold text-2xl text-slate-900">Input Nilai Siswa</h2>
                        <p className="text-sm text-slate-600 mt-1">Isi nilai untuk seluruh siswa di kelas yang dipilih.</p>
                    </div>

                    {/* Filter selector */}
                    <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow backdrop-blur">
                        <form onSubmit={handleFilterChange} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Kelas</label>
                                <select
                                    value={kelasId}
                                    onChange={(e) => setKelasId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
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
                                        <option key={m.id} value={m.id}>{m.nama}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800"
                                >
                                    Pilih
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Input Table */}
                    {isFiltered && (
                        <>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-medium text-slate-700">
                                    {selectedKelas.nama_kelas}
                                </span>
                                <span className="text-slate-400">·</span>
                                <span className="text-sm text-slate-600">
                                    {selectedSemester.tahun_ajaran?.tahun} — Semester {selectedSemester.semester}
                                </span>
                                <span className="text-slate-400">·</span>
                                <span className="text-sm text-slate-600">
                                    {selectedMapel.nama}
                                    {selectedMapel.kkm ? ` (KKM: ${selectedMapel.kkm})` : ''}
                                </span>
                                {!guruId && (
                                    <span className="inline-flex items-center rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs text-amber-800">
                                        ⚠ Guru tidak ditemukan di jadwal — simpan akan gagal
                                    </span>
                                )}
                            </div>

                            {siswaWithNilai.length === 0 ? (
                                <div className="rounded-2xl border border-white/70 bg-white/80 p-16 text-center shadow backdrop-blur">
                                    <p className="text-sm text-slate-500">Tidak ada siswa aktif di kelas ini.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="rounded-2xl border border-white/70 bg-white/85 shadow-[0_25px_65px_-35px_rgba(15,23,42,0.45)] backdrop-blur overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-100">
                                                <thead className="bg-slate-50/80">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-8">No</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Siswa</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">Harian</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">UTS</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">UAS</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">Praktik</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 w-20">Akhir</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">Sikap</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Catatan</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {siswaWithNilai.map((siswa, index) => {
                                                        const entry = entries[index];
                                                        const nilaiAkhir = computeAkhir(entry);
                                                        return (
                                                            <tr key={siswa.id} className="hover:bg-teal-50/30">
                                                                <td className="px-4 py-2 text-sm text-slate-400">{index + 1}</td>
                                                                <td className="px-4 py-2">
                                                                    <p className="text-sm font-medium text-slate-900">{siswa.nama_lengkap}</p>
                                                                    <p className="text-xs text-slate-400 font-mono">{siswa.nis}</p>
                                                                </td>
                                                                {(['nilai_harian', 'nilai_uts', 'nilai_uas', 'nilai_praktik'] as const).map((field) => (
                                                                    <td key={field} className="px-2 py-2">
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            max="100"
                                                                            step="0.01"
                                                                            value={entry[field]}
                                                                            onChange={(e) => updateEntry(index, field, e.target.value)}
                                                                            placeholder="—"
                                                                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-center focus:border-teal-400 focus:ring-1 focus:ring-teal-200"
                                                                        />
                                                                    </td>
                                                                ))}
                                                                <td className="px-4 py-2 text-center text-sm font-semibold text-slate-700">
                                                                    {nilaiAkhir}
                                                                </td>
                                                                <td className="px-2 py-2">
                                                                    <select
                                                                        value={entry.nilai_sikap}
                                                                        onChange={(e) => updateEntry(index, 'nilai_sikap', e.target.value)}
                                                                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-center focus:border-teal-400 focus:ring-1 focus:ring-teal-200"
                                                                    >
                                                                        <option value="">—</option>
                                                                        <option value="A">A</option>
                                                                        <option value="B">B</option>
                                                                        <option value="C">C</option>
                                                                        <option value="D">D</option>
                                                                    </select>
                                                                </td>
                                                                <td className="px-2 py-2">
                                                                    <input
                                                                        type="text"
                                                                        value={entry.catatan}
                                                                        onChange={(e) => updateEntry(index, 'catatan', e.target.value)}
                                                                        placeholder="Opsional"
                                                                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-teal-400 focus:ring-1 focus:ring-teal-200"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end gap-3">
                                        <Link
                                            href={backUrl}
                                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                                        >
                                            Batal
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="inline-flex items-center rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-teal-700 disabled:opacity-60"
                                        >
                                            {submitting ? 'Menyimpan...' : 'Simpan Semua Nilai'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}

                    {!isFiltered && (
                        <div className="rounded-2xl border border-white/70 bg-white/80 p-16 text-center shadow backdrop-blur">
                            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <p className="mt-4 text-sm text-slate-500">Pilih kelas, semester, dan mata pelajaran di atas untuk mulai menginput nilai.</p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
