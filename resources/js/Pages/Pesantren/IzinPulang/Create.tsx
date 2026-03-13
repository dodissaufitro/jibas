import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Siswa {
    id: number;
    nama_lengkap: string;
    nis: string;
    kelas?: {
        nama_kelas: string;
    };
}

interface Props {
    siswa: Siswa[];
}

export default function Create({ siswa }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        jenis_izin: 'pulang',
        tanggal_mulai: '',
        tanggal_selesai: '',
        tujuan: '',
        penjemput_nama: '',
        penjemput_hubungan: '',
        penjemput_telepon: '',
        alasan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pesantren.izin-pulang.store'));
    };

    return (
        <SidebarLayout>
            <Head title="Tambah Izin Pulang" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Tambah Izin Pulang</h1>
                    <p className="text-gray-600">Buat pengajuan izin pulang baru</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Santri *
                            </label>
                            <select
                                value={data.siswa_id}
                                onChange={(e) => setData('siswa_id', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                required
                            >
                                <option value="">Pilih Santri</option>
                                {siswa.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.nama_lengkap} - {s.nis} ({s.kelas?.nama_kelas})
                                    </option>
                                ))}
                            </select>
                            {errors.siswa_id && <p className="mt-1 text-sm text-red-600">{errors.siswa_id}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Izin *
                                </label>
                                <select
                                    value={data.jenis_izin}
                                    onChange={(e) => setData('jenis_izin', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    required
                                >
                                    <option value="pulang">Pulang</option>
                                    <option value="sakit">Sakit</option>
                                    <option value="keperluan_keluarga">Keperluan Keluarga</option>
                                    <option value="acara">Acara</option>
                                </select>
                                {errors.jenis_izin && <p className="mt-1 text-sm text-red-600">{errors.jenis_izin}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tujuan *
                                </label>
                                <input
                                    type="text"
                                    value={data.tujuan}
                                    onChange={(e) => setData('tujuan', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    required
                                />
                                {errors.tujuan && <p className="mt-1 text-sm text-red-600">{errors.tujuan}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Mulai *
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    required
                                />
                                {errors.tanggal_mulai && <p className="mt-1 text-sm text-red-600">{errors.tanggal_mulai}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Selesai *
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    required
                                />
                                {errors.tanggal_selesai && <p className="mt-1 text-sm text-red-600">{errors.tanggal_selesai}</p>}
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Data Penjemput</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Penjemput *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.penjemput_nama}
                                        onChange={(e) => setData('penjemput_nama', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        required
                                    />
                                    {errors.penjemput_nama && <p className="mt-1 text-sm text-red-600">{errors.penjemput_nama}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hubungan *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.penjemput_hubungan}
                                        onChange={(e) => setData('penjemput_hubungan', e.target.value)}
                                        placeholder="Ayah/Ibu/Kakak/dll"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        required
                                    />
                                    {errors.penjemput_hubungan && <p className="mt-1 text-sm text-red-600">{errors.penjemput_hubungan}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telepon *
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.penjemput_telepon}
                                        onChange={(e) => setData('penjemput_telepon', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        required
                                    />
                                    {errors.penjemput_telepon && <p className="mt-1 text-sm text-red-600">{errors.penjemput_telepon}</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alasan *
                            </label>
                            <textarea
                                value={data.alasan}
                                onChange={(e) => setData('alasan', e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                required
                            />
                            {errors.alasan && <p className="mt-1 text-sm text-red-600">{errors.alasan}</p>}
                        </div>

                        <div className="flex justify-end gap-4">
                            <a
                                href={route('pesantren.izin-pulang.index')}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
