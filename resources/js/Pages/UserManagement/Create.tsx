import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Role {
    id: number;
    name: string;
    display_name: string;
    description: string;
    permissions: Permission[];
}

interface Permission {
    id: number;
    name: string;
    display_name: string;
    module: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat: number;
    jenjang?: {
        id: number;
        nama: string;
    };
}

interface Props {
    roles: Role[];
    kelasList: Kelas[];
}

export default function Create({ roles, kelasList }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
        nik: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        is_active: true,
        roles: [] as number[],
        kelas_id: '',
        // Guru specific fields
        guru_data: {
            nip: '',
            pendidikan_terakhir: 'S1',
            status_kepegawaian: 'GTY',
            tanggal_masuk: '',
            mata_pelajaran_id: '',
            no_rekening: '',
            bank: '',
        },
        // Siswa specific fields
        siswa_data: {
            nis: '',
            nisn: '',
            nama_ayah: '',
            nama_ibu: '',
            no_hp_ortu: '',
            pekerjaan_ayah: '',
            pekerjaan_ibu: '',
            tahun_masuk: new Date().getFullYear().toString(),
        },
    });

    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    const handleRoleToggle = (roleId: number) => {
        const newRoles = data.roles.includes(roleId)
            ? data.roles.filter(id => id !== roleId)
            : [...data.roles, roleId];
        
        setData('roles', newRoles);
        setSelectedRoles(roles.filter(r => newRoles.includes(r.id)));
    };

    const getRoleBadgeColor = (roleName: string) => {
        const colors: Record<string, string> = {
            'super_admin': 'from-red-500 to-red-600',
            'admin': 'from-purple-500 to-purple-600',
            'guru': 'from-blue-500 to-blue-600',
            'siswa': 'from-green-500 to-green-600',
            'orang_tua': 'from-yellow-500 to-yellow-600',
        };
        return colors[roleName] || 'from-gray-500 to-gray-600';
    };

    return (
        <SidebarLayout>
            <Head title="Tambah User" />

            {/* Header */}
            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <Link
                            href={route('users.index')}
                            className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </Link>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            ➕ Tambah User Baru
                        </h1>
                        <p className="text-white/90 text-lg">
                            Buat user baru dan atur hak aksesnya
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Information */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-3">
                            👤
                        </span>
                        Informasi User
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                placeholder="user@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                placeholder="Minimal 8 karakter"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Konfirmasi Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                placeholder="Ketik ulang password"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Telepon
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                placeholder="08xxxxxxxxxx"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        {/* NIK */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                NIK (KTP)
                            </label>
                            <input
                                type="text"
                                value={data.nik}
                                onChange={(e) => setData('nik', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                placeholder="16 digit NIK"
                                maxLength={16}
                            />
                            {errors.nik && <p className="mt-1 text-sm text-red-600">{errors.nik}</p>}
                        </div>

                        {/* Jenis Kelamin */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Jenis Kelamin <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.jenis_kelamin}
                                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                            {errors.jenis_kelamin && <p className="mt-1 text-sm text-red-600">{errors.jenis_kelamin}</p>}
                        </div>

                        {/* Tempat Lahir */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Tempat Lahir
                            </label>
                            <input
                                type="text"
                                value={data.tempat_lahir}
                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                placeholder="Kota kelahiran"
                            />
                            {errors.tempat_lahir && <p className="mt-1 text-sm text-red-600">{errors.tempat_lahir}</p>}
                        </div>

                        {/* Tanggal Lahir */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Tanggal Lahir
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_lahir}
                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            />
                            {errors.tanggal_lahir && <p className="mt-1 text-sm text-red-600">{errors.tanggal_lahir}</p>}
                        </div>

                        {/* Status */}
                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <span className="ml-3 text-sm font-semibold text-gray-700">
                                    User Aktif
                                </span>
                            </label>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Alamat
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                placeholder="Alamat lengkap"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                        </div>

                        {/* Kelas - Only show if siswa role is selected */}
                        {selectedRoles.some(role => role.name === 'siswa') && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Kelas <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kelas_id}
                                    onChange={(e) => setData('kelas_id', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                >
                                    <option value="">Pilih Kelas</option>
                                    {kelasList && kelasList.map((kelas) => (
                                        <option key={kelas.id} value={kelas.id}>
                                            {kelas.nama_kelas} {kelas.jenjang && `- ${kelas.jenjang.nama}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.kelas_id && <p className="mt-1 text-sm text-red-600">{errors.kelas_id}</p>}
                                <p className="mt-2 text-sm text-gray-500">
                                    💡 Kelas harus dipilih untuk user dengan role siswa
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Guru Specific Data - Conditional */}
                {selectedRoles.some(role => role.name === 'guru') && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100 transform transition-all duration-300">
                        <div className="mb-6 pb-6 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center">
                                <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-3">
                                    👨‍🏫
                                </span>
                                Data Guru
                            </h3>
                            <p className="text-sm text-gray-600">Informasi khusus untuk guru/pendidik</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* NIP */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    NIP (Nomor Induk Pegawai)
                                </label>
                                <input
                                    type="text"
                                    value={data.guru_data.nip}
                                    onChange={(e) => setData('guru_data', { ...data.guru_data, nip: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Kosongkan untuk auto-generate"
                                />
                                <p className="mt-1 text-xs text-gray-500">💡 Jika dikosongkan, NIP akan digenerate otomatis</p>
                            </div>

                            {/* Pendidikan Terakhir */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Pendidikan Terakhir
                                </label>
                                <select
                                    value={data.guru_data.pendidikan_terakhir}
                                    onChange={(e) => setData('guru_data', { ...data.guru_data, pendidikan_terakhir: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    <option value="SMA">SMA/Sederajat</option>
                                    <option value="D3">D3</option>
                                    <option value="S1">S1</option>
                                    <option value="S2">S2</option>
                                    <option value="S3">S3</option>
                                </select>
                            </div>

                            {/* Status Kepegawaian */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Status Kepegawaian
                                </label>
                                <select
                                    value={data.guru_data.status_kepegawaian}
                                    onChange={(e) => setData('guru_data', { ...data.guru_data, status_kepegawaian: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    <option value="PNS">PNS</option>
                                    <option value="GTY">Guru Tetap Yayasan (GTY)</option>
                                    <option value="GTT">Guru Tidak Tetap (GTT)</option>
                                    <option value="Honorer">Honorer</option>
                                </select>
                            </div>

                            {/* Tanggal Masuk */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Tanggal Masuk
                                </label>
                                <input
                                    type="date"
                                    value={data.guru_data.tanggal_masuk}
                                    onChange={(e) => setData('guru_data', { ...data.guru_data, tanggal_masuk: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>

                            {/* Bank */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Bank
                                </label>
                                <input
                                    type="text"
                                    value={data.guru_data.bank}
                                    onChange={(e) => setData('guru_data', { ...data.guru_data, bank: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Nama bank"
                                />
                            </div>

                            {/* No Rekening */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nomor Rekening
                                </label>
                                <input
                                    type="text"
                                    value={data.guru_data.no_rekening}
                                    onChange={(e) => setData('guru_data', { ...data.guru_data, no_rekening: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Nomor rekening bank"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Siswa Specific Data - Conditional */}
                {selectedRoles.some(role => role.name === 'siswa') && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100 transform transition-all duration-300">
                        <div className="mb-6 pb-6 border-b-2 border-gradient-to-r from-green-200 to-emerald-200">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 flex items-center">
                                <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white mr-3">
                                    👨‍🎓
                                </span>
                                Data Siswa
                            </h3>
                            <p className="text-sm text-gray-600">Informasi siswa dan data orang tua/wali</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* NIS */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    NIS (Nomor Induk Siswa)
                                </label>
                                <input
                                    type="text"
                                    value={data.siswa_data.nis}
                                    onChange={(e) => setData('siswa_data', { ...data.siswa_data, nis: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    placeholder="Nomor Induk Siswa"
                                />
                            </div>

                            {/* NISN */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    NISN (Nomor Induk Siswa Nasional)
                                </label>
                                <input
                                    type="text"
                                    value={data.siswa_data.nisn}
                                    onChange={(e) => setData('siswa_data', { ...data.siswa_data, nisn: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    placeholder="NISN (10 digit)"
                                />
                            </div>

                            {/* Tahun Masuk */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Tahun Masuk
                                </label>
                                <input
                                    type="number"
                                    value={data.siswa_data.tahun_masuk}
                                    onChange={(e) => setData('siswa_data', { ...data.siswa_data, tahun_masuk: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    placeholder="2024"
                                    min="2000"
                                    max={new Date().getFullYear() + 1}
                                />
                            </div>

                            {/* Divider */}
                            <div className="md:col-span-2 mt-4 mb-2">
                                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                                    <span className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white text-sm mr-2">
                                        👪
                                    </span>
                                    Data Orang Tua/Wali
                                </h4>
                            </div>

                            {/* Nama Ayah */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nama Ayah
                                </label>
                                <input
                                    type="text"
                                    value={data.siswa_data.nama_ayah}
                                    onChange={(e) => setData('siswa_data', { ...data.siswa_data, nama_ayah: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    placeholder="Nama lengkap ayah"
                                />
                            </div>

                            {/* Nama Ibu */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nama Ibu
                                </label>
                                <input
                                    type="text"
                                    value={data.siswa_data.nama_ibu}
                                    onChange={(e) => setData('siswa_data', { ...data.siswa_data, nama_ibu: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    placeholder="Nama lengkap ibu"
                                />
                            </div>

                            {/* Pekerjaan Ayah */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Pekerjaan Ayah
                                </label>
                                <input
                                    type="text"
                                    value={data.siswa_data.pekerjaan_ayah}
                                    onChange={(e) => setData('siswa_data', { ...data.siswa_data, pekerjaan_ayah: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    placeholder="Pekerjaan ayah"
                                />
                            </div>

                            {/* Pekerjaan Ibu */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Pekerjaan Ibu
                                </label>
                                <input
                                    type="text"
                                    value={data.siswa_data.pekerjaan_ibu}
                                    onChange={(e) => setData('siswa_data', { ...data.siswa_data, pekerjaan_ibu: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    placeholder="Pekerjaan ibu"
                                />
                            </div>

                            {/* No HP Orang Tua */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    No HP Orang Tua/Wali
                                </label>
                                <input
                                    type="text"
                                    value={data.siswa_data.no_hp_ortu}
                                    onChange={(e) => setData('siswa_data', { ...data.siswa_data, no_hp_ortu: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Role Assignment */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <span className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white mr-3">
                            🔒
                        </span>
                        Pilih Role & Hak Akses
                    </h3>

                    {errors.roles && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errors.roles}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {roles && roles.map((role) => (
                            <div
                                key={role.id}
                                onClick={() => handleRoleToggle(role.id)}
                                className={`cursor-pointer p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                                    data.roles.includes(role.id)
                                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${getRoleBadgeColor(role.name)} rounded-xl flex items-center justify-center text-white text-2xl shadow-md`}>
                                        {role.name === 'super_admin' ? '⭐' : 
                                         role.name === 'admin' ? '👔' :
                                         role.name === 'guru' ? '👨‍🏫' :
                                         role.name === 'siswa' ? '👨‍🎓' : '👪'}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={data.roles.includes(role.id)}
                                        onChange={() => handleRoleToggle(role.id)}
                                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                    />
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg mb-1">
                                    {role.display_name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    {role.description}
                                </p>
                                <div className="text-xs text-gray-500">
                                    {role.permissions?.length || 0} permissions
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Roles Permissions Preview */}
                    {selectedRoles.length > 0 && (
                        <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Hak Akses yang Akan Diberikan
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {selectedRoles.flatMap(role => role.permissions || [])
                                    .filter((permission, index, self) => 
                                        index === self.findIndex(p => p.id === permission.id)
                                    )
                                    .map(permission => (
                                        <div key={permission.id} className="flex items-center text-sm text-gray-700 bg-white px-3 py-2 rounded-lg">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {permission.display_name}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <Link
                        href={route('users.index')}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-md hover:shadow-lg"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan User'}
                    </button>
                </div>
            </form>
        </SidebarLayout>
    );
}
