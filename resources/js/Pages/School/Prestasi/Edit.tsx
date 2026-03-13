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

interface Prestasi {
    id: number;
    siswa_id: number;
    jenis: string;
    kategori: string;
    nama_prestasi: string;
    tingkat: string;
    peringkat: number;
    penyelenggara: string;
    tanggal_prestasi: string;
    keterangan: string;
    sertifikat_file: string | null;
}

interface Props {
    prestasi: Prestasi;
    siswa: Siswa[];
}

export default function Edit({ prestasi, siswa }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        siswa_id: prestasi.siswa_id.toString(),
        jenis: prestasi.jenis,
        kategori: prestasi.kategori,
        nama_prestasi: prestasi.nama_prestasi,
        tingkat: prestasi.tingkat,
        peringkat: prestasi.peringkat.toString(),
        penyelenggara: prestasi.penyelenggara,
        tanggal_prestasi: prestasi.tanggal_prestasi,
        keterangan: prestasi.keterangan || '',
        sertifikat_file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('school.prestasi.update', prestasi.id));
    };

    return (
        <SidebarLayout>
            <Head title="Edit Prestasi" />
            
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Prestasi Siswa</h1>
                    <p className="text-gray-600 mt-2">Perbarui data prestasi siswa</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Data Siswa */}
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Data Siswa</h2>
                            <div>
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
                        </div>

                        {/* Informasi Prestasi */}
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informasi Prestasi</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Jenis Prestasi <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.jenis}
                                        onChange={(e) => setData('jenis', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="akademik">Akademik</option>
                                        <option value="non_akademik">Non-Akademik</option>
                                    </select>
                                    {errors.jenis && <p className="text-red-500 text-xs mt-1">{errors.jenis}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.kategori}
                                        onChange={(e) => setData('kategori', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Olimpiade, Olahraga, Seni, dll"
                                        required
                                    />
                                    {errors.kategori && <p className="text-red-500 text-xs mt-1">{errors.kategori}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Prestasi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_prestasi}
                                        onChange={(e) => setData('nama_prestasi', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Juara 1 Olimpiade Matematika"
                                        required
                                    />
                                    {errors.nama_prestasi && <p className="text-red-500 text-xs mt-1">{errors.nama_prestasi}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tingkat <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.tingkat}
                                        onChange={(e) => setData('tingkat', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="sekolah">Sekolah</option>
                                        <option value="kecamatan">Kecamatan</option>
                                        <option value="kabupaten">Kabupaten</option>
                                        <option value="provinsi">Provinsi</option>
                                        <option value="nasional">Nasional</option>
                                        <option value="internasional">Internasional</option>
                                    </select>
                                    {errors.tingkat && <p className="text-red-500 text-xs mt-1">{errors.tingkat}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Peringkat <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.peringkat}
                                        onChange={(e) => setData('peringkat', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="1"
                                        placeholder="1, 2, 3, dst"
                                        required
                                    />
                                    {errors.peringkat && <p className="text-red-500 text-xs mt-1">{errors.peringkat}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Penyelenggara <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.penyelenggara}
                                        onChange={(e) => setData('penyelenggara', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Nama lembaga penyelenggara"
                                        required
                                    />
                                    {errors.penyelenggara && <p className="text-red-500 text-xs mt-1">{errors.penyelenggara}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tanggal Prestasi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal_prestasi}
                                        onChange={(e) => setData('tanggal_prestasi', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.tanggal_prestasi && <p className="text-red-500 text-xs mt-1">{errors.tanggal_prestasi}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Dokumen */}
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Dokumen Pendukung</h2>
                            <div className="space-y-4">
                                {prestasi.sertifikat_file && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <p className="text-sm text-blue-800">
                                            <span className="font-medium">File saat ini:</span>{' '}
                                            <a href={`/storage/${prestasi.sertifikat_file}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
                                                Lihat Sertifikat
                                            </a>
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {prestasi.sertifikat_file ? 'Ganti Sertifikat' : 'Sertifikat'} (PDF/JPG/PNG, max 2MB)
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setData('sertifikat_file', e.target.files?.[0] || null)}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    {errors.sertifikat_file && <p className="text-red-500 text-xs mt-1">{errors.sertifikat_file}</p>}
                                    <p className="text-xs text-gray-500 mt-1">
                                        {prestasi.sertifikat_file ? 'Kosongkan jika tidak ingin mengganti' : 'Upload sertifikat atau bukti prestasi'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                                    <textarea
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Keterangan tambahan tentang prestasi ini"
                                    />
                                    {errors.keterangan && <p className="text-red-500 text-xs mt-1">{errors.keterangan}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <Link
                                href={route('school.prestasi.index')}
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
