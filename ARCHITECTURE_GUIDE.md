# 🏗️ E-Ponpes.id - Architecture & Development Guide

> **Panduan Lengkap Arsitektur, Pengembangan Modular, dan Roadmap Sistem**

---

## 📊 1. ANALISIS STRUKTUR APLIKASI YANG ADA

### Current Architecture Overview

```
E-Ponpes.id (Laravel 11 + React + Inertia.js + TypeScript)
│
├── Backend (Laravel)
│   ├── Models (35 models)
│   ├── Controllers (17 controllers)
│   ├── Migrations (Database schema)
│   └── Routes (web.php, auth.php)
│
├── Frontend (React + TypeScript)
│   ├── Pages (Inertia components)
│   ├── Layouts (SidebarLayout)
│   ├── Contexts (SettingsContext)
│   └── Components (Reusable UI)
│
└── Database
    ├── Multi-institution support
    ├── Role-based system
    └── Modular tables
```

### ✅ Modul yang Sudah Ada (Existing Modules)

#### 1. **Core System** ✅

- ✅ Authentication & Authorization
- ✅ User Management
- ✅ Institution Management (Multi-tenant)
- ✅ Role & Permission System
- ✅ Settings & Configuration

#### 2. **Master Data** ✅

- ✅ Tahun Ajaran (Academic Year)
- ✅ Jenjang (Education Level)
- ✅ Jurusan (Major/Department)
- ✅ Kelas (Classes)
- ✅ Mata Pelajaran (Subjects)

#### 3. **PPDB (Penerimaan Peserta Didik Baru)** ✅

- ✅ Pendaftaran (Registration)
- ✅ Seleksi (Selection)
- ✅ Pembayaran PPDB (Payment)
- ✅ Pengumuman (Announcement)
- ✅ Dokumen (Documents)

#### 4. **Akademik** ⚠️ (Partial)

- ✅ Data Siswa (Student Management)
- ✅ Data Guru (Teacher Management)
- ⏳ Jadwal Pelajaran (Schedule) - Coming Soon
- ⏳ Penilaian (Assessment) - Coming Soon
- ⏳ Raport (Report Card) - Coming Soon

#### 5. **Presensi** ✅

- ✅ Presensi Siswa (Student Attendance)
- ✅ Presensi Guru (Teacher Attendance)
- ✅ Rekap Presensi (Attendance Summary)

#### 6. **Keuangan** ⚠️ (Partial)

- ✅ Tagihan (Billing)
- ✅ Pembayaran (Payment)
- ⏳ Laporan Kas (Cash Report) - Coming Soon
- ⏳ Tunggakan (Arrears) - Coming Soon

#### 7. **Orang Tua** ⏳ (Planned)

- ⏳ Data Wali Murid
- ⏳ Akun Orang Tua
- ⏳ Komunikasi

#### 8. **Administrasi** ⏳ (Planned)

- ⏳ Surat Masuk
- ⏳ Surat Keluar
- ⏳ Arsip Digital
- ⏳ Laporan

### 🗄️ Database Structure (Current)

**Core Tables:**

- `users` - Multi-tenant user management
- `institutions` - Institution/school data
- `roles` - Role-based access control
- `permissions` - Permission management
- `user_roles` - User-role mapping

**Master Data Tables:**

- `tahun_ajaran`, `jenjang`, `jurusan`, `kelas`, `mata_pelajaran`

**Academic Tables:**

- `siswa`, `guru`, `jadwal_pelajaran`, `nilai`, `raport`

**PPDB Tables:**

- `ppdb_pendaftaran`, `ppdb_seleksi`, `ppdb_pembayaran`, `ppdb_pengumuman`, `ppdb_dokumen`

**Operations Tables:**

- `presensi_siswa`, `presensi_guru`, `rekap_presensi_siswa`
- `tagihan`, `pembayaran`, `kas`, `laporan_keuangan`

**Admin Tables:**

- `surat_masuk`, `surat_keluar`, `arsip`, `komunikasi`

---

## 🔧 2. CARA MENGEMBANGKAN MODUL BARU TANPA MENGGANGGU MODUL LAMA

### Prinsip Pengembangan Modular

#### A. **Separation of Concerns**

Setiap modul harus independen dan tidak bergantung langsung pada modul lain.

```php
// ❌ BAD: Tight coupling
class NilaiController {
    public function calculate() {
        $siswa = Siswa::find(1);
        $keuangan = Pembayaran::where('siswa_id', 1)->first();
        // Modul nilai bergantung pada modul keuangan
    }
}

// ✅ GOOD: Loose coupling with events
class NilaiController {
    public function store(Request $request) {
        $nilai = Nilai::create($validated);

        // Trigger event, biarkan modul lain yang handle
        event(new NilaiDiinput($nilai));
    }
}

// Di modul lain (optional listener)
class UpdateStatusSiswaListener {
    public function handle(NilaiDiinput $event) {
        // Handle jika diperlukan
    }
}
```

#### B. **Namespace Organization**

```
app/
├── Modules/
│   ├── Academic/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Requests/
│   │   ├── Resources/
│   │   └── Routes/
│   ├── Finance/
│   ├── PPDB/
│   ├── Pesantren/
│   └── Communication/
```

#### C. **Route Grouping**

```php
// routes/modules/academic.php
Route::prefix('academic')->name('academic.')->group(function () {
    Route::resource('nilai', NilaiController::class);
    Route::resource('jadwal', JadwalController::class);
});

// routes/modules/pesantren.php
Route::prefix('pesantren')->name('pesantren.')->middleware(['institution:pesantren'])->group(function () {
    Route::resource('hafalan', HafalanController::class);
    Route::resource('asrama', AsramaController::class);
});
```

#### D. **Shared Components Pattern**

```typescript
// resources/js/Components/Shared/DataTable.tsx
export default function DataTable({ data, columns }) {
    // Reusable table component
}

// resources/js/Pages/Academic/Nilai/Index.tsx
import DataTable from '@/Components/Shared/DataTable';

export default function NilaiIndex({ nilai }) {
    return <DataTable data={nilai} columns={columns} />;
}
```

### Migration Strategy (Zero Downtime)

```bash
# 1. Buat migration baru tanpa mengubah yang lama
php artisan make:migration create_hafalan_quran_table

# 2. Test di development
php artisan migrate

# 3. Jika ada masalah, rollback tanpa pengaruh ke modul lain
php artisan migrate:rollback
```

