import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { useState } from 'react';

interface Ekstrakurikuler {
    id: number;
    nama_ekskul: string;
    kategori: string;
    pembina: {
        name: string;
    };
    kuota: number;
    terisi: number;
    sisa_kapasitas: number;
    persentase_terisi: number;
    status: string;
}

interface Props {
    ekstrakurikuler: {
        data: Ekstrakurikuler[];
        current_page: number;
        last_page: number;
    };
    statistics: {
        total_ekskul: number;
        total_anggota: number;
        by_kategori: Record<string, number>;
    };
    filters: {
        search?: string;
        kategori?: string;
        status?: string;
    };
}

export default function Index({ ekstrakurikuler, statistics, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [kategori, setKategori] = useState(filters.kategori || '');

    const handleSearch = () => {
        router.get(route('school.ekstrakurikuler.index'), {
            search,
            kategori,
        }, {
            preserveState: true,
        });
    };

    return (
        <SidebarLayout>
            <Head title="Ekstrakurikuler" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Ekstrakurikuler</h1>
                    <p className="text-gray-600">Kelola kegiatan ekstrakurikuler</p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-blue-600 text-sm font-medium">Total Ekstrakurikuler</div>
                        <div className="text-2xl font-bold text-blue-700">{statistics.total_ekskul}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-green-600 text-sm font-medium">Total Anggota</div>
                        <div className="text-2xl font-bold text-green-700">{statistics.total_anggota}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-purple-600 text-sm font-medium">Kategori</div>
                        <div className="text-sm mt-2">
                            {Object.entries(statistics.by_kategori).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                    <span className="capitalize">{key}:</span>
                                    <span className="font-semibold">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Cari nama ekstrakurikuler..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <select
                            value={kategori}
                            onChange={(e) => setKategori(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value="">Semua Kategori</option>
                            <option value="olahraga">Olahraga</option>
                            <option value="seni">Seni</option>
                            <option value="sains">Sains</option>
                            <option value="bahasa">Bahasa</option>
                            <option value="keagamaan">Keagamaan</option>
                        </select>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Cari
                        </button>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end mb-4">
                    <Link
                        href={route('school.ekstrakurikuler.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                    >
                        <span className="mr-2">+</span>
                        Tambah Ekstrakurikuler
                    </Link>
                </div>

                {/* Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ekstrakurikuler.data.map((ekskul) => (
                        <div key={ekskul.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">{ekskul.nama_ekskul}</h3>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                        {ekskul.kategori}
                                    </span>
                                </div>
                                
                                <div className="text-sm text-gray-600 mb-4">
                                    <div className="flex items-center mb-2">
                                        <span className="font-medium">Pembina:</span>
                                        <span className="ml-2">{ekskul.pembina.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium">Kuota:</span>
                                        <span className="ml-2">{ekskul.terisi} / {ekskul.kuota}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Terisi</span>
                                        <span>{ekskul.persentase_terisi}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${ekskul.persentase_terisi}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        ekskul.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {ekskul.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                    <Link
                                        href={route('school.ekstrakurikuler.edit', ekskul.id)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {ekstrakurikuler.last_page > 1 && (
                    <div className="mt-6 flex justify-center">
                        {Array.from({ length: ekstrakurikuler.last_page }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={route('school.ekstrakurikuler.index', { ...filters, page })}
                                className={`mx-1 px-3 py-1 rounded ${
                                    page === ekstrakurikuler.current_page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {page}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
