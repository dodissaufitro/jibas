import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head } from '@inertiajs/react';

export default function ComingSoon({ module }: { module: string }) {
    return (
        <SidebarLayout>
            <Head title={module} />

            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="text-center">
                    <div className="mb-8">
                        <div className="inline-block p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl animate-bounce">
                            <svg
                                className="w-24 h-24 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                            </svg>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Modul Segera Hadir! 🚀
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-2">
                        {module}
                    </p>
                    
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Modul ini sedang dalam tahap pengembangan. 
                        Kami akan segera meluncurkannya dengan fitur-fitur terbaik untuk Anda.
                    </p>

                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg">
                        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Dalam Pengembangan
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="text-4xl mb-3">📋</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Perencanaan</h3>
                            <p className="text-sm text-gray-600">Desain & spesifikasi fitur</p>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="text-4xl mb-3">⚙️</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Pengembangan</h3>
                            <p className="text-sm text-gray-600">Coding & implementasi</p>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="text-4xl mb-3">✅</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Testing</h3>
                            <p className="text-sm text-gray-600">Quality assurance</p>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
