import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { useState } from 'react';

interface Siswa {
    id: number;
    nama_lengkap: string;
    nis: string;
    kelas?: {
        nama_kelas: string;
    };
}

interface Prestasi {
    id: number;
    siswa: Siswa;
    jenis: string;
    nama_prestasi: string;
    tingkat: string;
    peringkat: string;
    tanggal: string;
    poin: number;
}

interface Props {
    prestasi: {
        data: Prestasi[];
        current_page: number;
        last_page: number;
    };
    statistics: {
        total_prestasi: number;
        tahun_ini: number;
        by_jenis: Record<string, number>;
        by_tingkat: Record<string, number>;
    };
    ranking: Array<{
        siswa: Siswa;
        total_poin: number;
    }>;
    filters: {
        search?: string;
        jenis?: string;
        tingkat?: string;
    };
}

export default function Index({ prestasi, statistics, ranking, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [jenis, setJenis] = useState(filters.jenis || '');
    const [tingkat, setTingkat] = useState(filters.tingkat || '');

    const handleSearch = () => {
        router.get(route('school.prestasi.index'), {
            search,
            jenis,
            tingkat,
        }, {
            preserveState: true,
        });
    };

    const getTingkatColor = (tingkatValue: string) => {
        const colors: Record<string, string> = {
            internasional: 'bg-purple-100 text-purple-800',
            nasional: 'bg-red-100 text-red-800',
            provinsi: 'bg-blue-100 text-blue-800',
            kabupaten: 'bg-green-100 text-green-800',
            kecamatan: 'bg-yellow-100 text-yellow-800',
            sekolah: 'bg-gray-100 text-gray-800',
        };
        return colors[tingkatValue] || 'bg-gray-100 text-gray-800';
    };

    return (
        <SidebarLayout>
            <Head title="Prestasi Siswa" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Prestasi Siswa</h1>
                    <p className="text-gray-600">Tracking prestasi dan pencapaian siswa</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Statistics */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="text-blue-600 text-sm font-medium">Total Prestasi</div>
                                <div className="text-2xl font-bold text-blue-700">{statistics.total_prestasi}</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="text-green-600 text-sm font-medium">Tahun Ini</div>
                                <div className="text-2xl font-bold text-green-700">{statistics.tahun_ini}</div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-3">By Tingkat</h3>
                            <div className="space-y-2">
                                {Object.entries(statistics.by_tingkat).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="capitalize text-sm">{key}</span>
                                        <div className="flex items-center">
                                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${(value / statistics.total_prestasi) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold w-8">{value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top 10 Ranking */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-3">🏆 Top 10 Siswa</h3>
                        <div className="space-y-2">
                            {ranking.map((item, index) => (
                                <div key={item.siswa.id} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                                            index === 0 ? 'bg-yellow-400 text-white' :
                                            index === 1 ? 'bg-gray-300 text-white' :
                                            index === 2 ? 'bg-orange-400 text-white' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {index + 1}
                                        </span>
                                        <span className="truncate">{item.siswa.nama_lengkap}</span>
                                    </div>
                                    <span className="font-semibold text-blue-600">{item.total_poin}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Cari nama/prestasi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <select
                            value={jenis}
                            onChange={(e) => setJenis(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value="">Semua Jenis</option>
                            <option value="akademik">Akademik</option>
                            <option value="non_akademik">Non Akademik</option>
                        </select>
                        <select
                            value={tingkat}
                            onChange={(e) => setTingkat(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value="">Semua Tingkat</option>
                            <option value="sekolah">Sekolah</option>
                            <option value="kecamatan">Kecamatan</option>
                            <option value="kabupaten">Kabupaten</option>
                            <option value="provinsi">Provinsi</option>
                            <option value="nasional">Nasional</option>
                            <option value="internasional">Internasional</option>
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
                        href={route('school.prestasi.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                    >
                        <span className="mr-2">+</span>
                        Tambah Prestasi
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prestasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tingkat</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peringkat</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poin</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {prestasi.data.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{item.siswa.nama_lengkap}</div>
                                        <div className="text-sm text-gray-500">{item.siswa.kelas?.nama_kelas}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{item.nama_prestasi}</div>
                                        <div className="text-xs text-gray-500 capitalize">{item.jenis.replace('_', ' ')}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTingkatColor(item.tingkat)}`}>
                                            {item.tingkat}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                                        {item.peringkat.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-lg font-bold text-blue-600">{item.poin}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {new Date(item.tanggal).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <Link
                                            href={route('school.prestasi.edit', item.id)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SidebarLayout>
    );
}
