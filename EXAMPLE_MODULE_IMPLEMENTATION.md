# 📘 Contoh Implementasi Modul - Hafalan Al-Qur'an

> **Tutorial Step-by-Step: Implement Modul Pesantren - Hafalan Quran**

---

## 🎯 Tujuan

Membuat modul hafalan Al-Qur'an untuk pesantren dengan fitur:

- Input setoran hafalan
- Tracking progress per santri
- Laporan hafalan
- Sertifikat hafalan

---

## 📋 Step 1: Database Migration

```bash
php artisan make:migration create_hafalan_quran_table
```

```php
// database/migrations/2024_03_14_000001_create_hafalan_quran_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hafalan_quran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->integer('juz')->nullable();
            $table->string('surah', 100);
            $table->integer('ayat_dari');
            $table->integer('ayat_sampai');
            $table->date('tanggal_setoran');
            $table->foreignId('penguji_id')->constrained('guru');
            $table->enum('nilai', ['mumtaz', 'jayyid', 'maqbul', 'diulang']);
            $table->text('catatan')->nullable();
            $table->string('audio_recording')->nullable();
            $table->timestamps();

            $table->index(['siswa_id', 'tanggal_setoran']);
            $table->index('institution_id');
        });

        // Table untuk target hafalan
        Schema::create('target_hafalan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran');
            $table->integer('target_juz')->default(30);
            $table->date('deadline')->nullable();
            $table->integer('progress_juz')->default(0);
            $table->decimal('progress_persen', 5, 2)->default(0);
            $table->timestamps();

            $table->unique(['siswa_id', 'tahun_ajaran_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hafalan_quran');
        Schema::dropIfExists('target_hafalan');
    }
};
```

```bash
php artisan migrate
```

---

## 📦 Step 2: Model dengan Relationships

```php
// app/Models/HafalanQuran.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HafalanQuran extends Model
{
    use HasFactory;

    protected $table = 'hafalan_quran';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'juz',
        'surah',
        'ayat_dari',
        'ayat_sampai',
        'tanggal_setoran',
        'penguji_id',
        'nilai',
        'catatan',
        'audio_recording',
    ];

    protected $casts = [
        'tanggal_setoran' => 'date',
    ];

    // Relationships
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function penguji(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'penguji_id');
    }

    // Accessors
    public function getNilaiLabelAttribute(): string
    {
        return match($this->nilai) {
            'mumtaz' => 'Mumtaz (A)',
            'jayyid' => 'Jayyid (B)',
            'maqbul' => 'Maqbul (C)',
            'diulang' => 'Harus Diulang',
        };
    }

    public function getJumlahAyatAttribute(): int
    {
        return $this->ayat_sampai - $this->ayat_dari + 1;
    }

    // Scopes
    public function scopeForInstitution($query, $institutionId)
    {
        return $query->where('institution_id', $institutionId);
    }

    public function scopeForSiswa($query, $siswaId)
    {
        return $query->where('siswa_id', $siswaId);
    }

    public function scopeLulus($query)
    {
        return $query->whereIn('nilai', ['mumtaz', 'jayyid', 'maqbul']);
    }
}
```

```php
// app/Models/TargetHafalan.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TargetHafalan extends Model
{
    protected $table = 'target_hafalan';

    protected $fillable = [
        'institution_id',
        'siswa_id',
        'tahun_ajaran_id',
        'target_juz',
        'deadline',
        'progress_juz',
        'progress_persen',
    ];

    protected $casts = [
        'deadline' => 'date',
        'progress_persen' => 'decimal:2',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class);
    }

    // Update progress
    public function updateProgress(): void
    {
        $totalHafalan = HafalanQuran::where('siswa_id', $this->siswa_id)
            ->lulus()
            ->count();

        // Estimasi: 20 setoran per juz (simplified)
        $this->progress_juz = floor($totalHafalan / 20);
        $this->progress_persen = ($this->progress_juz / $this->target_juz) * 100;
        $this->save();
    }
}
```

---

## 🔧 Step 3: Service Layer

