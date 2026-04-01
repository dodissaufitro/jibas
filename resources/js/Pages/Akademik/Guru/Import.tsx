import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Import() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        router.post(route('akademik.guru.import'), formData, {
            forceFormData: true,
            onFinish: () => setUploading(false),
        });
    };

    return (
        <SidebarLayout>
            <Head title="Import Data Guru" />

            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-2xl text-gray-800">Import Data Guru</h2>
                        <p className="text-sm text-gray-600 mt-1">Import data guru secara massal via file Excel</p>
                    </div>
                    <Link
                        href={route('akademik.guru.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg"
                    >
                        ← Kembali
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Instructions */}
                <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                    <h3 className="font-semibold text-green-900 mb-3">📋 Petunjuk Penggunaan</h3>
                    <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside">
                        <li>Download template Excel dengan tombol di bawah</li>
                        <li>Isi data guru sesuai kolom yang tersedia</li>
                        <li>Kolom <strong>NIP</strong> dan <strong>nama_lengkap</strong> wajib diisi</li>
                        <li>Kolom <strong>jenis_kelamin</strong>: isi dengan L atau P</li>
                        <li>
                            Kolom <strong>status_kepegawaian</strong>: PNS, PPPK, GTY, atau PTY
                        </li>
                        <li>Upload file yang sudah diisi</li>
                    </ol>
                    <div className="mt-4 p-3 bg-green-100 rounded text-xs text-green-700">
                        ℹ️ Akun login akan dibuat otomatis menggunakan email yang diisi.
                        Password default: NIP guru.
                    </div>
                    <a
                        href={route('akademik.guru.download-template')}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Template
                    </a>
                </div>

                {/* Upload Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Upload File Excel</h3>
                    <form onSubmit={handleSubmit}>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {file ? (
                                <p className="text-sm font-medium text-green-600">{file.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600">Klik atau seret file ke sini</p>
                                    <p className="text-xs text-gray-400 mt-1">Format: .xlsx, .xls, .csv (maks. 5MB)</p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className="mt-4 w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                        >
                            {uploading ? 'Memproses...' : 'Upload & Import'}
                        </button>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
