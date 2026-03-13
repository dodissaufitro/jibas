import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { useState } from 'react';

interface Siswa {
    nis: string;
    nama_lengkap: string;
    kelas: {
        nama_kelas: string;
    };
}

interface EvaluasiIbadah {
    id: number;
    siswa: Siswa;
    bulan: number;
    tahun: number;
    shalat_wajib: number;
    shalat_dhuha: number;
    shalat_tahajud: number;
    tadarus_quran: number;
    hafalan_quran: number;
    puasa_sunnah: number;
    infaq_sedekah: number;
    akhlak_harian: number;
    nilai_total: number;
    predikat: string;
    catatan: string;
}

interface Statistics {
    rata_rata_total: number;
    total_evaluasi: number;
    predikat_counts: {
        'Sangat Baik': number;
        'Baik': number;
        'Cukup': number;
        'Kurang': number;
    };
}

interface Props {
    evaluasi: {
        data: EvaluasiIbadah[];
        current_page: number;
        last_page: number;
    };
    statistics: Statistics;
    filters: {
        search: string;
        bulan: number;
        tahun: number;
        predikat: string;
    };
}

export default function Index({ evaluasi, statistics, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [bulan, setBulan] = useState(filters.bulan || '');
    const [tahun, setTahun] = useState(filters.tahun || new Date().getFullYear());
    const [predikat, setPredikat] = useState(filters.predikat || '');

    const handleFilter = () => {
        router.get(route('madrasah.evaluasi-ibadah.index'), {
            search,
            bulan,
            tahun,
            predikat,
        });
    };

    const handleReset = () => {
        setSearch('');
        setBulan('');
        setTahun(new Date().getFullYear());
        setPredikat('');
        router.get(route('madrasah.evaluasi-ibadah.index'));
    };

    const getPredikatColor = (pred: string) => {
        switch (pred) {
            case 'Sangat Baik':
                return 'bg-green-100 text-green-800';
            case 'Baik':
                return 'bg-blue-100 text-blue-800';
            case 'Cukup':
                return 'bg-yellow-100 text-yellow-800';
            case 'Kurang':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    return (
        <SidebarLayout>
            <Head title="Evaluasi Ibadah" />
            
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Evaluasi Ibadah</h1>
                        <p className="text-gray-600 mt-2">Pantau pelaksanaan ibadah siswa secara berkala</p>
                    </div>
                    <Link
                        href={route('madrasah.evaluasi-ibadah.create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Tambah Evaluasi</span>
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Total Evaluasi</p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">{statistics.total_evaluasi}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600 font-medium">Rata-rata Total</p>
                                <p className="text-2xl font-bold text-green-900 mt-1">{statistics.rata_rata_total.toFixed(1)}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600 font-medium">Sangat Baik</p>
                                <p className="text-2xl font-bold text-purple-900 mt-1">{statistics.predikat_counts['Sangat Baik']}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-orange-600 font-medium">Perlu Bimbingan</p>
                                <p className="text-2xl font-bold text-orange-900 mt-1">
                                    {statistics.predikat_counts['Cukup'] + statistics.predikat_counts['Kurang']}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cari</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nama/NIS siswa"
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                            <select
                                value={bulan}
                                onChange={(e) => setBulan(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Semua Bulan</option>
                                {months.map((month, index) => (
                                    <option key={index} value={index + 1}>{month}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                            <select
                                value={tahun}
                                onChange={(e) => setTahun(parseInt(e.target.value))}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Predikat</label>
                            <select
                                value={predikat}
                                onChange={(e) => setPredikat(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Semua Predikat</option>
                                <option value="Sangat Baik">Sangat Baik</option>
                                <option value="Baik">Baik</option>
                                <option value="Cukup">Cukup</option>
                                <option value="Kurang">Kurang</option>
                            </select>
                        </div>

                        <div className="flex items-end space-x-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Filter
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai Total</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Predikat</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Detail</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {evaluasi.data.length > 0 ? (
                                evaluasi.data.map((ev) => (
                                    <tr key={ev.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{ev.siswa.nama_lengkap}</div>
                                                <div className="text-sm text-gray-500">
                                                    {ev.siswa.nis} • {ev.siswa.kelas?.nama_kelas}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {months[ev.bulan - 1]} {ev.tahun}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xl font-bold text-blue-600">{ev.nilai_total.toFixed(1)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPredikatColor(ev.predikat)}`}>
                                                {ev.predikat}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600">
                                            <div className="space-y-1">
                                                <div>Shalat Wajib: {ev.shalat_wajib}%</div>
                                                <div>Tadarus: {ev.tadarus_quran}%</div>
                                                <div>Akhlak: {ev.akhlak_harian}%</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={route('madrasah.evaluasi-ibadah.edit', ev.id)}
                                                className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada data evaluasi ibadah
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {evaluasi.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t">
                            <div className="text-sm text-gray-700">
                                Halaman {evaluasi.current_page} dari {evaluasi.last_page}
                            </div>
                            <div className="flex space-x-2">
                                {evaluasi.current_page > 1 && (
                                    <Link
                                        href={route('madrasah.evaluasi-ibadah.index', { ...filters, page: evaluasi.current_page - 1 })}
                                        className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                                    >
                                        Sebelumnya
                                    </Link>
                                )}
                                {evaluasi.current_page < evaluasi.last_page && (
                                    <Link
                                        href={route('madrasah.evaluasi-ibadah.index', { ...filters, page: evaluasi.current_page + 1 })}
                                        className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                                    >
                                        Selanjutnya
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
