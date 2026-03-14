import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Siswa {
    id: number;
    nama_lengkap: string;
    nisn: string;
}

interface OrangTua {
    id: number;
    siswa_id: number;
    nama_ayah: string;
    nik_ayah?: string;
    pekerjaan_ayah?: string;
    penghasilan_ayah?: number;
    nama_ibu: string;
    nik_ibu?: string;
    pekerjaan_ibu?: string;
    penghasilan_ibu?: number;
    alamat: string;
    no_hp: string;
    email?: string;
    siswa: Siswa;
}

interface Props {
    orangTua: OrangTua;
    siswaList: Siswa[];
}

export default function Edit({ orangTua, siswaList }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        siswa_id: orangTua.siswa_id.toString(),
        nama_ayah: orangTua.nama_ayah || '',
        nik_ayah: orangTua.nik_ayah || '',
        pekerjaan_ayah: orangTua.pekerjaan_ayah || '',
        penghasilan_ayah: orangTua.penghasilan_ayah?.toString() || '',
        nama_ibu: orangTua.nama_ibu || '',
        nik_ibu: orangTua.nik_ibu || '',
        pekerjaan_ibu: orangTua.pekerjaan_ibu || '',
        penghasilan_ibu: orangTua.penghasilan_ibu?.toString() || '',
        alamat: orangTua.alamat || '',
        no_hp: orangTua.no_hp || '',
        email: orangTua.email || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('orangtua.update', orangTua.id));
    };

    return (
        <SidebarLayout>
            <Head title={`Edit Data Wali Murid: ${orangTua.nama_ayah}`} />

            {/* Header */}
            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-8 shadow-2xl">
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
                            ✏️ Edit Data Wali Murid
                        </h1>
                        <p className="text-white/90 text-lg">
                            Perbarui data orang tua / wali murid: {orangTua.nama_ayah}
                        </p>
                    </div>
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Data Siswa */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        👨‍🎓 Data Siswa
                    </h2>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nama Siswa *
                        </label>
                        <select
                            value={data.siswa_id}
                            onChange={(e) => setData('siswa_id', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                        disabled={processing}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Menyimpan...' : '💾 Update Data'}
                    </button>
                </div>
            </form>
        </SidebarLayout>
    );
}