### Testing Isolation

```php
// tests/Feature/Academic/NilaiTest.php
class NilaiTest extends TestCase {
    use RefreshDatabase;

    /** @test */
    public function dapat_menambah_nilai_tanpa_mempengaruhi_modul_lain()
    {
        $siswa = Siswa::factory()->create();

        $response = $this->post('/academic/nilai', [
            'siswa_id' => $siswa->id,
            'nilai' => 85
        ]);

        $response->assertSuccessful();

        // Pastikan modul lain tidak terpengaruh
        $this->assertDatabaseCount('pembayaran', 0);
    }
}
```

---

## 🧩 3. SISTEM MODULAR - BEST PRACTICES

### Module Structure Template

```
app/Modules/{ModuleName}/
│
├── Controllers/
│   ├── {Module}Controller.php
│   └── Api/{Module}ApiController.php
│
├── Models/
│   └── {Model}.php
│
├── Requests/
│   ├── Store{Model}Request.php
│   └── Update{Model}Request.php
│
├── Resources/
│   └── {Model}Resource.php
│
├── Services/
│   └── {Module}Service.php
│
├── Events/
│   └── {Event}Happened.php
│
├── Listeners/
│   └── {Listener}.php
│
├── Routes/
│   └── {module}.php
│
└── Migrations/
    └── xxxx_create_{table}_table.php
```

### Service Layer Pattern

```php
// app/Modules/Academic/Services/NilaiService.php
class NilaiService
{
    public function hitungNilaiRapot(Siswa $siswa, Semester $semester)
    {
        $nilaiList = Nilai::where('siswa_id', $siswa->id)
            ->where('semester_id', $semester->id)
            ->get();

        return $nilaiList->avg('nilai');
    }

    public function generateRapot(Siswa $siswa, Semester $semester)
    {
        $nilaiRata = $this->hitungNilaiRapot($siswa, $semester);

        return Raport::create([
            'siswa_id' => $siswa->id,
            'semester_id' => $semester->id,
            'nilai_rata_rata' => $nilaiRata
        ]);
    }
}

// Controller tetap slim
class NilaiController
{
    public function __construct(
        private NilaiService $nilaiService
    ) {}

    public function generateRapot(Siswa $siswa, Semester $semester)
    {
        $rapot = $this->nilaiService->generateRapot($siswa, $semester);

        return redirect()->back()->with('success', 'Rapot berhasil digenerate');
    }
}
```

### Event-Driven Architecture

```php
// app/Modules/Academic/Events/NilaiDiinput.php
class NilaiDiinput
{
    public function __construct(public Nilai $nilai) {}
}

// app/Modules/Communication/Listeners/KirimNotifikasiKeOrangTua.php
class KirimNotifikasiKeOrangTua
{
    public function handle(NilaiDiinput $event)
    {
        $siswa = $event->nilai->siswa;
        $orangTua = $siswa->orangTua;

        // Kirim notifikasi
        Notification::send($orangTua, new NilaiAnakDiinput($event->nilai));
    }
}

// Register di EventServiceProvider
protected $listen = [
    NilaiDiinput::class => [
        KirimNotifikasiKeOrangTua::class,
        UpdateRangkingSiswa::class,
    ],
];
```

---

## 🚀 4. REKOMENDASI MODUL TAMBAHAN

### Priority 1: Critical Modules (1-3 Bulan)

#### A. **Modul Penilaian & Rapor** 🎯

**Kompleksitas:** Medium-High  
**Estimasi:** 3-4 minggu

**Fitur:**

- Input nilai per mata pelajaran
- Perhitungan nilai rata-rata
- Generate rapor otomatis
- Cetak rapor (PDF)
- Catatan guru/wali kelas
- Grafik perkembangan nilai

**Database:**

```sql
-- nilai_details table
CREATE TABLE nilai_details (
    id BIGINT PRIMARY KEY,
    siswa_id BIGINT,
    mata_pelajaran_id BIGINT,
    semester_id BIGINT,
    nilai_tugas DECIMAL(5,2),
    nilai_uts DECIMAL(5,2),
    nilai_uas DECIMAL(5,2),
    nilai_akhir DECIMAL(5,2),
    predikat ENUM('A','B','C','D','E'),
    deskripsi TEXT
);

-- raport table enhancement
CREATE TABLE raport (
    id BIGINT PRIMARY KEY,
    siswa_id BIGINT,
    semester_id BIGINT,
    nilai_rata_rata DECIMAL(5,2),
    rangking INT,
    catatan_wali_kelas TEXT,
    catatan_kepala_sekolah TEXT,
    status ENUM('draft','published'),
    published_at TIMESTAMP
);
```

#### B. **Modul Jadwal Pelajaran** 📅

**Kompleksitas:** Medium  
**Estimasi:** 2-3 minggu

**Fitur:**

- Generate jadwal otomatis
- Drag & drop schedule editor
- Conflict detection (bentrok)
- Export jadwal (PDF)
- Jadwal per kelas
- Jadwal per guru
- Notifikasi perubahan jadwal

**Database:**

```sql
CREATE TABLE jadwal_pelajaran (
    id BIGINT PRIMARY KEY,
    kelas_id BIGINT,
    mata_pelajaran_id BIGINT,
    guru_id BIGINT,
    hari ENUM('senin','selasa','rabu','kamis','jumat','sabtu'),
    jam_mulai TIME,
    jam_selesai TIME,
    ruangan VARCHAR(50)
);
```

#### C. **Modul Komunikasi Orang Tua** 📱

**Kompleksitas:** High  
**Estimasi:** 4 minggu

**Fitur:**

- Portal orang tua (parent dashboard)
- Lihat nilai anak real-time
- Lihat presensi anak
- Lihat tagihan & pembayaran
- Chat dengan wali kelas
- Notifikasi push/email
- Izin/perizinan siswa

**Database:**

```sql
CREATE TABLE parent_portal (
    id BIGINT PRIMARY KEY,
    user_id BIGINT, -- parent user
    siswa_id BIGINT,
    relationship ENUM('ayah','ibu','wali'),
    is_primary BOOLEAN
);

CREATE TABLE communications (
    id BIGINT PRIMARY KEY,
    from_user_id BIGINT,
    to_user_id BIGINT,
    type ENUM('message','notification','announcement'),
    subject VARCHAR(255),
    message TEXT,
    read_at TIMESTAMP
);
```

