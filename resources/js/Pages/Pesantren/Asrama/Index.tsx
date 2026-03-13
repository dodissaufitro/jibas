import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Pengurus {
    id: number;
    name: string;
}

interface AsramaItem {
    id: number;
    nama_asrama: string;
    jenis: 'putra' | 'putri';
    kapasitas: number;
    terisi: number;
    status: 'aktif' | 'nonaktif';
    alamat?: string | null;
    fasilitas?: string[] | null;
    pengurus?: Pengurus | null;
    kamar?: { id: number }[];
    penghuni_count?: number;
}

interface PaginatedAsrama {
    data: AsramaItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    asrama: PaginatedAsrama;
    filters: {
        search?: string;
    };
    stats: {
        total_asrama: number;
        asrama_aktif: number;
        total_kapasitas: number;
        total_terisi: number;
    };
}

export default function Index({ asrama, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const occupancyPercent = useMemo(() => {
        if (stats.total_kapasitas === 0) return 0;
        return Math.round((stats.total_terisi / stats.total_kapasitas) * 100);
    }, [stats.total_terisi, stats.total_kapasitas]);

    const applyFilter = () => {
        router.get(route('pesantren.asrama.index'), { search }, { preserveState: true });
    };

    const getJenisClass = (jenis: string) =>
        jenis === 'putra'
            ? 'bg-sky-100 text-sky-700 border-sky-200'
            : 'bg-pink-100 text-pink-700 border-pink-200';

    const getStatusClass = (status: string) =>
        status === 'aktif'
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <SidebarLayout>
            <Head title="Asrama" />

            <div className="relative py-6 sm:py-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-emerald-300/40 blur-3xl" />
                    <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-6 text-white shadow-[0_25px_80px_-30px_rgba(5,150,105,0.75)]">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
                                    Pesantren Dormitory
                                </p>
                                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Manajemen Asrama</h1>
                                <p className="mt-2 max-w-2xl text-sm text-emerald-100">
                                    Kelola hunian santri dengan tampilan visual 3D untuk memantau kapasitas, keterisian, dan status setiap asrama.
                                </p>
                            </div>
                            <Link
                                href={route('pesantren.asrama.create')}
                                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Asrama
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(5,150,105,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Total Asrama</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total_asrama}</p>
                        </div>
                        <div className="rounded-2xl border border-cyan-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(14,165,233,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Asrama Aktif</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.asrama_aktif}</p>
                        </div>
                        <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(245,158,11,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Kapasitas Total</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total_kapasitas}</p>
                        </div>
                        <div className="rounded-2xl border border-purple-100 bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(147,51,234,0.55)] backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">Keterisian</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{occupancyPercent}%</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama asrama..."
                                className="w-full flex-1 rounded-xl border border-emerald-100 bg-white px-4 py-2.5 text-sm shadow-inner focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            />
                            <button
                                type="button"
                                onClick={applyFilter}
                                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-700"
                            >
                                Filter
                            </button>
                            <Link
                                href={route('pesantren.asrama.index')}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                                Reset
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {asrama.data.length > 0 ? (
                            asrama.data.map((item) => {
                                const kamarCount = item.kamar?.length || 0;
                                const terisi = item.penghuni_count ?? item.terisi;
                                const progress = item.kapasitas > 0 ? Math.min(100, Math.round((terisi / item.kapasitas) * 100)) : 0;

                                return (
                                    <div
                                        key={item.id}
                                        className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-[0_25px_65px_-35px_rgba(15,23,42,0.45)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_30px_70px_-35px_rgba(15,23,42,0.55)]"
                                    >
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{item.nama_asrama}</h3>
                                                <p className="mt-1 text-xs text-slate-500">Pengurus: {item.pengurus?.name || '-'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getJenisClass(item.jenis)}`}>
                                                    {item.jenis}
                                                </span>
                                                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                                                    <span>Keterisian</span>
                                                    <span className="font-semibold">{terisi}/{item.kapasitas}</span>
                                                </div>
                                                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                                                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${progress}%` }} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="rounded-xl bg-slate-50 p-3">
                                                    <p className="text-xs text-slate-500">Jumlah Kamar</p>
                                                    <p className="mt-1 text-lg font-bold text-slate-800">{kamarCount}</p>
                                                </div>
                                                <div className="rounded-xl bg-slate-50 p-3">
                                                    <p className="text-xs text-slate-500">Sisa Tempat</p>
                                                    <p className="mt-1 text-lg font-bold text-slate-800">{Math.max(item.kapasitas - terisi, 0)}</p>
                                                </div>
                                            </div>

                                            <p className="line-clamp-2 text-xs text-slate-500">{item.alamat || 'Alamat belum diisi.'}</p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                                            <Link
                                                href={route('pesantren.asrama.edit', item.id)}
                                                className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
                                Belum ada data asrama. Silakan tambah asrama pertama.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
