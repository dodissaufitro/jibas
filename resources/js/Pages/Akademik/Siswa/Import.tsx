import React, { useState, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Jenjang {
    nama: string;
}

interface Jurusan {
    nama: string;
}

interface Kelas {
    id: number;
    nama: string;
    nama_kelas: string;
    tingkat: number;
    jenjang: Jenjang;
    jurusan?: Jurusan;
}

interface Props {
    kelas: Kelas[];
}

export default function Import({ kelas }: Props) {
    const { data, setData, post, processing, errors, progress } = useForm({
        file: null as File | null,
    });

    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            setFileName(file.name);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('akademik.siswa.import'));
    };

    const handleDownloadTemplate = () => {
        window.location.href = route('akademik.siswa.download-template');
    };

    return (
        <SidebarLayout>
            <Head title="Import Data Siswa" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('akademik.siswa.index')}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali ke Data Siswa
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">📊 Import Data Siswa dari Excel</h2>
                            <p className="text-sm text-gray-600 mt-2">
                                Upload file Excel untuk menambahkan data siswa secara massal
                            </p>
                        </div>

                        <div className="p-6">
                            {/* Information Box */}
                            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-blue-900 mb-2">Petunjuk Import:</h3>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>✓ Download template Excel terlebih dahulu</li>
                                            <li>✓ Isi data siswa sesuai format yang telah disediakan</li>
                                            <li>✓ Password akun siswa otomatis menggunakan <strong>NIS yang di-encrypt</strong></li>
                                            <li>✓ Pastikan ID Kelas sesuai dengan data di database</li>
                                            <li>✓ Format tanggal: YYYY-MM-DD (contoh: 2010-01-15)</li>
                                            <li>✓ Jenis kelamin: L (Laki-laki) atau P (Perempuan)</li>
                                            <li>✓ Status: aktif, lulus, pindah, atau keluar</li>
                                            <li>✓ File maksimal 2MB</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Download Template Button */}
                            <div className="mb-6">
                                <button
                                    type="button"
                                    onClick={handleDownloadTemplate}
                                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Template Excel
                                </button>
                            </div>

                            {/* Kelas Reference Table */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-3">📋 Referensi ID Kelas:</h3>
                                <div className="overflow-x-auto max-h-48">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-100 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-medium text-gray-700">ID</th>
                                                <th className="px-4 py-2 text-left font-medium text-gray-700">Jenjang</th>
                                                <th className="px-4 py-2 text-left font-medium text-gray-700">Kelas</th>
                                                <th className="px-4 py-2 text-left font-medium text-gray-700">Tingkat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {kelas.map((k) => (
                                                <tr key={k.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-mono text-blue-600">{k.id}</td>
                                                    <td className="px-4 py-2">{k.jenjang.nama}</td>
                                                    <td className="px-4 py-2">{k.nama_kelas}</td>
                                                    <td className="px-4 py-2">{k.tingkat}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Upload Form */}
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        📁 Upload File Excel
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label 
                                            htmlFor="file-upload" 
                                            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                                fileName ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {fileName ? (
                                                    <>
                                                        <svg className="w-12 h-12 mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <p className="text-sm font-semibold text-green-700">{fileName}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Klik untuk mengganti file</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">Excel (.xlsx, .xls) atau CSV (Max 2MB)</p>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                className="hidden"
                                                accept=".xlsx,.xls,.csv"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                    {errors.file && (
                                        <p className="mt-2 text-sm text-red-600">{errors.file}</p>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                {progress && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex items-center justify-end space-x-3">
                                    <Link
                                        href={route('akademik.siswa.index')}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.file}
                                        className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                                            processing || !data.file
                                                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                        }`}
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Mengimport...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                                Import Data
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