### Priority 2: Enhancement Modules (3-6 Bulan)

#### D. **Modul Laporan Keuangan Lengkap** 💰

**Fitur:**

- Dashboard keuangan
- Laporan pemasukan/pengeluaran
- Grafik cash flow
- Rekonsiliasi bank
- Export laporan (Excel, PDF)
- Budget planning

#### E. **Modul Perpustakaan** 📚

**Fitur:**

- Katalog buku
- Peminjaman & pengembalian
- Denda keterlambatan
- Kartu anggota digital
- Statistik peminjaman

#### F. **Modul Ekstrakurikuler** ⚽

**Fitur:**

- Daftar ekskul
- Pendaftaran siswa
- Jadwal latihan
- Prestasi & piagam
- Dokumentasi kegiatan

### Priority 3: Advanced Modules (6-12 Bulan)

#### G. **Modul Analytics & Reporting** 📊

- Business intelligence dashboard
- Prediksi kelulusan siswa
- Analisis performa guru
- Trend analysis
- Custom report builder

#### H. **Modul E-Learning** 💻

- Materi pembelajaran online
- Quiz & ujian online
- Video pembelajaran
- Assignment submission
- Discussion forum

---

## 🕌 5. FITUR KHUSUS BERDASARKAN JENIS INSTITUSI

### A. Modul Pesantren 🕌

```typescript
// resources/js/Pages/Pesantren/

1. **Manajemen Asrama**
   - Pembagian kamar santri
   - Inventaris asrama
   - Jadwal piket
   - Perizinan keluar masuk

2. **Hafalan Al-Qur'an**
   - Target hafalan per santri
   - Tracking progress hafalan
   - Ujian hafalan (setoran)
   - Sertifikat hafalan
   - Grafik perkembangan

3. **Pembinaan Akhlak**
   - Poin pelanggaran/prestasi
   - Catatan perilaku
   - Bimbingan konseling
   - Reward & punishment

4. **Kegiatan Keagamaan**
   - Jadwal kajian
   - Sholat berjamaah
   - Kegiatan Ramadhan
   - Peringatan hari besar Islam

5. **Izin Pulang Santri**
   - Pengajuan izin online
   - Approval wali/ustadz
   - Tracking keberangkatan/kepulangan
   - Notifikasi ke orang tua
```

**Database Schema:**

```sql
-- Hafalan Quran
CREATE TABLE hafalan_quran (
    id BIGINT PRIMARY KEY,
    siswa_id BIGINT,
    juz INT,
    surah VARCHAR(100),
    ayat_dari INT,
    ayat_sampai INT,
    tanggal_setoran DATE,
    penguji_id BIGINT,
    nilai ENUM('mumtaz','jayyid','maqbul','diulang'),
    catatan TEXT
);

-- Asrama
CREATE TABLE asrama (
    id BIGINT PRIMARY KEY,
    nama VARCHAR(100),
    kapasitas INT,
    gender ENUM('putra','putri')
);

CREATE TABLE kamar_asrama (
    id BIGINT PRIMARY KEY,
    asrama_id BIGINT,
    nomor_kamar VARCHAR(10),
    kapasitas INT,
    terisi INT
);

CREATE TABLE penghuni_asrama (
    id BIGINT PRIMARY KEY,
    siswa_id BIGINT,
    kamar_id BIGINT,
    tanggal_masuk DATE,
    tanggal_keluar DATE,
    status ENUM('aktif','keluar')
);

-- Izin Pulang
CREATE TABLE izin_pulang (
    id BIGINT PRIMARY KEY,
    siswa_id BIGINT,
    tanggal_izin DATE,
    tanggal_kembali DATE,
    alasan TEXT,
    status ENUM('pending','approved','rejected'),
    approved_by BIGINT,
    approved_at TIMESTAMP
);
```

### B. Modul Sekolah Umum 🏫

```typescript
1. **Ekstrakurikuler**
   - Basket, Futsal, Pramuka, PMR, dll
   - Pendaftaran & pembayaran
   - Jadwal & kehadiran
   - Prestasi & kejuaraan

2. **OSIS & Organisasi**
   - Struktur organisasi
   - Kegiatan OSIS
   - Proposal kegiatan
   - Laporan pertanggungjawaban

3. **Analisis Prestasi Akademik**
   - Peringkat kelas/tingkat
   - Mata pelajaran unggulan
   - Siswa berprestasi
   - Prediksi kelulusan

4. **Bimbingan Konseling**
   - Profil siswa
   - Konseling individual
   - Career guidance
   - Psikotes

5. **Manajemen Lab & Praktek**
   - Jadwal praktikum
   - Inventaris alat lab
   - Laporan praktikum
```

**Database Schema:**

```sql
-- Ekstrakurikuler
CREATE TABLE ekstrakurikuler (
    id BIGINT PRIMARY KEY,
    nama VARCHAR(100),
    pembina_id BIGINT,
    deskripsi TEXT,
    jadwal VARCHAR(100),
    biaya DECIMAL(10,2),
    max_peserta INT
);

CREATE TABLE peserta_ekskul (
    id BIGINT PRIMARY KEY,
    siswa_id BIGINT,
    ekstrakurikuler_id BIGINT,
    tahun_ajaran_id BIGINT,
    status ENUM('aktif','nonaktif')
);

-- Prestasi
CREATE TABLE prestasi (
    id BIGINT PRIMARY KEY,
    siswa_id BIGINT,
    jenis_prestasi ENUM('akademik','non_akademik','olahraga'),
    nama_prestasi VARCHAR(255),
    tingkat ENUM('sekolah','kecamatan','kabupaten','provinsi','nasional','internasional'),
    peringkat VARCHAR(50),
    tanggal DATE,
    sertifikat VARCHAR(255)
);
```

### C. Modul Madrasah 📚

```typescript
1. **Pelajaran Agama Khusus**
   - Al-Qur'an Hadits
   - Aqidah Akhlak
   - Fiqih
   - Sejarah Kebudayaan Islam

2. **Evaluasi Ibadah**
   - Tracking sholat 5 waktu
   - Puasa Sunnah
   - Tilawah Al-Qur'an
   - Infaq/sedekah

3. **Kegiatan Keagamaan**
   - Pesantren Ramadhan
   - PHBI (Peringatan Hari Besar Islam)
   - Khataman Al-Qur'an
   - Istighosah

4. **BTQ (Baca Tulis Quran)**
   - Tes kemampuan BTQ
   - Kelas tahsin
   - Evaluasi progress
```

