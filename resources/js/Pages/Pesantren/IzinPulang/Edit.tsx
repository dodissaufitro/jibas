import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Siswa {
    id: number;
    nis: string;
    nama_lengkap: string;
    kelas: {
        nama_kelas: string;
    };
}

interface IzinPulang {
    id: number;
    siswa_id: number;
    jenis_izin: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    alasan: string;
    tujuan: string;
    nama_penjemput: string;
    hubungan_penjemput: string;
    telepon_penjemput: string;
    status: string;
}

interface Props {
    izin: IzinPulang;
    siswa: Siswa[];
}

export default function Edit({ izin, siswa }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        siswa_id: izin.siswa_id.toString(),
        jenis_izin: izin.jenis_izin,
        tanggal_mulai: izin.tanggal_mulai,
        tanggal_selesai: izin.tanggal_selesai,
        alasan: izin.alasan,
        tujuan: izin.tujuan,
        nama_penjemput: izin.nama_penjemput,
        hubungan_penjemput: izin.hubungan_penjemput,
        telepon_penjemput: izin.telepon_penjemput,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('pesantren.izin-pulang.update', izin.id));
    };

    return (
        <SidebarLayout>
            <Head title="Edit Izin Pulang" />
            
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Izin Pulang</h1>
                    <p className="text-gray-600 mt-2">Perbarui informasi izin pulang santri</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Data Santri */}
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Data Santri</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Santri <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.siswa_id}
                                    onChange={(e) => setData('siswa_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Pilih Santri</option>
                                    {siswa.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nis} - {s.nama_lengkap} ({s.kelas?.nama_kelas})
                                        </option>
                                    ))}
                                </select>
                                {errors.siswa_id && <p className="text-red-500 text-xs mt-1">{errors.siswa_id}</p>}
                            </div>
                        </div>

                        {/* Informasi Izin */}
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informasi Izin</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Jenis Izin <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.jenis_izin}
                                        onChange={(e) => setData('jenis_izin', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="pulang">Pulang</option>
                                        <option value="sakit">Sakit</option>
                                        <option value="keperluan_keluarga">Keperluan Keluarga</option>
                                        <option value="acara">Acara</option>
                                    </select>
                                    {errors.jenis_izin && <p className="text-red-500 text-xs mt-1">{errors.jenis_izin}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tujuan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tujuan}
                                        onChange={(e) => setData('tujuan', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Alamat tujuan"
                                        required
                                    />
                                    {errors.tujuan && <p className="text-red-500 text-xs mt-1">{errors.tujuan}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tanggal Mulai <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.tanggal_mulai && <p className="text-red-500 text-xs mt-1">{errors.tanggal_mulai}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tanggal Selesai <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.tanggal_selesai && <p className="text-red-500 text-xs mt-1">{errors.tanggal_selesai}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Alasan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.alasan}
                                        onChange={(e) => setData('alasan', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Jelaskan alasan izin pulang"
                                        required
                                    />
                                    {errors.alasan && <p className="text-red-500 text-xs mt-1">{errors.alasan}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Data Penjemput */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Data Penjemput</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Penjemput <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_penjemput}
                                        onChange={(e) => setData('nama_penjemput', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Nama lengkap penjemput"
                                        required
                                    />
                                    {errors.nama_penjemput && <p className="text-red-500 text-xs mt-1">{errors.nama_penjemput}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Hubungan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.hubungan_penjemput}
                                        onChange={(e) => setData('hubungan_penjemput', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="Ayah">Ayah</option>
                                        <option value="Ibu">Ibu</option>
                                        <option value="Kakak">Kakak</option>
                                        <option value="Adik">Adik</option>
                                        <option value="Paman">Paman</option>
                                        <option value="Bibi">Bibi</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                    {errors.hubungan_penjemput && <p className="text-red-500 text-xs mt-1">{errors.hubungan_penjemput}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        No. Telepon <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.telepon_penjemput}
                                        onChange={(e) => setData('telepon_penjemput', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="08xxxxxxxxxx"
                                        required
                                    />
                                    {errors.telepon_penjemput && <p className="text-red-500 text-xs mt-1">{errors.telepon_penjemput}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Status Info (Read-only) */}
                        {izin.status !== 'pending' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <span className="font-medium">Status saat ini:</span>{' '}
                                    <span className="uppercase">{izin.status}</span>
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Catatan: Perubahan data tidak akan mengubah status persetujuan yang sudah ada
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Link
                                href={route('pesantren.izin-pulang.index')}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Perbarui'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
