import { Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Ujian {
    id: number;
    judul_ujian: string;
    mata_pelajaran: {
        nama: string;
    };
    kelas: {
        nama: string;
    };
}

interface Soal {
    id: number;
    nomor_soal: number;
    tipe_soal: string;
    pertanyaan: string;
    opsi_a?: string;
    opsi_b?: string;
    opsi_c?: string;
    opsi_d?: string;
    opsi_e?: string;
    jawaban_benar?: string;
    pembahasan?: string;
    file_soal?: string;
    bobot: number;
}

interface Props {
    ujian: Ujian;
    soal: Soal;
}

export default function Edit({ ujian, soal }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        nomor_soal: soal.nomor_soal,
        tipe_soal: soal.tipe_soal,
        pertanyaan: soal.pertanyaan,
        opsi_a: soal.opsi_a || '',
        opsi_b: soal.opsi_b || '',
        opsi_c: soal.opsi_c || '',
        opsi_d: soal.opsi_d || '',
        opsi_e: soal.opsi_e || '',
        jawaban_benar: soal.jawaban_benar || '',
        pembahasan: soal.pembahasan || '',
        file_soal: null as File | null,
        bobot: soal.bobot,
    });

    const [showOpsiE, setShowOpsiE] = useState(!!soal.opsi_e);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('ujian.soal.update', { ujian: ujian.id, soal: soal.id }));
    };

    return (
        <SidebarLayout>
            {/* Floating Blur Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            {/* Header */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 mb-8">
                <Link
                    href={route('ujian.soal.index', ujian.id)}
                    className="inline-flex items-center text-white/90 hover:text-white mb-3 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Daftar Soal
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">Edit Soal</h1>
                <p className="text-white/90 text-lg">
                    {ujian.judul_ujian} • {ujian.mata_pelajaran.nama} • {ujian.kelas.nama}
                </p>
            </div>

            {/* Form */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nomor Soal */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nomor Soal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.nomor_soal}
                                onChange={(e) => setData('nomor_soal', parseInt(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                min="1"
                                required
                            />
                            {errors.nomor_soal && <p className="text-red-500 text-sm mt-1">{errors.nomor_soal}</p>}
                        </div>

                        {/* Tipe Soal */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tipe Soal <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.tipe_soal}
                                onChange={(e) => setData('tipe_soal', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required
                            >
                                <option value="pilihan_ganda">Pilihan Ganda</option>
                                <option value="essay">Essay</option>
                                <option value="benar_salah">Benar/Salah</option>
                                <option value="menjodohkan">Menjodohkan</option>
                            </select>
                            {errors.tipe_soal && <p className="text-red-500 text-sm mt-1">{errors.tipe_soal}</p>}
                        </div>
                    </div>

                    {/* Pertanyaan */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pertanyaan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={data.pertanyaan}
                            onChange={(e) => setData('pertanyaan', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="Tulis pertanyaan di sini..."
                            required
                        />
                        {errors.pertanyaan && <p className="text-red-500 text-sm mt-1">{errors.pertanyaan}</p>}
                    </div>

                    {/* Opsi Jawaban - Only for Pilihan Ganda */}
                    {data.tipe_soal === 'pilihan_ganda' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Pilihan Jawaban</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowOpsiE(!showOpsiE)}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    {showOpsiE ? 'Sembunyikan Opsi E' : 'Tampilkan Opsi E'}
                                </button>
                            </div>

                            {['A', 'B', 'C', 'D', ...(showOpsiE ? ['E'] : [])].map((opsi) => (
                                <div key={opsi} className="flex items-start space-x-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg font-bold flex-shrink-0 mt-2">
                                        {opsi}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={data[`opsi_${opsi.toLowerCase()}` as keyof typeof data] as string}
                                            onChange={(e) => setData(`opsi_${opsi.toLowerCase()}` as any, e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            placeholder={`Opsi ${opsi}`}
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Jawaban Benar */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Jawaban Benar <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.jawaban_benar}
                                    onChange={(e) => setData('jawaban_benar', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">Pilih jawaban yang benar</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    {showOpsiE && <option value="E">E</option>}
                                </select>
                                {errors.jawaban_benar && <p className="text-red-500 text-sm mt-1">{errors.jawaban_benar}</p>}
                            </div>
                        </div>
                    )}

                    {/* Jawaban Benar untuk Essay */}
                    {data.tipe_soal === 'essay' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Kunci Jawaban (Opsional)
                            </label>
                            <textarea
                                value={data.jawaban_benar}
                                onChange={(e) => setData('jawaban_benar', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Poin-poin kunci jawaban untuk essay..."
                            />
                        </div>
                    )}

                    {/* Pembahasan */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pembahasan (Opsional)
                        </label>
                        <textarea
                            value={data.pembahasan}
                            onChange={(e) => setData('pembahasan', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="Penjelasan atau pembahasan jawaban..."
                        />
                    </div>

                    {/* File Upload & Bobot */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* File Soal */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                File Pendukung (Gambar/PDF)
                            </label>
                            {soal.file_soal && (
                                <div className="mb-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                                    File saat ini: {soal.file_soal.split('/').pop()}
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={(e) => setData('file_soal', e.target.files?.[0] || null)}
                                accept="image/*,application/pdf"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, PDF (Max: 2MB)</p>
                        </div>

                        {/* Bobot */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Bobot Nilai <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.bobot}
                                onChange={(e) => setData('bobot', parseFloat(e.target.value))}
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required
                            />
                            {errors.bobot && <p className="text-red-500 text-sm mt-1">{errors.bobot}</p>}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                        <Link
                            href={route('ujian.soal.index', ujian.id)}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Menyimpan...' : 'Update Soal'}
                        </button>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}