**Database Schema:**

```sql
-- Evaluasi Ibadah
CREATE TABLE evaluasi_ibadah (
    id BIGINT PRIMARY KEY,
    siswa_id BIGINT,
    tanggal DATE,
    sholat_subuh BOOLEAN,
    sholat_dzuhur BOOLEAN,
    sholat_ashar BOOLEAN,
    sholat_maghrib BOOLEAN,
    sholat_isya BOOLEAN,
    tilawah_halaman INT,
    catatan TEXT
);

-- BTQ
CREATE TABLE btq_evaluation (
    id BIGINT PRIMARY KEY,
    siswa_id BIGINT,
    tanggal_tes DATE,
    nilai_baca INT,
    nilai_tulis INT,
    nilai_tajwid INT,
    level ENUM('iqro','quran','tajwid','tahsin'),
    keterangan TEXT
);
```

---

## 🏗️ 6. STRUKTUR MODUL SCALABLE

### Recommended Folder Structure

```
app/
├── Core/                           # Core system (jangan diubah)
│   ├── Auth/
│   ├── Institution/
│   └── User/
│
├── Base/                          # Base classes & traits
│   ├── Controllers/
│   │   └── BaseController.php
│   ├── Models/
│   │   └── BaseModel.php
│   ├── Requests/
│   │   └── BaseRequest.php
│   └── Services/
│       └── BaseService.php
│
├── Shared/                        # Shared utilities
│   ├── Helpers/
│   ├── Traits/
│   ├── Interfaces/
│   └── Enums/
│
└── Modules/                       # Feature modules
    ├── Academic/
    │   ├── Controllers/
    │   ├── Models/
    │   ├── Services/
    │   ├── Requests/
    │   ├── Resources/
    │   ├── Routes/
    │   └── Tests/
    │
    ├── Finance/
    ├── PPDB/
    ├── Attendance/
    ├── Communication/
    ├── Library/
    │
    └── InstitutionSpecific/       # Institution-specific modules
        ├── Pesantren/
        │   ├── Hafalan/
        │   ├── Asrama/
        │   └── IzinPulang/
        ├── School/
        │   ├── Ekstrakurikuler/
        │   └── OSIS/
        └── Madrasah/
            ├── BTQ/
            └── EvaluasiIbadah/
```

### Module Registration System

```php
// app/Core/ModuleServiceProvider.php
class ModuleServiceProvider extends ServiceProvider
{
    protected array $modules = [
        \App\Modules\Academic\AcademicServiceProvider::class,
        \App\Modules\Finance\FinanceServiceProvider::class,
        \App\Modules\Attendance\AttendanceServiceProvider::class,
        // Conditional loading based on institution type
        \App\Modules\InstitutionSpecific\Pesantren\PesantrenServiceProvider::class,
    ];

    public function register()
    {
        foreach ($this->modules as $module) {
            $this->app->register($module);
        }
    }
}

// app/Modules/Academic/AcademicServiceProvider.php
class AcademicServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->loadRoutesFrom(__DIR__ . '/Routes/academic.php');
        $this->loadMigrationsFrom(__DIR__ . '/Migrations');
        $this->loadViewsFrom(__DIR__ . '/Views', 'academic');
    }
}
```

### Middleware untuk Institution-Specific Access

```php
// app/Http/Middleware/CheckInstitutionType.php
class CheckInstitutionType
{
    public function handle(Request $request, Closure $next, string $type)
    {
        $user = $request->user();
        $institution = $user->institution;

        if (!$institution || $institution->type !== $type) {
            abort(403, 'Fitur ini tidak tersedia untuk institusi Anda.');
        }

        return $next($request);
    }
}

// Usage in routes
Route::middleware(['auth', 'institution:pesantren'])->group(function () {
    Route::prefix('pesantren')->name('pesantren.')->group(function () {
        Route::resource('hafalan', HafalanController::class);
    });
});
```

---

## 🗄️ 7. PERUBAHAN & PENAMBAHAN STRUKTUR DATABASE

### A. Enhancement untuk Tabel Existing

```sql
-- Enhance users table
ALTER TABLE users ADD COLUMN last_login_ip VARCHAR(45) AFTER last_login_at;
ALTER TABLE users ADD COLUMN preferences JSON AFTER is_active;
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;

-- Enhance institutions table
ALTER TABLE institutions ADD COLUMN timezone VARCHAR(50) DEFAULT 'Asia/Jakarta';
ALTER TABLE institutions ADD COLUMN academic_calendar JSON;
ALTER TABLE institutions ADD COLUMN modules_enabled JSON;

-- Add soft deletes to important tables
ALTER TABLE siswa ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE guru ADD COLUMN deleted_at TIMESTAMP NULL;
```

### B. New Tables untuk Modul Baru

