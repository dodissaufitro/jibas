import React from 'react';
import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface MataPelajaran {
    id: number;
    nama: string;
    kode: string;
}

interface User {
    name: string;
}

interface Guru {
    id: number;
    nama_lengkap: string;
    user: User;
}

interface Jenjang {
    nama: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
    nama: string;
    jenjang: Jenjang;
}

interface JadwalItem {
    id: number;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    ruangan: string;
    mata_pelajaran: MataPelajaran;
    guru: Guru;
    kelas: Kelas;
}

interface Siswa {
    id: number;
    nama_lengkap: string;
    nis: string;
    kelas: Kelas;
}

interface Props {
    siswa: Siswa;
    jadwalPelajaran: Record<string, JadwalItem[]>;
    hariList: string[];
}

export default function JadwalPelajaran({ siswa, jadwalPelajaran, hariList }: Props) {
    const getDayColor = (hari: string) => {
        const colors: Record<string, string> = {
            Senin: 'bg-red-50 border-red-200',
            Selasa: 'bg-orange-50 border-orange-200',
            Rabu: 'bg-yellow-50 border-yellow-200',
            Kamis: 'bg-green-50 border-green-200',
            Jumat: 'bg-blue-50 border-blue-200',
            Sabtu: 'bg-purple-50 border-purple-200',
            Minggu: 'bg-pink-50 border-pink-200',
        };
        return colors[hari] || 'bg-gray-50 border-gray-200';
    };

    const getDayBadgeColor = (hari: string) => {
        const colors: Record<string, string> = {
            Senin: 'bg-red-100 text-red-800 border-red-300',
            Selasa: 'bg-orange-100 text-orange-800 border-orange-300',
            Rabu: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            Kamis: 'bg-green-100 text-green-800 border-green-300',
            Jumat: 'bg-blue-100 text-blue-800 border-blue-300',
            Sabtu: 'bg-purple-100 text-purple-800 border-purple-300',
            Minggu: 'bg-pink-100 text-pink-800 border-pink-300',
        };
        return colors[hari] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const getCurrentDay = () => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[new Date().getDay()];
    };

    const currentDay = getCurrentDay();

    return (
        <SidebarLayout>
            <Head title="Jadwal Pelajaran" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Jadwal Pelajaran
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Lihat jadwal mata pelajaran Anda untuk mengikuti ujian
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-600">
                                {siswa.nama_lengkap}
                            </div>
                            <div className="text-xs text-gray-500">
                                NIS: {siswa.nis}
                            </div>
                            <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {siswa.kelas.nama} - {siswa.kelas.jenjang.nama}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-blue-900">
                                Informasi Penting
                            </h3>
                            <p className="mt-1 text-sm text-blue-800">
                                Jadwal pelajaran ini menentukan mata pelajaran dan guru yang dapat memberikan ujian kepada Anda. 
                                Anda hanya dapat mengikuti ujian dari guru dan mata pelajaran yang tercantum dalam jadwal kelas Anda.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Jadwal per Hari */}
                <div className="space-y-6">
                    {Object.entries(jadwalPelajaran).map(([hari, jadwalList]) => {
                        const isToday = hari === currentDay;
                        
                        return (
                            <div
                                key={hari}
                                className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden ${
                                    isToday ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                                }`}
                            >
                                {/* Day Header */}
                                <div className={`px-6 py-4 ${getDayColor(hari)} border-b-2 ${isToday ? 'border-blue-400' : 'border-gray-300'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border-2 ${getDayBadgeColor(hari)}`}>
                                                {hari}
                                            </span>
                                            {isToday && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white animate-pulse">
                                                    Hari Ini
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">
                                            {jadwalList.length} Mata Pelajaran
                                        </span>
                                    </div>
                                </div>

                                {/* Schedule Items */}
                                <div className="divide-y divide-gray-200">
                                    {jadwalList.map((jadwal, index) => (
                                        <div
                                            key={jadwal.id}
                                            className="p-5 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Time */}
                                                <div className="flex-shrink-0 w-32">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{formatTime(jadwal.jam_mulai)}</span>
                                                    </div>
                                                    <div className="ml-6 text-xs text-gray-500">
                                                        s/d {formatTime(jadwal.jam_selesai)}
                                                    </div>
                                                </div>

                                                {/* Divider */}
                                                <div className="flex-shrink-0 w-px bg-gray-300 self-stretch"></div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                                {jadwal.mata_pelajaran.nama}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                                <div className="flex items-center gap-1.5">
                                                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                    </svg>
                                                                    <span>{jadwal.guru.nama_lengkap}</span>
                                                                </div>
                                                                {jadwal.ruangan && (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                        <span>{jadwal.ruangan}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Kode Mapel Badge */}
                                                        <div className="flex-shrink-0">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                                                                {jadwal.mata_pelajaran.kode}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty State */}
                    {Object.keys(jadwalPelajaran).length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Belum Ada Jadwal
                            </h3>
                            <p className="text-gray-600">
                                Jadwal pelajaran untuk kelas Anda belum tersedia. Silakan hubungi admin atau wali kelas.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
