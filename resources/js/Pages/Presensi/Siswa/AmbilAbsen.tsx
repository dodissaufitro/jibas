import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Jenjang {
    nama: string;
}

interface Jurusan {
    nama: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat: number;
    jenjang: Jenjang;
    jurusan?: Jurusan;
}

interface Siswa {
    id: number;
    nis: string;
    nama_lengkap: string;
}

interface PresensiItem {
    siswa_id: number;
    status: 'hadir' | 'izin' | 'sakit' | 'alpha';
    jam_masuk: string;
    jam_keluar: string;
    keterangan: string;
}

interface ExistingPresensi {
    [key: number]: {
        status: string;
        jam_masuk: string | null;
        jam_keluar: string | null;
        keterangan: string | null;
    };
}

interface Props {
    kelasList: Kelas[];
    siswaList: Siswa[] | null;
    existingPresensi: ExistingPresensi;
    selectedKelasId?: number;
    selectedTanggal: string;
}

export default function AmbilAbsen({
    kelasList,
    siswaList,
    existingPresensi,
    selectedKelasId,
    selectedTanggal,
}: Props) {
    const [kelasId, setKelasId] = useState(selectedKelasId?.toString() || '');
    const [tanggal, setTanggal] = useState(selectedTanggal);
    const [presensiData, setPresensiData] = useState<{ [key: number]: PresensiItem }>({});
    const [jamMasukGlobal, setJamMasukGlobal] = useState('07:00');
    const [jamKeluarGlobal, setJamKeluarGlobal] = useState('14:00');
    const [processing, setProcessing] = useState(false);

    // Initialize presensi data when siswaList changes
    useEffect(() => {
        if (siswaList) {
            const initialData: { [key: number]: PresensiItem } = {};
            siswaList.forEach((siswa) => {
                const existing = existingPresensi[siswa.id];
                initialData[siswa.id] = {
                    siswa_id: siswa.id,
                    status: (existing?.status as any) || 'hadir',
                    jam_masuk: existing?.jam_masuk || jamMasukGlobal,
                    jam_keluar: existing?.jam_keluar || jamKeluarGlobal,
                    keterangan: existing?.keterangan || '',
                };
            });
            setPresensiData(initialData);
        }
    }, [siswaList, existingPresensi, jamMasukGlobal, jamKeluarGlobal]);

    const handleLoadSiswa = () => {
        if (!kelasId || !tanggal) {
            alert('Pilih kelas dan tanggal terlebih dahulu');
            return;
        }
        router.get(
            route('presensi.siswa.ambil-absen'),
            { kelas_id: kelasId, tanggal },
            { preserveState: true }
        );
    };

    const handleStatusChange = (siswaId: number, status: 'hadir' | 'izin' | 'sakit' | 'alpha') => {
        setPresensiData((prev) => ({
            ...prev,
            [siswaId]: {
                ...prev[siswaId],
                status,
            },
        }));
    };

    const handleFieldChange = (
        siswaId: number,
        field: 'jam_masuk' | 'jam_keluar' | 'keterangan',
        value: string
    ) => {
        setPresensiData((prev) => ({
            ...prev,
            [siswaId]: {
                ...prev[siswaId],
                [field]: value,
            },
        }));
    };

    const handleSetAllStatus = (status: 'hadir' | 'izin' | 'sakit' | 'alpha') => {
        if (!siswaList) return;
        const updatedData = { ...presensiData };
        siswaList.forEach((siswa) => {
            if (updatedData[siswa.id]) {
                updatedData[siswa.id].status = status;
            }
        });
        setPresensiData(updatedData);
    };

    const handleApplyGlobalTime = () => {
        if (!siswaList) return;
        const updatedData = { ...presensiData };
        siswaList.forEach((siswa) => {
            if (updatedData[siswa.id]) {
                updatedData[siswa.id].jam_masuk = jamMasukGlobal;
                updatedData[siswa.id].jam_keluar = jamKeluarGlobal;
            }
        });
        setPresensiData(updatedData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!kelasId || !siswaList) {
            alert('Pilih kelas dan muat data siswa terlebih dahulu');
            return;
        }

        const presensiArray = Object.values(presensiData);

        setProcessing(true);
        router.post(
            route('presensi.siswa.store-absen'),
            {
                kelas_id: parseInt(kelasId),
                tanggal,
                presensi: presensiArray as any,
            },
            {
                onFinish: () => setProcessing(false),
            }
        );
    };

    const stats = siswaList
        ? {
              hadir: Object.values(presensiData).filter((p) => p.status === 'hadir').length,
              izin: Object.values(presensiData).filter((p) => p.status === 'izin').length,
              sakit: Object.values(presensiData).filter((p) => p.status === 'sakit').length,
              alpha: Object.values(presensiData).filter((p) => p.status === 'alpha').length,
          }
        : null;

    return (
        <SidebarLayout>
            <Head title="Ambil Absen Siswa" />

            <div className="relative py-6 sm:py-8">
                {/* Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-teal-300/40 blur-3xl" />
                    <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Ambil Absen Siswa</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Isi presensi untuk seluruh siswa dalam satu kelas
                            </p>
                        </div>
                        <Link
                            href={route('presensi.siswa.index')}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Kembali
                        </Link>
                    </div>

                    {/* Selection Form */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pilih Kelas & Tanggal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kelas <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={kelasId}
                                    onChange={(e) => setKelasId(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                >
                                    <option value="">Pilih Kelas</option>
                                    {kelasList.map((kelas) => (
                                        <option key={kelas.id} value={kelas.id}>
                                            {kelas.nama_kelas} - {kelas.jenjang.nama}
                                            {kelas.jurusan ? ` - ${kelas.jurusan.nama}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={tanggal}
                                    onChange={(e) => setTanggal(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={handleLoadSiswa}
                                    className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
                                >
                                    Muat Data Siswa
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Quick Actions */}
                    {siswaList && stats && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                                    <div className="text-2xl font-bold text-green-700">{stats.hadir}</div>
                                    <div className="text-sm text-green-600">Hadir</div>
                                </div>
                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                    <div className="text-2xl font-bold text-blue-700">{stats.izin}</div>
                                    <div className="text-sm text-blue-600">Izin</div>
                                </div>
                                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                                    <div className="text-2xl font-bold text-yellow-700">{stats.sakit}</div>
                                    <div className="text-sm text-yellow-600">Sakit</div>
                                </div>
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                                    <div className="text-2xl font-bold text-red-700">{stats.alpha}</div>
                                    <div className="text-sm text-red-600">Alpha</div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Aksi Cepat</h3>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleSetAllStatus('hadir')}
                                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                                    >
                                        Tandai Semua Hadir
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSetAllStatus('izin')}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Tandai Semua Izin
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSetAllStatus('sakit')}
                                        className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 transition-colors"
                                    >
                                        Tandai Semua Sakit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSetAllStatus('alpha')}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                                    >
                                        Tandai Semua Alpha
                                    </button>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Set Jam Global</h4>
                                    <div className="flex flex-wrap items-end gap-3">
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-xs text-gray-600 mb-1">Jam Masuk</label>
                                            <input
                                                type="time"
                                                value={jamMasukGlobal}
                                                onChange={(e) => setJamMasukGlobal(e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-xs text-gray-600 mb-1">Jam Keluar</label>
                                            <input
                                                type="time"
                                                value={jamKeluarGlobal}
                                                onChange={(e) => setJamKeluarGlobal(e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleApplyGlobalTime}
                                            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                                        >
                                            Terapkan ke Semua
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Student List */}
                    {siswaList && (
                        <form onSubmit={handleSubmit}>
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Daftar Siswa ({siswaList.length} siswa)
                                    </h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    No
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    NIS
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nama Siswa
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jam Masuk
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jam Keluar
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Keterangan
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {siswaList.map((siswa, index) => {
                                                const getButtonClass = (status: string, currentStatus: string) => {
                                                    if (currentStatus === status) {
                                                        if (status === 'hadir') return 'bg-green-500 text-white';
                                                        if (status === 'izin') return 'bg-blue-500 text-white';
                                                        if (status === 'sakit') return 'bg-yellow-500 text-white';
                                                        if (status === 'alpha') return 'bg-red-500 text-white';
                                                    }
                                                    return 'bg-gray-300 text-gray-700 hover:bg-gray-400';
                                                };

                                                return (
                                                    <tr key={siswa.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {siswa.nis}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {siswa.nama_lengkap}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex gap-1">
                                                                {(['hadir', 'izin', 'sakit', 'alpha'] as const).map(
                                                                    (status) => (
                                                                        <button
                                                                            key={status}
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleStatusChange(siswa.id, status)
                                                                            }
                                                                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${getButtonClass(
                                                                                status,
                                                                                presensiData[siswa.id]?.status
                                                                            )}`}
                                                                            title={
                                                                                status.charAt(0).toUpperCase() +
                                                                                status.slice(1)
                                                                            }
                                                                        >
                                                                            {status === 'hadir' && '✓'}
                                                                            {status === 'izin' && 'I'}
                                                                            {status === 'sakit' && 'S'}
                                                                            {status === 'alpha' && 'A'}
                                                                        </button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="time"
                                                                value={presensiData[siswa.id]?.jam_masuk || ''}
                                                                onChange={(e) =>
                                                                    handleFieldChange(
                                                                        siswa.id,
                                                                        'jam_masuk',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="time"
                                                                value={presensiData[siswa.id]?.jam_keluar || ''}
                                                                onChange={(e) =>
                                                                    handleFieldChange(
                                                                        siswa.id,
                                                                        'jam_keluar',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="text"
                                                                value={presensiData[siswa.id]?.keterangan || ''}
                                                                onChange={(e) =>
                                                                    handleFieldChange(
                                                                        siswa.id,
                                                                        'keterangan',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Keterangan (opsional)"
                                                                className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                                    <Link
                                        href={route('presensi.siswa.index')}
                                        className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Presensi'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Empty State */}
                    {!siswaList && (
                        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Pilih Kelas dan Tanggal</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Pilih kelas dan tanggal di atas, kemudian klik "Muat Data Siswa" untuk memulai
                                mengambil absen.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
