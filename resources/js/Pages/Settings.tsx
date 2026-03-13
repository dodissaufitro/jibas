import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { useSettings } from '@/Contexts/SettingsContext';

export default function Settings() {
    const { settings, updateSettings, isLoading: contextLoading } = useSettings();
    
    const [formData, setFormData] = useState(settings);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const institutionTypes = [
        { value: 'pesantren', label: 'Pondok Pesantren / Yayasan', icon: '🕌' },
        { value: 'umum', label: 'Sekolah Umum', icon: '🏫' },
        { value: 'madrasah', label: 'Madrasah', icon: '📚' },
    ];

    const educationLevels: Record<string, { value: string; label: string }[]> = {
        pesantren: [
            { value: 'RA', label: 'RA (Raudhatul Athfal)' },
            { value: 'MI', label: 'MI (Madrasah Ibtidaiyah)' },
            { value: 'MTs', label: 'MTs (Madrasah Tsanawiyah)' },
            { value: 'MA', label: 'MA (Madrasah Aliyah)' },
        ],
        madrasah: [
            { value: 'RA', label: 'RA (Raudhatul Athfal)' },
            { value: 'MI', label: 'MI (Madrasah Ibtidaiyah)' },
            { value: 'MTs', label: 'MTs (Madrasah Tsanawiyah)' },
            { value: 'MA', label: 'MA (Madrasah Aliyah)' },
        ],
        umum: [
            { value: 'TK', label: 'TK (Taman Kanak-Kanak)' },
            { value: 'SD', label: 'SD (Sekolah Dasar)' },
            { value: 'SMP', label: 'SMP (Sekolah Menengah Pertama)' },
            { value: 'SMA', label: 'SMA (Sekolah Menengah Atas)' },
            { value: 'SMK', label: 'SMK (Sekolah Menengah Kejuruan)' },
        ],
    };

    const handleInstitutionTypeChange = (type: 'pesantren' | 'umum' | 'madrasah') => {
        setFormData({
            ...formData,
            institutionType: type,
            educationLevel: '', // Reset education level when type changes
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        
        try {
            await updateSettings(formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal menyimpan pengaturan');
            setTimeout(() => setError(null), 5000);
        } finally {
            setSaving(false);
        }
    };

    return (
        <SidebarLayout>
            <Head title="Pengaturan Institusi" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2 flex items-center">
                        <span className="mr-3">⚙️</span>
                        Pengaturan Institusi
                    </h1>
                    <p className="text-indigo-100">
                        Konfigurasikan informasi dasar institusi pendidikan Anda
                    </p>
                </div>

                {/* Loading State */}
                {contextLoading && (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Memuat pengaturan...</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <span className="text-red-500 text-2xl mr-3">⚠</span>
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {saved && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <span className="text-green-500 text-2xl mr-3">✓</span>
                            <p className="text-green-800 font-medium">
                                Pengaturan berhasil disimpan!
                            </p>
                        </div>
                    </div>
                )}

                {!contextLoading && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Institution Type Selection */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">🏛️</span>
                            Jenis Institusi
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {institutionTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleInstitutionTypeChange(type.value as any)}
                                    className={`p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                                        formData.institutionType === type.value
                                            ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                                            : 'border-gray-200 hover:border-indigo-300'
                                    }`}
                                >
                                    <div className="text-4xl mb-3">{type.icon}</div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {type.label}
                                    </div>
                                    {formData.institutionType === type.value && (
                                        <div className="mt-2">
                                            <span className="inline-flex items-center px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">
                                                ✓ Dipilih
                                            </span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Education Level Selection */}
                    {formData.institutionType && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="mr-2">🎓</span>
                                Tingkat Pendidikan
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {educationLevels[formData.institutionType]?.map((level) => (
                                    <button
                                        key={level.value}
                                        type="button"
                                        onClick={() =>
                                            setFormData({ ...formData, educationLevel: level.value })
                                        }
                                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                            formData.educationLevel === level.value
                                                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                                : 'border-gray-200 hover:border-indigo-300'
                                        }`}
                                    >
                                        <div className="font-bold text-lg text-gray-900">
                                            {level.value}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">
                                            {level.label.split('(')[1]?.replace(')', '')}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Institution Details */}
                    {formData.institutionType && formData.educationLevel && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="mr-2">📋</span>
                                Detail Institusi
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Institusi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.institutionName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, institutionName: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Contoh: Pondok Pesantren Al-Hikmah"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alamat Lengkap
                                    </label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) =>
                                            setFormData({ ...formData, address: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Jl. Contoh No. 123, Kota, Provinsi"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="021-12345678"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="info@institusi.id"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    {formData.institutionType && formData.educationLevel && formData.institutionName && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    '💾 Simpan Pengaturan'
                                )}
                            </button>
                        </div>
                    )}
                </form>
                )}
            </div>
        </SidebarLayout>
    );
}
