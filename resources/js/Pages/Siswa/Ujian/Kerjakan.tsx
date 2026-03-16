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
    // ALL HOOKS MUST BE CALLED FIRST (UNCONDITIONALLY) - React Rules of Hooks
    const [selectedJawaban, setSelectedJawaban] = useState<{ [key: number]: string }>({});
    const [sisaWaktu, setSisaWaktu] = useState(typeof initialSisaWaktu === 'number' ? initialSisaWaktu : 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredQuestion, setHoveredQuestion] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Load saved answers - MUST be called before any early returns
    useEffect(() => {
        try {
            const savedAnswers: { [key: number]: string } = {};
            if (jawaban && typeof jawaban === 'object') {
                Object.keys(jawaban).forEach((soalId) => {
                    const id = parseInt(soalId);
                    if (jawaban[id] && jawaban[id].jawaban) {
                        savedAnswers[id] = jawaban[id].jawaban;
                    }
                });
            }
            console.log('Loaded saved answers:', savedAnswers);
            setSelectedJawaban(savedAnswers);
        } catch (error) {
            console.error('Error loading saved answers:', error);
        }
    }, [jawaban]);

    // Timer countdown - MUST be called before any early returns
    useEffect(() => {
        // Only run timer if we have valid data
        if (!ujianSiswa || !soal || soal.length === 0) {
            return;
        }

        const timer = setInterval(() => {
            setSisaWaktu((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Auto-submit when time is up
                    if (!isSubmitting && ujianSiswa && ujianSiswa.id) {
                        router.post(route('siswa.ujian.submit', ujianSiswa.id), {}, {
                            onFinish: () => setIsSubmitting(false),
                        });
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []); // Empty dependency array - only run once on mount

    // Console log untuk debugging
    console.log('=== KERJAKAN UJIAN DEBUG ===');
    console.log('ujianSiswa:', ujianSiswa);
    console.log('soal:', soal);
    console.log('soal length:', soal?.length);
    console.log('jawaban:', jawaban);
    console.log('sisaWaktu:', initialSisaWaktu);
    console.log('===========================');

    // Validasi props - Cek apakah data ada
    if (!ujianSiswa) {
        console.error('ujianSiswa is null/undefined');
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Data Ujian Siswa Tidak Ditemukan</h2>
                    <p className="text-gray-600 mb-4">Terjadi kesalahan saat memuat data ujian siswa.</p>
                    <a href="/siswa/ujian" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                        Kembali ke Daftar Ujian
                    </a>
                </div>
            </div>
        );
    }

    if (!ujianSiswa.ujian) {
        console.error('ujianSiswa.ujian is null/undefined');
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Data Ujian Tidak Valid</h2>
                    <p className="text-gray-600 mb-4">Informasi ujian tidak lengkap.</p>
                    <a href="/siswa/ujian" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                        Kembali ke Daftar Ujian
                    </a>
                </div>
            </div>
        );
    }

    if (!soal || soal.length === 0) {
        console.error('Soal kosong atau undefined:', soal);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <svg className="mx-auto h-16 w-16 text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Ujian Belum Memiliki Soal</h2>
                    <p className="text-gray-600 mb-4">Ujian ini belum memiliki soal. Silakan hubungi guru pengampu.</p>
                    <a href="/siswa/ujian" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                        Kembali ke Daftar Ujian
                    </a>
                </div>
            </div>
        );
    }

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

    const handleNextQuestion = () => {
        if (currentQuestionIndex < soal.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
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
    const isTimeCritical = sisaWaktu < 300; // 5 minutes

    return (
        <>
            <Head title={`${ujianSiswa.ujian.judul_ujian}`} />

            {/* Add custom styles for animations */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 0.8; }
                }
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float 8s ease-in-out infinite;
                    animation-delay: 2s;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                .card-3d {
                    transform-style: preserve-3d;
                    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .card-3d:hover {
                    transform: translateY(-8px) rotateX(2deg) rotateY(-2deg) scale(1.02);
                }
                .glass-effect {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .option-card {
                    transform-style: preserve-3d;
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    position: relative;
                    overflow: hidden;
                }
                .option-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    transition: left 0.5s;
                }
                .option-card:hover::before {
                    left: 100%;
                }
                .option-card:hover {
                    transform: translateX(4px) scale(1.01);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }
                .gradient-border {
                    border-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-image-slice: 1;
                }
            `}} />

            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
                    <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
                    <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
                </div>

                {/* Fixed Glassmorphism Header */}
                <div className="sticky top-0 z-50 glass-effect shadow-lg border-b border-white/30">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Title Section */}
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                                </div>
                                <div>
                                    <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {ujianSiswa.ujian.judul_ujian}
                                    </h1>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                                            {ujianSiswa.ujian.jenis_ujian}
                                        </span>
                                        <span className="text-sm text-gray-600">{ujianSiswa.ujian.mata_pelajaran.nama}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="flex items-center space-x-3">
                                {/* Timer */}
                                <div className={`flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
                                    isTimeCritical 
                                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse' 
                                        : 'bg-white/90 text-indigo-700'
                                }`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-mono font-bold text-lg">{formatTime(sisaWaktu)}</span>
                                </div>

                                {/* Progress Circle */}
                                <div className="relative w-16 h-16">
                                    <svg className="transform -rotate-90 w-16 h-16">
                                        <circle
                                            cx="32"
                                            cy="32"
                                            r="28"
                                            stroke="currentColor"
                                            strokeWidth="6"
                                            fill="none"
                                            className="text-gray-200"
                                        />
                                        <circle
                                            cx="32"
                                            cy="32"
                                            r="28"
                                            stroke="currentColor"
                                            strokeWidth="6"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 28}`}
                                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                                            className="text-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                                            style={{
                                                stroke: progress === 100 ? '#10b981' : progress > 50 ? '#8b5cf6' : '#6366f1'
                                            }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-700">{answeredCount}/{soal.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Linear Progress Bar */}
                        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-500 ease-out relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Info Card dengan Glassmorphism */}
                    <div className="mb-8 p-6 glass-effect rounded-3xl shadow-2xl border border-white/30 transform hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">📋 Petunjuk Pengerjaan</h3>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li>✓ Pilih salah satu jawaban untuk setiap soal</li>
                                    <li>✓ Jawaban Anda akan tersimpan otomatis</li>
                                    <li>✓ Klik tombol <strong className="text-purple-600">Submit Ujian</strong> setelah selesai</li>
                                    <li>✓ Perhatikan waktu yang tersisa di pojok kanan atas</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Question Display - Single Question at a Time */}
                    {(() => {
                        const item = soal[currentQuestionIndex];
                        const index = currentQuestionIndex;
                        
                        return (
                            <div 
                                key={item.id}
                                onMouseEnter={() => setHoveredQuestion(item.id)}
                                onMouseLeave={() => setHoveredQuestion(null)}
                                className="card-3d glass-effect rounded-3xl shadow-2xl border-l-8 border-gradient p-8 relative overflow-hidden"
                                style={{
                                    borderLeftColor: selectedJawaban[item.id] ? '#10b981' : '#6366f1'
                                }}
                            >
                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full filter blur-3xl -z-10"></div>

                                {/* Question Number Badge */}
                                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                                    <span className="text-2xl font-bold text-white">{index + 1}</span>
                                </div>

                                {/* Status Badge */}
                                {selectedJawaban[item.id] && (
                                    <div className="absolute top-4 right-4">
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm font-semibold">Terjawab</span>
                                        </div>
                                    </div>
                                )}

                                {/* Question Content */}
                                <div className="mt-8 mb-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 mr-4">
                                            <h3 className="text-xl font-bold text-gray-800 leading-relaxed mb-3">
                                                {item.pertanyaan}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                    </svg>
                                                    {item.bobot} poin
                                                </span>
                                            </div>
                                        </div>
                                        {selectedJawaban[item.id] && (
                                            <button
                                                onClick={() => handleClearJawaban(item.id)}
                                                className="flex-shrink-0 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-300 hover:scale-110"
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
                                        <div className="mt-6 p-4 bg-white/50 rounded-2xl">
                                            <img 
                                                src={`/storage/${item.file_soal}`} 
                                                alt="Gambar Soal" 
                                                className="max-w-full h-auto rounded-xl shadow-lg border-4 border-white"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Options dengan efek 3D */}
                                <div className="space-y-4">
                                    {['A', 'B', 'C', 'D', 'E'].map((option) => {
                                        const optionValue = item[`opsi_${option.toLowerCase()}` as keyof Soal] as string;
                                        if (!optionValue && option === 'E') return null;

                                        const isSelected = selectedJawaban[item.id] === option;
                                        
                                        return (
                                            <label 
                                                key={option}
                                                className={`option-card flex items-start p-5 rounded-2xl border-2 cursor-pointer group ${
                                                    isSelected 
                                                        ? 'border-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 shadow-xl scale-[1.02]' 
                                                        : 'border-gray-200 bg-white/70 hover:border-purple-300 hover:bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center h-full">
                                                    <div className="relative">
                                                        <input
                                                            type="radio"
                                                            name={`soal-${item.id}`}
                                                            value={option}
                                                            checked={isSelected}
                                                            onChange={() => handleSelectJawaban(item.id, option)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-7 h-7 rounded-full border-3 flex items-center justify-center transition-all duration-300 ${
                                                            isSelected 
                                                                ? 'border-purple-600 bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg' 
                                                                : 'border-gray-300 bg-white group-hover:border-purple-400'
                                                        }`}>
                                                            {isSelected && (
                                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`text-lg font-bold ${
                                                            isSelected ? 'text-purple-700' : 'text-gray-700 group-hover:text-purple-600'
                                                        }`}>
                                                            {option}.
                                                        </span>
                                                        <span className={`text-base ${
                                                            isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'
                                                        }`}>
                                                            {optionValue}
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Navigation Buttons - Next/Previous */}
                    <div className="mt-8 flex items-center justify-between gap-4">
                        <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 ${
                                currentQuestionIndex === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105'
                            }`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Previous</span>
                        </button>

                        {/* Question Counter */}
                        <div className="flex-1 text-center">
                            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/90 rounded-2xl shadow-lg border-2 border-purple-300">
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {currentQuestionIndex + 1}
                                </span>
                                <span className="text-gray-500">/</span>
                                <span className="text-lg text-gray-700">{soal.length}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex === soal.length - 1}
                            className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 ${
                                currentQuestionIndex === soal.length - 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105'
                            }`}
                        >
                            <span>Next</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation - Show on small screens */}
                    <div className="mt-6 lg:hidden">
                        <div className="glass-effect rounded-2xl shadow-xl p-4">
                            <h4 className="text-sm font-bold text-gray-700 mb-3">Navigasi Soal</h4>
                            <div className="grid grid-cols-5 gap-2">
                                {soal.map((item, index) => (
                                    <button
                                        key={item.id}
                                        onClick={() => goToQuestion(index)}
                                        className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                            index === currentQuestionIndex
                                                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg ring-2 ring-purple-300 transform scale-105'
                                                : selectedJawaban[item.id]
                                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md'
                                                : 'bg-white text-gray-600 border-2 border-gray-200'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button dengan efek 3D */}
                    <div className="mt-12 flex items-center justify-center pb-12">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`relative group px-12 py-5 rounded-2xl font-bold text-lg text-white shadow-2xl transition-all duration-500 overflow-hidden ${
                                isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105'
                            }`}
                        >
                            {/* Animated background */}
                            {!isSubmitting && (
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            )}
                            
                            <span className="relative z-10 flex items-center">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengirim Jawaban...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Submit Ujian Sekarang
                                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Question Navigation Panel - Direct Jump */}
                    <div className="fixed bottom-6 right-6 z-50 lg:block hidden">
                        <div className="glass-effect rounded-2xl shadow-2xl p-4 max-h-96 overflow-y-auto">
                            <h4 className="text-sm font-bold text-gray-700 mb-3 px-2">Navigasi Soal</h4>
                            <div className="grid grid-cols-5 gap-2">
                                {soal.map((item, index) => (
                                    <button
                                        key={item.id}
                                        onClick={() => goToQuestion(index)}
                                        className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                            index === currentQuestionIndex
                                                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg ring-4 ring-purple-300 transform scale-110'
                                                : selectedJawaban[item.id]
                                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg transform hover:scale-110'
                                                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-purple-400 hover:scale-105'
                                        }`}
                                        title={`Soal ${index + 1}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
