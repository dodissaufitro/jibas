import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Siswa {
    id: number;
    nis: string;
    nisn?: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    alamat?: string;
    email?: string;
    no_hp?: string;
    nama_ayah?: string;
    nama_ibu?: string;
    no_hp_ortu?: string;
    status: string;
    tanggal_masuk?: string;
    foto?: string;
    kelas?: { nama_kelas: string; jenjang: { nama: string } };
    institution?: { name: string };
    user?: { email: string };
    presensi: Presensi[];
    tagihan: Tagihan[];
    nilai: Nilai[];
    orang_tua?: OrangTua;
}

interface Presensi {
    id: number;
    tanggal: string;
    status: string;
    keterangan?: string;
}

interface Tagihan {
    id: number;
    nomor_tagihan: string;
    jumlah: number;
    denda: number;
    total: number;
    status: string;
    jatuh_tempo?: string;
}

interface Nilai {
    id: number;
    nilai_harian?: number;
    nilai_uts?: number;
    nilai_uas?: number;
    nilai_akhir?: number;
    nilai_sikap?: string;
    catatan?: string;
    mata_pelajaran?: { nama: string };
}

interface OrangTua {
    id: number;
    nama_ayah?: string;
    nik_ayah?: string;
    pekerjaan_ayah?: string;
    penghasilan_ayah?: number;
    nama_ibu?: string;
    nik_ibu?: string;
    pekerjaan_ibu?: string;
    penghasilan_ibu?: number;
    alamat?: string;
    no_hp?: string;
    email?: string;
}

interface ActivityLog {
    id: number;
    action: string;
    description: string;
    created_at: string;
    user?: { name: string };
}

interface Props {
    siswa: Siswa;
    rekapPresensi: Record<string, number>;
    activityLog: ActivityLog[];
}

