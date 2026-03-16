# 🎓 Contoh Penerapan Akses Berbasis Kelas

File ini berisi contoh praktis penerapan sistem akses berbasis kelas.

---

## 📋 Contoh 1: Route Group untuk Siswa

```php
// routes/web.php

// Tambahkan route group khusus siswa dengan kelas access
Route::middleware(['auth', 'role:siswa', 'kelas.access'])->prefix('my')->name('my.')->group(function () {

    // Jadwal kelas saya
    Route::get('/jadwal', [SiswaController::class, 'mySchedule'])->name('jadwal');

    // Teman sekelas
    Route::get('/classmates', [SiswaController::class, 'classmates'])->name('classmates');

    // Nilai saya
    Route::get('/nilai', [SiswaController::class, 'myGrades'])->name('nilai');

    // Presensi saya
    Route::get('/presensi', [SiswaController::class, 'myAttendance'])->name('presensi');

    // Tugas kelas
    Route::get('/tugas', [SiswaController::class, 'assignments'])->name('tugas');
});
```

---

## 📋 Contoh 2: Controller Implementation

### File: `app/Http/Controllers/SiswaMyController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\JadwalPelajaran;
use App\Models\Nilai;
use App\Models\PresensiSiswa;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SiswaMyController extends Controller
{
    /**
     * Tampilkan jadwal kelas saya
     */
    public function mySchedule()
    {
        $user = Auth::user();
        $kelasId = $user->getKelasId();

        // Dengan KelasScoped trait, siswa otomatis hanya lihat jadwal kelasnya
        $jadwal = JadwalPelajaran::with(['mataPelajaran', 'guru', 'kelas'])
            ->orderBy('hari')
            ->orderBy('jam_mulai')
            ->get()
            ->groupBy('hari');

        return Inertia::render('Siswa/MySchedule', [
            'jadwal' => $jadwal,
            'kelas' => $user->siswa->kelas
        ]);
    }

    /**
     * Tampilkan daftar teman sekelas
     */
    public function classmates()
    {
        $user = Auth::user();
        $kelasId = $user->getKelasId();

        if (!$kelasId) {
            return back()->with('error', 'Anda belum terdaftar di kelas manapun.');
        }

        // Get all classmates except the current user
        $classmates = Siswa::where('kelas_id', $kelasId)
            ->where('user_id', '!=', $user->id)
            ->where('status', 'aktif')
            ->with(['user', 'kelas'])
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('Siswa/Classmates', [
            'classmates' => $classmates,
            'myKelas' => $user->siswa->kelas,
            'totalClassmates' => $classmates->count()
        ]);
    }

    /**
     * Tampilkan profil teman sekelas
     */
    public function viewClassmate($id)
    {
        $targetSiswa = Siswa::with(['user', 'kelas'])->findOrFail($id);

        // Check authorization using Gate
        if (!Gate::allows('view-classmate', $targetSiswa->user)) {
            abort(403, 'Anda hanya dapat melihat profil teman sekelas Anda.');
        }

        return Inertia::render('Siswa/ClassmateProfile', [
            'siswa' => $targetSiswa
        ]);
    }

    /**
     * Tampilkan nilai saya
     */
    public function myGrades()
    {
        $user = Auth::user();

        // Dengan KelasScoped trait di model Nilai
        $nilai = Nilai::with(['mataPelajaran', 'siswa'])
            ->where('siswa_id', $user->siswa->id)
            ->orderBy('semester')
            ->get()
            ->groupBy('semester');

        return Inertia::render('Siswa/MyGrades', [
            'nilai' => $nilai,
            'siswa' => $user->siswa
        ]);
    }

    /**
     * Tampilkan presensi saya
     */
    public function myAttendance()
    {
        $user = Auth::user();

        $presensi = PresensiSiswa::where('siswa_id', $user->siswa->id)
            ->with(['kelas', 'mataPelajaran'])
            ->orderBy('tanggal', 'desc')
            ->take(30) // Last 30 records
            ->get();

        // Calculate statistics
        $stats = [
            'total' => $presensi->count(),
            'hadir' => $presensi->where('status', 'hadir')->count(),
            'izin' => $presensi->where('status', 'izin')->count(),
            'sakit' => $presensi->where('status', 'sakit')->count(),
            'alpha' => $presensi->where('status', 'alpha')->count(),
        ];

        $stats['persentase_kehadiran'] = $stats['total'] > 0
            ? round(($stats['hadir'] / $stats['total']) * 100, 2)
            : 0;

        return Inertia::render('Siswa/MyAttendance', [
            'presensi' => $presensi,
            'stats' => $stats
        ]);
    }

    /**
     * Tampilkan tugas kelas
     */
    public function assignments()
    {
        $user = Auth::user();
        $kelasId = $user->getKelasId();

        // If you have Tugas model with KelasScoped
        $tugas = \App\Models\Tugas::with(['mataPelajaran', 'guru'])
            ->where('kelas_id', $kelasId)
            ->orderBy('deadline', 'asc')
            ->get();

        return Inertia::render('Siswa/Assignments', [
            'tugas' => $tugas,
            'kelas' => $user->siswa->kelas
        ]);
    }
}
```

---

## 📋 Contoh 3: Update Model dengan KelasScoped

### File: `app/Models/JadwalPelajaran.php`

```php
<?php

