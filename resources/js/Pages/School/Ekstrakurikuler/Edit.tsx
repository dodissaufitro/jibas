import { Head, Link, useForm, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Pembina {
    id: number;
    name: string;
}

interface Ekstrakurikuler {
    id: number;
    nama_ekskul: string;
    kategori: string;
    deskripsi: string;
    pembina_id: number;
    jadwal: Array<{
        hari: string;
        waktu_mulai: string;
        waktu_selesai: string;
        tempat: string;
    }>;
    kuota: number;
    biaya: number;
    status: string;
}

interface Props {
    ekstrakurikuler: Ekstrakurikuler;
    pembina: Pembina[];
}

export default function Edit({ ekstrakurikuler, pembina }: Props) {
    const jadwalFirst = ekstrakurikuler.jadwal?.[0] || {
        hari: '',
        waktu_mulai: '',
        waktu_selesai: '',
        tempat: '',
    };

    const { data, setData, put, processing, errors } = useForm({
        nama_ekskul: ekstrakurikuler.nama_ekskul,
        kategori: ekstrakurikuler.kategori,
        deskripsi: ekstrakurikuler.deskripsi || '',
        pembina_id: ekstrakurikuler.pembina_id.toString(),
        hari: jadwalFirst.hari,
        waktu_mulai: jadwalFirst.waktu_mulai,
        waktu_selesai: jadwalFirst.waktu_selesai,
        tempat: jadwalFirst.tempat,
        kuota: ekstrakurikuler.kuota.toString(),
        biaya: ekstrakurikuler.biaya.toString(),
        status: ekstrakurikuler.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Build jadwal JSON from separate fields
        const jadwalData = {
            hari: data.hari,
            waktu_mulai: data.waktu_mulai,
            waktu_selesai: data.waktu_selesai,
            tempat: data.tempat,
        };
        
        // Submit with transformed data using router
        router.put(route('school.ekstrakurikuler.update', ekstrakurikuler.id), {
            nama_ekskul: data.nama_ekskul,
            kategori: data.kategori,
            deskripsi: data.deskripsi,
            pembina_id: data.pembina_id,
            jadwal: JSON.stringify([jadwalData]),
            kuota: data.kuota,
            biaya: data.biaya,
            status: data.status,
        });
    };

    return (
        <SidebarLayout>
            <Head title="Edit Ekstrakurikuler" />
            
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Ekstrakurikuler</h1>
                    <p className="text-gray-600 mt-2">Perbarui informasi ekstrakurikuler</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informasi Dasar */}
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informasi Dasar</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Ekstrakurikuler <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_ekskul}
                                        onChange={(e) => setData('nama_ekskul', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.nama_ekskul && <p className="text-red-500 text-xs mt-1">{errors.nama_ekskul}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.kategori}
                                        onChange={(e) => setData('kategori', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="olahraga">Olahraga</option>
                                        <option value="seni">Seni</option>
                                        <option value="sains">Sains</option>
                                        <option value="bahasa">Bahasa</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                    {errors.kategori && <p className="text-red-500 text-xs mt-1">{errors.kategori}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                    <textarea
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Pembina <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.pembina_id}
                                        onChange={(e) => setData('pembina_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Pilih Pembina</option>
                                        {pembina.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.pembina_id && <p className="text-red-500 text-xs mt-1">{errors.pembina_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="aktif">Aktif</option>
                                        <option value="nonaktif">Nonaktif</option>
                                    </select>
                                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Jadwal */}
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Jadwal Kegiatan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Hari <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.hari}
                                        onChange={(e) => setData('hari', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Pilih Hari</option>
                                        <option value="Senin">Senin</option>
                                        <option value="Selasa">Selasa</option>
                                        <option value="Rabu">Rabu</option>
                                        <option value="Kamis">Kamis</option>
                                        <option value="Jumat">Jumat</option>
                                        <option value="Sabtu">Sabtu</option>
                                        <option value="Minggu">Minggu</option>
                                    </select>
                                    {errors.hari && <p className="text-red-500 text-xs mt-1">{errors.hari}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tempat <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tempat}
                                        onChange={(e) => setData('tempat', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Lapangan, Lab, ruang kelas, dll"
                                        required
                                    />
                                    {errors.tempat && <p className="text-red-500 text-xs mt-1">{errors.tempat}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Waktu Mulai <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={data.waktu_mulai}
                                        onChange={(e) => setData('waktu_mulai', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.waktu_mulai && <p className="text-red-500 text-xs mt-1">{errors.waktu_mulai}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Waktu Selesai <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={data.waktu_selesai}
                                        onChange={(e) => setData('waktu_selesai', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.waktu_selesai && <p className="text-red-500 text-xs mt-1">{errors.waktu_selesai}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Kuota dan Biaya */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Kuota dan Biaya</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Kuota Peserta <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.kuota}
                                        onChange={(e) => setData('kuota', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="1"
                                        required
                                    />
                                    {errors.kuota && <p className="text-red-500 text-xs mt-1">{errors.kuota}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Biaya (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.biaya}
                                        onChange={(e) => setData('biaya', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="0"
                                        placeholder="0"
                                    />
                                    {errors.biaya && <p className="text-red-500 text-xs mt-1">{errors.biaya}</p>}
                                    <p className="text-xs text-gray-500 mt-1">Kosongkan jika gratis</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Link
                                href={route('school.ekstrakurikuler.index')}
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
