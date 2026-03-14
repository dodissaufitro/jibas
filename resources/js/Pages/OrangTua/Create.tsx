import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Siswa {
    id: number;
    nama_lengkap: string;
    nisn: string;
}

interface Props {
    siswaList: Siswa[];
}

export default function Create({ siswaList }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        nama_ayah: '',
        nik_ayah: '',
        pekerjaan_ayah: '',
        penghasilan_ayah: '',
        nama_ibu: '',
        nik_ibu: '',
        pekerjaan_ibu: '',
        penghasilan_ibu: '',
        alamat: '',
        no_hp: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orangtua.store'));
    };

    return (
        <SidebarLayout>
            <Head title="Tambah Data Wali Murid" />

            {/* Header */}
            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <Link
                            href={route('orangtua.data')}
                            className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali
                        </Link>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            ➕ Tambah Data Wali Murid
                        </h1>
                        <p className="text-white/90 text-lg">
                            Isi form untuk menambahkan data orang tua / wali murid baru
                        </p>
                    </div>
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Data Siswa */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        👨‍🎓 Pilih Siswa
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nama Siswa *
                        </label>
                        <select
                            value={data.siswa_id}
                            onChange={(e) => setData('siswa_id', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                            required
                        >
                            <option value="">-- Pilih Siswa --</option>
                            {siswaList.map((siswa) => (
                                <option key={siswa.id} value={siswa.id}>
                                    {siswa.nama_lengkap} (NISN: {siswa.nisn})
                                </option>
                            ))}
                        </select>
                        {errors.siswa_id && (
                            <p className="mt-2 text-sm text-red-600">{errors.siswa_id}</p>
                        )}
                        {siswaList.length === 0 && (
                            <p className="mt-2 text-sm text-yellow-600">
                                ⚠️ Semua siswa sudah memiliki data orang tua
                            </p>
                        )}
                    </div>
                </div>

                {/* Data Ayah */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        👨 Data Ayah
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nama Ayah *
                            </label>
                            <input
                                type="text"
                                value={data.nama_ayah}
                                onChange={(e) => setData('nama_ayah', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                placeholder="Masukkan nama lengkap ayah"
                                required
                            />
                            {errors.nama_ayah && (
                                <p className="mt-2 text-sm text-red-600">{errors.nama_ayah}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                NIK Ayah
                            </label>
                            <input
                                type="text"
                                value={data.nik_ayah}
                                onChange={(e) => setData('nik_ayah', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                placeholder="16 digit NIK"
                                maxLength={16}
                            />
                            {errors.nik_ayah && (
                                <p className="mt-2 text-sm text-red-600">{errors.nik_ayah}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Pekerjaan Ayah
                            </label>
                            <input
                                type="text"
                                value={data.pekerjaan_ayah}
                                onChange={(e) => setData('pekerjaan_ayah', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                placeholder="contoh: PNS, Wiraswasta"
                            />
                            {errors.pekerjaan_ayah && (
                                <p className="mt-2 text-sm text-red-600">{errors.pekerjaan_ayah}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Penghasilan Ayah (Rp)
                            </label>
                            <input
                                type="number"
                                value={data.penghasilan_ayah}
                                onChange={(e) => setData('penghasilan_ayah', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                placeholder="contoh: 5000000"
                                min="0"
                            />
                            {errors.penghasilan_ayah && (
                                <p className="mt-2 text-sm text-red-600">{errors.penghasilan_ayah}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Ibu */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        👩 Data Ibu
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nama Ibu *
                            </label>
                            <input
                                type="text"
                                value={data.nama_ibu}
                                onChange={(e) => setData('nama_ibu', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                placeholder="Masukkan nama lengkap ibu"
                                required
                            />
                            {errors.nama_ibu && (
                                <p className="mt-2 text-sm text-red-600">{errors.nama_ibu}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                NIK Ibu
                            </label>
                            <input
                                type="text"
                                value={data.nik_ibu}
                                onChange={(e) => setData('nik_ibu', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                placeholder="16 digit NIK"
                                maxLength={16}
                            />
                            {errors.nik_ibu && (
                                <p className="mt-2 text-sm text-red-600">{errors.nik_ibu}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Pekerjaan Ibu
                            </label>
                            <input
                                type="text"
                                value={data.pekerjaan_ibu}
                                onChange={(e) => setData('pekerjaan_ibu', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                placeholder="contoh: Ibu Rumah Tangga"
                            />
                            {errors.pekerjaan_ibu && (
                                <p className="mt-2 text-sm text-red-600">{errors.pekerjaan_ibu}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Penghasilan Ibu (Rp)
                            </label>
                            <input
                                type="number"
                                value={data.penghasilan_ibu}
                                onChange={(e) => setData('penghasilan_ibu', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                placeholder="contoh: 3000000"
                                min="0"
                            />
                            {errors.penghasilan_ibu && (
                                <p className="mt-2 text-sm text-red-600">{errors.penghasilan_ibu}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Kontak */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        📞 Data Kontak & Alamat
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Alamat Lengkap *
                            </label>
                            <textarea
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                placeholder="Masukkan alamat lengkap rumah"
                                required
                            />
                            {errors.alamat && (
                                <p className="mt-2 text-sm text-red-600">{errors.alamat}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nomor HP / WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    value={data.no_hp}
                                    onChange={(e) => setData('no_hp', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                    placeholder="contoh: 08123456789"
                                    required
                                />
                                {errors.no_hp && (
                                    <p className="mt-2 text-sm text-red-600">{errors.no_hp}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                    placeholder="contoh: email@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <Link
                        href={route('orangtua.data')}
                        className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing || siswaList.length === 0}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Menyimpan...' : '💾 Simpan Data'}
                    </button>
                </div>
            </form>
        </SidebarLayout>
    );
}
