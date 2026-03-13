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

interface IzinPulang {
    id: number;
    siswa: Siswa;
    jenis_izin: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    tujuan: string;
    status: string;
    status_badge: string;
    terlambat: boolean;
}

interface Props {
    izinPulang: {
        data: IzinPulang[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    statistics: {
        pending: number;
        disetujui: number;
        ditolak: number;
        sedang_pulang: number;
        terlambat_bulan_ini: number;
    };
    filters: {
        search?: string;
        status?: string;
        jenis_izin?: string;
    };
}

export default function Index({ izinPulang, statistics, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [jenisIzin, setJenisIzin] = useState(filters.jenis_izin || '');

    const handleSearch = () => {
        router.get(route('pesantren.izin-pulang.index'), {
            search,
            status,
            jenis_izin: jenisIzin,
        }, {
            preserveState: true,
        });
    };

    const handleApprove = (id: number) => {
        if (confirm('Setujui izin pulang ini?')) {
            router.post(route('pesantren.izin-pulang.approve', id), {}, {
                preserveState: true,
            });
        }
    };

    const handleReject = (id: number) => {
        const alasan = prompt('Alasan penolakan:');
        if (alasan) {
            router.post(route('pesantren.izin-pulang.reject', id), { alasan }, {
                preserveState: true,
            });
        }
    };

    const handleMarkReturn = (id: number) => {
        if (confirm('Tandai siswa sudah kembali?')) {
            router.post(route('pesantren.izin-pulang.mark-return', id), {}, {
                preserveState: true,
            });
        }
    };

    const getStatusColor = (statusValue: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            disetujui: 'bg-green-100 text-green-800',
            ditolak: 'bg-red-100 text-red-800',
            kembali: 'bg-blue-100 text-blue-800',
        };
        return colors[statusValue] || 'bg-gray-100 text-gray-800';
    };

    return (
        <SidebarLayout>
            <Head title="Izin Pulang" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Izin Pulang Santri</h1>
                    <p className="text-gray-600">Kelola izin pulang santri</p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="text-yellow-600 text-sm font-medium">Pending</div>
                        <div className="text-2xl font-bold text-yellow-700">{statistics.pending}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-green-600 text-sm font-medium">Disetujui</div>
                        <div className="text-2xl font-bold text-green-700">{statistics.disetujui}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-blue-600 text-sm font-medium">Sedang Pulang</div>
                        <div className="text-2xl font-bold text-blue-700">{statistics.sedang_pulang}</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="text-red-600 text-sm font-medium">Ditolak</div>
                        <div className="text-2xl font-bold text-red-700">{statistics.ditolak}</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="text-orange-600 text-sm font-medium">Terlambat (Bulan Ini)</div>
                        <div className="text-2xl font-bold text-orange-700">{statistics.terlambat_bulan_ini}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Cari nama/NIS..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="disetujui">Disetujui</option>
                            <option value="ditolak">Ditolak</option>
                            <option value="kembali">Kembali</option>
                        </select>
                        <select
                            value={jenisIzin}
                            onChange={(e) => setJenisIzin(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value="">Semua Jenis</option>
                            <option value="pulang">Pulang</option>
                            <option value="sakit">Sakit</option>
                            <option value="keperluan_keluarga">Keperluan Keluarga</option>
                            <option value="acara">Acara</option>
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
                        href={route('pesantren.izin-pulang.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                    >
                        <span className="mr-2">+</span>
                        Tambah Izin Pulang
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Santri</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Izin</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tujuan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {izinPulang.data.map((izin) => (
                                <tr key={izin.id}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{izin.siswa.nama_lengkap}</div>
                                        <div className="text-sm text-gray-500">
                                            {izin.siswa.nis} - {izin.siswa.kelas?.nama_kelas}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                                        {izin.jenis_izin.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div>{new Date(izin.tanggal_mulai).toLocaleDateString('id-ID')}</div>
                                        <div className="text-xs text-gray-500">
                                            s/d {new Date(izin.tanggal_selesai).toLocaleDateString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{izin.tujuan}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(izin.status)}`}>
                                            {izin.status_badge}
                                        </span>
                                        {izin.terlambat && (
                                            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                Terlambat
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {izin.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(izin.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Setujui
                                                </button>
                                                <button
                                                    onClick={() => handleReject(izin.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Tolak
                                                </button>
                                            </div>
                                        )}
                                        {izin.status === 'disetujui' && (
                                            <button
                                                onClick={() => handleMarkReturn(izin.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Tandai Kembali
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {izinPulang.last_page > 1 && (
                    <div className="mt-4 flex justify-center">
                        {Array.from({ length: izinPulang.last_page }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={route('pesantren.izin-pulang.index', { ...filters, page })}
                                className={`mx-1 px-3 py-1 rounded ${
                                    page === izinPulang.current_page
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
