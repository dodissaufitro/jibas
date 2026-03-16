# Jadwal Pelajaran Siswa

## Overview

Fitur Jadwal Pelajaran Siswa memungkinkan siswa untuk melihat jadwal mata pelajaran mereka. Jadwal ini menjadi dasar untuk siswa mengikuti ujian, karena siswa **hanya dapat mengakses ujian dari guru dan mata pelajaran yang mengajar di kelas mereka** sesuai jadwal.

## Fitur Utama

### 1. **Tampilan Jadwal Terstruktur**

- Jadwal ditampilkan per hari (Senin-Minggu)
- Highlight pada hari yang sedang berjalan
- Informasi lengkap: mata pelajaran, guru, waktu, dan ruangan
- Warna berbeda untuk setiap hari agar mudah dibedakan

### 2. **Integrasi dengan Sistem Ujian**

- Jadwal pelajaran menentukan ujian mana yang bisa diakses siswa
- Siswa hanya bisa melihat dan mengikuti ujian dari:
    - Guru yang mengajar di kelas mereka
    - Mata pelajaran yang ada di jadwal kelas mereka

### 3. **Informasi Lengkap**

- **Hari dan Tanggal**: Terorganisir per hari
- **Waktu**: Jam mulai dan selesai pelajaran
- **Mata Pelajaran**: Nama lengkap dan kode mapel
- **Guru Pengajar**: Nama lengkap guru
- **Ruangan**: Lokasi kelas berlangsung
- **Kelas**: Informasi kelas dan jenjang siswa

## Akses Menu

Siswa dapat mengakses jadwal pelajaran melalui:

1. Menu sidebar → **Ujian** → **Jadwal Pelajaran**
2. URL langsung: `/siswa/exam/jadwal`

## Routes

```php
// Route untuk siswa
Route::prefix('siswa/exam')->name('siswa.exam.')->middleware('role:siswa')->group(function () {
    Route::get('/jadwal', [SiswaExamController::class, 'jadwalPelajaran'])->name('jadwal');
});
```

## Controller

### SiswaExamController::jadwalPelajaran()

Method ini mengambil dan menampilkan jadwal pelajaran untuk kelas siswa yang login:

```php
public function jadwalPelajaran()
{
    $siswa = Siswa::where('user_id', Auth::id())->first();

    // Get jadwal pelajaran untuk kelas siswa
    $jadwalPelajaran = \App\Models\JadwalPelajaran::with(['mataPelajaran', 'guru.user', 'kelas.jenjang'])
        ->where('kelas_id', $siswa->kelas_id)
        ->orderByRaw("FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')")
        ->orderBy('jam_mulai', 'asc')
        ->get()
        ->groupBy('hari');

    return Inertia::render('Siswa/JadwalPelajaran', [
        'siswa' => $siswa->load('kelas.jenjang'),
        'jadwalPelajaran' => $jadwalPelajaranSorted,
        'hariList' => $hariOrder,
    ]);
}
```

## React Component

File: `resources/js/Pages/Siswa/JadwalPelajaran.tsx`

### Props Interface

```typescript
interface Props {
    siswa: Siswa; // Data siswa yang login
    jadwalPelajaran: Record<string, JadwalItem[]>; // Jadwal dikelompokkan per hari
    hariList: string[]; // Daftar hari dalam urutan yang benar
}
```

### Fitur UI

1. **Header dengan Info Siswa**
    - Nama lengkap siswa
    - NIS
    - Kelas dan jenjang

2. **Info Box**
    - Penjelasan tentang fungsi jadwal untuk akses ujian

3. **Jadwal per Hari**
    - Badge hari dengan warna berbeda
    - Highlight "Hari Ini" untuk hari aktif
    - Card untuk setiap mata pelajaran dengan informasi lengkap
    - Icon untuk waktu, guru, dan ruangan

4. **Empty State**
    - Pesan jika belum ada jadwal untuk kelas

## Filtering Ujian Berdasarkan Jadwal

Sistem filtering ujian sudah diimplementasikan di:

### 1. UjianSiswaController::index()

```php
// Get guru_ids dan mata_pelajaran_ids yang mengajar di kelas siswa
$jadwalKelas = \App\Models\JadwalPelajaran::where('kelas_id', $siswa->kelas_id)->get();
$guruIds = $jadwalKelas->pluck('guru_id')->unique()->toArray();
$mapelIds = $jadwalKelas->pluck('mata_pelajaran_id')->unique()->toArray();

// Filter ujian
$ujian = Ujian::with(['mataPelajaran', 'guru', 'kelas'])
    ->where('kelas_id', $siswa->kelas_id)
    ->whereIn('guru_id', $guruIds)
    ->whereIn('mata_pelajaran_id', $mapelIds)
    ->whereIn('status', ['dijadwalkan', 'berlangsung'])
    ->get();
```

### 2. UjianSiswaController::aksesKode()

