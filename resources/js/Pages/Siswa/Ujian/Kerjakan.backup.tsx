import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';

interface Soal {
    id: number;
    nomor_soal: number;
    pertanyaan: string;
    opsi_a: string;
    opsi_b: string;
    opsi_c: string;
    opsi_d: string;
    opsi_e: string | null;
    file_soal: string | null;
    bobot: number;
}

interface MataPelajaran {
    nama: string;
}

interface Guru {
    nama_lengkap: string;
}

interface Ujian {
    id: number;
    judul_ujian: string;
    jenis_ujian: string;
    durasi_menit: number;
    mata_pelajaran: MataPelajaran;
    guru: Guru;
}

interface UjianSiswa {
    id: number;
    waktu_mulai: string;
    ujian: Ujian;
}

interface Jawaban {
    [key: number]: {
        jawaban: string;
    };
}

interface Props {
    ujianSiswa: UjianSiswa;
    soal: Soal[];
    jawaban: Jawaban;
    sisaWaktu: number;
}

export default function Kerjakan({ ujianSiswa, soal, jawaban, sisaWaktu: initialSisaWaktu }: Props) {
    const [selectedJawaban, setSelectedJawaban] = useState<{ [key: number]: string }>({});
    const [sisaWaktu, setSisaWaktu] = useState(initialSisaWaktu);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load saved answers
    useEffect(() => {
        const savedAnswers: { [key: number]: string } = {};
        Object.keys(jawaban).forEach((soalId) => {
            savedAnswers[parseInt(soalId)] = jawaban[parseInt(soalId)].jawaban;
        });
        setSelectedJawaban(savedAnswers);
    }, [jawaban]);

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setSisaWaktu((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectJawaban = async (soalId: number, jawaban: string) => {
        setSelectedJawaban((prev) => ({
            ...prev,
            [soalId]: jawaban,
        }));

        // Auto save to server
        try {
            await axios.post(route('siswa.ujian.simpan-jawaban', ujianSiswa.id), {
                soal_ujian_id: soalId,
                jawaban: jawaban,
            });
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    };

    const handleClearJawaban = (soalId: number) => {
        setSelectedJawaban((prev) => {
            const newAnswers = { ...prev };
            delete newAnswers[soalId];
            return newAnswers;
        });
    };

    const handleSubmit = () => {
        if (isSubmitting) return;

        const unansweredCount = soal.length - Object.keys(selectedJawaban).length;
        
        if (unansweredCount > 0) {
            if (!confirm(`Anda masih memiliki ${unansweredCount} soal yang belum dijawab. Apakah Anda yakin ingin menyelesaikan ujian?`)) {
                return;
            }
        } else {
            if (!confirm('Apakah Anda yakin ingin menyelesaikan ujian?')) {
                return;
            }
        }

        setIsSubmitting(true);
        router.post(
            route('siswa.ujian.submit', ujianSiswa.id),
            {},
            {
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    const answeredCount = Object.keys(selectedJawaban).length;
    const progress = (answeredCount / soal.length) * 100;

    return (
        <>
            <Head title={`${ujianSiswa.ujian.judul_ujian}`} />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
                {/* Fixed Header */}
                <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">{ujianSiswa.ujian.judul_ujian}</h1>
                                    <p className="text-sm text-gray-600">{ujianSiswa.ujian.mata_pelajaran.nama}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Timer */}
                                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${sisaWaktu < 300 ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-mono font-bold">{formatTime(sisaWaktu)}</span>
                                </div>
                                {/* Progress */}
                                <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-semibold">{answeredCount}/{soal.length}</span>
                                </div>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Info Card */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-800">
                            <strong>Petunjuk:</strong> Pilih salah satu jawaban untuk setiap soal. Jawaban Anda akan tersimpan otomatis. Klik tombol <strong>Submit Ujian</strong> setelah selesai mengerjakan semua soal.
                        </p>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                        {soal.map((item, index) => (
                            <div 
                                key={item.id} 
                                className="bg-white rounded-xl border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="p-6">
                                    {/* Question Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {item.pertanyaan}
                                        </h3>
                                        {selectedJawaban[item.id] && (
                                            <button
                                                onClick={() => handleClearJawaban(item.id)}
                                                className="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Hapus jawaban"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Image if exists */}
                                    {item.file_soal && (
                                        <div className="mb-4">
                                            <img 
                                                src={`/storage/${item.file_soal}`} 
                                                alt="Gambar Soal" 
                                                className="max-w-full h-auto rounded-lg border border-gray-200"
                                            />
                                        </div>
                                    )}

                                    {/* Options */}
                                    <div className="space-y-3">
                                        {/* Option A */}
                                        <label 
                                            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                selectedJawaban[item.id] === 'A' 
                                                    ? 'border-blue-600 bg-blue-50' 
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`soal-${item.id}`}
                                                value="A"
                                                checked={selectedJawaban[item.id] === 'A'}
                                                onChange={() => handleSelectJawaban(item.id, 'A')}
                                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-3 text-gray-900">{item.opsi_a}</span>
                                        </label>

                                        {/* Option B */}
                                        <label 
                                            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                selectedJawaban[item.id] === 'B' 
                                                    ? 'border-blue-600 bg-blue-50' 
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`soal-${item.id}`}
                                                value="B"
                                                checked={selectedJawaban[item.id] === 'B'}
                                                onChange={() => handleSelectJawaban(item.id, 'B')}
                                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-3 text-gray-900">{item.opsi_b}</span>
                                        </label>

                                        {/* Option C */}
                                        <label 
                                            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                selectedJawaban[item.id] === 'C' 
                                                    ? 'border-blue-600 bg-blue-50' 
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`soal-${item.id}`}
                                                value="C"
                                                checked={selectedJawaban[item.id] === 'C'}
                                                onChange={() => handleSelectJawaban(item.id, 'C')}
                                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-3 text-gray-900">{item.opsi_c}</span>
                                        </label>

                                        {/* Option D */}
                                        <label 
                                            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                selectedJawaban[item.id] === 'D' 
                                                    ? 'border-blue-600 bg-blue-50' 
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`soal-${item.id}`}
                                                value="D"
                                                checked={selectedJawaban[item.id] === 'D'}
                                                onChange={() => handleSelectJawaban(item.id, 'D')}
                                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-3 text-gray-900">{item.opsi_d}</span>
                                        </label>

                                        {/* Option E (if exists) */}
                                        {item.opsi_e && (
                                            <label 
                                                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    selectedJawaban[item.id] === 'E' 
                                                        ? 'border-blue-600 bg-blue-50' 
                                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`soal-${item.id}`}
                                                    value="E"
                                                    checked={selectedJawaban[item.id] === 'E'}
                                                    onChange={() => handleSelectJawaban(item.id, 'E')}
                                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-3 text-gray-900">{item.opsi_e}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex items-center justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
                                isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5'
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Submit Ujian
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>Pastikan semua soal sudah terjawab sebelum submit.</p>
                        <p className="mt-1">Anda telah menjawab <strong className="text-blue-600">{answeredCount}</strong> dari <strong className="text-blue-600">{soal.length}</strong> soal.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
