import React, { FormEventHandler, useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Institution {
    id: number;
    name: string;
}

interface Kelas {
    id: number;
    label: string;
    nama: string;
    tingkat: number;
    jenjang: string;
    jurusan: string | null;
}

interface MataPelajaran {
    id: number;
    label: string;
    nama: string;
    kode: string;
    jenjang: string;
}

interface Guru {
    id: number;
    institution_id: number | null;
    nip: string;
    nuptk: string | null;
    nik: string | null;
    nama_lengkap: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    alamat: string;
    email: string | null;
    no_hp: string;
    pendidikan_terakhir: string;
    jurusan: string | null;
    status_kepegawaian: string;
    status: string;
    tanggal_masuk: string;
    tanggal_keluar: string | null;
    kelas_ids: number[];
    mata_pelajaran_ids: number[];
}

interface Props {
    guru: Guru;
    institutions: Institution[];
    kelasList: Kelas[];
    mataPelajaranList: MataPelajaran[];
    userInstitutionId: number | null;
}

export default function Edit({ guru, institutions, kelasList, mataPelajaranList, userInstitutionId }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        institution_id: guru.institution_id || userInstitutionId || '',
        nip: guru.nip || '',
        nuptk: guru.nuptk || '',
        nik: guru.nik || '',
        nama_lengkap: guru.nama_lengkap || '',
        jenis_kelamin: guru.jenis_kelamin || '',
        tempat_lahir: guru.tempat_lahir || '',
        tanggal_lahir: guru.tanggal_lahir || '',
        alamat: guru.alamat || '',
        email: guru.email || '',
        no_hp: guru.no_hp || '',
        pendidikan_terakhir: guru.pendidikan_terakhir || '',
        jurusan: guru.jurusan || '',
        status_kepegawaian: guru.status_kepegawaian || '',
        status: guru.status || '',
        tanggal_masuk: guru.tanggal_masuk || '',
        tanggal_keluar: guru.tanggal_keluar || '',
        kelas_ids: guru.kelas_ids || [],
        mata_pelajaran_ids: guru.mata_pelajaran_ids || [],
    });

    const [isInstitutionSelected, setIsInstitutionSelected] = useState(!!data.institution_id);

    useEffect(() => {
        setIsInstitutionSelected(!!data.institution_id);
    }, [data.institution_id]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('akademik.guru.update', guru.id));
    };

    return (
        <SidebarLayout>
            <Head title="Edit Guru" />

            <h2 className="font-semibold text-2xl text-gray-800 mb-6">
                Edit Guru
            </h2>

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-8">
                            {/* Institution Selection - Primary Section */}
                            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-indigo-200 shadow-lg">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-md mr-4">
                                        🏫
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            Pilih Institusi Terlebih Dahulu
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Tentukan institusi untuk menampilkan data lengkap guru
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="institution_id" className="block text-sm font-bold text-gray-700 mb-2">
                                        Institusi <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="institution_id"
                                        value={data.institution_id}
                                        onChange={(e) => setData('institution_id', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-gray-900 font-medium shadow-sm"
                                    >
                                        <option value="">-- Pilih Institusi --</option>
                                        {institutions.map((inst) => (
                                            <option key={inst.id} value={inst.id}>
                                                {inst.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.institution_id && (
                                        <p className="mt-2 text-sm text-red-600 font-semibold">{errors.institution_id}</p>
                                    )}
                                </div>
                            </div>

                            {/* Empty State - Show when institution not selected */}
                            {!isInstitutionSelected && (
                                <div className="text-center py-16">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                                        Pilih Institusi Terlebih Dahulu
                                    </h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        Silakan pilih institusi dari dropdown di atas untuk menampilkan dan mengedit data guru lengkap
                                    </p>
                                </div>
                            )}

                            {/* Data Pribadi Section - Only show when institution selected */}
                            {isInstitutionSelected && (
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
                            )}

                            {/* Penugasan Section - Only show when institution selected */}
                            {isInstitutionSelected && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    Penugasan Guru
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Kelas yang Diampu */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kelas yang Diampu
                                        </label>
                                        <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto bg-gray-50">
                                            {kelasList.length === 0 ? (
                                                <p className="text-sm text-gray-500">Tidak ada kelas tersedia</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {kelasList.map((kelas) => (
                                                        <label key={kelas.id} className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={data.kelas_ids.includes(kelas.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setData('kelas_ids', [...data.kelas_ids, kelas.id]);
                                                                    } else {
                                                                        setData('kelas_ids', data.kelas_ids.filter(id => id !== kelas.id));
                                                                    }
                                                                }}
                                                                className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                            />
                                                            <span className="text-sm text-gray-700">{kelas.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                       </div>
                                        {data.kelas_ids.length > 0 && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                <strong>{data.kelas_ids.length}</strong> kelas dipilih
                                            </p>
                                        )}
                                        {errors.kelas_ids && (
                                            <p className="mt-1 text-sm text-red-600">{errors.kelas_ids}</p>
                                        )}
                                    </div>

                                    {/* Mata Pelajaran yang Diajar */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mata Pelajaran yang Diajar
                                        </label>
                                        <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto bg-gray-50">
                                            {mataPelajaranList.length === 0 ? (
                                                <p className="text-sm text-gray-500">Tidak ada mata pelajaran tersedia</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {mataPelajaranList.map((mp) => (
                                                        <label key={mp.id} className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={data.mata_pelajaran_ids.includes(mp.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setData('mata_pelajaran_ids', [...data.mata_pelajaran_ids, mp.id]);
                                                                    } else {
                                                                        setData('mata_pelajaran_ids', data.mata_pelajaran_ids.filter(id => id !== mp.id));
                                                                    }
                                                                }}
                                                                className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                            />
                                                            <span className="text-sm text-gray-700">{mp.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {data.mata_pelajaran_ids.length > 0 && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                <strong>{data.mata_pelajaran_ids.length}</strong> mata pelajaran dipilih
                                            </p>
                                        )}
                                        {errors.mata_pelajaran_ids && (
                                            <p className="mt-1 text-sm text-red-600">{errors.mata_pelajaran_ids}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            )}

                            {/* Data Kepegawaian Section - Only show when institution selected */}
                            {isInstitutionSelected && (
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

                                    {/* Tanggal Keluar */}
                                    <div>
                                        <label htmlFor="tanggal_keluar" className="block text-sm font-medium text-gray-700">
                                            Tanggal Keluar
                                        </label>
                                        <input
                                            id="tanggal_keluar"
                                            type="date"
                                            value={data.tanggal_keluar}
                                            onChange={(e) => setData('tanggal_keluar', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.tanggal_keluar && (
                                            <p className="mt-1 text-sm text-red-600">{errors.tanggal_keluar}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            )}

                            {/* Buttons - Only show when institution selected */}
                            {isInstitutionSelected && (
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
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
