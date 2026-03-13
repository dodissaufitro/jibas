import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface TahunAjaran {
    id: number;
    nama: string;
}

interface Jenjang {
    id: number;
    nama: string;
}

interface Jurusan {
    id: number;
    nama: string;
    jenjang_id: number;
}

interface Props {
    tahunAjaran: TahunAjaran[];
    jenjang: Jenjang[];
    jurusan: Jurusan[];
}

export default function Create({ tahunAjaran, jenjang, jurusan }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tahun_ajaran_id: '',
        jenjang_id: '',
        jurusan_id: '',
        nama_lengkap: '',
        nisn: '',
        nik: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        alamat: '',
        email: '',
        no_hp: '',
        nama_ayah: '',
        nama_ibu: '',
        pekerjaan_ayah: '',
        pekerjaan_ibu: '',
        no_hp_ortu: '',
        penghasilan_ortu: '',
        jalur: '',
        status: 'pending',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('ppdb.pendaftaran.store'));
    };

    // Filter jurusan based on selected jenjang
    const filteredJurusan = data.jenjang_id
        ? jurusan.filter(j => j.jenjang_id.toString() === data.jenjang_id)
        : [];

    return (
        <SidebarLayout>
            <Head title="Tambah Pendaftaran PPDB" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Tambah Pendaftaran PPDB
            </h2>

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-8">
                            {/* Data Pendaftaran Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                                    Data Pendaftaran
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Tahun Ajaran */}
                                    <div>
                                        <label htmlFor="tahun_ajaran_id" className="block text-sm font-medium text-gray-700">
                                            Tahun Ajaran <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="tahun_ajaran_id"
                                            value={data.tahun_ajaran_id}
                                            onChange={(e) => setData('tahun_ajaran_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            autoFocus
                                        >
                                            <option value="">Pilih Tahun Ajaran</option>
                                            {tahunAjaran.map((ta) => (
                                                <option key={ta.id} value={ta.id}>
                                                    {ta.nama}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.tahun_ajaran_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.tahun_ajaran_id}</p>
                                        )}
                                    </div>

                                    {/* Jenjang */}
                                    <div>
                                        <label htmlFor="jenjang_id" className="block text-sm font-medium text-gray-700">
                                            Jenjang <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="jenjang_id"
                                            value={data.jenjang_id}
                                            onChange={(e) => {
                                                setData('jenjang_id', e.target.value);
                                                setData('jurusan_id', ''); // Reset jurusan when jenjang changes
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Pilih Jenjang</option>
                                            {jenjang.map((j) => (
                                                <option key={j.id} value={j.id}>
                                                    {j.nama}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.jenjang_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.jenjang_id}</p>
                                        )}
                                    </div>

                                    {/* Jurusan */}
                                    <div>
                                        <label htmlFor="jurusan_id" className="block text-sm font-medium text-gray-700">
                                            Jurusan
                                        </label>
                                        <select
                                            id="jurusan_id"
                                            value={data.jurusan_id}
                                            onChange={(e) => setData('jurusan_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            disabled={!data.jenjang_id}
                                        >
                                            <option value="">Pilih Jurusan</option>
                                            {filteredJurusan.map((j) => (
                                                <option key={j.id} value={j.id}>
                                                    {j.nama}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.jurusan_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.jurusan_id}</p>
                                        )}
                                    </div>

                                    {/* Jalur */}
                                    <div>
                                        <label htmlFor="jalur" className="block text-sm font-medium text-gray-700">
                                            Jalur Pendaftaran <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="jalur"
                                            value={data.jalur}
                                            onChange={(e) => setData('jalur', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Pilih Jalur</option>
                                            <option value="reguler">Reguler</option>
                                            <option value="prestasi">Prestasi</option>
                                            <option value="afirmasi">Afirmasi</option>
                                        </select>
                                        {errors.jalur && (
                                            <p className="mt-1 text-sm text-red-600">{errors.jalur}</p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                            Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="verifikasi">Verifikasi</option>
                                            <option value="lulus">Lulus</option>
                                            <option value="tidak_lulus">Tidak Lulus</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Data Pribadi Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                                    Data Pribadi
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nama Lengkap */}
                                    <div>
                                        <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="nama_lengkap"
                                            type="text"
                                            value={data.nama_lengkap}
                                            onChange={(e) => setData('nama_lengkap', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Nama lengkap calon siswa"
                                        />
                                        {errors.nama_lengkap && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nama_lengkap}</p>
                                        )}
                                    </div>

                                    {/* NISN */}
                                    <div>
                                        <label htmlFor="nisn" className="block text-sm font-medium text-gray-700">
                                            NISN <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="nisn"
                                            type="text"
                                            value={data.nisn}
                                            onChange={(e) => setData('nisn', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Nomor Induk Siswa Nasional"
                                        />
                                        {errors.nisn && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nisn}</p>
                                        )}
                                    </div>

                                    {/* NIK */}
                                    <div>
                                        <label htmlFor="nik" className="block text-sm font-medium text-gray-700">
                                            NIK
                                        </label>
                                        <input
                                            id="nik"
                                            type="text"
                                            value={data.nik}
                                            onChange={(e) => setData('nik', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Nomor Induk Kependudukan"
                                        />
                                        {errors.nik && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nik}</p>
                                        )}
                                    </div>

                                    {/* Jenis Kelamin */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jenis Kelamin <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex space-x-6">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    value="L"
                                                    checked={data.jenis_kelamin === 'L'}
                                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Laki-laki</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    value="P"
                                                    checked={data.jenis_kelamin === 'P'}
                                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Perempuan</span>
                                            </label>
                                        </div>
                                        {errors.jenis_kelamin && (
                                            <p className="mt-1 text-sm text-red-600">{errors.jenis_kelamin}</p>
                                        )}
                                    </div>

                                    {/* Tempat Lahir */}
                                    <div>
                                        <label htmlFor="tempat_lahir" className="block text-sm font-medium text-gray-700">
                                            Tempat Lahir <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="tempat_lahir"
                                            type="text"
                                            value={data.tempat_lahir}
                                            onChange={(e) => setData('tempat_lahir', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Kota tempat lahir"
                                        />
                                        {errors.tempat_lahir && (
                                            <p className="mt-1 text-sm text-red-600">{errors.tempat_lahir}</p>
                                        )}
                                    </div>

                                    {/* Tanggal Lahir */}
                                    <div>
                                        <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-gray-700">
                                            Tanggal Lahir <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="tanggal_lahir"
                                            type="date"
                                            value={data.tanggal_lahir}
                                            onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.tanggal_lahir && (
                                            <p className="mt-1 text-sm text-red-600">{errors.tanggal_lahir}</p>
                                        )}
                                    </div>

                                    {/* Alamat */}
                                    <div className="col-span-2">
                                        <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                                            Alamat <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="alamat"
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Alamat lengkap"
                                        />
                                        {errors.alamat && (
                                            <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="email@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* No HP */}
                                    <div>
                                        <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700">
                                            No. HP
                                        </label>
                                        <input
                                            id="no_hp"
                                            type="text"
                                            value={data.no_hp}
                                            onChange={(e) => setData('no_hp', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                        {errors.no_hp && (
                                            <p className="mt-1 text-sm text-red-600">{errors.no_hp}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Data Orang Tua Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                                    Data Orang Tua
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nama Ayah */}
                                    <div>
                                        <label htmlFor="nama_ayah" className="block text-sm font-medium text-gray-700">
                                            Nama Ayah <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="nama_ayah"
                                            type="text"
                                            value={data.nama_ayah}
                                            onChange={(e) => setData('nama_ayah', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Nama lengkap ayah"
                                        />
                                        {errors.nama_ayah && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nama_ayah}</p>
                                        )}
                                    </div>

                                    {/* Nama Ibu */}
                                    <div>
                                        <label htmlFor="nama_ibu" className="block text-sm font-medium text-gray-700">
                                            Nama Ibu <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="nama_ibu"
                                            type="text"
                                            value={data.nama_ibu}
                                            onChange={(e) => setData('nama_ibu', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Nama lengkap ibu"
                                        />
                                        {errors.nama_ibu && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nama_ibu}</p>
                                        )}
                                    </div>

                                    {/* Pekerjaan Ayah */}
                                    <div>
                                        <label htmlFor="pekerjaan_ayah" className="block text-sm font-medium text-gray-700">
                                            Pekerjaan Ayah <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="pekerjaan_ayah"
                                            type="text"
                                            value={data.pekerjaan_ayah}
                                            onChange={(e) => setData('pekerjaan_ayah', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Pekerjaan ayah"
                                        />
                                        {errors.pekerjaan_ayah && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pekerjaan_ayah}</p>
                                        )}
                                    </div>

                                    {/* Pekerjaan Ibu */}
                                    <div>
                                        <label htmlFor="pekerjaan_ibu" className="block text-sm font-medium text-gray-700">
                                            Pekerjaan Ibu <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="pekerjaan_ibu"
                                            type="text"
                                            value={data.pekerjaan_ibu}
                                            onChange={(e) => setData('pekerjaan_ibu', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Pekerjaan ibu"
                                        />
                                        {errors.pekerjaan_ibu && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pekerjaan_ibu}</p>
                                        )}
                                    </div>

                                    {/* No HP Orang Tua */}
                                    <div>
                                        <label htmlFor="no_hp_ortu" className="block text-sm font-medium text-gray-700">
                                            No. HP Orang Tua <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="no_hp_ortu"
                                            type="text"
                                            value={data.no_hp_ortu}
                                            onChange={(e) => setData('no_hp_ortu', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                        {errors.no_hp_ortu && (
                                            <p className="mt-1 text-sm text-red-600">{errors.no_hp_ortu}</p>
                                        )}
                                    </div>

                                    {/* Penghasilan Orang Tua */}
                                    <div>
                                        <label htmlFor="penghasilan_ortu" className="block text-sm font-medium text-gray-700">
                                            Penghasilan Orang Tua <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="penghasilan_ortu"
                                            type="number"
                                            value={data.penghasilan_ortu}
                                            onChange={(e) => setData('penghasilan_ortu', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Penghasilan per bulan"
                                            min="0"
                                        />
                                        {errors.penghasilan_ortu && (
                                            <p className="mt-1 text-sm text-red-600">{errors.penghasilan_ortu}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                <Link
                                    href={route('ppdb.pendaftaran.index')}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
