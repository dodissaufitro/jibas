import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
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
    sisaWaktu: number; // dalam detik
}

export default function Kerjakan({ ujianSiswa, soal, jawaban, sisaWaktu: initialSisaWaktu }: Props) {
    const [currentSoalIndex, setCurrentSoalIndex] = useState(0);
    const [selectedJawaban, setSelectedJawaban] = useState<{ [key: number]: string }>({});
    const [currentJawaban, setCurrentJawaban] = useState<string>('');
    const [sisaWaktu, setSisaWaktu] = useState(initialSisaWaktu);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load saved answers
    useEffect(() => {
        const savedAnswers: { [key: number]: string } = {};
        Object.keys(jawaban).forEach((soalId) => {
            savedAnswers[parseInt(soalId)] = jawaban[parseInt(soalId)].jawaban;
        });
        setSelectedJawaban(savedAnswers);
        
        // Find first unanswered question
        let firstUnanswered = 0;
        for (let i = 0; i < soal.length; i++) {
            if (!savedAnswers[soal[i].id]) {
                firstUnanswered = i;
                break;
            }
        }
        setCurrentSoalIndex(firstUnanswered);
    }, [jawaban]);

    // Update current answer when soal changes
    useEffect(() => {
        const currentSoal = soal[currentSoalIndex];
        setCurrentJawaban(selectedJawaban[currentSoal?.id] || '');
    }, [currentSoalIndex, selectedJawaban]);

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
        setCurrentJawaban(jawaban);
        setSelectedJawaban((prev) => ({
            ...prev,
            [soalId]: jawaban,
        }));

        // Auto save to server
        setIsSaving(true);
        try {
            await axios.post(route('siswa.ujian.simpan-jawaban', ujianSiswa.id), {
                soal_ujian_id: soalId,
                jawaban: jawaban,
            });
        } catch (error) {
            console.error('Error saving answer:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleNextSoal = () => {
        const currentSoal = soal[currentSoalIndex];
        
        // Peringatan jika belum menjawab
        if (!currentJawaban) {
            if (!confirm('Anda belum menjawab soal ini. Lanjut ke soal berikutnya? (Anda tidak dapat kembali ke soal ini)')) {
                return;
            }
        }

        // Jika ini soal terakhir, tampilkan tombol submit
        if (currentSoalIndex === soal.length - 1) {
            handleSubmit();
            return;
        }

        // Lanjut ke soal berikutnya
        setCurrentSoalIndex(currentSoalIndex + 1);
        setCurrentJawaban('');
    };

    const handleSubmit = () => {
        if (isSubmitting) return;

        const unansweredCount = soal.length - Object.keys(selectedJawaban).length;
        
        if (unansweredCount > 0) {
            if (!confirm(`Anda masih memiliki ${unansweredCount} soal yang belum dijawab. Apakah Anda yakin ingin menyelesaikan ujian?`)) {
                return;
            }
        } else {
            if (!confirm('Apakah Anda yakin ingin menyelesaikan ujian? Anda tidak dapat mengubah jawaban setelah submit.')) {
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

    const currentSoal = soal[currentSoalIndex];
    const progress = ((currentSoalIndex + 1) / soal.length) * 100;
    const answeredCount = Object.keys(selectedJawaban).length;

    return (
        <SidebarLayout>
            <Head title={`${ujianSiswa.ujian.judul_ujian} - Kerjakan Ujian`} />

            <div className="relative min-h-screen py-6 sm:py-8 bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Floating Blur Orbs Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 left-10 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />
                    <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Card - CAT Style */}
                    <div className="mb-6 rounded-2xl border border-white/70 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                        <div className="flex flex-col space-y-4">
                            {/* Title & Timer Row */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{ujianSiswa.ujian.judul_ujian}</h2>
                                            <p className="text-sm text-gray-600">
                                                {ujianSiswa.ujian.mata_pelajaran.nama} • {ujianSiswa.ujian.guru.nama_lengkap}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className={`rounded-xl border px-4 py-3 ${sisaWaktu < 300 ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
                                        <p className="text-xs font-medium text-gray-600">Sisa Waktu</p>
                                        <p className={`text-2xl font-bold ${sisaWaktu < 300 ? 'text-red-700' : 'text-orange-700'}`}>
                                            {formatTime(sisaWaktu)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar - CAT Style */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-slate-900">
                                            Soal {currentSoalIndex + 1} dari {soal.length}
                                        </span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-600">
                                            {answeredCount} terjawab
                                        </span>
                                    </div>
                                    <span className="font-semibold text-indigo-600">{progress.toFixed(0)}%</span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out relative overflow-hidden"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Alert */}
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start space-x-2">
                                <svg className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-amber-800">
                                    <span className="font-semibold">Mode CAT:</span> Anda tidak dapat kembali ke soal sebelumnya setelah melanjutkan. Pastikan jawaban Anda sudah benar sebelum klik "Lanjut".
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Soal CAT Style */}
                    <div className="rounded-2xl border border-white/70 bg-white/95 p-8 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.4)] backdrop-blur">
                        {/* Soal Header */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {currentSoal.nomor_soal}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Soal Nomor</p>
                                        <p className="text-lg font-bold text-slate-900">{currentSoal.nomor_soal} dari {soal.length}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Bobot</p>
                                    <p className="text-xl font-bold text-indigo-600">{currentSoal.bobot} poin</p>
                                </div>
                            </div>
                        </div>

                        {/* Soal Question */}
                        <div className="mb-8">
                            <div className="prose max-w-none text-slate-900 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: currentSoal.pertanyaan }} />
                            {currentSoal.file_soal && (
                                <div className="mt-6">
                                    <img
                                        src={`/storage/${currentSoal.file_soal}`}
                                        alt="Gambar Soal"
                                        className="max-w-full h-auto rounded-xl border border-gray-200 shadow-lg"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Options - CAT Style */}
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-700 mb-4">Pilih jawaban yang paling tepat:</p>
                            {['A', 'B', 'C', 'D', 'E'].map((option) => {
                                const optionKey = `opsi_${option.toLowerCase()}` as keyof Soal;
                                const optionText = currentSoal[optionKey];
                                
                                if (!optionText) return null;

                                const isSelected = currentJawaban === option;

                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleSelectJawaban(currentSoal.id, option)}
                                        className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
                                            isSelected
                                                ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg scale-[1.02]'
                                                : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div
                                                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-bold transition-all ${
                                                    isSelected
                                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {option}
                                            </div>
                                            <div className="flex-1 pt-1.5">
                                                <p className="text-slate-900 leading-relaxed">{optionText}</p>
                                            </div>
                                            {isSelected && (
                                                <div className="flex-shrink-0">
                                                    <svg className="h-6 w-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Status Saving */}
                        {isSaving && (
                            <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menyimpan jawaban...
                            </div>
                        )}

                        {/* Navigation Button - CAT Style (Only Next) */}
                        <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                {currentJawaban ? (
                                    <span className="flex items-center text-green-600">
                                        <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Jawaban tersimpan
                                    </span>
                                ) : (
                                    <span className="flex items-center text-amber-600">
                                        <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Belum menjawab
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleNextSoal}
                                disabled={isSubmitting}
                                className={`inline-flex items-center rounded-xl px-8 py-4 text-white font-semibold shadow-lg transition-all ${
                                    currentSoalIndex === soal.length - 1
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                } hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengirim...
                                    </>
                                ) : currentSoalIndex === soal.length - 1 ? (
                                    <>
                                        Selesai & Submit Ujian
                                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        Lanjut ke Soal Berikutnya
                                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
