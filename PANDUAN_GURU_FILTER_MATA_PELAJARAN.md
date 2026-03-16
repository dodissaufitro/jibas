# Panduan Filter Mata Pelajaran Untuk Guru

## Overview

Sistem ini memastikan bahwa guru hanya dapat melihat dan mengelola ujian dari mata pelajaran yang mereka ampu. Filtering dilakukan di level controller untuk keamanan maksimal.

## Fitur yang Diimplementasikan

### 1. Index/List Ujian

- Guru hanya melihat ujian dari mata pelajaran yang diampu
- Filter otomatis berdasarkan relasi `guru_mata_pelajaran`
- Statistik (total ujian, dijadwalkan, berlangsung, selesai) juga disesuaikan dengan filter

**Lokasi**: `UjianController@index()`

### 2. Jadwal Ujian (Calendar View)

- Calendar hanya menampilkan ujian dari mata pelajaran yang diampu
- Filter identik dengan index untuk konsistensi
- Data events yang dikembalikan sudah terfilter

**Lokasi**: `UjianController@jadwal()`

### 3. Hasil Ujian Per Siswa

- Guru tidak bisa akses hasil ujian dari mata pelajaran yang tidak diampu
- Validasi akses sebelum menampilkan data
- Error message jelas jika akses ditolak
- Logging untuk tracking unauthorized access attempts

**Lokasi**: `UjianController@hasilSiswa()`

### 4. Create Ujian

- Dropdown mata pelajaran hanya menampilkan yang diampu
- Guru tidak bisa create ujian untuk mata pelajaran lain
- Validasi backend untuk keamanan

**Lokasi**: `UjianController@create()` dan `UjianController@store()`

### 5. Edit Ujian

- Validasi akses: guru hanya bisa edit ujian dari mata pelajaran yang diampu
- Dropdown mata pelajaran difilter (sama seperti create)
- Tidak bisa mengubah ujian ke mata pelajaran yang tidak diampu

**Lokasi**: `UjianController@edit()` dan `UjianController@update()`

### 6. Delete Ujian

- Guru hanya bisa delete ujian dari mata pelajaran yang diampu
- Validasi sebelum proses delete
- Error message jelas jika akses ditolak

**Lokasi**: `UjianController@destroy()`

## Implementasi Teknis

### Relasi Database

```php
// Di Model Guru
public function mataPelajaran()
{
    return $this->belongsToMany(
        MataPelajaran::class,
        'guru_mata_pelajaran',
        'guru_id',
        'mata_pelajaran_id'
    );
}
```

### Pattern Filter

```php
// 1. Ambil user yang sedang login
$user = Auth::user();

// 2. Cek apakah user adalah guru
if ($user->hasRole('guru')) {
    // 3. Ambil data guru
    $guru = Guru::where('user_id', $user->id)->first();

    if ($guru) {
        // 4. Ambil ID mata pelajaran yang diampu
        $mataPelajaranIds = $guru->mataPelajaran()
            ->pluck('mata_pelajaran.id')
            ->toArray();

        // 5. Filter query
        if (!empty($mataPelajaranIds)) {
            $query->whereIn('mata_pelajaran_id', $mataPelajaranIds);
        } else {
            // Jika tidak ada mata pelajaran, return empty
            $query->whereRaw('1 = 0');
        }
    }
}
```

### Pattern Validasi Akses

```php
// Validasi akses untuk single record
if ($user->hasRole('guru')) {
    $guru = Guru::where('user_id', $user->id)->first();

    if ($guru) {
        $mataPelajaranIds = $guru->mataPelajaran()
            ->pluck('mata_pelajaran.id')
            ->toArray();

        // Cek apakah ujian ini dari mata pelajaran yang diampu
        if (!in_array($ujian->mata_pelajaran_id, $mataPelajaranIds)) {
            return redirect()->route('ujian.index')
                ->with('error', 'Anda tidak memiliki akses...');
        }
    }
}
```

## Error Messages

Pesan error yang user-friendly dan konsisten:

- **View Results**: "Anda tidak memiliki akses untuk melihat hasil ujian ini. Hanya ujian dari mata pelajaran yang Anda ampu yang dapat diakses."
- **Edit**: "Anda tidak memiliki akses untuk mengedit ujian ini. Hanya ujian dari mata pelajaran yang Anda ampu yang dapat diedit."
- **Update**: "Anda tidak memiliki akses untuk memperbarui ujian ini."
- **Create**: "Anda tidak dapat membuat ujian untuk mata pelajaran yang tidak Anda ampu."
- **Delete**: "Anda tidak memiliki akses untuk menghapus ujian ini. Hanya ujian dari mata pelajaran yang Anda ampu yang dapat dihapus."

## Security Considerations

