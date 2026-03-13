import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nip: '',
        nuptk: '',
        nik: '',
        nama_lengkap: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        alamat: '',
        email: '',
        no_hp: '',
        pendidikan_terakhir: '',
        jurusan: '',
        status_kepegawaian: '',
        status: '',
        tanggal_masuk: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('akademik.guru.store'));
    };

    return (
        <SidebarLayout>
            <Head title="Tambah Guru" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Tambah Guru
            </h2>

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-8">
                            {/* Data Pribadi Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    Data Pribadi
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* NIP */}
                                    <div>
                                        <label htmlFor="nip" className="block text-sm font-medium text-gray-700">
                                            NIP <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="nip"
                                            type="text"
                                            value={data.nip}
                                            onChange={(e) => setData('nip', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Nomor Induk Pegawai"
                                            autoFocus
                                        />
                                        {errors.nip && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nip}</p>
                                        )}
                                    </div>

                                    {/* NUPTK */}
                                    <div>
                                        <label htmlFor="nuptk" className="block text-sm font-medium text-gray-700">
                                            NUPTK
                                        </label>
                                        <input
                                            id="nuptk"
                                            type="text"
                                            value={data.nuptk}
                                            onChange={(e) => setData('nuptk', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Nomor Unik Pendidik dan Tenaga Kependidikan"
                                        />
                                        {errors.nuptk && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nuptk}</p>
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
                                            placeholder="Nama lengkap guru"
                                        />
                                        {errors.nama_lengkap && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nama_lengkap}</p>
                                        )}
                                    </div>

                                    {/* Jenis Kelamin */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jenis Kelamin <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center space-x-6">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    value="L"
                                                    checked={data.jenis_kelamin === 'L'}
                                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Laki-laki</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    value="P"
                                                    checked={data.jenis_kelamin === 'P'}
                                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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
                                            placeholder="Kota/Kabupaten tempat lahir"
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
                                            No. HP <span className="text-red-500">*</span>
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

                                    {/* Alamat - Full Width */}
                                    <div className="md:col-span-2">
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
                                </div>
                            </div>

                            {/* Data Kepegawaian Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    Data Kepegawaian
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Pendidikan Terakhir */}
                                    <div>
                                        <label htmlFor="pendidikan_terakhir" className="block text-sm font-medium text-gray-700">
                                            Pendidikan Terakhir <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="pendidikan_terakhir"
                                            type="text"
                                            value={data.pendidikan_terakhir}
                                            onChange={(e) => setData('pendidikan_terakhir', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Contoh: S1, S2, S3"
                                        />
                                        {errors.pendidikan_terakhir && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pendidikan_terakhir}</p>
                                        )}
                                    </div>

                                    {/* Jurusan */}
                                    <div>
                                        <label htmlFor="jurusan" className="block text-sm font-medium text-gray-700">
                                            Jurusan
                                        </label>
                                        <input
                                            id="jurusan"
                                            type="text"
                                            value={data.jurusan}
                                            onChange={(e) => setData('jurusan', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Jurusan pendidikan"
                                        />
                                        {errors.jurusan && (
                                            <p className="mt-1 text-sm text-red-600">{errors.jurusan}</p>
                                        )}
                                    </div>

                                    {/* Status Kepegawaian */}
                                    <div>
                                        <label htmlFor="status_kepegawaian" className="block text-sm font-medium text-gray-700">
                                            Status Kepegawaian <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="status_kepegawaian"
                                            value={data.status_kepegawaian}
                                            onChange={(e) => setData('status_kepegawaian', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Pilih Status Kepegawaian</option>
                                            <option value="PNS">PNS</option>
                                            <option value="PPPK">PPPK</option>
                                            <option value="GTY">GTY (Guru Tetap Yayasan)</option>
                                            <option value="PTY">PTY (Guru Tidak Tetap Yayasan)</option>
                                        </select>
                                        {errors.status_kepegawaian && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status_kepegawaian}</p>
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
                                            <option value="">Pilih Status</option>
                                            <option value="aktif">Aktif</option>
                                            <option value="cuti">Cuti</option>
                                            <option value="pensiun">Pensiun</option>
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
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Link
                                    href={route('akademik.guru.index')}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
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