```sql
-- ============================================
-- ACADEMIC MODULE
-- ============================================

-- Jadwal Pelajaran (Enhanced)
CREATE TABLE jadwal_pelajaran (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    tahun_ajaran_id BIGINT NOT NULL,
    semester_id BIGINT NOT NULL,
    kelas_id BIGINT NOT NULL,
    mata_pelajaran_id BIGINT NOT NULL,
    guru_id BIGINT NOT NULL,
    hari ENUM('senin','selasa','rabu','kamis','jumat','sabtu','minggu'),
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruangan VARCHAR(50),
    type ENUM('teori','praktikum','olahraga'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (kelas_id) REFERENCES kelas(id),
    FOREIGN KEY (mata_pelajaran_id) REFERENCES mata_pelajaran(id),
    FOREIGN KEY (guru_id) REFERENCES guru(id),
    INDEX idx_kelas_hari (kelas_id, hari),
    INDEX idx_guru_hari (guru_id, hari)
);

-- Nilai Detail
CREATE TABLE nilai_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    siswa_id BIGINT NOT NULL,
    mata_pelajaran_id BIGINT NOT NULL,
    semester_id BIGINT NOT NULL,
    tahun_ajaran_id BIGINT NOT NULL,
    nilai_tugas DECIMAL(5,2),
    nilai_uts DECIMAL(5,2),
    nilai_uas DECIMAL(5,2),
    nilai_praktik DECIMAL(5,2),
    nilai_akhir DECIMAL(5,2) GENERATED ALWAYS AS (
        (COALESCE(nilai_tugas, 0) * 0.2 +
         COALESCE(nilai_uts, 0) * 0.3 +
         COALESCE(nilai_uas, 0) * 0.4 +
         COALESCE(nilai_praktik, 0) * 0.1)
    ) STORED,
    predikat CHAR(1),
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (siswa_id) REFERENCES siswa(id),
    FOREIGN KEY (mata_pelajaran_id) REFERENCES mata_pelajaran(id),
    UNIQUE KEY unique_nilai (siswa_id, mata_pelajaran_id, semester_id)
);

-- Raport Enhancement
CREATE TABLE raport (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    siswa_id BIGINT NOT NULL,
    semester_id BIGINT NOT NULL,
    tahun_ajaran_id BIGINT NOT NULL,
    nilai_rata_rata DECIMAL(5,2),
    rangking INT,
    jumlah_siswa INT,
    sakit INT DEFAULT 0,
    izin INT DEFAULT 0,
    alpha INT DEFAULT 0,
    catatan_wali_kelas TEXT,
    catatan_kepala_sekolah TEXT,
    status ENUM('draft', 'published', 'printed') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    published_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (siswa_id) REFERENCES siswa(id),
    FOREIGN KEY (semester_id) REFERENCES semester(id),
    UNIQUE KEY unique_raport (siswa_id, semester_id, tahun_ajaran_id)
);

-- ============================================
-- COMMUNICATION MODULE
-- ============================================

CREATE TABLE parent_portal (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    siswa_id BIGINT NOT NULL,
    relationship ENUM('ayah','ibu','wali','kakak','paman','bibi','kakek','nenek') DEFAULT 'wali',
    is_primary BOOLEAN DEFAULT FALSE,
    can_access_grades BOOLEAN DEFAULT TRUE,
    can_access_finance BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_siswa (user_id, siswa_id)
);

CREATE TABLE communications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    from_user_id BIGINT NOT NULL,
    to_user_id BIGINT,
    to_role VARCHAR(50),
    type ENUM('message','notification','announcement','alert') DEFAULT 'message',
    priority ENUM('low','normal','high','urgent') DEFAULT 'normal',
    subject VARCHAR(255),
    message TEXT NOT NULL,
    attachments JSON,
    read_at TIMESTAMP NULL,
    replied_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id),
    INDEX idx_to_user (to_user_id, read_at),
    INDEX idx_type_priority (type, priority)
);

-- ============================================
-- PESANTREN MODULE
-- ============================================

CREATE TABLE asrama (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    alamat TEXT,
    kapasitas INT NOT NULL,
    terisi INT DEFAULT 0,
    gender ENUM('putra','putri') NOT NULL,
    pengasuh_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (pengasuh_id) REFERENCES guru(id)
);

CREATE TABLE kamar_asrama (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    asrama_id BIGINT NOT NULL,
    nomor_kamar VARCHAR(10) NOT NULL,
    lantai INT,
    kapasitas INT NOT NULL,
    terisi INT DEFAULT 0,
    fasilitas JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asrama_id) REFERENCES asrama(id) ON DELETE CASCADE,
    UNIQUE KEY unique_kamar (asrama_id, nomor_kamar)
);

CREATE TABLE penghuni_asrama (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    siswa_id BIGINT NOT NULL,
    kamar_id BIGINT NOT NULL,
    tanggal_masuk DATE NOT NULL,
    tanggal_keluar DATE NULL,
    status ENUM('aktif','keluar','pindah') DEFAULT 'aktif',
    alasan_keluar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id),
    FOREIGN KEY (kamar_id) REFERENCES kamar_asrama(id),
    INDEX idx_siswa_status (siswa_id, status)
);

CREATE TABLE hafalan_quran (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    siswa_id BIGINT NOT NULL,
    juz INT,
    surah VARCHAR(100),
    ayat_dari INT,
    ayat_sampai INT,
    tanggal_setoran DATE NOT NULL,
    penguji_id BIGINT NOT NULL,
    nilai ENUM('mumtaz','jayyid','maqbul','diulang') NOT NULL,
    catatan TEXT,
    audio_recording VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (siswa_id) REFERENCES siswa(id),
    FOREIGN KEY (penguji_id) REFERENCES guru(id),
    INDEX idx_siswa_tanggal (siswa_id, tanggal_setoran)
);

CREATE TABLE izin_pulang (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    siswa_id BIGINT NOT NULL,
    tanggal_izin DATE NOT NULL,
    tanggal_kembali DATE NOT NULL,
    alasan TEXT NOT NULL,
    alamat_tujuan TEXT,
    kontak_darurat VARCHAR(20),
    status ENUM('pending','approved','rejected','returned') DEFAULT 'pending',
    approved_by BIGINT NULL,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT,
    actual_return_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (siswa_id) REFERENCES siswa(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_siswa_status (siswa_id, status),
    INDEX idx_tanggal (tanggal_izin, tanggal_kembali)
);

-- ============================================
-- SCHOOL MODULE (Umum)
-- ============================================

CREATE TABLE ekstrakurikuler (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    kategori ENUM('olahraga','seni','akademik','keagamaan','organisasi') NOT NULL,
    pembina_id BIGINT,
    deskripsi TEXT,
    jadwal VARCHAR(100),
    tempat VARCHAR(100),
    biaya DECIMAL(10,2) DEFAULT 0,
    max_peserta INT,
    min_peserta INT DEFAULT 10,
    tahun_ajaran_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (pembina_id) REFERENCES guru(id),
    FOREIGN KEY (tahun_ajaran_id) REFERENCES tahun_ajaran(id)
);

CREATE TABLE peserta_ekstrakurikuler (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    siswa_id BIGINT NOT NULL,
    ekstrakurikuler_id BIGINT NOT NULL,
    tanggal_daftar DATE NOT NULL,
    status ENUM('aktif','nonaktif','keluar') DEFAULT 'aktif',
    alasan_keluar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id),
    FOREIGN KEY (ekstrakurikuler_id) REFERENCES ekstrakurikuler(id),
    UNIQUE KEY unique_peserta (siswa_id, ekstrakurikuler_id)
);

CREATE TABLE prestasi (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    siswa_id BIGINT NOT NULL,
    jenis ENUM('akademik','non_akademik','olahraga','seni','keagamaan') NOT NULL,
    nama_prestasi VARCHAR(255) NOT NULL,
    tingkat ENUM('sekolah','kecamatan','kabupaten','provinsi','nasional','internasional') NOT NULL,
    peringkat VARCHAR(50),
    penyelenggara VARCHAR(255),
    tanggal DATE NOT NULL,
    tempat VARCHAR(255),
    sertifikat VARCHAR(255),
    foto VARCHAR(255),
    pembina_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (siswa_id) REFERENCES siswa(id),
    FOREIGN KEY (pembina_id) REFERENCES guru(id),
    INDEX idx_siswa_jenis (siswa_id, jenis),
    INDEX idx_tingkat_tanggal (tingkat, tanggal)
);

-- ============================================
-- MADRASAH MODULE
-- ============================================

CREATE TABLE evaluasi_ibadah (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    siswa_id BIGINT NOT NULL,
    tanggal DATE NOT NULL,
    sholat_subuh BOOLEAN DEFAULT FALSE,
    sholat_dzuhur BOOLEAN DEFAULT FALSE,
    sholat_ashar BOOLEAN DEFAULT FALSE,
    sholat_maghrib BOOLEAN DEFAULT FALSE,
    sholat_isya BOOLEAN DEFAULT FALSE,
    sholat_dhuha BOOLEAN DEFAULT FALSE,
    puasa_sunnah BOOLEAN DEFAULT FALSE,
    tilawah_halaman INT DEFAULT 0,
    infaq DECIMAL(10,2) DEFAULT 0,
    catatan TEXT,
    evaluator_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (siswa_id) REFERENCES siswa(id),
    FOREIGN KEY (evaluator_id) REFERENCES guru(id),
    UNIQUE KEY unique_evaluasi (siswa_id, tanggal),
    INDEX idx_tanggal (tanggal)
);

CREATE TABLE btq_evaluation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    siswa_id BIGINT NOT NULL,
    tanggal_tes DATE NOT NULL,
    nilai_baca INT CHECK (nilai_baca BETWEEN 0 AND 100),
    nilai_tulis INT CHECK (nilai_tulis BETWEEN 0 AND 100),
    nilai_tajwid INT CHECK (nilai_tajwid BETWEEN 0 AND 100),
    nilai_kelancaran INT CHECK (nilai_kelancaran BETWEEN 0 AND 100),
    level ENUM('iqro_1','iqro_2','iqro_3','iqro_4','iqro_5','iqro_6','quran','tajwid','tahsin') NOT NULL,
    lulus BOOLEAN DEFAULT FALSE,
    keterangan TEXT,
    penguji_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (siswa_id) REFERENCES siswa(id),
    FOREIGN KEY (penguji_id) REFERENCES guru(id),
    INDEX idx_siswa_level (siswa_id, level)
);

-- ============================================
-- LIBRARY MODULE
-- ============================================

CREATE TABLE buku (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    kode_buku VARCHAR(50) UNIQUE NOT NULL,
    isbn VARCHAR(20),
    judul VARCHAR(255) NOT NULL,
    penulis VARCHAR(255),
    penerbit VARCHAR(255),
    tahun_terbit YEAR,
    kategori VARCHAR(100),
    jumlah_total INT NOT NULL DEFAULT 1,
    jumlah_tersedia INT NOT NULL DEFAULT 1,
    lokasi_rak VARCHAR(50),
    harga DECIMAL(10,2),
    cover_image VARCHAR(255),
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    INDEX idx_kategori (kategori)
);

CREATE TABLE peminjaman_buku (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    buku_id BIGINT NOT NULL,
    peminjam_id BIGINT NOT NULL,
    peminjam_type ENUM('siswa','guru','staff') NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    tanggal_kembali_rencana DATE NOT NULL,
    tanggal_kembali_aktual DATE NULL,
    denda DECIMAL(10,2) DEFAULT 0,
    status ENUM('dipinjam','dikembalikan','hilang','rusak') DEFAULT 'dipinjam',
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (buku_id) REFERENCES buku(id),
    INDEX idx_peminjam (peminjam_id, peminjam_type),
    INDEX idx_status_tanggal (status, tanggal_kembali_rencana)
);

-- ============================================
-- ANALYTICS & AUDIT
-- ============================================

CREATE TABLE activity_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    old_values JSON,
    new_values JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_action (user_id, action),
    INDEX idx_module_date (module, created_at)
);

CREATE TABLE system_configs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT,
    config_type VARCHAR(50),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id),
    UNIQUE KEY unique_config (institution_id, config_key)
);
```

