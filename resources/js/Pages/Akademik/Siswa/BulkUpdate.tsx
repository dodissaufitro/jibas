import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function BulkUpdate() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        router.post(route('akademik.siswa.bulk-update'), formData, {
            forceFormData: true,
            onFinish: () => setUploading(false),
        });
    };

    return (
        <SidebarLayout>
            <Head title="Bulk Update Siswa" />

            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-2xl text-gray-800">Bulk Update Siswa</h2>
                        <p className="text-sm text-gray-600 mt-1">Update data siswa secara massal via file Excel</p>
                    </div>
                    <Link
                        href={route('akademik.siswa.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg"
                    >
                        ← Kembali
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Instructions */}
                <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
                    <h3 className="font-semibold text-amber-900 mb-3">📋 Petunjuk Penggunaan</h3>
                    <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside">
                        <li>Download template Excel dengan tombol di bawah</li>
                        <li>Isi kolom yang ingin diupdate (kosongkan untuk tidak mengubah)</li>
                        <li>Kolom <strong>NIS</strong> wajib diisi sebagai identifier</li>
                        <li>Upload file yang sudah diisi</li>
                        <li>Sistem akan update data berdasarkan NIS yang ditemukan</li>
                    </ol>
                    <div className="mt-4 p-3 bg-amber-100 rounded text-xs text-amber-700">
                        ⚠️ Pastikan NIS yang dimasukkan sudah terdaftar di sistem.
                        Data yang tidak ditemukan akan dilewati.
                    </div>
                    <a
                        href={route('akademik.siswa.download-update-template')}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Template Update
                    </a>
                </div>

                {/* Upload Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Upload File Excel</h3>
                    <form onSubmit={handleSubmit}>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {file ? (
                                <p className="text-sm font-medium text-amber-600">{file.name}</p>
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
                            className="mt-4 w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                        >
                            {uploading ? 'Memproses...' : 'Upload & Update'}
                        </button>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
