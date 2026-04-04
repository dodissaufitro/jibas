import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Jenjang { id: number; nama: string }
interface Jurusan { id: number; nama: string }
interface Kelas { id: number; nama_kelas: string; jenjang?: Jenjang; jurusan?: Jurusan }
interface TahunAjaran { id: number; tahun: string }
interface Semester { id: number; semester: string; tahun_ajaran?: TahunAjaran }

interface Siswa {
    id: number;
    nis: string;
    nisn?: string;
    nama_lengkap: string;
    nama_ayah?: string;
    nama_ibu?: string;
    kelas?: Kelas;
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

interface Guru {
    id: number;
    nama_lengkap: string;
}

interface MataPelajaran {
    id: number;
    nama: string;
    kode?: string;
    kkm?: number;
}

interface NilaiItem {
    id: number;
    nilai_harian?: number | null;
    nilai_uts?: number | null;
    nilai_uas?: number | null;
    nilai_praktik?: number | null;
    nilai_akhir?: number | null;
    nilai_sikap?: string | null;
    catatan?: string | null;
    mata_pelajaran?: MataPelajaran;
    guru?: Guru;
}

interface Props {
    siswa: Siswa;
    semester: Semester;
    raport: Raport | null;
    nilaiList: NilaiItem[];
    filters: {
        kelas_id?: string | null;
        semester_id?: string | null;
    };
}

export default function Show({ siswa, semester, raport, nilaiList, filters }: Props) {
    const [catatan, setCatatan] = useState(raport?.catatan_wali_kelas ?? '');
    const [savingCatatan, setSavingCatatan] = useState(false);
    const [editingCatatan, setEditingCatatan] = useState(false);

    const backUrl = route('akademik.raport') + `?kelas_id=${filters.kelas_id}&semester_id=${filters.semester_id}`;

    const handleSaveCatatan = () => {
        if (!raport) return;
        setSavingCatatan(true);
        router.patch(route('akademik.raport.update-catatan', raport.id), {
            catatan_wali_kelas: catatan,
        }, {
            onSuccess: () => setEditingCatatan(false),
            onFinish: () => setSavingCatatan(false),
        });
    };

    const getNilaiBadge = (nilai: number | null | undefined, kkm?: number) => {
        if (nilai === null || nilai === undefined) return 'text-slate-400';
        const threshold = kkm ?? 75;
        if (nilai >= 90) return 'text-emerald-700 font-bold';
        if (nilai >= threshold) return 'text-blue-700 font-semibold';
        return 'text-red-600 font-semibold';
    };

    const getSikapColor = (sikap: string | null | undefined) => {
        const map: Record<string, string> = {
            A: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            B: 'bg-blue-100 text-blue-800 border-blue-200',
            C: 'bg-amber-100 text-amber-800 border-amber-200',
            D: 'bg-red-100 text-red-800 border-red-200',
        };
        return sikap ? map[sikap] || '' : '';
    };

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const totalHadir = nilaiList.length; // proxy
    const kelasLabel = siswa.kelas
        ? `${siswa.kelas.nama_kelas}${siswa.kelas.jurusan ? ' - ' + siswa.kelas.jurusan.nama : ''}`
        : '—';

    return (
        <SidebarLayout>
            <Head title={`Raport - ${siswa.nama_lengkap}`} />

            <div className="relative py-6 sm:py-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 left-10 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl" />
                    <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Back */}
                    <Link
                        href={backUrl}
                        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Raport
                    </Link>

                    {/* Raport Card */}
                    <div className="rounded-3xl border border-white/60 bg-white/90 shadow-[0_30px_80px_-30px_rgba(109,40,217,0.4)] overflow-hidden">
                        {/* Header Strip */}
                        <div className="bg-gradient-to-r from-violet-800 via-indigo-700 to-purple-800 px-6 py-5 text-white">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-violet-200 font-semibold">Rapor Hasil Belajar</p>
                                    <h2 className="mt-1 text-xl font-bold">{siswa.nama_lengkap}</h2>
                                    <p className="text-sm text-violet-200 mt-0.5">
                                        NIS: {siswa.nis} · {kelasLabel}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-violet-300">{semester.tahun_ajaran?.tahun}</p>
                                    <p className="text-lg font-semibold">Semester {semester.semester}</p>
                                    {raport?.is_published && (
                                        <span className="inline-flex items-center rounded-full bg-emerald-400/20 border border-emerald-300/30 px-2.5 py-0.5 text-xs text-emerald-200 mt-1">
                                            ✓ Dipublikasikan {formatDate(raport.tanggal_terbit)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Summary Stats */}
                            {raport && (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Rata-Rata</p>
                                        <p className={`mt-2 text-3xl font-bold ${
                                            (raport.rata_rata ?? 0) >= 90 ? 'text-emerald-700' :
                                            (raport.rata_rata ?? 0) >= 75 ? 'text-blue-700' :
                                            (raport.rata_rata ?? 0) >= 60 ? 'text-amber-700' :
                                            'text-red-700'
                                        }`}>
                                            {raport.rata_rata ?? '—'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Ranking</p>
                                        <p className="mt-2 text-3xl font-bold text-indigo-700">{raport.ranking ?? '—'}</p>
                                    </div>
                                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Sakit / Izin</p>
                                        <p className="mt-2 text-2xl font-bold text-blue-700">
                                            {raport.total_sakit} / {raport.total_izin}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Alpha</p>
                                        <p className="mt-2 text-3xl font-bold text-red-700">{raport.total_alpha}</p>
                                    </div>
                                </div>
                            )}

                            {/* Nilai Table */}
                            {nilaiList.length > 0 ? (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Daftar Nilai per Mata Pelajaran</h3>
                                    <div className="rounded-2xl border border-slate-100 overflow-hidden">
                                        <table className="min-w-full divide-y divide-slate-100">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Mata Pelajaran</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Guru</th>
                                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Harian</th>
                                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">UTS</th>
                                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">UAS</th>
                                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Praktik</th>
                                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Akhir</th>
                                                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Sikap</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {nilaiList.map((item) => (
                                                    <tr key={item.id} className="hover:bg-violet-50/30">
                                                        <td className="px-4 py-2.5">
                                                            <p className="text-sm font-medium text-slate-900">{item.mata_pelajaran?.nama ?? '—'}</p>
                                                            {item.mata_pelajaran?.kkm && (
                                                                <p className="text-xs text-slate-400">KKM: {item.mata_pelajaran.kkm}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2.5 text-xs text-slate-500">
                                                            {item.guru?.nama_lengkap ?? '—'}
                                                        </td>
                                                        {[item.nilai_harian, item.nilai_uts, item.nilai_uas, item.nilai_praktik].map((val, i) => (
                                                            <td key={i} className={`px-3 py-2.5 text-sm text-center ${getNilaiBadge(val, item.mata_pelajaran?.kkm)}`}>
                                                                {val ?? <span className="text-slate-300">—</span>}
                                                            </td>
                                                        ))}
                                                        <td className={`px-3 py-2.5 text-sm text-center ${getNilaiBadge(item.nilai_akhir, item.mata_pelajaran?.kkm)}`}>
                                                            {item.nilai_akhir ?? <span className="text-slate-300">—</span>}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center">
                                                            {item.nilai_sikap ? (
                                                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getSikapColor(item.nilai_sikap)}`}>
                                                                    {item.nilai_sikap}
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
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center">
                                    <p className="text-sm text-slate-400">Belum ada nilai yang diinput untuk siswa ini pada semester ini.</p>
                                    <Link
                                        href={route('akademik.nilai.input') + `?kelas_id=${filters.kelas_id}&semester_id=${filters.semester_id}`}
                                        className="mt-3 inline-flex items-center text-sm text-violet-600 hover:text-violet-700 font-medium"
                                    >
                                        Input nilai →
                                    </Link>
                                </div>
                            )}

                            {/* Catatan Wali Kelas */}
                            {raport && (
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Catatan Wali Kelas</h3>
                                        {!editingCatatan ? (
                                            <button
                                                onClick={() => setEditingCatatan(true)}
                                                className="text-xs text-violet-600 hover:text-violet-800 font-medium transition"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingCatatan(false)}
                                                    className="text-xs text-slate-500 hover:text-slate-700 transition"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    onClick={handleSaveCatatan}
                                                    disabled={savingCatatan}
                                                    className="text-xs text-violet-600 hover:text-violet-800 font-medium transition disabled:opacity-50"
                                                >
                                                    {savingCatatan ? 'Menyimpan...' : 'Simpan'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {editingCatatan ? (
                                        <textarea
                                            value={catatan}
                                            onChange={(e) => setCatatan(e.target.value)}
                                            rows={3}
                                            placeholder="Tulis catatan wali kelas..."
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                            {catatan || <span className="text-slate-400 italic">Belum ada catatan.</span>}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Data Identitas Siswa */}
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Identitas Siswa</h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                    <div>
                                        <span className="text-slate-500">Nama Lengkap:</span>
                                        <span className="ml-2 font-medium text-slate-800">{siswa.nama_lengkap}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">NIS:</span>
                                        <span className="ml-2 font-mono text-slate-800">{siswa.nis}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">NISN:</span>
                                        <span className="ml-2 font-mono text-slate-800">{siswa.nisn ?? '—'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Kelas:</span>
                                        <span className="ml-2 text-slate-800">{kelasLabel}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Nama Ayah:</span>
                                        <span className="ml-2 text-slate-800">{siswa.nama_ayah ?? '—'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Nama Ibu:</span>
                                        <span className="ml-2 text-slate-800">{siswa.nama_ibu ?? '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
