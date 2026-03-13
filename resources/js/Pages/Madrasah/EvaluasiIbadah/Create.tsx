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

interface Props {
    siswa: Siswa[];
}

export default function Create({ siswa }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        shalat_wajib: '',
        shalat_dhuha: '',
        shalat_tahajud: '',
        tadarus_quran: '',
        hafalan_quran: '',
        puasa_sunnah: '',
        infaq_sedekah: '',
        akhlak_harian: '',
        catatan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('madrasah.evaluasi-ibadah.store'));
    };

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    return (
        <SidebarLayout>
            <Head title="Tambah Evaluasi Ibadah" />
            
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Tambah Evaluasi Ibadah</h1>
                    <p className="text-gray-600 mt-2">Catat evaluasi pelaksanaan ibadah siswa bulanan</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Data Siswa & Periode */}
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Data Siswa & Periode</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Siswa <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.siswa_id}
                                        onChange={(e) => setData('siswa_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Pilih Siswa</option>
                                        {siswa.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.nis} - {s.nama_lengkap} ({s.kelas?.nama_kelas})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.siswa_id && <p className="text-red-500 text-xs mt-1">{errors.siswa_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Bulan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.bulan}
                                        onChange={(e) => setData('bulan', parseInt(e.target.value))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        {months.map((month, index) => (
                                            <option key={index} value={index + 1}>{month}</option>
                                        ))}
                                    </select>
                                    {errors.bulan && <p className="text-red-500 text-xs mt-1">{errors.bulan}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tahun <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.tahun}
                                        onChange={(e) => setData('tahun', parseInt(e.target.value))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        {years.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    {errors.tahun && <p className="text-red-500 text-xs mt-1">{errors.tahun}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Shalat */}
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Evaluasi Shalat (%)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Shalat Wajib <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.shalat_wajib}
                                        onChange={(e) => setData('shalat_wajib', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        required
                                    />
                                    {errors.shalat_wajib && <p className="text-red-500 text-xs mt-1">{errors.shalat_wajib}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Shalat Dhuha <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.shalat_dhuha}
                                        onChange={(e) => setData('shalat_dhuha', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        required
                                    />
                                    {errors.shalat_dhuha && <p className="text-red-500 text-xs mt-1">{errors.shalat_dhuha}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Shalat Tahajud <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.shalat_tahajud}
                                        onChange={(e) => setData('shalat_tahajud', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        required
                                    />
                                    {errors.shalat_tahajud && <p className="text-red-500 text-xs mt-1">{errors.shalat_tahajud}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Al-Quran & Ibadah Lainnya */}
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Al-Quran & Ibadah Lainnya (%)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tadarus Al-Quran <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.tadarus_quran}
                                        onChange={(e) => setData('tadarus_quran', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        required
                                    />
                                    {errors.tadarus_quran && <p className="text-red-500 text-xs mt-1">{errors.tadarus_quran}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Hafalan Al-Quran <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.hafalan_quran}
                                        onChange={(e) => setData('hafalan_quran', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        required
                                    />
                                    {errors.hafalan_quran && <p className="text-red-500 text-xs mt-1">{errors.hafalan_quran}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Puasa Sunnah <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.puasa_sunnah}
                                        onChange={(e) => setData('puasa_sunnah', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        required
                                    />
                                    {errors.puasa_sunnah && <p className="text-red-500 text-xs mt-1">{errors.puasa_sunnah}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Infaq/Sedekah <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.infaq_sedekah}
                                        onChange={(e) => setData('infaq_sedekah', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        required
                                    />
                                    {errors.infaq_sedekah && <p className="text-red-500 text-xs mt-1">{errors.infaq_sedekah}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Akhlak & Catatan */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Akhlak & Catatan</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Akhlak Harian (%) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.akhlak_harian}
                                        onChange={(e) => setData('akhlak_harian', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        required
                                    />
                                    {errors.akhlak_harian && <p className="text-red-500 text-xs mt-1">{errors.akhlak_harian}</p>}
                                    <p className="text-xs text-gray-500 mt-1">Evaluasi perilaku dan sikap sehari-hari</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Catatan</label>
                                    <textarea
                                        value={data.catatan}
                                        onChange={(e) => setData('catatan', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Catatan khusus terkait evaluasi ibadah siswa bulan ini"
                                    />
                                    {errors.catatan && <p className="text-red-500 text-xs mt-1">{errors.catatan}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Link
                                href={route('madrasah.evaluasi-ibadah.index')}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Batal
                            </Link>
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