export default function Show({ siswa, rekapPresensi, activityLog }: Props) {
    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            aktif: 'bg-green-100 text-green-800',
            lulus: 'bg-blue-100 text-blue-800',
            pindah: 'bg-yellow-100 text-yellow-800',
            keluar: 'bg-red-100 text-red-800',
        };
        return map[status] ?? 'bg-gray-100 text-gray-800';
    };

    const getPresensiColor = (status: string) => {
        const map: Record<string, string> = {
            hadir: 'bg-green-50 border-green-200 text-green-700',
            sakit: 'bg-yellow-50 border-yellow-200 text-yellow-700',
            izin: 'bg-blue-50 border-blue-200 text-blue-700',
            alpha: 'bg-red-50 border-red-200 text-red-700',
        };
        return map[status] ?? 'bg-gray-50 border-gray-200 text-gray-700';
    };

    const formatRupiah = (n: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    return (
        <SidebarLayout>
            <Head title={`Detail Siswa - ${siswa.nama_lengkap}`} />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-2xl text-gray-800">Detail Siswa</h2>
                    <p className="text-sm text-gray-600 mt-1">Profil lengkap dan riwayat aktivitas</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={route('akademik.siswa.edit', siswa.id)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                    >
                        Edit Data
                    </Link>
                    <button
                        onClick={() => {
                            if (confirm(`Reset password ${siswa.nama_lengkap} ke NIS (${siswa.nis})?`)) {
                                router.post(route('akademik.siswa.reset-password', siswa.id));
                            }
                        }}
                        className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg"
                    >
                        Reset Password
                    </button>
                    <Link
                        href={route('akademik.siswa.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg"
                    >
                        ← Kembali
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col items-center mb-4">
                            {siswa.foto ? (
                                <img
                                    src={`/storage/${siswa.foto}`}
                                    alt={siswa.nama_lengkap}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-blue-200">
                                    {siswa.nama_lengkap.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <h3 className="mt-3 text-lg font-bold text-gray-900">{siswa.nama_lengkap}</h3>
                            <p className="text-sm text-gray-500">NIS: {siswa.nis}</p>
                            <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(siswa.status)}`}>
                                {siswa.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">NISN</span>
                                <span className="font-medium">{siswa.nisn || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Kelas</span>
                                <span className="font-medium">
                                    {siswa.kelas ? `${siswa.kelas.jenjang.nama} ${siswa.kelas.nama_kelas}` : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Jenis Kelamin</span>
                                <span className="font-medium">{siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tempat Lahir</span>
                                <span className="font-medium">{siswa.tempat_lahir || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tanggal Lahir</span>
                                <span className="font-medium">{siswa.tanggal_lahir || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Email</span>
                                <span className="font-medium text-xs">{siswa.email || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">No. HP</span>
                                <span className="font-medium">{siswa.no_hp || '-'}</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <p className="text-gray-500 text-xs font-semibold mb-1">DATA ORANG TUA</p>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Nama Ayah</span>
                                    <span className="font-medium">{siswa.nama_ayah || '-'}</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-gray-500">Nama Ibu</span>
                                    <span className="font-medium">{siswa.nama_ibu || '-'}</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-gray-500">No. HP Ortu</span>
                                    <span className="font-medium">{siswa.no_hp_ortu || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Rekap Presensi */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h4 className="text-base font-semibold text-gray-800 mb-4">Rekap Presensi</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {(['hadir', 'sakit', 'izin', 'alpha'] as const).map((s) => (
                                <div key={s} className={`p-3 rounded-lg border ${getPresensiColor(s)} text-center`}>
                                    <p className="text-2xl font-bold">{rekapPresensi[s] ?? 0}</p>
                                    <p className="text-xs capitalize font-medium">{s}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Presensi Table */}
                    {siswa.presensi.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-base font-semibold text-gray-800 mb-4">Riwayat Presensi (30 Terakhir)</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {siswa.presensi.map((p) => (
                                            <tr key={p.id}>
                                                <td className="px-4 py-2">{p.tanggal}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPresensiColor(p.status)}`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-gray-500">{p.keterangan || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Tagihan */}
                    {siswa.tagihan.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-base font-semibold text-gray-800 mb-4">Tagihan</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No. Tagihan</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jatuh Tempo</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {siswa.tagihan.map((t) => (
                                            <tr key={t.id}>
                                                <td className="px-4 py-2 font-medium">{t.nomor_tagihan}</td>
                                                <td className="px-4 py-2">{formatRupiah(t.total)}</td>
                                                <td className="px-4 py-2 text-gray-500">{t.jatuh_tempo || '-'}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        t.status === 'lunas' ? 'bg-green-100 text-green-800' : t.status === 'dibayar_sebagian' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Nilai */}
                    {siswa.nilai && siswa.nilai.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-base font-semibold text-gray-800 mb-4">Nilai</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mata Pelajaran</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Harian</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">UTS</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">UAS</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Akhir</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Sikap</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {siswa.nilai.map((n) => (
                                            <tr key={n.id}>
                                                <td className="px-4 py-2 font-medium">{n.mata_pelajaran?.nama ?? '-'}</td>
                                                <td className="px-4 py-2 text-center">{n.nilai_harian ?? '-'}</td>
                                                <td className="px-4 py-2 text-center">{n.nilai_uts ?? '-'}</td>
                                                <td className="px-4 py-2 text-center">{n.nilai_uas ?? '-'}</td>
                                                <td className="px-4 py-2 text-center font-semibold text-blue-700">{n.nilai_akhir ?? '-'}</td>
                                                <td className="px-4 py-2 text-center">{n.nilai_sikap ?? '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Data Orang Tua Lengkap */}
                    {siswa.orang_tua && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-base font-semibold text-gray-800 mb-4">Data Orang Tua Lengkap</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ayah</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Nama</span>
                                            <span className="font-medium">{siswa.orang_tua.nama_ayah || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">NIK</span>
                                            <span className="font-medium">{siswa.orang_tua.nik_ayah || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Pekerjaan</span>
                                            <span className="font-medium">{siswa.orang_tua.pekerjaan_ayah || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Penghasilan</span>
                                            <span className="font-medium">{siswa.orang_tua.penghasilan_ayah ? formatRupiah(siswa.orang_tua.penghasilan_ayah) : '-'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ibu</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Nama</span>
                                            <span className="font-medium">{siswa.orang_tua.nama_ibu || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">NIK</span>
                                            <span className="font-medium">{siswa.orang_tua.nik_ibu || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Pekerjaan</span>
                                            <span className="font-medium">{siswa.orang_tua.pekerjaan_ibu || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Penghasilan</span>
                                            <span className="font-medium">{siswa.orang_tua.penghasilan_ibu ? formatRupiah(siswa.orang_tua.penghasilan_ibu) : '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {siswa.orang_tua.no_hp && (
                                <div className="mt-4 pt-4 border-t text-sm flex gap-6">
                                    <div><span className="text-gray-500">No. HP: </span><span className="font-medium">{siswa.orang_tua.no_hp}</span></div>
                                    {siswa.orang_tua.email && <div><span className="text-gray-500">Email: </span><span className="font-medium">{siswa.orang_tua.email}</span></div>}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Activity Log */}
                    {activityLog.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-base font-semibold text-gray-800 mb-4">Log Aktivitas</h4>
                            <div className="space-y-3">
                                {activityLog.map((log) => (
                                    <div key={log.id} className="flex items-start gap-3 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                        <div>
                                            <p className="text-gray-800">{log.description}</p>
                                            <p className="text-gray-400 text-xs">
                                                {log.user?.name ?? 'Sistem'} &middot; {new Date(log.created_at).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