```php
// app/Modules/Pesantren/Services/HafalanService.php
<?php

namespace App\Modules\Pesantren\Services;

use App\Models\HafalanQuran;
use App\Models\TargetHafalan;
use App\Models\Siswa;
use App\Events\HafalanDisetor;
use Illuminate\Support\Facades\DB;

class HafalanService
{
    public function catatSetoran(array $data): HafalanQuran
    {
        DB::beginTransaction();

        try {
            $hafalan = HafalanQuran::create($data);

            // Update target progress
            $target = TargetHafalan::where('siswa_id', $data['siswa_id'])->first();
            if ($target) {
                $target->updateProgress();
            }

            // Trigger notification to parent
            event(new HafalanDisetor($hafalan));

            DB::commit();
            return $hafalan;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getProgressSiswa(int $siswaId): array
    {
        $target = TargetHafalan::where('siswa_id', $siswaId)->first();

        $hafalanList = HafalanQuran::forSiswa($siswaId)
            ->with('penguji')
            ->orderBy('tanggal_setoran', 'desc')
            ->get();

        $stats = [
            'total_setoran' => $hafalanList->count(),
            'lulus' => $hafalanList->where('nilai', '!=', 'diulang')->count(),
            'diulang' => $hafalanList->where('nilai', 'diulang')->count(),
            'mumtaz' => $hafalanList->where('nilai', 'mumtaz')->count(),
            'jayyid' => $hafalanList->where('nilai', 'jayyid')->count(),
            'maqbul' => $hafalanList->where('nilai', 'maqbul')->count(),
        ];

        return [
            'target' => $target,
            'hafalan_list' => $hafalanList,
            'statistics' => $stats,
        ];
    }

    public function generateSertifikat(int $siswaId, int $juz): string
    {
        // Generate PDF sertifikat
        $siswa = Siswa::findOrFail($siswaId);

        // TODO: Implement PDF generation with DomPDF

        return "sertifikat_{$siswaId}_juz_{$juz}.pdf";
    }
}
```

---

## 🎛️ Step 4: Controller

```php
// app/Http/Controllers/Pesantren/HafalanController.php
<?php

namespace App\Http\Controllers\Pesantren;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pesantren\StoreHafalanRequest;
use App\Models\HafalanQuran;
use App\Models\Siswa;
use App\Models\Guru;
use App\Modules\Pesantren\Services\HafalanService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HafalanController extends Controller
{
    public function __construct(
        private HafalanService $hafalanService
    ) {
        $this->middleware(['auth', 'institution:pesantren']);
    }

    public function index(Request $request)
    {
        $institutionId = $request->user()->institution_id;

        $hafalan = HafalanQuran::with(['siswa', 'penguji'])
            ->forInstitution($institutionId)
            ->when($request->siswa_id, fn($q) => $q->forSiswa($request->siswa_id))
            ->when($request->nilai, fn($q) => $q->where('nilai', $request->nilai))
            ->latest('tanggal_setoran')
            ->paginate(20);

        $siswaList = Siswa::where('institution_id', $institutionId)
            ->where('is_active', true)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nis']);

        return Inertia::render('Pesantren/Hafalan/Index', [
            'hafalan' => $hafalan,
            'siswa_list' => $siswaList,
            'filters' => $request->only(['siswa_id', 'nilai']),
        ]);
    }

    public function create()
    {
        $institutionId = auth()->user()->institution_id;

        $siswaList = Siswa::where('institution_id', $institutionId)
            ->where('is_active', true)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nis', 'kelas_id']);

        $pengujiList = Guru::where('institution_id', $institutionId)
            ->where('status', 'aktif')
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nip']);

        return Inertia::render('Pesantren/Hafalan/Create', [
            'siswa_list' => $siswaList,
            'penguji_list' => $pengujiList,
            'surah_list' => $this->getSurahList(),
        ]);
    }

    public function store(StoreHafalanRequest $request)
    {
        $hafalan = $this->hafalanService->catatSetoran([
            ...$request->validated(),
            'institution_id' => $request->user()->institution_id,
        ]);

        return redirect()
            ->route('pesantren.hafalan.show', $hafalan)
            ->with('success', 'Hafalan berhasil dicatat');
    }

    public function show(HafalanQuran $hafalan)
    {
        $hafalan->load(['siswa.kelas', 'penguji']);

        return Inertia::render('Pesantren/Hafalan/Show', [
            'hafalan' => $hafalan,
        ]);
    }

    public function progress(Request $request, Siswa $siswa)
    {
        $data = $this->hafalanService->getProgressSiswa($siswa->id);

        return Inertia::render('Pesantren/Hafalan/Progress', [
            'siswa' => $siswa,
            ...$data,
        ]);
    }

    private function getSurahList(): array
    {
        return [
            ['no' => 1, 'nama' => 'Al-Fatihah', 'jumlah_ayat' => 7],
            ['no' => 2, 'nama' => 'Al-Baqarah', 'jumlah_ayat' => 286],
            ['no' => 3, 'nama' => 'Ali-Imran', 'jumlah_ayat' => 200],
            // ... 114 surah
            ['no' => 114, 'nama' => 'An-Nas', 'jumlah_ayat' => 6],
        ];
    }
}
```

