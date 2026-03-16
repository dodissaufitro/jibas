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

interface Siswa {
    id: number;
    nama_lengkap: string;
    nisn: string;
    kelas: Kelas;
}

interface Props {
    siswa: Siswa;
    ujianAktif: Ujian[];
}

export default function OnlineExam({ siswa, ujianAktif }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleMulaiUjian = (ujianId: number) => {
        if (confirm('Apakah Anda yakin ingin memulai ujian ini?')) {
            router.get(route('siswa.ujian.mulai', ujianId));
        }
    };

    const handleLanjutkanUjian = (ujianSiswaId: number) => {
        router.get(route('siswa.ujian.kerjakan', ujianSiswaId));
    };

    const handleLihatHasil = (ujianSiswaId: number) => {
        router.get(route('siswa.ujian.hasil', ujianSiswaId));
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
            <Head title="Ujian Online - JIBAS" />
            
            {/* Custom 3D Animations */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .card-3d {
                    transform-style: preserve-3d;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .card-3d:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                }
                .glass-effect {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .btn-3d {
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .btn-3d:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }
                .btn-3d:active {
                    transform: translateY(-1px) scale(1.02);
                }
            `}} />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{ animationDuration: '7s' }}></div>
                    <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDuration: '11s', animationDelay: '4s' }}></div>
                </div>

                {/* Glassmorphism Header */}
                <div className="relative z-10 glass-effect shadow-xl border-b border-white/30 sticky top-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Logo & Title */}
                            <div className="flex items-center space-x-4">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-glow"></div>
                                    <div className="relative h-16 w-16 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
                                        <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                                        Ujian Online
                                    </h1>
                                    <p className="text-sm text-gray-600 font-medium">Computer Based Test System</p>
                                </div>
                            </div>
                            
                            {/* User Info & Logout */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="glass-effect px-5 py-3 rounded-2xl border border-white/30 shadow-lg">
                                    <p className="text-xs text-gray-600 mb-1">Siswa</p>
                                    <p className="font-bold text-gray-900">{siswa.nama_lengkap}</p>
                                    <p className="text-xs text-purple-600 font-semibold">{siswa.kelas.nama}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="btn-3d px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl shadow-lg flex items-center space-x-2 font-semibold"
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
                    {/* Search Bar with 3D Effect */}
                    <div className="mb-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                            <div className="relative glass-effect rounded-2xl shadow-xl border border-white/30">
                                <input
                                    type="text"
                                    placeholder="🔍 Cari ujian atau mata pelajaran..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-4 py-5 bg-transparent border-2 border-transparent focus:border-purple-400 rounded-2xl text-lg font-medium text-gray-800 placeholder-gray-500 focus:outline-none transition-all"
                                />
                                <svg
                                    className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        {/* Total Ujian */}
                        <div className="card-3d glass-effect rounded-2xl p-6 shadow-xl border border-white/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Total Ujian</p>
                                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        {filteredUjian.length}
                                    </p>
                                </div>
                                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Belum Dikerjakan */}
                        <div className="card-3d glass-effect rounded-2xl p-6 shadow-xl border border-white/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Belum Dikerjakan</p>
                                    <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                        {filteredUjian.filter(u => u.status_pengerjaan === 'belum_mulai').length}
                                    </p>
                                </div>
                                <div className="h-16 w-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Selesai */}
                        <div className="card-3d glass-effect rounded-2xl p-6 shadow-xl border border-white/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Selesai</p>
                                    <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        {filteredUjian.filter(u => u.status_pengerjaan === 'selesai').length}
                                    </p>
                                </div>
                                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ujian List or Empty State */}
                    {filteredUjian.length === 0 ? (
                        <div className="card-3d glass-effect rounded-3xl shadow-2xl border border-white/30 p-16 text-center">
                            <div className="inline-block p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6">
                                <svg className="mx-auto h-20 w-20 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Tidak Ada Ujian</h3>
                            <p className="text-lg text-gray-600">Tidak ada ujian yang tersedia saat ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 pb-8">
                            {filteredUjian.map((ujian) => {
                                // Status Configuration
                                const statusConfig = {
                                    belum_mulai: {
                                        gradient: 'from-blue-500 to-indigo-500',
                                        bg: 'bg-blue-50',
                                        border: 'border-blue-300',
                                        text: 'text-blue-700',
                                        label: 'Belum Dikerjakan',
                                        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                    },
                                    sedang_mengerjakan: {
                                        gradient: 'from-yellow-500 to-orange-500',
                                        bg: 'bg-yellow-50',
                                        border: 'border-yellow-300',
                                        text: 'text-yellow-700',
                                        label: 'Sedang Dikerjakan',
                                        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                                    },
                                    selesai: {
                                        gradient: 'from-green-500 to-emerald-500',
                                        bg: 'bg-green-50',
                                        border: 'border-green-300',
                                        text: 'text-green-700',
                                        label: 'Selesai',
                                        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                    }
                                };
                                
                                const config = statusConfig[ujian.status_pengerjaan as keyof typeof statusConfig] || statusConfig.belum_mulai;

                                return (
                                    <div key={ujian.id} className="card-3d glass-effect rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                                        {/* Gradient Top Bar */}
                                        <div className={`h-2 bg-gradient-to-r ${config.gradient}`}></div>
                                        
                                        <div className="p-6 sm:p-8">
                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                                {/* Left Section - Ujian Info */}
                                                <div className="flex-1 space-y-4">
                                                    {/* Header */}
                                                    <div className="flex items-start space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <div className={`h-16 w-16 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                                                                <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                                <h3 className="text-xl font-bold text-gray-900">
                                                                    {ujian.judul_ujian}
                                                                </h3>
                                                                <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full">
                                                                    {ujian.jenis_ujian}
                                                                </span>
                                                            </div>
                                                            <div className={`inline-flex items-center gap-2 px-4 py-2 ${config.bg} ${config.border} border ${config.text} rounded-full font-semibold text-sm`}>
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                                                                </svg>
                                                                {config.label}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Details Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-20">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-10 w-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                                                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Mata Pelajaran</p>
                                                                <p className="font-semibold text-gray-900">{ujian.mata_pelajaran.nama}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Guru</p>
                                                                <p className="font-semibold text-gray-900">{ujian.guru.nama_lengkap}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-10 w-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                                                                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Tanggal</p>
                                                                <p className="font-semibold text-gray-900">{formatDate(ujian.tanggal_ujian)}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-10 w-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                                                                <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Durasi</p>
                                                                <p className="font-semibold text-gray-900">{ujian.durasi_menit} menit</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Nilai (if completed) */}
                                                    {ujian.status_pengerjaan === 'selesai' && ujian.nilai !== null && (
                                                        <div className="pl-20 pt-2">
                                                            <div className={`inline-flex items-center gap-4 px-6 py-4 rounded-2xl ${ujian.nilai >= ujian.kkm ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300' : 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300'}`}>
                                                                <div>
                                                                    <p className="text-xs text-gray-600 mb-1">Nilai Anda</p>
                                                                    <p className={`text-4xl font-bold ${ujian.nilai >= ujian.kkm ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {ujian.nilai}
                                                                    </p>
                                                                </div>
                                                                <div className="h-12 w-px bg-gray-300"></div>
                                                                <div>
                                                                    <p className="text-xs text-gray-600 mb-1">KKM</p>
                                                                    <p className="text-2xl font-bold text-gray-700">{ujian.kkm}</p>
                                                                </div>
                                                                <div>
                                                                    {ujian.nilai >= ujian.kkm ? (
                                                                        <div className="flex items-center gap-2 text-green-600">
                                                                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                            <span className="font-bold">LULUS</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-2 text-red-600">
                                                                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                            <span className="font-bold">BELUM LULUS</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Section - Action Button */}
                                                <div className="flex-shrink-0 lg:ml-6 flex items-center">
                                                    {ujian.status_pengerjaan === 'belum_mulai' && ujian.is_available && (
                                                        <button
                                                            onClick={() => handleMulaiUjian(ujian.id)}
                                                            className="btn-3d w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center space-x-3 text-lg"
                                                        >
                                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>Mulai Ujian</span>
                                                        </button>
                                                    )}

                                                    {ujian.status_pengerjaan === 'sedang_mengerjakan' && (
                                                        <button
                                                            onClick={() => handleLanjutkanUjian(ujian.ujian_siswa_id!)}
                                                            className="btn-3d w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center space-x-3 text-lg animate-pulse"
                                                        >
                                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                            <span>Lanjutkan Ujian</span>
                                                        </button>
                                                    )}

                                                    {ujian.status_pengerjaan === 'selesai' && (
                                                        <button
                                                            onClick={() => handleLihatHasil(ujian.ujian_siswa_id!)}
                                                            className="btn-3d w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center space-x-3 text-lg"
                                                        >
                                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>Lihat Hasil</span>
                                                        </button>
                                                    )}

                                                    {ujian.status_pengerjaan === 'belum_mulai' && !ujian.is_available && (
                                                        <div className="w-full lg:w-auto px-8 py-4 bg-gray-200 text-gray-600 font-bold rounded-2xl flex items-center justify-center space-x-3 text-lg cursor-not-allowed">
                                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                            <span>Belum Dibuka</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