### C. Indexes untuk Performance

```sql
-- Performance indexes
CREATE INDEX idx_siswa_institution ON siswa(institution_id, is_active);
CREATE INDEX idx_guru_institution ON guru(institution_id, status);
CREATE INDEX idx_pembayaran_status ON pembayaran(status, tanggal_bayar);
CREATE INDEX idx_tagihan_jatuh_tempo ON tagihan(jatuh_tempo, status);
CREATE INDEX idx_presensi_tanggal ON presensi_siswa(tanggal, status);

-- Full-text search indexes
CREATE FULLTEXT INDEX ft_siswa_search ON siswa(nama_lengkap, nis);
CREATE FULLTEXT INDEX ft_guru_search ON guru(nama_lengkap, nip);
CREATE FULLTEXT INDEX ft_buku_search ON buku(judul, penulis, penerbit);
```

---

## 🗺️ 8. ROADMAP PENGEMBANGAN LANJUTAN

### Phase 1: Foundation (Completed ✅)

**Timeline:** Selesai  
**Status:** ✅ Done

- ✅ Multi-institution system
- ✅ Authentication & Authorization
- ✅ Master Data Management
- ✅ PPDB Module
- ✅ Basic Academic Module
- ✅ Attendance Module
- ✅ Basic Finance Module

### Phase 2: Core Enhancement (Current → 3 Bulan)

**Timeline:** Bulan 1-3  
**Priority:** HIGH 🔥

**Month 1:**

- 🎯 Modul Penilaian & Rapor (Complete)
- 📅 Modul Jadwal Pelajaran
- 🔧 Performance Optimization

**Month 2:**

- 📱 Modul Komunikasi Orang Tua
- 💰 Enhancement Modul Keuangan
- 📊 Basic Analytics Dashboard

**Month 3:**

- 🕌 Pesantren Module Phase 1 (Hafalan & Asrama)
- 📚 Library Module Basic
- ⚽ Ekstrakurikuler Module

**Deliverables:**

