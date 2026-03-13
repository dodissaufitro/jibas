import { Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

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
    status: string;
    mata_pelajaran: MataPelajaran;
    guru: Guru;
    kelas: Kelas;
}

interface Stats {
    bulan_ini: number;
    minggu_ini: number;
    hari_ini: number;
    mendatang: number;
}

interface Props {
    ujian: Record<string, Ujian[]>;
    stats: Stats;
}

export default function Jadwal({ ujian, stats }: Props) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        
        return {
            day: days[date.getDay()],
            date: date.getDate(),
            month: months[date.getMonth()],
            year: date.getFullYear(),
            full: `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        };
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getJenisUjianBadge = (jenis: string) => {
        const badges = {
            UTS: 'bg-purple-100 text-purple-800 border-purple-200',
            UAS: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            Harian: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            Quiz: 'bg-pink-100 text-pink-800 border-pink-200',
            Praktek: 'bg-amber-100 text-amber-800 border-amber-200',
            Tugas: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            Lainnya: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return badges[jenis as keyof typeof badges] || badges.Lainnya;
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            dijadwalkan: 'bg-blue-100 text-blue-800 border-blue-200',
            berlangsung: 'bg-green-100 text-green-800 border-green-200',
            selesai: 'bg-gray-100 text-gray-800 border-gray-200',
            batal: 'bg-red-100 text-red-800 border-red-200',
        };
        return badges[status as keyof typeof badges] || badges.dijadwalkan;
    };

    const isToday = (dateString: string) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.toDateString() === today.toDateString();
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">📅 Jadwal Ujian</h1>
                            <p className="text-white/90 text-lg">Kalender dan timeline ujian yang akan datang</p>
                        </div>
                        <Link
                            href={route('ujian.index')}
                            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <span>Lihat Semua Data</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Bulan Ini</p>
                            <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.bulan_ini}</p>
                        </div>
                        <div className="bg-indigo-100 p-3 rounded-xl">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Minggu Ini</p>
                            <p className="text-3xl font-bold text-purple-600 mt-1">{stats.minggu_ini}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Hari Ini</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">{stats.hari_ini}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Mendatang</p>
                            <p className="text-3xl font-bold text-pink-600 mt-1">{stats.mendatang}</p>
                        </div>
                        <div className="bg-pink-100 p-3 rounded-xl">
                            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Timeline Ujian</h2>

                {Object.keys(ujian).length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg mb-4">Tidak ada ujian yang dijadwalkan</p>
                        <Link
                            href={route('ujian.create')}
                            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Buat Ujian Baru
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(ujian).map(([date, items]) => {
                            const dateInfo = formatDate(date);
                            const isTodayDate = isToday(date);

                            return (
                                <div key={date} className="relative">
                                    {/* Date Header */}
                                    <div className={`flex items-center space-x-4 mb-4 ${isTodayDate ? 'text-green-600' : 'text-gray-700'}`}>
                                        <div className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl font-bold ${isTodayDate ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                                            <span className="text-xs uppercase">{dateInfo.month}</span>
                                            <span className="text-3xl">{dateInfo.date}</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold ${isTodayDate ? 'text-green-600' : 'text-gray-900'}`}>
                                                {dateInfo.day}, {dateInfo.date} {dateInfo.month} {dateInfo.year}
                                            </h3>
                                            {isTodayDate && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 mt-1">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                                    Hari Ini
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Events */}
                                    <div className="ml-24 space-y-4">
                                        {items.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={route('ujian.soal.index', item.id)}
                                                className="block bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-indigo-200 group"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getJenisUjianBadge(item.jenis_ujian)}`}>
                                                                {item.jenis_ujian}
                                                            </span>
                                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                                                                {item.status}
                                                            </span>
                                                            <span className="text-gray-500 text-sm flex items-center">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {formatTime(item.tanggal_ujian)} • {item.durasi_menit} menit
                                                            </span>
                                                        </div>
                                                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                            {item.judul_ujian}
                                                        </h4>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                            <span className="flex items-center">
                                                                <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                </svg>
                                                                {item.mata_pelajaran.nama}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                {item.kelas.nama}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <svg className="w-4 h-4 mr-1 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                                {item.guru.nama_lengkap}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