namespace App\Models;

use App\Shared\Traits\KelasScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JadwalPelajaran extends Model
{
    use KelasScoped; // ← Tambahkan trait ini

    protected $table = 'jadwal_pelajaran';

    protected $fillable = [
        'kelas_id',
        'mata_pelajaran_id',
        'guru_id',
        'tahun_ajaran_id',
        'hari',
        'jam_mulai',
        'jam_selesai',
        'ruangan',
    ];

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class);
    }
}
```

### File: `app/Models/Nilai.php`

```php
<?php

namespace App\Models;

use App\Shared\Traits\KelasScoped;
use Illuminate\Database\Eloquent\Model;

class Nilai extends Model
{
    use KelasScoped; // ← Tambahkan trait ini

    protected $fillable = [
        'siswa_id',
        'mata_pelajaran_id',
        'kelas_id',
        'semester',
        'nilai_tugas',
        'nilai_uts',
        'nilai_uas',
        'nilai_akhir',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function mataPelajaran()
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}
```

---

## 📋 Contoh 4: Frontend React/TypeScript Component

### File: `resources/js/Pages/Siswa/Classmates.tsx`

```tsx
import React from "react";
import { Head, Link } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

interface Siswa {
    id: number;
    nama_lengkap: string;
    nis: string;
    foto?: string;
    jenis_kelamin: string;
    email?: string;
}

interface Kelas {
    id: number;
    nama: string;
    tingkat: number;
}

interface Props {
    classmates: Siswa[];
    myKelas: Kelas;
    totalClassmates: number;
}

export default function Classmates({
    classmates,
    myKelas,
    totalClassmates,
}: Props) {
    return (
        <SidebarLayout>
            <Head title="Teman Sekelas" />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    👥 Teman Sekelas
                </h1>
                <p className="text-gray-600">
                    Kelas: <span className="font-semibold">{myKelas.nama}</span>
                    {" • "}
                    <span className="font-semibold">
                        {totalClassmates}
                    </span>{" "}
                    teman sekelas
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classmates.map((siswa) => (
                    <div
                        key={siswa.id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {siswa.foto ? (
                                    <img
                                        src={siswa.foto}
                                        alt={siswa.nama_lengkap}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                                        {siswa.nama_lengkap.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {siswa.nama_lengkap}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    NIS: {siswa.nis}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {siswa.jenis_kelamin === "L"
                                        ? "👨 Laki-laki"
                                        : "👩 Perempuan"}
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route("my.classmates.show", siswa.id)}
                            className="mt-4 block text-center bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded transition-colors"
                        >
                            Lihat Profil
                        </Link>
                    </div>
                ))}
            </div>

            {classmates.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800">
                        Belum ada teman sekelas lainnya di kelas ini.
                    </p>
                </div>
            )}
        </SidebarLayout>
    );
}
```

---

## 📋 Contoh 5: Testing

### File: `tests/Feature/KelasAccessTest.php`

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\JadwalPelajaran;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KelasAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(); // Seed roles and permissions
    }

    public function test_siswa_without_kelas_cannot_access_protected_routes()
    {
        $user = User::factory()->create();
        $siswaRole = Role::where('name', 'siswa')->first();
        $user->roles()->attach($siswaRole);

        // Create siswa without kelas
        Siswa::factory()->create([
            'user_id' => $user->id,
            'kelas_id' => null
        ]);

        $response = $this->actingAs($user)->get('/my/jadwal');

        $response->assertStatus(403);
        $response->assertSee('belum terdaftar di kelas');
    }

    public function test_siswa_with_kelas_can_access_protected_routes()
    {
        $user = User::factory()->create();
        $siswaRole = Role::where('name', 'siswa')->first();
        $user->roles()->attach($siswaRole);

        $kelas = Kelas::factory()->create();
        Siswa::factory()->create([
            'user_id' => $user->id,
            'kelas_id' => $kelas->id
        ]);

        $response = $this->actingAs($user)->get('/my/jadwal');

        $response->assertStatus(200);
    }

    public function test_siswa_only_sees_own_kelas_jadwal()
    {
        // Create two kelas
        $kelas1 = Kelas::factory()->create();
        $kelas2 = Kelas::factory()->create();

        // Create siswa in kelas1
        $user = User::factory()->create();
        $siswaRole = Role::where('name', 'siswa')->first();
        $user->roles()->attach($siswaRole);
        Siswa::factory()->create([
            'user_id' => $user->id,
            'kelas_id' => $kelas1->id
        ]);

        // Create jadwal for both kelas
        JadwalPelajaran::factory()->create(['kelas_id' => $kelas1->id]);
        JadwalPelajaran::factory()->create(['kelas_id' => $kelas1->id]);
        JadwalPelajaran::factory()->create(['kelas_id' => $kelas2->id]);

        $this->actingAs($user);

        $jadwal = JadwalPelajaran::all();

        // Should only see kelas1 jadwal (2 items)
        $this->assertCount(2, $jadwal);
        $jadwal->each(function ($item) use ($kelas1) {
            $this->assertEquals($kelas1->id, $item->kelas_id);
        });
    }

    public function test_admin_can_see_all_kelas_jadwal()
    {
        // Create two kelas
        $kelas1 = Kelas::factory()->create();
        $kelas2 = Kelas::factory()->create();

        // Create admin user
        $user = User::factory()->create();
        $adminRole = Role::where('name', 'admin')->first();
        $user->roles()->attach($adminRole);

        // Create jadwal for both kelas
        JadwalPelajaran::factory()->create(['kelas_id' => $kelas1->id]);
        JadwalPelajaran::factory()->create(['kelas_id' => $kelas2->id]);

        $this->actingAs($user);

        $jadwal = JadwalPelajaran::all();

        // Admin should see all (2 items from different kelas)
        $this->assertCount(2, $jadwal);
    }

    public function test_siswa_cannot_view_other_kelas_classmate()
    {
        $kelas1 = Kelas::factory()->create();
        $kelas2 = Kelas::factory()->create();

        // Siswa 1 in kelas 1
        $user1 = User::factory()->create();
        $siswaRole = Role::where('name', 'siswa')->first();
        $user1->roles()->attach($siswaRole);
        Siswa::factory()->create(['user_id' => $user1->id, 'kelas_id' => $kelas1->id]);

        // Siswa 2 in kelas 2
        $user2 = User::factory()->create();
        $user2->roles()->attach($siswaRole);
        $siswa2 = Siswa::factory()->create(['user_id' => $user2->id, 'kelas_id' => $kelas2->id]);

        // User1 tries to view user2's profile
        $this->actingAs($user1);

        $response = $this->get(route('my.classmates.show', $siswa2->id));

        $response->assertStatus(403);
    }

    public function test_siswa_can_view_same_kelas_classmate()
    {
        $kelas = Kelas::factory()->create();

        // Siswa 1
        $user1 = User::factory()->create();
        $siswaRole = Role::where('name', 'siswa')->first();
        $user1->roles()->attach($siswaRole);
        Siswa::factory()->create(['user_id' => $user1->id, 'kelas_id' => $kelas->id]);

        // Siswa 2 (same kelas)
        $user2 = User::factory()->create();
        $user2->roles()->attach($siswaRole);
        $siswa2 = Siswa::factory()->create(['user_id' => $user2->id, 'kelas_id' => $kelas->id]);

        // User1 can view user2's profile
        $this->actingAs($user1);

        $response = $this->get(route('my.classmates.show', $siswa2->id));

        $response->assertStatus(200);
    }
}
```

---

## 🎉 Kesimpulan

Dengan contoh-contoh di atas, Anda dapat:

1. ✅ Membuat route khusus siswa dengan akses berbasis kelas
2. ✅ Implementasi controller yang secure dan efficient
3. ✅ Update model dengan auto-filtering
4. ✅ Membuat frontend yang menampilkan data sesuai kelas
5. ✅ Testing untuk memastikan sistem bekerja dengan baik

Selamat mengimplementasikan! 🚀

```

```