---

## ✅ Step 5: Request Validation

```php
// app/Http/Requests/Pesantren/StoreHafalanRequest.php
<?php

namespace App\Http\Requests\Pesantren;

use Illuminate\Foundation\Http\FormRequest;

class StoreHafalanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create-hafalan');
    }

    public function rules(): array
    {
        return [
            'siswa_id' => ['required', 'exists:siswa,id'],
            'juz' => ['nullable', 'integer', 'between:1,30'],
            'surah' => ['required', 'string', 'max:100'],
            'ayat_dari' => ['required', 'integer', 'min:1'],
            'ayat_sampai' => ['required', 'integer', 'gte:ayat_dari'],
            'tanggal_setoran' => ['required', 'date', 'before_or_equal:today'],
            'penguji_id' => ['required', 'exists:guru,id'],
            'nilai' => ['required', 'in:mumtaz,jayyid,maqbul,diulang'],
            'catatan' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'siswa_id.required' => 'Santri harus dipilih',
            'surah.required' => 'Nama surah harus diisi',
            'ayat_sampai.gte' => 'Ayat sampai harus lebih besar atau sama dengan ayat dari',
            'tanggal_setoran.before_or_equal' => 'Tanggal setoran tidak boleh di masa depan',
            'nilai.in' => 'Nilai harus salah satu dari: Mumtaz, Jayyid, Maqbul, atau Diulang',
        ];
    }
}
```

---

## 🗺️ Step 6: Routes

```php
// routes/modules/pesantren.php
<?php

use App\Http\Controllers\Pesantren\HafalanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'institution:pesantren'])
    ->prefix('pesantren')
    ->name('pesantren.')
    ->group(function () {

        // Hafalan Routes
        Route::resource('hafalan', HafalanController::class);
        Route::get('hafalan/progress/{siswa}', [HafalanController::class, 'progress'])
            ->name('hafalan.progress');
    });
```

```php
// routes/web.php - Add this line
require __DIR__ . '/modules/pesantren.php';
```

---

## ⚛️ Step 7: React Components

### Index Page

