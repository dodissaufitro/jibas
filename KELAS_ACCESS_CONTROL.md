# 🎓 SISTEM AKSES BERBASIS KELAS - DOKUMENTASI

Dokumentasi lengkap untuk sistem akses siswa berdasarkan kelas masing-masing.

---

## 📋 Daftar Isi

1. [Gambaran Umum](#gambaran-umum)
2. [Komponen Sistem](#komponen-sistem)
3. [Cara Penggunaan](#cara-penggunaan)
4. [Contoh Implementasi](#contoh-implementasi)
5. [Testing](#testing)

---

## 🎯 Gambaran Umum

Sistem ini memastikan bahwa siswa **hanya dapat mengakses data dan resource yang berkaitan dengan kelas mereka sendiri**, seperti:

- ✅ Daftar teman sekelas
- ✅ Jadwal pelajaran kelas
- ✅ Nilai dan tugas kelas
- ✅ Presensi kelas
- ✅ Informasi yang spesifik untuk kelas mereka

**Catatan:** Admin, Guru, dan Super Admin tidak dibatasi dan dapat mengakses semua kelas.

---

## 🔧 Komponen Sistem

### 1. **Middleware: CheckKelasAccess**

**Lokasi:** `app/Http/Middleware/CheckKelasAccess.php`

Middleware ini memverifikasi bahwa siswa memiliki kelas yang valid sebelum mengakses resource.

**Fungsi:**

- ✅ Cek apakah user adalah siswa
- ✅ Cek apakah siswa terdaftar di kelas
- ✅ Menyimpan `user_kelas_id` di request untuk akses mudah

**Penggunaan di Route:**

```php
Route::middleware(['auth', 'kelas.access'])->group(function () {
    Route::get('/jadwal-saya', [JadwalController::class, 'mySchedule']);
    Route::get('/teman-sekelas', [SiswaController::class, 'classmates']);
});
```

---

### 2. **Trait: KelasScoped**

**Lokasi:** `app/Shared/Traits/KelasScoped.php`

Trait ini secara otomatis mem-filter query untuk hanya menampilkan data dari kelas siswa yang login.

**Fungsi:**

- ✅ Otomatis filter berdasarkan `kelas_id`
- ✅ Hanya berlaku untuk role siswa
- ✅ Bisa di-bypass untuk admin/guru

**Penggunaan di Model:**

```php
use App\Shared\Traits\KelasScoped;

class JadwalPelajaran extends Model
{
    use KelasScoped;

    // Model ini otomatis ter-filter berdasarkan kelas siswa
}
```

**Query dengan Trait:**

```php
// Untuk siswa: hanya jadwal kelasnya
$jadwal = JadwalPelajaran::all();

// Untuk admin/guru: bypass filter
$semuaJadwal = JadwalPelajaran::withoutKelasScope()->get();

// Query kelas spesifik
$jadwalKelas10A = JadwalPelajaran::byKelas(5)->get();
```

---

### 3. **Policy: KelasPolicy**

**Lokasi:** `app/Policies/KelasPolicy.php`

Policy untuk authorization berbasis kelas.

**Methods:**

- `viewKelas($user, $kelasId)` - Cek apakah user bisa lihat kelas tertentu
- `accessKelasResource($user, $model)` - Cek apakah user bisa akses resource dengan kelas_id
- `viewClassmate($user, $targetUser)` - Cek apakah user bisa lihat profil teman sekelas

**Penggunaan di Controller:**

```php
// Check if user can view a specific kelas
if (Gate::allows('view-kelas', $kelasId)) {
    // User can view this kelas
}

// Check if user can access a resource
if (Gate::allows('access-kelas-resource', $jadwal)) {
    // User can access this jadwal
}

// Check if user can view another student
if (Gate::allows('view-classmate', $targetUser)) {
    // User can view this student's profile
}
```

---

### 4. **Helper Methods di User Model**

**Lokasi:** `app/Models/User.php`

Methods tambahan untuk mempermudah pengecekan kelas:

```php
// Get kelas_id dari siswa
$kelasId = $user->getKelasId();

// Check if user is in specific kelas
if ($user->isInKelas($kelasId)) {
    // User is in this kelas
}

// Check if user can access a kelas
if ($user->canAccessKelas($kelasId)) {
    // User can access this kelas
}

// Check if two users are classmates
if ($user1->isClassmateOf($user2)) {
    // They are classmates
}
```

---

## 🚀 Cara Penggunaan

### **A. Proteksi Route dengan Middleware**

Gunakan middleware `kelas.access` untuk memastikan siswa sudah terdaftar di kelas:

```php
// routes/web.php
Route::middleware(['auth', 'kelas.access'])->prefix('siswa')->name('siswa.')->group(function () {
    // Hanya siswa dengan kelas valid yang bisa akses
    Route::get('/jadwal', [JadwalController::class, 'index'])->name('jadwal');
    Route::get('/nilai', [NilaiController::class, 'index'])->name('nilai');
    Route::get('/teman-sekelas', [SiswaController::class, 'classmates'])->name('classmates');
});
```

---

### **B. Auto-Filter Query dengan Trait**

Tambahkan trait `KelasScoped` ke model yang memiliki `kelas_id`:

```php
// app/Models/JadwalPelajaran.php
namespace App\Models;

use App\Shared\Traits\KelasScoped;
use Illuminate\Database\Eloquent\Model;

class JadwalPelajaran extends Model
{
    use KelasScoped;

    protected $fillable = ['kelas_id', 'mata_pelajaran_id', 'hari', 'jam_mulai', 'jam_selesai'];
}
```

**Hasil:**

- Siswa yang login akan otomatis hanya melihat jadwal kelasnya
- Admin/Guru tetap melihat semua jadwal

---

### **C. Authorization di Controller**

Gunakan Policy untuk authorization checks:

```php
// app/Http/Controllers/SiswaController.php
namespace App\Http\Controllers;

use App\Models\Siswa;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class SiswaController extends Controller
{
    public function classmates()
    {
        $user = Auth::user();

        // Get siswa's kelas_id
        $kelasId = $user->getKelasId();

        if (!$kelasId) {
            abort(403, 'Anda belum terdaftar di kelas manapun.');
        }

        // Only get classmates
        $classmates = Siswa::where('kelas_id', $kelasId)
            ->where('user_id', '!=', $user->id)
            ->with('user')
            ->get();

        return Inertia::render('Siswa/Classmates', [
            'classmates' => $classmates
        ]);
    }

    public function show($id)
    {
        $siswa = Siswa::with('user')->findOrFail($id);

        // Check authorization
        if (!Gate::allows('view-classmate', $siswa->user)) {
            abort(403, 'Anda tidak dapat melihat profil siswa dari kelas lain.');
        }

        return Inertia::render('Siswa/Show', [
            'siswa' => $siswa
        ]);
    }
}
```

---

## 📝 Contoh Implementasi

### **Contoh 1: Jadwal Pelajaran untuk Siswa**

```php
// app/Http/Controllers/JadwalPelajaranController.php
namespace App\Http\Controllers;

use App\Models\JadwalPelajaran;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JadwalPelajaranController extends Controller
{
    public function mySchedule()
    {
        $user = Auth::user();

        // Jika siswa, otomatis ter-filter oleh KelasScoped trait
        // Jika guru/admin, tampilkan semua
        $jadwal = JadwalPelajaran::with(['mataPelajaran', 'guru'])
            ->orderBy('hari')
            ->orderBy('jam_mulai')
            ->get();

        return Inertia::render('Jadwal/MySchedule', [
            'jadwal' => $jadwal,
            'isStudent' => $user->hasRole('siswa')
        ]);
    }
}
```

---

### **Contoh 2: Daftar Teman Sekelas**

```php
// app/Http/Controllers/SiswaController.php
public function classmates()
{
    $user = Auth::user();
    $kelasId = $user->getKelasId();

    if (!$kelasId) {
        return back()->with('error', 'Anda belum terdaftar di kelas manapun.');
    }

    $classmates = Siswa::where('kelas_id', $kelasId)
        ->where('user_id', '!=', $user->id)
        ->with(['user', 'kelas'])
        ->get();

    return Inertia::render('Siswa/Classmates', [
        'classmates' => $classmates,
        'myKelas' => Kelas::find($kelasId)
    ]);
}
```

---

### **Contoh 3: Nilai Siswa (Hanya Kelas Sendiri)**

```php
// app/Models/Nilai.php
namespace App\Models;

use App\Shared\Traits\KelasScoped;
use Illuminate\Database\Eloquent\Model;

class Nilai extends Model
{
    use KelasScoped;

    protected $fillable = ['siswa_id', 'mata_pelajaran_id', 'kelas_id', 'nilai', 'semester'];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}

// Controller
public function myGrades()
{
    $user = Auth::user();

    // Otomatis ter-filter berdasarkan kelas
    $nilai = Nilai::with(['siswa', 'mataPelajaran'])
        ->where('siswa_id', $user->siswa->id)
        ->get();

    return Inertia::render('Nilai/MyGrades', [
        'nilai' => $nilai
    ]);
}
```

---

## 🧪 Testing

### **Test 1: Middleware Check**

```php
// tests/Feature/KelasAccessTest.php
public function test_siswa_without_kelas_cannot_access()
{
    $user = User::factory()->create();
    $siswaRole = Role::where('name', 'siswa')->first();
    $user->roles()->attach($siswaRole);

    // Siswa belum punya kelas
    Siswa::factory()->create([
        'user_id' => $user->id,
        'kelas_id' => null
    ]);

    $response = $this->actingAs($user)->get('/siswa/jadwal');

    $response->assertStatus(403);
}

public function test_siswa_with_kelas_can_access()
{
    $user = User::factory()->create();
    $siswaRole = Role::where('name', 'siswa')->first();
    $user->roles()->attach($siswaRole);

    $kelas = Kelas::factory()->create();
    Siswa::factory()->create([
        'user_id' => $user->id,
        'kelas_id' => $kelas->id
    ]);

    $response = $this->actingAs($user)->get('/siswa/jadwal');

    $response->assertStatus(200);
}
```

---

### **Test 2: KelasScoped Trait**

```php
public function test_siswa_only_sees_own_kelas_data()
{
    $kelas1 = Kelas::factory()->create();
    $kelas2 = Kelas::factory()->create();

    $siswa = User::factory()->create();
    $siswaRole = Role::where('name', 'siswa')->first();
    $siswa->roles()->attach($siswaRole);
    Siswa::factory()->create([
        'user_id' => $siswa->id,
        'kelas_id' => $kelas1->id
    ]);

    // Create jadwal for both kelas
    JadwalPelajaran::factory()->create(['kelas_id' => $kelas1->id]);
    JadwalPelajaran::factory()->create(['kelas_id' => $kelas2->id]);

    $this->actingAs($siswa);

    $jadwal = JadwalPelajaran::all();

    // Siswa hanya lihat jadwal kelas 1
    $this->assertCount(1, $jadwal);
    $this->assertEquals($kelas1->id, $jadwal->first()->kelas_id);
}
```

---

## 🛡️ Keamanan & Best Practices

### ✅ **DO's**

1. **Selalu gunakan middleware `kelas.access`** untuk route yang hanya boleh diakses siswa dengan kelas valid
2. **Gunakan trait `KelasScoped`** pada model yang memiliki `kelas_id`
3. **Gunakan Gate/Policy** untuk authorization checks di controller
4. **Validasi kelas_id** sebelum melakukan operasi database

### ❌ **DON'Ts**

1. **Jangan hardcode kelas_id** di query
2. **Jangan skip authorization checks** untuk data sensitif
3. **Jangan assume user selalu punya kelas** - always check first

---

## 📊 Diagram Alur

```
┌─────────────┐
│   User      │
│  (Siswa)    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  CheckKelasAccess   │ ◄── Middleware verifies kelas
│     Middleware      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│    Controller       │
│  + KelasScoped      │ ◄── Auto-filter by kelas_id
│      Trait          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   KelasPolicy       │ ◄── Authorization checks
│   (Gate/Policy)     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   Database Query    │ ◄── Only returns kelas data
│  (Filtered Result)  │
└─────────────────────┘
```

---

## 🎉 Summary

Sistem ini memberikan:

✅ **Keamanan tingkat kelas** - Siswa hanya akses data kelasnya  
✅ **Otomatis filtering** - Tidak perlu manual filter di setiap query  
✅ **Flexible authorization** - Mudah customize per fitur  
✅ **Clean code** - Reusable components  
✅ **Easy to implement** - Tinggal tambah trait & middleware

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan hubungi tim development atau buat issue di repository.

**Happy Coding! 🚀**
