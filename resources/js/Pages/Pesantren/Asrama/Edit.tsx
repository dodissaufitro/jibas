import { Head, Link, router, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

interface Pengurus {
    id: number;
    name: string;
}

interface Asrama {
    id: number;
    nama_asrama: string;
    jenis: 'putra' | 'putri';
    kapasitas: number;
    pengurus_id: number | null;
    alamat: string | null;
    fasilitas: string[] | null;
    status: 'aktif' | 'nonaktif';
}

interface Props {
    asrama: Asrama;
    pengurus: Pengurus[];
}

export default function Edit({ asrama, pengurus }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_asrama: asrama.nama_asrama,
        jenis: asrama.jenis,
        kapasitas: String(asrama.kapasitas),
        pengurus_id: asrama.pengurus_id ? String(asrama.pengurus_id) : '',
        alamat: asrama.alamat || '',
        fasilitas_text: (asrama.fasilitas || []).join(', '),
        status: asrama.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fasilitas = data.fasilitas_text
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        router.put(route('pesantren.asrama.update', asrama.id), {
            nama_asrama: data.nama_asrama,
            jenis: data.jenis,
            kapasitas: data.kapasitas,
            pengurus_id: data.pengurus_id || null,
            alamat: data.alamat,
            fasilitas,
            status: data.status,
        });
    };

    return (
        <SidebarLayout>
            <Head title="Edit Asrama" />

            <div className="relative py-6 sm:py-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 left-10 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
                    <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('pesantren.asrama.index')} className="text-sm text-slate-600 hover:text-slate-900">
                            ← Kembali ke daftar asrama
                        </Link>
                        <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit Asrama</h1>
                        <p className="text-sm text-slate-600">Perbarui informasi asrama dengan cepat.</p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_25px_65px_-35px_rgba(15,23,42,0.45)] backdrop-blur"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Nama Asrama</label>
                                <input
                                    type="text"
                                    value={data.nama_asrama}
                                    onChange={(e) => setData('nama_asrama', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                                    required
                                />
                                {errors.nama_asrama && <p className="mt-1 text-xs text-red-600">{errors.nama_asrama}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">Jenis</label>
                                <select
                                    value={data.jenis}
                                    onChange={(e) => setData('jenis', e.target.value as 'putra' | 'putri')}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                                >
                                    <option value="putra">Putra</option>
                                    <option value="putri">Putri</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">Kapasitas</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={data.kapasitas}
                                    onChange={(e) => setData('kapasitas', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                                    required
                                />
                                {errors.kapasitas && <p className="mt-1 text-xs text-red-600">{errors.kapasitas}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">Pengurus</label>
                                <select
                                    value={data.pengurus_id}
                                    onChange={(e) => setData('pengurus_id', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                                >
                                    <option value="">Pilih Pengurus</option>
                                    {pengurus.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Alamat</label>
                                <textarea
                                    rows={3}
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Fasilitas (pisahkan dengan koma)</label>
                                <input
                                    type="text"
                                    value={data.fasilitas_text}
                                    onChange={(e) => setData('fasilitas_text', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as 'aktif' | 'nonaktif')}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
                            <Link href={route('pesantren.asrama.index')} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