```typescript
// resources/js/Pages/Pesantren/Hafalan/Index.tsx
import { useState } from 'react';
import { router, Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { HafalanQuran, PaginatedData, Siswa } from '@/types';

interface Props {
    hafalan: PaginatedData<HafalanQuran>;
    siswa_list: Siswa[];
    filters: {
        siswa_id?: string;
        nilai?: string;
    };
}

export default function HafalanIndex({ hafalan, siswa_list, filters }: Props) {
    const [selectedSiswa, setSelectedSiswa] = useState(filters.siswa_id || '');
    const [selectedNilai, setSelectedNilai] = useState(filters.nilai || '');

    const handleFilter = () => {
        router.get(route('pesantren.hafalan.index'), {
            siswa_id: selectedSiswa,
            nilai: selectedNilai,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getNilaiColor = (nilai: string) => {
        const colors = {
            mumtaz: 'bg-green-100 text-green-800',
            jayyid: 'bg-blue-100 text-blue-800',
            maqbul: 'bg-yellow-100 text-yellow-800',
            diulang: 'bg-red-100 text-red-800',
        };
        return colors[nilai as keyof typeof colors];
    };

    return (
        <SidebarLayout>
            <Head title="Hafalan Al-Qur'an" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Hafalan Al-Qur'an</h1>
                        <p className="text-gray-600 mt-1">Kelola catatan setoran hafalan santri</p>
                    </div>
                    <Link
                        href={route('pesantren.hafalan.create')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        + Catat Setoran
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter Santri
                            </label>
                            <select
                                value={selectedSiswa}
                                onChange={(e) => setSelectedSiswa(e.target.value)}
                                className="w-full border-gray-300 rounded-lg"
                            >
                                <option value="">Semua Santri</option>
                                {siswa_list.map((siswa) => (
                                    <option key={siswa.id} value={siswa.id}>
                                        {siswa.nama_lengkap} - {siswa.nis}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter Nilai
                            </label>
                            <select
                                value={selectedNilai}
                                onChange={(e) => setSelectedNilai(e.target.value)}
                                className="w-full border-gray-300 rounded-lg"
                            >
                                <option value="">Semua Nilai</option>
                                <option value="mumtaz">Mumtaz (A)</option>
                                <option value="jayyid">Jayyid (B)</option>
                                <option value="maqbul">Maqbul (C)</option>
                                <option value="diulang">Harus Diulang</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Tanggal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Santri
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Surah
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Ayat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Nilai
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Penguji
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {hafalan.data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(item.tanggal_setoran).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {item.siswa.nama_lengkap}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {item.siswa.nis}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.juz && <span className="text-gray-500 mr-2">Juz {item.juz}</span>}
                                        {item.surah}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.ayat_dari} - {item.ayat_sampai}
                                        <span className="text-gray-500 ml-2">
                                            ({item.jumlah_ayat} ayat)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getNilaiColor(item.nilai)}`}>
                                            {item.nilai_label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.penguji.nama_lengkap}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            href={route('pesantren.hafalan.show', item.id)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {hafalan.last_page > 1 && (
                        <div className="bg-white px-6 py-4 border-t">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700">
                                    Menampilkan {hafalan.from} - {hafalan.to} dari {hafalan.total} data
                                </div>
                                <div className="flex gap-2">
                                    {Array.from({ length: hafalan.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={route('pesantren.hafalan.index', { ...filters, page })}
                                            className={`px-3 py-1 rounded ${
                                                page === hafalan.current_page
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
```

### Create Form

```typescript
// resources/js/Pages/Pesantren/Hafalan/Create.tsx
import { useState, FormEvent } from 'react';
import { router, Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Siswa, Guru, Surah } from '@/types';

interface Props {
    siswa_list: Siswa[];
    penguji_list: Guru[];
    surah_list: Surah[];
}

export default function HafalanCreate({ siswa_list, penguji_list, surah_list }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        juz: '',
        surah: '',
        ayat_dari: '',
        ayat_sampai: '',
        tanggal_setoran: new Date().toISOString().split('T')[0],
        penguji_id: '',
        nilai: '',
        catatan: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('pesantren.hafalan.store'));
    };

    return (
        <SidebarLayout>
            <Head title="Catat Setoran Hafalan" />

            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Catat Setoran Hafalan</h1>
                    <p className="text-gray-600 mt-1">Input catatan setoran hafalan santri</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Santri */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Santri <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.siswa_id}
                                onChange={(e) => setData('siswa_id', e.target.value)}
                                className="w-full border-gray-300 rounded-lg"
                            >
                                <option value="">Pilih Santri</option>
                                {siswa_list.map((siswa) => (
                                    <option key={siswa.id} value={siswa.id}>
                                        {siswa.nama_lengkap} - {siswa.nis}
                                    </option>
                                ))}
                            </select>
                            {errors.siswa_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.siswa_id}</p>
                            )}
                        </div>

                        {/* Juz & Surah */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Juz
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={data.juz}
                                    onChange={(e) => setData('juz', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg"
                                    placeholder="1-30"
                                />
                                {errors.juz && (
                                    <p className="mt-1 text-sm text-red-600">{errors.juz}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Surah <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.surah}
                                    onChange={(e) => setData('surah', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg"
                                >
                                    <option value="">Pilih Surah</option>
                                    {surah_list.map((surah) => (
                                        <option key={surah.no} value={surah.nama}>
                                            {surah.no}. {surah.nama} ({surah.jumlah_ayat} ayat)
                                        </option>
                                    ))}
                                </select>
                                {errors.surah && (
                                    <p className="mt-1 text-sm text-red-600">{errors.surah}</p>
                                )}
                            </div>
                        </div>

                        {/* Ayat */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ayat Dari <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.ayat_dari}
                                    onChange={(e) => setData('ayat_dari', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg"
                                />
                                {errors.ayat_dari && (
                                    <p className="mt-1 text-sm text-red-600">{errors.ayat_dari}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ayat Sampai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.ayat_sampai}
                                    onChange={(e) => setData('ayat_sampai', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg"
                                />
                                {errors.ayat_sampai && (
                                    <p className="mt-1 text-sm text-red-600">{errors.ayat_sampai}</p>
                                )}
                            </div>
                        </div>

                        {/* Tanggal & Penguji */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Setoran <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_setoran}
                                    onChange={(e) => setData('tanggal_setoran', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg"
                                />
                                {errors.tanggal_setoran && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tanggal_setoran}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Penguji <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.penguji_id}
                                    onChange={(e) => setData('penguji_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg"
                                >
                                    <option value="">Pilih Penguji</option>
                                    {penguji_list.map((guru) => (
                                        <option key={guru.id} value={guru.id}>
                                            {guru.nama_lengkap}
                                        </option>
                                    ))}
                                </select>
                                {errors.penguji_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.penguji_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Nilai */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nilai <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: 'mumtaz', label: 'Mumtaz (A)', color: 'green' },
                                    { value: 'jayyid', label: 'Jayyid (B)', color: 'blue' },
                                    { value: 'maqbul', label: 'Maqbul (C)', color: 'yellow' },
                                    { value: 'diulang', label: 'Harus Diulang', color: 'red' },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                                            data.nilai === option.value
                                                ? `border-${option.color}-500 bg-${option.color}-50`
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="nilai"
                                            value={option.value}
                                            checked={data.nilai === option.value}
                                            onChange={(e) => setData('nilai', e.target.value)}
                                            className="mr-3"
                                        />
                                        <span className="font-medium">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.nilai && (
                                <p className="mt-1 text-sm text-red-600">{errors.nilai}</p>
                            )}
                        </div>

                        {/* Catatan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catatan
                            </label>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                className="w-full border-gray-300 rounded-lg"
                                rows={4}
                                placeholder="Catatan tambahan (opsional)"
                            />
                            {errors.catatan && (
                                <p className="mt-1 text-sm text-red-600">{errors.catatan}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href={route('pesantren.hafalan.index')}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Setoran'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
```

---

## 🧪 Step 8: Testing

```php
// tests/Feature/Pesantren/HafalanTest.php
<?php

namespace Tests\Feature\Pesantren;

use Tests\TestCase;
use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Institution;
use App\Models\HafalanQuran;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HafalanTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Institution $institution;
    private Siswa $siswa;
    private Guru $penguji;

    protected function setUp(): void
    {
        parent::setUp();

        $this->institution = Institution::factory()->create([
            'type' => 'pesantren'
        ]);

        $this->user = User::factory()->create([
            'institution_id' => $this->institution->id
        ]);

        $this->siswa = Siswa::factory()->create([
            'institution_id' => $this->institution->id
        ]);

        $this->penguji = Guru::factory()->create([
            'institution_id' => $this->institution->id
        ]);
    }

    /** @test */
    public function dapat_melihat_halaman_hafalan()
    {
        $response = $this->actingAs($this->user)
            ->get(route('pesantren.hafalan.index'));

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) =>
            $page->component('Pesantren/Hafalan/Index')
        );
    }

    /** @test */
    public function dapat_mencatat_setoran_hafalan()
    {
        $response = $this->actingAs($this->user)
            ->post(route('pesantren.hafalan.store'), [
                'siswa_id' => $this->siswa->id,
                'juz' => 1,
                'surah' => 'Al-Fatihah',
                'ayat_dari' => 1,
                'ayat_sampai' => 7,
                'tanggal_setoran' => now()->toDateString(),
                'penguji_id' => $this->penguji->id,
                'nilai' => 'mumtaz',
                'catatan' => 'Lancar dan tartil',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('hafalan_quran', [
            'siswa_id' => $this->siswa->id,
            'surah' => 'Al-Fatihah',
            'nilai' => 'mumtaz',
        ]);
    }

    /** @test */
    public function validasi_gagal_jika_ayat_sampai_lebih_kecil()
    {
        $response = $this->actingAs($this->user)
            ->post(route('pesantren.hafalan.store'), [
                'siswa_id' => $this->siswa->id,
                'surah' => 'Al-Baqarah',
                'ayat_dari' => 10,
                'ayat_sampai' => 5, // Invalid
                'tanggal_setoran' => now()->toDateString(),
                'penguji_id' => $this->penguji->id,
                'nilai' => 'mumtaz',
            ]);

        $response->assertSessionHasErrors('ayat_sampai');
    }

    /** @test */
    public function tidak_dapat_mengakses_jika_bukan_pesantren()
    {
        $schoolInstitution = Institution::factory()->create([
            'type' => 'umum'
        ]);

        $schoolUser = User::factory()->create([
            'institution_id' => $schoolInstitution->id
        ]);

        $response = $this->actingAs($schoolUser)
            ->get(route('pesantren.hafalan.index'));

        $response->assertStatus(403);
    }
}
```

---

## 🔧 Step 9: Seeder untuk Testing

```php
// database/seeders/HafalanSeeder.php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HafalanQuran;
use App\Models\Siswa;
use App\Models\Guru;

class HafalanSeeder extends Seeder
{
    public function run(): void
    {
        $siswa = Siswa::where('institution_id', 1)->first();
        $penguji = Guru::where('institution_id', 1)->first();

        if ($siswa && $penguji) {
            // Sample hafalan data
            $hafalanData = [
                ['juz' => 30, 'surah' => 'An-Nas', 'ayat_dari' => 1, 'ayat_sampai' => 6, 'nilai' => 'mumtaz'],
                ['juz' => 30, 'surah' => 'Al-Falaq', 'ayat_dari' => 1, 'ayat_sampai' => 5, 'nilai' => 'mumtaz'],
                ['juz' => 30, 'surah' => 'Al-Ikhlas', 'ayat_dari' => 1, 'ayat_sampai' => 4, 'nilai' => 'jayyid'],
                ['juz' => 1, 'surah' => 'Al-Fatihah', 'ayat_dari' => 1, 'ayat_sampai' => 7, 'nilai' => 'mumtaz'],
                ['juz' => 1, 'surah' => 'Al-Baqarah', 'ayat_dari' => 1, 'ayat_sampai' => 20, 'nilai' => 'maqbul'],
            ];

            foreach ($hafalanData as $data) {
                HafalanQuran::create([
                    'institution_id' => 1,
                    'siswa_id' => $siswa->id,
                    'penguji_id' => $penguji->id,
                    'tanggal_setoran' => now()->subDays(rand(1, 30)),
                    ...$data,
                ]);
            }
        }
    }
}
```

---

## ✅ Checklist Implementasi

- [x] Database migration
- [x] Models dengan relationships
- [x] Service layer untuk business logic
- [x] Controller dengan CRUD
- [x] Request validation
- [x] Routes registration
- [x] React components (Index, Create)
- [x] TypeScript types
- [x] Testing (Feature)
- [x] Seeder untuk sample data

---

## 🚀 Cara Menjalankan

```bash
# 1. Jalankan migration
php artisan migrate

# 2. (Optional) Seed sample data
php artisan db:seed --class=HafalanSeeder

# 3. Build frontend
npm run build

# 4. Jalankan tests
php artisan test --filter=HafalanTest

# 5. Akses di browser
# http://localhost/jibas/pesantren/hafalan
```

---

## 📝 Notes

- **Middleware `institution:pesantren`** memastikan hanya institusi pesantren yang bisa akses
- **Scopes di Model** memudahkan query filtering
- **Service Layer** pisahkan business logic dari controller
- **Event `HafalanDisetor`** untuk notifikasi orang tua (implement later)
- **Validasi ketat** untuk data integrity

---

**Template ini bisa direplikasi untuk modul lain seperti:**

- Ekstrakurikuler (School)
- BTQ Evaluation (Madrasah)
- Library Module
- dll.

🎉 **Happy Coding!**
