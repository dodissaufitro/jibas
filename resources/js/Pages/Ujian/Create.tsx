import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface MataPelajaran {
    id: number;
    nama?: string;
}

interface Guru {
    id: number;
    nama: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    jenjang?: { nama: string };
    jurusan?: { nama: string };
}

interface TahunAjaran {
    id: number;
    tahun: string;
}

interface Semester {
    id: number;
    nama: string;
}

interface Props {
    mataPelajaran: MataPelajaran[];
    guru: Guru[];
    kelas: Kelas[];
    tahunAjaran: TahunAjaran[];
    semester: Semester[];
}

export default function Create({ mataPelajaran, guru, kelas, tahunAjaran, semester }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        mata_pelajaran_id: '',
        guru_id: '',
        kelas_id: '',
        tahun_ajaran_id: '',
        semester_id: '',
        judul_ujian: '',
        jenis_ujian: 'Harian',
        tanggal_ujian: '',
        durasi_menit: '90',
        bobot: '100',
        kkm: '75',
        keterangan: '',
        status: 'dijadwalkan',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('ujian.store'));
    };

    return (
        <SidebarLayout>
            <Head title="Tambah Ujian" />

            <div className="relative py-6 sm:py-8">
                {/* Floating Blur Orbs Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 left-10 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />
                    <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route('ujian.index')}
                            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4 transition"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </Link>
                        <h2 className="font-semibold text-2xl text-slate-900">
                            Tambah Ujian Baru
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Buat jadwal ujian baru untuk kelas Anda
                        </p>
                    </div>

                    {/* Form */}
                    <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_25px_65px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Judul Ujian */}
                            <div>
                                <label htmlFor="judul_ujian" className="block text-sm font-medium text-gray-700 mb-2">
                                    Judul Ujian <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="judul_ujian"
                                    value={data.judul_ujian}
                                    onChange={(e) => setData('judul_ujian', e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                        errors.judul_ujian ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Contoh: UTS Semester Ganjil"
                                    required
                                />
                                {errors.judul_ujian && (
                                    <p className="mt-1 text-sm text-red-600">{errors.judul_ujian}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Mata Pelajaran */}
                                <div>
                                    <label htmlFor="mata_pelajaran_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mata Pelajaran <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="mata_pelajaran_id"
                                        value={data.mata_pelajaran_id}
                                        onChange={(e) => setData('mata_pelajaran_id', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.mata_pelajaran_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">-- Pilih Mata Pelajaran --</option>
                                        {mataPelajaran.map((mp) => (
                                            <option key={mp.id} value={mp.id}>
                                                {mp.nama || `Mata Pelajaran ${mp.id}`}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.mata_pelajaran_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.mata_pelajaran_id}</p>
                                    )}
                                </div>

                                {/* Guru */}
                                <div>
                                    <label htmlFor="guru_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Guru Pengampu <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="guru_id"
                                        value={data.guru_id}
                                        onChange={(e) => setData('guru_id', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.guru_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">-- Pilih Guru --</option>
                                        {guru.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.guru_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.guru_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kelas */}
                                <div>
                                    <label htmlFor="kelas_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Kelas <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="kelas_id"
                                        value={data.kelas_id}
                                        onChange={(e) => setData('kelas_id', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.kelas_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">-- Pilih Kelas --</option>
                                        {kelas.map((k) => (
                                            <option key={k.id} value={k.id}>
                                                {k.nama_kelas}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.kelas_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.kelas_id}</p>
                                    )}
                                </div>

                                {/* Jenis Ujian */}
                                <div>
                                    <label htmlFor="jenis_ujian" className="block text-sm font-medium text-gray-700 mb-2">
                                        Jenis Ujian <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="jenis_ujian"
                                        value={data.jenis_ujian}
                                        onChange={(e) => setData('jenis_ujian', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.jenis_ujian ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="UTS">UTS</option>
                                        <option value="UAS">UAS</option>
                                        <option value="Harian">Harian</option>
                                        <option value="Quiz">Quiz</option>
                                        <option value="Praktek">Praktek</option>
                                        <option value="Tugas">Tugas</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                    {errors.jenis_ujian && (
                                        <p className="mt-1 text-sm text-red-600">{errors.jenis_ujian}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tahun Ajaran */}
                                <div>
                                    <label htmlFor="tahun_ajaran_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tahun Ajaran <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="tahun_ajaran_id"
                                        value={data.tahun_ajaran_id}
                                        onChange={(e) => setData('tahun_ajaran_id', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.tahun_ajaran_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">-- Pilih Tahun Ajaran --</option>
                                        {tahunAjaran.map((ta) => (
                                            <option key={ta.id} value={ta.id}>
                                                {ta.tahun}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.tahun_ajaran_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.tahun_ajaran_id}</p>
                                    )}
                                </div>

                                {/* Semester */}
                                <div>
                                    <label htmlFor="semester_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Semester <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="semester_id"
                                        value={data.semester_id}
                                        onChange={(e) => setData('semester_id', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.semester_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">-- Pilih Semester --</option>
                                        {semester.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.semester_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.semester_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tanggal Ujian */}
                                <div>
                                    <label htmlFor="tanggal_ujian" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal & Waktu Ujian <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="tanggal_ujian"
                                        value={data.tanggal_ujian}
                                        onChange={(e) => setData('tanggal_ujian', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.tanggal_ujian ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {errors.tanggal_ujian && (
                                        <p className="mt-1 text-sm text-red-600">{errors.tanggal_ujian}</p>
                                    )}
                                </div>

                                {/* Durasi */}
                                <div>
                                    <label htmlFor="durasi_menit" className="block text-sm font-medium text-gray-700 mb-2">
                                        Durasi (Menit) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="durasi_menit"
                                        min="1"
                                        value={data.durasi_menit}
                                        onChange={(e) => setData('durasi_menit', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.durasi_menit ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="90"
                                        required
                                    />
                                    {errors.durasi_menit && (
                                        <p className="mt-1 text-sm text-red-600">{errors.durasi_menit}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Bobot */}
                                <div>
                                    <label htmlFor="bobot" className="block text-sm font-medium text-gray-700 mb-2">
                                        Bobot (%) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="bobot"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={data.bobot}
                                        onChange={(e) => setData('bobot', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.bobot ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="100"
                                        required
                                    />
                                    {errors.bobot && (
                                        <p className="mt-1 text-sm text-red-600">{errors.bobot}</p>
                                    )}
                                </div>

                                {/* KKM */}
                                <div>
                                    <label htmlFor="kkm" className="block text-sm font-medium text-gray-700 mb-2">
                                        KKM <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="kkm"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={data.kkm}
                                        onChange={(e) => setData('kkm', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.kkm ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="75"
                                        required
                                    />
                                    {errors.kkm && (
                                        <p className="mt-1 text-sm text-red-600">{errors.kkm}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                            errors.status ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="dijadwalkan">Dijadwalkan</option>
                                        <option value="berlangsung">Berlangsung</option>
                                        <option value="selesai">Selesai</option>
                                        <option value="batal">Batal</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div>
                                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
                                    Keterangan
                                </label>
                                <textarea
                                    id="keterangan"
                                    rows={3}
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                        errors.keterangan ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Catatan tambahan tentang ujian..."
                                />
                                {errors.keterangan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Link
                                    href={route('ujian.index')}
                                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:-translate-y-0.5 hover:bg-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Ujian'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