- Sistem penilaian lengkap
- Parent portal functional
- Institution-specific features working
- Performance improvement 50%+

### Phase 3: Institution-Specific Features (3-6 Bulan)

**Timeline:** Bulan 4-6  
**Priority:** MEDIUM

**Month 4:**

- 🕌 Pesantren Module Complete (Izin Pulang, Pembinaan)
- 🏫 School Module (OSIS, Counseling)
- 📚 Madrasah Module (BTQ, Evaluasi Ibadah)

**Month 5:**

- 📚 Library Module Complete
- 💻 E-Learning Module Basic
- 📊 Advanced Analytics

**Month 6:**

- 🔐 Enhanced Security & Permissions
- 📱 Mobile App API
- 🌐 Multi-language Support

**Deliverables:**

- All institution types fully supported
- Advanced reporting system
- Mobile-ready API

### Phase 4: Advanced Features (6-9 Bulan)

**Timeline:** Bulan 7-9  
**Priority:** LOW

**Month 7:**

- 💻 E-Learning Platform Complete
- 🎥 Video Streaming Integration
- 📝 Online Exam System

**Month 8:**

- 🤖 AI-Powered Analytics
- 📈 Predictive Models (Dropout, Performance)
- 🎓 Alumni Management

**Month 9:**

- 🌐 Public Website CMS
- 📱 Mobile App (React Native)
- ⚡ Real-time Notifications (WebSocket)

**Deliverables:**

- Full-featured LMS
- Mobile apps (iOS/Android)
- AI-powered insights

### Phase 5: Enterprise & Scale (9-12 Bulan)

**Timeline:** Bulan 10-12  
**Priority:** FUTURE

**Month 10:**

- ☁️ Multi-server support
- 📊 Big Data Analytics
- 🔄 API Marketplace

**Month 11:**

- 🌐 Multi-region deployment
- 💳 Payment Gateway Integration
- 📧 Advanced Email Marketing

**Month 12:**

- 🏆 Certification & Compliance
- 📱 WhatsApp Integration
- 🤝 Third-party Integration Hub

**Deliverables:**

- Enterprise-ready platform
- Scalable to 100k+ users
- Integration ecosystem

---

## 💻 9. BEST PRACTICE INTEGRASI LARAVEL + REACT

### A. Controller Pattern (Laravel)

```php
// ✅ GOOD: ResourceController with proper separation
class NilaiController extends Controller
{
    public function __construct(
        private NilaiService $nilaiService
    ) {}

    public function index(Request $request)
    {
        $nilai = $this->nilaiService->getPaginatedNilai(
            user: $request->user(),
            filters: $request->only(['kelas_id', 'semester_id']),
            perPage: 15
        );

        return inertia('Academic/Nilai/Index', [
            'nilai' => NilaiResource::collection($nilai),
            'filters' => $request->only(['kelas_id', 'semester_id']),
            'kelas' => KelasResource::collection(Kelas::all())
        ]);
    }

    public function store(StoreNilaiRequest $request)
    {
        $nilai = $this->nilaiService->create($request->validated());

        return redirect()
            ->route('academic.nilai.index')
            ->with('success', 'Nilai berhasil ditambahkan');
    }
}
```

### B. Service Layer Pattern

```php
// app/Modules/Academic/Services/NilaiService.php
class NilaiService
{
    public function getPaginatedNilai(User $user, array $filters, int $perPage = 15)
    {
        $query = Nilai::with(['siswa', 'mataPelajaran'])
            ->where('institution_id', $user->institution_id);

        if (isset($filters['kelas_id'])) {
            $query->whereHas('siswa', fn($q) => $q->where('kelas_id', $filters['kelas_id']));
        }

        if (isset($filters['semester_id'])) {
            $query->where('semester_id', $filters['semester_id']);
        }

        return $query->paginate($perPage);
    }

    public function create(array $data): Nilai
    {
        DB::beginTransaction();

        try {
            $nilai = Nilai::create($data);

            // Auto-calculate final grade
            $nilai->nilai_akhir = $this->calculateFinalGrade($nilai);
            $nilai->predikat = $this->determinePredikat($nilai->nilai_akhir);
            $nilai->save();

            // Trigger event
            event(new NilaiDiinput($nilai));

            DB::commit();
            return $nilai;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function calculateFinalGrade(Nilai $nilai): float
    {
        return ($nilai->nilai_tugas * 0.2) +
               ($nilai->nilai_uts * 0.3) +
               ($nilai->nilai_uas * 0.4) +
               ($nilai->nilai_praktik * 0.1);
    }
}
```

### C. Request Validation

```php
// app/Http/Requests/StoreNilaiRequest.php
class StoreNilaiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Nilai::class);
    }

    public function rules(): array
    {
        return [
            'siswa_id' => ['required', 'exists:siswa,id', new BelongsToInstitution],
            'mata_pelajaran_id' => ['required', 'exists:mata_pelajaran,id'],
            'semester_id' => ['required', 'exists:semester,id'],
            'nilai_tugas' => ['nullable', 'numeric', 'between:0,100'],
            'nilai_uts' => ['nullable', 'numeric', 'between:0,100'],
            'nilai_uas' => ['nullable', 'numeric', 'between:0,100'],
            'nilai_praktik' => ['nullable', 'numeric', 'between:0,100'],
        ];
    }

    public function messages(): array
    {
        return [
            'siswa_id.required' => 'Siswa harus dipilih.',
            'nilai_*.between' => 'Nilai harus antara 0 sampai 100.',
        ];
    }
}
```

### D. React Component Pattern

```typescript
// resources/js/Pages/Academic/Nilai/Index.tsx
import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import DataTable from '@/Components/Shared/DataTable';
import FilterBar from '@/Components/Shared/FilterBar';

interface Props {
    nilai: PaginatedData<Nilai>;
    filters: NilaiFilters;
    kelas: Kelas[];
}

export default function NilaiIndex({ nilai, filters, kelas }: Props) {
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas_id || '');

    const handleFilter = (key: string, value: string) => {
        router.get(route('academic.nilai.index'), {
            ...filters,
            [key]: value
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const columns = [
        { key: 'siswa.nama_lengkap', label: 'Nama Siswa' },
        { key: 'mata_pelajaran.nama', label: 'Mata Pelajaran' },
        { key: 'nilai_akhir', label: 'Nilai Akhir' },
        { key: 'predikat', label: 'Predikat' },
        { key: 'actions', label: 'Aksi' },
    ];

    return (
        <SidebarLayout>
            <Head title="Daftar Nilai" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Daftar Nilai</h1>
                    <Link
                        href={route('academic.nilai.create')}
                        className="btn-primary"
                    >
                        + Tambah Nilai
                    </Link>
                </div>

                <FilterBar
                    filters={[
                        {
                            type: 'select',
                            name: 'kelas_id',
                            label: 'Kelas',
                            options: kelas,
                            value: selectedKelas,
                            onChange: (value) => handleFilter('kelas_id', value)
                        }
                    ]}
                />

                <DataTable
                    data={nilai.data}
                    columns={columns}
                    pagination={nilai}
                />
            </div>
        </SidebarLayout>
    );
}
```