1. **Backend Validation**: Semua filtering dan validasi dilakukan di backend (controller), tidak mengandalkan frontend
2. **Consistent Pattern**: Pattern yang sama digunakan di semua methods untuk konsistensi
3. **Logging**: Unauthorized access attempts di-log untuk audit trail
4. **Empty Result Handling**: Jika guru tidak punya mata pelajaran, query return empty dengan `whereRaw('1 = 0')`
5. **Double Validation**: Untuk update, validasi dilakukan dua kali:
    - Validasi ujian yang di-edit (apakah boleh diakses)
    - Validasi mata pelajaran baru (apakah boleh dipilih)

## Testing

### Test Case 1: Login sebagai Guru

```
1. Login dengan akun guru yang mengampu Matematika
2. Akses halaman "Ujian Saya"
3. Verifikasi: Hanya ujian Matematika yang muncul
```

### Test Case 2: Coba Akses Ujian Lain

```
1. Login sebagai guru Matematika
2. Coba akses URL hasil ujian Bahasa Indonesia (ujian ID dari mapel lain)
3. Verifikasi: Redirect ke index dengan error message
```

### Test Case 3: Create Ujian

```
1. Login sebagai guru Matematika
2. Klik "Buat Ujian Baru"
3. Verifikasi: Dropdown mata pelajaran hanya berisi Matematika
```

### Test Case 4: Edit Ujian

```
1. Login sebagai guru Matematika
2. Edit ujian Matematika
3. Coba ubah mata pelajaran ke Bahasa Indonesia (jika tampil di dropdown)
4. Submit
5. Verifikasi: Error jika berhasil diubah (seharusnya tidak bisa)
```

## Admin/Superuser Behavior

- Admin dan superuser **TIDAK** dibatasi oleh filter ini
- Mereka bisa melihat dan mengelola semua ujian
- Kondisi `if ($user->hasRole('guru'))` memastikan hanya guru yang difilter

## Data Setup Requirements

Untuk fitur ini berfungsi, pastikan:

1. **Guru-Mata Pelajaran Link**: Tabel `guru_mata_pelajaran` harus terisi

    ```sql
    -- Contoh data
    INSERT INTO guru_mata_pelajaran (guru_id, mata_pelajaran_id)
    VALUES (1, 5), (1, 7); -- Guru ID 1 mengampu mapel 5 dan 7
    ```

2. **User-Guru Link**: User guru harus terlink dengan record di tabel guru

    ```sql
    SELECT u.id, u.name, g.id, g.nama_lengkap
    FROM users u
    JOIN guru g ON g.user_id = u.id
    WHERE u.id = 1;
    ```

3. **Role Assignment**: User harus punya role 'guru'
    ```sql
    SELECT u.name, r.name as role
    FROM users u
    JOIN model_has_roles mhr ON mhr.model_id = u.id
    JOIN roles r ON r.id = mhr.role_id
    WHERE u.id = 1;
    ```

## Troubleshooting

### Problem: Guru tidak melihat ujian apapun

**Possible Causes**:

- Guru belum di-assign mata pelajaran di tabel `guru_mata_pelajaran`
- User tidak terlink dengan record guru (guru.user_id)
- Role 'guru' belum di-assign ke user

**Solution**:

```sql
-- Cek link user-guru
SELECT * FROM guru WHERE user_id = <USER_ID>;

-- Cek mata pelajaran yang diampu
SELECT gmp.*, mp.nama_mata_pelajaran
FROM guru_mata_pelajaran gmp
JOIN mata_pelajaran mp ON mp.id = gmp.mata_pelajaran_id
WHERE gmp.guru_id = <GURU_ID>;
```

### Problem: Error "Undefined method hasRole"

**Cause**: Ini adalah false positive dari PHP Intelephense

**Solution**: Abaikan error ini. Method `hasRole()` disediakan oleh Spatie Laravel Permission package dan akan berfungsi di runtime. Pastikan User model menggunakan trait HasRoles.

### Problem: Guru masih bisa akses ujian dari mapel lain via direct URL

**Investigation**:

- Cek apakah semua methods sudah ada validasi
- Cek log file untuk melihat apakah validasi ter-trigger
- Pastikan `$user->hasRole('guru')` return true

## Files Modified

1. `app/Http/Controllers/UjianController.php`:
    - `index()` - Filter list ujian
    - `jadwal()` - Filter calendar events
    - `create()` - Filter dropdown mata pelajaran
    - `store()` - Validate mata pelajaran selection
    - `edit()` - Validate access + filter dropdown
    - `update()` - Validate access + validate new mata pelajaran
    - `destroy()` - Validate access before delete
    - `hasilSiswa()` - Validate access to exam results

## Kesimpulan

Implementasi ini memastikan guru hanya dapat mengakses dan mengelola ujian dari mata pelajaran yang mereka ampu. Validasi dilakukan di backend untuk keamanan maksimal, dengan error messages yang jelas untuk user experience yang baik.
