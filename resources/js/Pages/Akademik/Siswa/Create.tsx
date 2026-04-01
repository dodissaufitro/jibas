import React, { FormEventHandler, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Kelas {
    id: number;
    nama: string;
    jenjang: {
        nama: string;
    };
}

interface Props {
    kelas: Kelas[];
}

export default function Create({ kelas }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        nis: string; nisn: string; nik: string; nama_lengkap: string;
        jenis_kelamin: string; tempat_lahir: string; tanggal_lahir: string;
        alamat: string; email: string; no_hp: string; nama_ayah: string;
        nama_ibu: string; no_hp_ortu: string; kelas_id: string;
        status: string; tanggal_masuk: string; foto: File | null;
    }>({
        nis: '',
        nisn: '',
        nik: '',
        nama_lengkap: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        alamat: '',
        email: '',
        no_hp: '',
        nama_ayah: '',
        nama_ibu: '',
        no_hp_ortu: '',
        kelas_id: '',
        status: 'aktif',
        tanggal_masuk: '',
        foto: null,
    });

    const fotoRef = useRef<HTMLInputElement>(null);
    const [fotoPreview, setFotoPreview] = React.useState<string | null>(null);

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('foto', file);
        if (file) setFotoPreview(URL.createObjectURL(file));
        else setFotoPreview(null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('akademik.siswa.store'), { forceFormData: true });
    };

    return (
        <SidebarLayout>
            <Head title="Tambah Siswa" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Tambah Siswa
            </h2>

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-8">
                            {/* Data Pribadi Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                                    Data Pribadi
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* NIS */}
                                    <div>
                                        <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
                                            NIS <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="nis"
                                            type="text"
                                            value={data.nis}
                                            onChange={(e) => setData('nis', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Nomor Induk Siswa"
                                            autoFocus
                                        />
                                        {errors.nis && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nis}</p>
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
                                            placeholder="Nama lengkap siswa"
                                        />
                                        {errors.nama_lengkap && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nama_lengkap}</p>
                                        )}
                                    </div>

                                    {/* Jenis Kelamin */}
                                    <div className="col-span-2">
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
                                            placeholder="Alamat lengkap siswa"
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

                                    {/* Foto */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Foto Siswa</label>
                                        <div className="mt-1 flex items-center gap-4">
                                            {fotoPreview && (
                                                <img src={fotoPreview} alt="preview" className="w-16 h-16 rounded-full object-cover border" />
                                            )}
                                            <input
                                                ref={fotoRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFotoChange}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                        {errors.foto && <p className="mt-1 text-sm text-red-600">{errors.foto}</p>}
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

                                    {/* No HP Orang Tua */}
                                    <div className="col-span-2">
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
                                </div>
                            </div>

                            {/* Data Akademik Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                                    Data Akademik
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Kelas */}
                                    <div>
                                        <label htmlFor="kelas_id" className="block text-sm font-medium text-gray-700">
                                            Kelas <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="kelas_id"
                                            value={data.kelas_id}
                                            onChange={(e) => setData('kelas_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {kelas.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.jenjang.nama} {item.nama}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.kelas_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.kelas_id}</p>
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
                                            <option value="aktif">Aktif</option>
                                            <option value="lulus">Lulus</option>
                                            <option value="pindah">Pindah</option>
                                            <option value="keluar">Keluar</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>

                                    {/* Tanggal Masuk */}
                                    <div>
                                        <label htmlFor="tanggal_masuk" className="block text-sm font-medium text-gray-700">
                                            Tanggal Masuk <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="tanggal_masuk"
                                            type="date"
                                            value={data.tanggal_masuk}
                                            onChange={(e) => setData('tanggal_masuk', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.tanggal_masuk && (
                                            <p className="mt-1 text-sm text-red-600">{errors.tanggal_masuk}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                                <Link
                                    href={route('akademik.siswa.index')}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
