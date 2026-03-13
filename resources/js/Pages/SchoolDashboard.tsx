import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link } from '@inertiajs/react';
import { useSettings } from '@/Contexts/SettingsContext';

interface Stats {
    totalSiswa: number;
    totalGuru: number;
    totalKelas: number;
    ppdbAktif: number;
    tunggakan: number;
    presensiHariIni: number;
}

export default function SchoolDashboard({ stats }: { stats: Stats }) {
    const { isConfigured } = useSettings();
    
    const statCards = [
        {
            title: 'Total Siswa',
            value: stats.totalSiswa,
            icon: '👨‍🎓',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            change: '+12 dari bulan lalu',
        },
        {
            title: 'Total Guru',
            value: stats.totalGuru,
            icon: '👨‍🏫',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            change: '+2 guru baru',
        },
        {
            title: 'Total Kelas',
            value: stats.totalKelas,
            icon: '🏫',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            change: '24 rombel aktif',
        },
        {
            title: 'PPDB Aktif',
            value: stats.ppdbAktif,
            icon: '📝',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            change: 'Pendaftar baru',
        },
        {
            title: 'Tunggakan SPP',
            value: `Rp ${stats.tunggakan.toLocaleString('id-ID')}`,
            icon: '💰',
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
            change: '45 siswa menunggak',
        },
        {
            title: 'Presensi Hari Ini',
            value: `${stats.presensiHariIni}%`,
            icon: '✅',
            color: 'from-teal-500 to-teal-600',
            bgColor: 'bg-teal-50',
            change: 'Kehadiran siswa',
        },
    ];

    const quickLinks = [
        { name: 'Input Nilai', icon: '📊', route: 'akademik.nilai', color: 'bg-blue-500' },
        { name: 'Presensi Siswa', icon: '✓', route: 'presensi.siswa.index', color: 'bg-green-500' },
        { name: 'Kelola PPDB', icon: '📋', route: 'ppdb.pendaftaran.index', color: 'bg-purple-500' },
        { name: 'Pembayaran', icon: '💳', route: 'keuangan.pembayaran.index', color: 'bg-orange-500' },
        { name: 'Jadwal', icon: '📅', route: 'akademik.jadwal', color: 'bg-pink-500' },
        { name: 'Laporan', icon: '📈', route: 'admin.laporan', color: 'bg-indigo-500' },
    ];

    const recentActivities = [
        { 
            id: 1, 
            action: 'Pembayaran SPP diterima', 
            detail: 'Kelas X-A - 15 siswa', 
            time: '10 menit yang lalu',
            icon: '💰',
            color: 'bg-green-100 text-green-600'
        },
        { 
            id: 2, 
            action: 'Pendaftar PPDB baru', 
            detail: 'Ahmad Fauzi - Jalur Prestasi', 
            time: '25 menit yang lalu',
            icon: '📝',
            color: 'bg-blue-100 text-blue-600'
        },
        { 
            id: 3, 
            action: 'Nilai UTS diinput', 
            detail: 'Matematika - Kelas IX-B', 
            time: '1 jam yang lalu',
            icon: '📊',
            color: 'bg-purple-100 text-purple-600'
        },
        { 
            id: 4, 
            action: 'Absensi diperbarui', 
            detail: 'Presensi Guru - 45 dari 48', 
            time: '2 jam yang lalu',
            icon: '✅',
            color: 'bg-teal-100 text-teal-600'
        },
        { 
            id: 5, 
            action: 'Surat masuk', 
            detail: 'Undangan rapat dinas', 
            time: '3 jam yang lalu',
            icon: '✉️',
            color: 'bg-yellow-100 text-yellow-600'
        },
    ];

    const ppdbStats = [
        { status: 'Pendaftar', count: 156, color: 'bg-blue-500' },
        { status: 'Verifikasi', count: 89, color: 'bg-yellow-500' },
        { status: 'Lulus', count: 120, color: 'bg-green-500' },
        { status: 'Daftar Ulang', count: 95, color: 'bg-purple-500' },
    ];

    const keuanganOverview = [
        { label: 'Pendapatan Bulan Ini', amount: 'Rp 125.500.000', trend: 'up', percent: '+8%' },
        { label: 'Total Tunggakan', amount: 'Rp 26.750.000', trend: 'down', percent: '-12%' },
        { label: 'Target SPP', amount: 'Rp 150.000.000', trend: 'up', percent: '84%' },
    ];

    return (
        <SidebarLayout>
            <Head title="Dashboard Sekolah" />

            <div className="space-y-6">
                {/* Configuration Reminder Banner */}
                {!isConfigured && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-lg font-semibold text-yellow-800">
                                    Konfigurasi Institusi Belum Lengkap
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                        Silakan lengkapi pengaturan institusi Anda untuk pengalaman yang lebih baik. 
                                        Konfigurasikan jenis institusi, tingkat pendidikan, dan informasi dasar lainnya.
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href={route('settings')}
                                        className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition duration-150 transform hover:scale-105"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Ke Halaman Pengaturan
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-xl shadow-lg p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Selamat Datang di E-Ponpes.id 👋
                            </h1>
                            <p className="text-blue-100 text-lg">
                                Sistem Informasi Sekolah Terintegrasi - Kelola semua kebutuhan sekolah dalam satu platform
                            </p>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <span className="text-6xl">🏫</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className={`h-2 bg-gradient-to-r ${stat.color} rounded-t-xl`} />
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-gray-500">{stat.change}</p>
                                    </div>
                                    <div className={`${stat.bgColor} p-4 rounded-xl text-4xl`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">⚡</span>
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {quickLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={route(link.route)}
                                className={`${link.color} text-white rounded-xl p-6 text-center hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                            >
                                <div className="text-4xl mb-2">{link.icon}</div>
                                <div className="text-sm font-semibold">{link.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* PPDB Overview */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                            <span>📋 Status PPDB</span>
                            <Link href={route('ppdb.pendaftaran.index')} className="text-sm text-blue-600 hover:text-blue-800 font-normal">
                                Lihat Detail →
                            </Link>
                        </h3>
                        <div className="space-y-4">
                            {ppdbStats.map((item, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.status}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {item.count}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${(item.count / 200) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Keuangan Overview */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                            <span>💰 Ringkasan Keuangan</span>
                            <Link href={route('keuangan.laporan')} className="text-sm text-blue-600 hover:text-blue-800 font-normal">
                                Detail →
                            </Link>
                        </h3>
                        <div className="space-y-4">
                            {keuanganOverview.map((item, index) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                    <p className="text-xs text-gray-600 mb-1">{item.label}</p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-xl font-bold text-gray-900">{item.amount}</p>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                            item.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {item.percent}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            🕐 Aktivitas Terbaru
                        </h3>
                        <div className="space-y-3">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-xl`}>
                                        {activity.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-600">{activity.detail}</p>
                                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Presensi Hari Ini</h3>
                            <span className="text-3xl">✅</span>
                        </div>
                        <p className="text-4xl font-bold mb-2">{stats.presensiHariIni}%</p>
                        <p className="text-green-100 text-sm">Kehadiran siswa sangat baik</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Jadwal Hari Ini</h3>
                            <span className="text-3xl">📅</span>
                        </div>
                        <p className="text-4xl font-bold mb-2">24</p>
                        <p className="text-blue-100 text-sm">Jam pelajaran aktif</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Pengumuman</h3>
                            <span className="text-3xl">📢</span>
                        </div>
                        <p className="text-4xl font-bold mb-2">5</p>
                        <p className="text-purple-100 text-sm">Pengumuman baru</p>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
