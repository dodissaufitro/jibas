import { Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Ujian {
    id: number;
    judul_ujian: string;
    jenis_ujian: string;
    tanggal_ujian: string;
    durasi_menit: number;
    status: string;
    mata_pelajaran: {
        nama: string;
    };
    guru: {
        nama_lengkap: string;
    };
    kelas: {
        nama: string;
    };
    tahun_ajaran: {
        nama: string;
    };
    semester: {
        semester: string;
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

interface Stats {
    total_soal: number;
    pilihan_ganda: number;
    essay: number;
    total_bobot: number;
}

interface Props {
    ujian: Ujian;
    soal: Soal[];
    stats: Stats;
}

export default function Index({ ujian, soal, stats }: Props) {
    const handleDelete = (soalId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
            router.delete(route('ujian.soal.destroy', { ujian: ujian.id, soal: soalId }));
        }
    };

    const getTipeSoalBadge = (tipe: string) => {
        const badges = {
            pilihan_ganda: 'bg-blue-100 text-blue-800',
            essay: 'bg-purple-100 text-purple-800',
            benar_salah: 'bg-green-100 text-green-800',
            menjodohkan: 'bg-amber-100 text-amber-800',
        };
        return badges[tipe as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const getTipeSoalLabel = (tipe: string) => {
        const labels = {
            pilihan_ganda: 'Pilihan Ganda',
            essay: 'Essay',
            benar_salah: 'Benar/Salah',
            menjodohkan: 'Menjodohkan',
        };
        return labels[tipe as keyof typeof labels] || tipe;
    };

    return (
        <SidebarLayout>
            {/* Floating Blur Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <Link
                                href={route('ujian.index')}
                                className="inline-flex items-center text-white/90 hover:text-white mb-3 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Kembali ke Daftar Ujian
                            </Link>
                            <h1 className="text-4xl font-bold text-white mb-2">{ujian.judul_ujian}</h1>
                            <p className="text-white/90 text-lg">
                                {ujian.mata_pelajaran.nama} • {ujian.kelas.nama} • {ujian.guru.nama_lengkap}
                            </p>
                        </div>
                        <Link
                            href={route('ujian.soal.create', ujian.id)}
                            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Tambah Soal</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Soal</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_soal}</p>
                        </div>
                        <div className="bg-indigo-100 p-3 rounded-xl">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Pilihan Ganda</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">{stats.pilihan_ganda}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Essay</p>
                            <p className="text-3xl font-bold text-purple-600 mt-1">{stats.essay}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Bobot</p>
                            <p className="text-3xl font-bold text-pink-600 mt-1">{stats.total_bobot}</p>
                        </div>
                        <div className="bg-pink-100 p-3 rounded-xl">
                            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Soal List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Daftar Soal</h2>

                {soal.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg mb-4">Belum ada soal untuk ujian ini</p>
                        <Link
                            href={route('ujian.soal.create', ujian.id)}
                            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Soal Pertama
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {soal.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="bg-indigo-600 text-white px-4 py-1 rounded-lg font-bold text-sm">
                                                No. {item.nomor_soal}
                                            </span>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getTipeSoalBadge(item.tipe_soal)}`}>
                                                {getTipeSoalLabel(item.tipe_soal)}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                Bobot: <span className="font-semibold text-gray-700">{item.bobot}</span>
                                            </span>
                                        </div>
                                        <p className="text-gray-800 text-base mb-3 leading-relaxed">{item.pertanyaan}</p>

                                        {item.tipe_soal === 'pilihan_ganda' && (
                                            <div className="grid grid-cols-1 gap-2 mt-3">
                                                {item.opsi_a && (
                                                    <div className={`p-2 rounded-lg text-sm ${item.jawaban_benar === 'A' ? 'bg-green-100 text-green-800 font-semibold' : 'bg-gray-50 text-gray-700'}`}>
                                                        A. {item.opsi_a}
                                                    </div>
                                                )}
                                                {item.opsi_b && (
                                                    <div className={`p-2 rounded-lg text-sm ${item.jawaban_benar === 'B' ? 'bg-green-100 text-green-800 font-semibold' : 'bg-gray-50 text-gray-700'}`}>
                                                        B. {item.opsi_b}
                                                    </div>
                                                )}
                                                {item.opsi_c && (
                                                    <div className={`p-2 rounded-lg text-sm ${item.jawaban_benar === 'C' ? 'bg-green-100 text-green-800 font-semibold' : 'bg-gray-50 text-gray-700'}`}>
                                                        C. {item.opsi_c}
                                                    </div>
                                                )}
                                                {item.opsi_d && (
                                                    <div className={`p-2 rounded-lg text-sm ${item.jawaban_benar === 'D' ? 'bg-green-100 text-green-800 font-semibold' : 'bg-gray-50 text-gray-700'}`}>
                                                        D. {item.opsi_d}
                                                    </div>
                                                )}
                                                {item.opsi_e && (
                                                    <div className={`p-2 rounded-lg text-sm ${item.jawaban_benar === 'E' ? 'bg-green-100 text-green-800 font-semibold' : 'bg-gray-50 text-gray-700'}`}>
                                                        E. {item.opsi_e}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {item.pembahasan && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <p className="text-xs font-semibold text-blue-800 mb-1">Pembahasan:</p>
                                                <p className="text-sm text-blue-900">{item.pembahasan}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col space-y-2 ml-4">
                                        <Link
                                            href={route('ujian.soal.edit', { ujian: ujian.id, soal: item.id })}
                                            className="p-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                            title="Hapus"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
