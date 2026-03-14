import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { useSettings } from '@/Contexts/SettingsContext';

interface MenuItem {
    name: string;
    icon: ReactNode;
    route?: string;
    submenu?: { name: string; route: string }[];
}

export default function SidebarLayout({ children }: PropsWithChildren) {
    const page = usePage();
    const user = page.props.auth?.user as { name: string; email: string } | undefined;
    const { settings } = useSettings();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    // If no user, don't render (shouldn't happen on authenticated routes)
    if (!user) {
        return <div>Loading...</div>;
    }

    const menuItems: MenuItem[] = [
        {
            name: 'Dashboard',
            route: 'dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: 'PPDB',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
            submenu: [
                { name: 'Pendaftaran', route: 'ppdb.pendaftaran.index' },
                { name: 'Calon Siswa', route: 'ppdb.calon' },
                { name: 'Seleksi', route: 'ppdb.seleksi' },
                { name: 'Pembayaran', route: 'ppdb.pembayaran' },
                { name: 'Pengumuman', route: 'ppdb.pengumuman.index' },
            ],
        },
        {
            name: 'Master Data',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
            ),
            submenu: [
                { name: 'Tahun Ajaran', route: 'master.tahun-ajaran.index' },
                { name: 'Jenjang', route: 'master.jenjang.index' },
                { name: 'Jurusan', route: 'master.jurusan.index' },
                { name: 'Kelas', route: 'master.kelas.index' },
                { name: 'Mata Pelajaran', route: 'master.mata-pelajaran.index' },
            ],
        },
        {
            name: 'Akademik',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            submenu: [
                { name: 'Data Siswa', route: 'akademik.siswa.index' },
                { name: 'Data Guru', route: 'akademik.guru.index' },
                { name: 'Jadwal Pelajaran', route: 'akademik.jadwal.index' },
                { name: 'Penilaian', route: 'akademik.nilai' },
                { name: 'Raport', route: 'akademik.raport' },
            ],
        },
        {
            name: 'Ujian',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            submenu: [
                { name: 'Ujian Saya', route: 'siswa.ujian.index' },
                { name: 'Data Ujian', route: 'ujian.index' },
                { name: 'Jadwal Ujian', route: 'ujian.jadwal' },
            ],
        },
        {
            name: 'Presensi',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            submenu: [
                { name: 'Presensi Siswa', route: 'presensi.siswa.index' },
                { name: 'Presensi Guru', route: 'presensi.guru.index' },
                { name: 'Rekap Presensi', route: 'presensi.rekap' },
            ],
        },
        {
            name: 'Keuangan',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            submenu: [
                { name: 'Tagihan SPP', route: 'keuangan.tagihan.index' },
                { name: 'Pembayaran', route: 'keuangan.pembayaran.index' },
                { name: 'Laporan Kas', route: 'keuangan.laporan' },
                { name: 'Tunggakan', route: 'keuangan.tunggakan' },
            ],
        },
        {
            name: 'Orang Tua',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            submenu: [
                { name: 'Data Wali Murid', route: 'orangtua.data' },
                { name: 'Akun Orang Tua', route: 'orangtua.akun' },
                { name: 'Komunikasi', route: 'orangtua.komunikasi' },
            ],
        },
        {
            name: 'Administrasi',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            submenu: [
                { name: 'Surat Masuk', route: 'admin.surat-masuk' },
                { name: 'Surat Keluar', route: 'admin.surat-keluar' },
                { name: 'Arsip Digital', route: 'admin.arsip' },
                { name: 'Laporan', route: 'admin.laporan' },
            ],
        },
        {
            name: 'User Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            submenu: [
                { name: 'Daftar User', route: 'users.index' },
                { name: 'Tambah User', route: 'users.create' },
                { name: 'Kelola Permission', route: 'users.permissions' },
            ],
        },
        {
            name: 'Pesantren',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            submenu: [
                { name: 'Hafalan Quran', route: 'pesantren.hafalan.index' },
                { name: 'Asrama', route: 'pesantren.asrama.index' },
                { name: 'Akhlak', route: 'pesantren.akhlak.index' },
                { name: 'Izin Pulang', route: 'pesantren.izin-pulang.index' },
            ],
        },
        {
            name: 'Sekolah',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            submenu: [
                { name: 'Ekstrakurikuler', route: 'school.ekstrakurikuler.index' },
                { name: 'OSIS', route: 'school.osis.index' },
                { name: 'Prestasi', route: 'school.prestasi.index' },
            ],
        },
        {
            name: 'Madrasah',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            ),
            submenu: [
                { name: 'Nilai Agama', route: 'madrasah.nilai-agama.index' },
                { name: 'Evaluasi Ibadah', route: 'madrasah.evaluasi-ibadah.index' },
                { name: 'Kegiatan Keagamaan', route: 'madrasah.kegiatan-keagamaan.index' },
            ],
        },
        {
            name: 'Pengaturan',
            route: 'settings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];

    const toggleSubmenu = (menuName: string) => {
        setOpenMenu(openMenu === menuName ? null : menuName);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}
            >
                {/* Logo */}
                <div className="p-4 flex items-center justify-between border-b border-blue-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-blue-900 font-bold text-xl">
                                {settings.institutionName ? settings.institutionName[0] : 'E'}
                            </span>
                        </div>
                        {sidebarOpen && (
                            <div>
                                <h1 className="font-bold text-lg">
                                    {settings.institutionName || 'E-Ponpes.id'}
                                </h1>
                                <p className="text-xs text-blue-300">
                                    {settings.educationLevel ? `${settings.educationLevel} • Sistem Sekolah` : 'Sistem Sekolah'}
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-white hover:bg-blue-700 p-2 rounded-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    {menuItems.map((item) => (
                        <div key={item.name}>
                            {item.submenu ? (
                                <>
                                    <button
                                        onClick={() => toggleSubmenu(item.name)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                                            openMenu === item.name
                                                ? 'bg-blue-700 text-white'
                                                : 'text-blue-100 hover:bg-blue-800'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {item.icon}
                                            {sidebarOpen && <span className="font-medium">{item.name}</span>}
                                        </div>
                                        {sidebarOpen && (
                                            <svg
                                                className={`w-4 h-4 transition-transform ${
                                                    openMenu === item.name ? 'rotate-180' : ''
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </button>
                                    {sidebarOpen && openMenu === item.name && (
                                        <div className="ml-4 mt-1 space-y-1">
                                            {item.submenu.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={route(sub.route)}
                                                    className="block px-3 py-2 text-sm text-blue-200 hover:bg-blue-800 hover:text-white rounded-lg transition-colors"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={route(item.route!)}
                                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                                        route().current(item.route!)
                                            ? 'bg-blue-700 text-white'
                                            : 'text-blue-100 hover:bg-blue-800'
                                    }`}
                                >
                                    {item.icon}
                                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="border-t border-blue-700 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-sm">
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-blue-300 truncate">{user.email}</p>
                            </div>
                        )}
                    </div>
                    {sidebarOpen && (
                        <Link
                            href={route('custom.logout')}
                            method="post"
                            as="button"
                            className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Sistem Informasi Sekolah
                            </h2>
                            <p className="text-sm text-gray-500">
                                {new Date().toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
