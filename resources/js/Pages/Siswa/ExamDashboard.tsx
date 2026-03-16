import { Link, Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface MataPelajaran {
    nama: string;
}

interface Guru {
    nama_lengkap: string;
}

interface Kelas {
    nama: string;
}

interface Ujian {
    id: number;
    judul_ujian: string;
    jenis_ujian: string;
    tanggal_ujian: string;
    durasi_menit: number;
    kkm: number;
    status: string;
    mata_pelajaran: MataPelajaran;
    guru: Guru;
    kelas: Kelas;
    status_pengerjaan: string;
    nilai: number | null;
    ujian_siswa_id: number | null;
    is_available: boolean;
}

interface UjianSelesai {
    id: number;
    nilai: number;
    waktu_mulai: string;
    waktu_selesai: string;
    ujian: {
        judul_ujian: string;
        jenis_ujian: string;
        kkm: number;
        mata_pelajaran: MataPelajaran;
        guru: Guru;
    };
}

interface Siswa {
    id: number;
    nama_lengkap: string;
    nisn: string;
    kelas: Kelas;
}

interface Stats {
    total_ujian: number;
    belum_dikerjakan: number;
    sedang_dikerjakan: number;
    selesai: number;
}

interface Props {
    siswa: Siswa;
    ujianAktif: Ujian[];
    ujianSelesai: UjianSelesai[];
    stats: Stats;
}

export default function ExamDashboard({ siswa, ujianAktif, ujianSelesai, stats }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            belum_mulai: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Belum Mulai' },
            sedang_mengerjakan: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Sedang Mengerjakan' },
            selesai: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
        };
        const badge = badges[status as keyof typeof badges] || badges.belum_mulai;
        return badge;
    };

    const getNilaiColor = (nilai: number, kkm: number) => {
        if (nilai >= kkm) return 'text-green-600';
        if (nilai >= kkm * 0.8) return 'text-yellow-600';
        return 'text-red-600';
    };

    const handleLogout = () => {
        router.post(route('custom.logout'));
    };

    const filteredUjian = ujianAktif.filter(ujian =>
        ujian.judul_ujian.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ujian.mata_pelajaran.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head title="Exam Dashboard - JIBAS" />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                {/* Floating Orbs Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Header */}
                <div className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">JIBAS Exam System</h1>
                                    <p className="text-sm text-white/70">Computer Based Test</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm text-white/70">Welcome,</p>
                                    <p className="text-white font-semibold">{siswa.nama_lengkap}</p>
                                    <p className="text-xs text-white/60">{siswa.kelas.nama}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/70 text-sm font-medium">Total Ujian</p>
                                    <p className="text-4xl font-bold text-white mt-2">{stats.total_ujian}</p>
                                </div>
                                <div className="h-14 w-14 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                    <svg className="h-8 w-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/70 text-sm font-medium">Belum Dikerjakan</p>
                                    <p className="text-4xl font-bold text-blue-300 mt-2">{stats.belum_dikerjakan}</p>
                                </div>
                                <div className="h-14 w-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                    <svg className="h-8 w-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/70 text-sm font-medium">Sedang Dikerjakan</p>
                                    <p className="text-4xl font-bold text-yellow-300 mt-2">{stats.sedang_dikerjakan}</p>
                                </div>
                                <div className="h-14 w-14 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                                    <svg className="h-8 w-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/70 text-sm font-medium">Selesai</p>
                                    <p className="text-4xl font-bold text-green-300 mt-2">{stats.selesai}</p>
                                </div>
                                <div className="h-14 w-14 bg-green-500/20 rounded-xl flex items-center justify-center">
                                    <svg className="h-8 w-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari ujian..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                            <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Active Exams */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <svg className="h-7 w-7 mr-3 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Ujian Aktif
                            </h2>
                        </div>

                        {filteredUjian.length === 0 ? (
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/20">
                                <svg className="h-20 w-20 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-white/70 text-lg">Tidak ada ujian aktif saat ini</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredUjian.map((ujian) => {
                                    const statusBadge = getStatusBadge(ujian.status_pengerjaan);
                                    
                                    return (
                                        <div key={ujian.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="px-3 py-1 bg-purple-500/30 text-purple-200 text-xs font-semibold rounded-lg border border-purple-400/30">
                                                            {ujian.jenis_ujian}
                                                        </span>
                                                        <span className={`px-3 py-1 ${statusBadge.bg} ${statusBadge.text} text-xs font-semibold rounded-lg`}>
                                                            {statusBadge.label}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                                                        {ujian.judul_ujian}
                                                    </h3>
                                                    <div className="space-y-1 text-sm text-white/70">
                                                        <p className="flex items-center">
                                                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                            </svg>
                                                            {ujian.mata_pelajaran.nama}
                                                        </p>
                                                        <p className="flex items-center">
                                                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {ujian.guru.nama_lengkap}
                                                        </p>
                                                        <p className="flex items-center">
                                                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {formatDate(ujian.tanggal_ujian)} • {formatTime(ujian.tanggal_ujian)}
                                                        </p>
                                                        <p className="flex items-center">
                                                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {ujian.durasi_menit} menit • KKM: {ujian.kkm}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                {ujian.status_pengerjaan === 'belum_mulai' && (
                                                    <Link
                                                        href={route('siswa.ujian.mulai', ujian.id)}
                                                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                                    >
                                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197 -2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Mulai Ujian
                                                    </Link>
                                                )}
                                                {ujian.status_pengerjaan === 'sedang_mengerjakan' && ujian.ujian_siswa_id && (
                                                    <Link
                                                        href={route('siswa.ujian.kerjakan', ujian.ujian_siswa_id)}
                                                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                                    >
                                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Lanjutkan Ujian
                                                    </Link>
                                                )}
                                                {ujian.status_pengerjaan === 'selesai' && ujian.ujian_siswa_id && (
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-white/70 text-sm">Nilai:</p>
                                                            <p className={`text-3xl font-bold ${ujian.nilai ? getNilaiColor(ujian.nilai, ujian.kkm) : 'text-white'}`}>
                                                                {ujian.nilai ? ujian.nilai.toFixed(2) : '-'}
                                                            </p>
                                                        </div>
                                                        <Link
                                                            href={route('siswa.ujian.hasil', ujian.ujian_siswa_id)}
                                                            className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-300"
                                                        >
                                                            Lihat Detail
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Recent Results */}
                    {ujianSelesai.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <svg className="h-7 w-7 mr-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00 2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Hasil Ujian Terbaru
                            </h2>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Ujian</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Mata Pelajaran</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Tanggal</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Nilai</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ujianSelesai.map((item) => (
                                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="text-white font-medium">{item.ujian.judul_ujian}</p>
                                                        <p className="text-white/60 text-sm">{item.ujian.jenis_ujian}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-white/80">{item.ujian.mata_pelajaran.nama}</td>
                                                    <td className="px-6 py-4 text-white/80 text-sm">{formatDate(item.waktu_selesai)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-2xl font-bold ${getNilaiColor(item.nilai, item.ujian.kkm)}`}>
                                                            {item.nilai.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={route('siswa.ujian.hasil', item.id)}
                                                            className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="relative z-10 mt-12 py-6 text-center">
                    <p className="text-white/50 text-sm">
                        © 2026 JIBAS - Jadwal Informasi Berbasis Administras Sekolah
                    </p>
                </div>
            </div>
        </>
    );
}