### E. Shared Components

```typescript
// resources/js/Components/Shared/DataTable.tsx
interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column[];
    pagination?: PaginatedData<T>;
    onSort?: (key: string) => void;
}

export default function DataTable<T>({ data, columns, pagination }: DataTableProps<T>) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            {columns.map((column) => (
                                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                    {column.render
                                        ? column.render(getNestedValue(row, column.key), row)
                                        : getNestedValue(row, column.key)
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {pagination && <Pagination pagination={pagination} />}
        </div>
    );
}

// Helper function
function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
```

### F. Type Definitions

```typescript
// resources/js/types/index.d.ts
export interface Nilai {
    id: number;
    siswa_id: number;
    mata_pelajaran_id: number;
    nilai_tugas: number;
    nilai_uts: number;
    nilai_uas: number;
    nilai_akhir: number;
    predikat: "A" | "B" | "C" | "D" | "E";
    siswa: Siswa;
    mata_pelajaran: MataPelajaran;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface InertiaSharedProps {
    auth: {
        user: User;
    };
    flash: {
        success?: string;
        error?: string;
    };
    errors: Record<string, string>;
}
```

### G. API Resource Pattern

```php
// app/Http/Resources/NilaiResource.php
class NilaiResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'siswa' => new SiswaResource($this->whenLoaded('siswa')),
            'mata_pelajaran' => new MataPelajaranResource($this->whenLoaded('mataPelajaran')),
            'nilai' => [
                'tugas' => $this->nilai_tugas,
                'uts' => $this->nilai_uts,
                'uas' => $this->nilai_uas,
                'praktik' => $this->nilai_praktik,
                'akhir' => $this->nilai_akhir,
            ],
            'predikat' => $this->predikat,
            'created_at' => $this->created_at?->format('d M Y'),
            'can' => [
                'update' => $request->user()?->can('update', $this->resource),
                'delete' => $request->user()?->can('delete', $this->resource),
            ],
        ];
    }
}
```

### H. Testing Pattern

```php
// tests/Feature/Academic/NilaiTest.php
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class NilaiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function dapat_menambah_nilai_siswa()
    {
        $this->actingAs($user = User::factory()->create());
        $siswa = Siswa::factory()->create(['institution_id' => $user->institution_id]);

        $response = $this->post(route('academic.nilai.store'), [
            'siswa_id' => $siswa->id,
            'mata_pelajaran_id' => 1,
            'semester_id' => 1,
            'nilai_tugas' => 85,
            'nilai_uts' => 80,
            'nilai_uas' => 90,
        ]);

        $response->assertRedirect(route('academic.nilai.index'));
        $this->assertDatabaseHas('nilai', [
            'siswa_id' => $siswa->id,
            'nilai_tugas' => 85,
        ]);
    }

    /** @test */
    public function tidak_dapat_menambah_nilai_siswa_institusi_lain()
    {
        $this->actingAs($user = User::factory()->create());
        $siswa = Siswa::factory()->create(); // Different institution

        $response = $this->post(route('academic.nilai.store'), [
            'siswa_id' => $siswa->id,
            'mata_pelajaran_id' => 1,
        ]);

        $response->assertStatus(422);
    }
}
```

---

## 📋 10. CHECKLIST IMPLEMENTASI MODUL BARU

### Checklist untuk Setiap Modul Baru:

#### Backend (Laravel):

- [ ] Migration dibuat dan tested
- [ ] Model dengan relationships
- [ ] Factory & Seeder
- [ ] Controller dengan Resource methods
- [ ] Request validation classes
- [ ] API Resources untuk formatting
- [ ] Service layer jika complex logic
- [ ] Events & Listeners jika perlu
- [ ] Policy untuk authorization
- [ ] Routes registered
- [ ] Tests (Feature & Unit)
- [ ] Documentation (API docs)

#### Frontend (React):

- [ ] TypeScript interfaces/types
- [ ] Index page (list)
- [ ] Create/Edit forms
- [ ] Detail/Show page
- [ ] Shared components extracted
- [ ] Loading & error states
- [ ] Responsive design
- [ ] Accessibility (a11y)
- [ ] Integration with Inertia
- [ ] Tests (Component tests)

#### Database:

- [ ] Foreign keys & constraints
- [ ] Indexes untuk performance
- [ ] institution_id untuk multi-tenancy
- [ ] Soft deletes jika perlu
- [ ] Timestamps
- [ ] Seed data untuk testing

#### Documentation:

- [ ] API endpoints documented
- [ ] User guide updated
- [ ] Developer notes
- [ ] Changelog updated

---

## 🎯 KESIMPULAN & NEXT ACTIONS

### Immediate Actions (This Week):

1. ✅ Review dokumentasi ini dengan tim
2. 🎯 Prioritize modules untuk Phase 2
3. 📊 Set up project tracking (Trello/Jira)
4. 🗄️ Run database enhancements migration
5. 📝 Create detailed spec untuk Modul Penilaian

### Key Takeaways:

- ✅ Sistem sudah punya foundation yang kuat
- 🧩 Arsitektur modular memudahkan pengembangan
- 🏗️ Multi-tenancy sudah implemented
- 📈 Scalable untuk growth

### Critical Success Factors:

1. **Maintain Modularity** - Jangan buat tight coupling
2. **Test Everything** - Automated testing is a must
3. **Documentation** - Keep docs updated
4. **Performance** - Monitor & optimize regularly
5. **Security** - Multi-tenant data isolation

---

**Dibuat:** 13 Maret 2026  
**Versi:** 1.0  
**Author:** E-Ponpes.id Development Team

---

💡 **Pertanyaan atau butuh klarifikasi? Buat issue atau hubungi tim development!**