```php
// Validasi akses ujian via kode
$ujian = Ujian::where('id', $validated['kode_ujian'])
    ->where('kelas_id', $siswa->kelas_id)
    ->whereIn('guru_id', $guruIds)
    ->whereIn('mata_pelajaran_id', $mapelIds)
    ->whereIn('status', ['dijadwalkan', 'berlangsung'])
    ->first();
```

### 3. UjianSiswaController::mulai()

```php
// Validasi saat mulai ujian
$jadwalKelas = \App\Models\JadwalPelajaran::where('kelas_id', $siswa->kelas_id)->get();
$guruIds = $jadwalKelas->pluck('guru_id')->unique()->toArray();
$mapelIds = $jadwalKelas->pluck('mata_pelajaran_id')->unique()->toArray();

if (!in_array($ujian->guru_id, $guruIds) || !in_array($ujian->mata_pelajaran_id, $mapelIds)) {
    return redirect()->route('siswa.ujian.index')
        ->with('error', 'Ujian ini tidak tersedia untuk Anda. Hanya ujian dari guru dan mata pelajaran yang mengajar di kelas Anda yang dapat diakses.');
}
```

## Database

### Tabel: jadwal_pelajaran

```sql
- id
- tahun_ajaran_id
- kelas_id
- mata_pelajaran_id
- guru_id
- hari (Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu)
- jam_mulai (HH:MM:SS)
- jam_selesai (HH:MM:SS)
- ruangan
- created_at
- updated_at
```

## Model Relationships

### JadwalPelajaran Model

```php
public function tahunAjaran()
{
    return $this->belongsTo(TahunAjaran::class);
}

public function kelas()
{
    return $this->belongsTo(Kelas::class);
}

public function mataPelajaran()
{
    return $this->belongsTo(MataPelajaran::class);
}

public function guru()
{
    return $this->belongsTo(Guru::class);
}
```

## Security & Access Control

1. **Middleware**: `role:siswa` - Hanya siswa yang bisa mengakses
2. **Kelas Filtering**: Siswa hanya melihat jadwal kelasnya sendiri
3. **Ujian Filtering**: Ujian difilter berdasarkan jadwal pelajaran
4. **Multi-layer Validation**:
    - Saat melihat daftar ujian
    - Saat akses ujian via kode
    - Saat mulai mengerjakan ujian

## Manfaat

1. **Transparansi**: Siswa tahu mata pelajaran apa saja dan siapa gurunya
2. **Akses Ujian yang Akurat**: Siswa hanya melihat ujian yang relevan
3. **Mencegah Akses Ilegal**: Siswa tidak bisa mengakses ujian dari guru/mapel yang tidak mengajar di kelasnya
4. **User-Friendly**: Interface yang jelas dan mudah dipahami

## Best Practices

1. **Pastikan Jadwal Selalu Update**: Admin harus memperbarui jadwal setiap semester/tahun ajaran
2. **Validasi Data**: Pastikan semua guru dan mata pelajaran terdaftar dengan benar
3. **Konsistensi**: Gunakan tahun ajaran yang aktif untuk filter
4. **Testing**: Test dengan berbagai skenario (siswa beda kelas, guru beda mapel, dll)

## Testing Scenario

### Test 1: Akses Jadwal

1. Login sebagai siswa (contoh: siswa.smp7a@jibas.com)
2. Buka menu Ujian → Jadwal Pelajaran
3. Verifikasi jadwal muncul sesuai kelas (VII-A)

### Test 2: Filtering Ujian

1. Buat ujian untuk kelas VII-A oleh guru yang TIDAK di jadwal
2. Login sebagai siswa VII-A
3. Verifikasi ujian tersebut TIDAK muncul di daftar

### Test 3: Akses Ujian via Kode

1. Ambil kode ujian dari kelas lain atau guru yang tidak di jadwal
2. Login sebagai siswa
3. Coba akses dengan kode tersebut
4. Verifikasi muncul error "Ujian ini tidak tersedia untuk Anda"

## Changelog

### Version 1.0 (2026-03-16)

- ✅ Implementasi method `jadwalPelajaran()` di `SiswaExamController`
- ✅ Routing `/siswa/exam/jadwal`
- ✅ React component `JadwalPelajaran.tsx`
- ✅ Menu navigasi "Jadwal Pelajaran" di sidebar
- ✅ Integrasi filtering ujian berdasarkan jadwal
- ✅ Multi-layer validation di `UjianSiswaController`

## File yang Diperbarui

1. `app/Http/Controllers/SiswaExamController.php` - Tambah method jadwalPelajaran()
2. `app/Http/Controllers/UjianSiswaController.php` - Tambah filtering berdasarkan jadwal
3. `routes/web.php` - Tambah route siswa.exam.jadwal
4. `resources/js/Pages/Siswa/JadwalPelajaran.tsx` - Component baru
5. `resources/js/Layouts/SidebarLayout.tsx` - Tambah menu jadwal pelajaran

## Support

Untuk pertanyaan atau bantuan terkait fitur ini, hubungi tim developer atau lihat dokumentasi lengkap di repository.
