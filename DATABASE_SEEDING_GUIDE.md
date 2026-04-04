# 📚 Database Seeding Guide - JIBAS

Panduan lengkap untuk seeding database aplikasi JIBAS.

---

## 🚀 Quick Start

### Option 1: Fresh Setup (Recommended untuk development)

**Windows:**

```bash
# Menggunakan batch script
setup-fresh.bat

# Atau manual
php artisan migrate:fresh --seed
```

**Linux/Mac:**

```bash
# Menggunakan bash script
chmod +x setup-fresh.sh
./setup-fresh.sh

# Atau manual
php artisan migrate:fresh --seed
```

### Option 2: Migration Only (Keep existing data)

```bash
php artisan migrate
```

### Option 3: Seeding Only (Database sudah di-migrate)

**Windows:**

```bash
seed-only.bat
```

**Manual:**

```bash
php artisan db:seed
```

---

## 📋 Urutan Seeding

DatabaseSeeder akan menjalankan seeder dalam urutan berikut:

1. **InstitutionSeeder** - Membuat institusi (Pesantren, Sekolah, Madrasah)
2. **PermissionSeeder** - Membuat permissions dan roles
3. **MasterDataSeeder** - Tahun ajaran, jenjang, jurusan, kelas
4. **AkademikDataSeeder** - Data akademik (mata pelajaran, dll)
5. **UserSeeder** - User dengan berbagai role (admin, guru, siswa)
6. **GuruSeeder** - Data guru
7. **SiswaSeeder** - Data siswa
8. **GuruKelasSeeder** - Assignment guru ke kelas
9. **AsramaSeeder** - Data asrama (untuk pesantren)
10. **JenisPembayaranSeeder** - Jenis pembayaran (SPP, dll)
11. **TagihanSeeder** - Tagihan siswa
12. **PresensiSiswaSeeder** - Sample data presensi
13. **UjianSeeder** - Sample ujian
14. **SoalUjianSeeder** - Soal ujian
15. **GuruJadwalUjianSeeder** - Jadwal guru dan ujian
16. **SoalUjianMatematikaSeeder** - Soal matematika tambahan
17. **ContohSiswaSeeder** - Contoh siswa berbagai jenjang
18. **ContohUjianSeeder** - Contoh ujian dengan hasil

---

## 👥 Default Login Credentials

Setelah seeding, Anda dapat login dengan akun berikut:

### Super Admin

- **Email:** `admin@jibas.com`
- **Password:** `password123`
- **Akses:** Full access ke semua fitur

### Admin Sekolah

- **Email:** `admin.sekolah@jibas.com`
- **Password:** `password123`
- **Akses:** Kelola data sekolah

### Guru

- **Email:** `guru@jibas.com`
- **Password:** `password123`
- **Akses:** Input nilai, presensi, ujian

### Siswa

- **Email:** `siswa@jibas.com`
- **Password:** `password123`
- **Akses:** Lihat nilai, jadwal, ujian

### Orang Tua

- **Email:** `orangtua@jibas.com`
- **Password:** `password123`
- **Akses:** Lihat data anak

---

## 🏫 Institusi yang Dibuat

1. **Pondok Pesantren Al-Hikmah** (MA)
2. **SMA Negeri 1 Jakarta** (SMA)
3. **Madrasah Tsanawiyah Negeri 1 Bandung** (MTs)
4. **SMP A** (SMP)

---

## 🎯 Seeder Individual

Jika ingin menjalankan seeder tertentu saja:

```bash
# Seeder institusi saja
php artisan db:seed --class=InstitutionSeeder

# Seeder permissions saja
php artisan db:seed --class=PermissionSeeder

# Seeder master data saja
php artisan db:seed --class=MasterDataSeeder

# Seeder user saja
php artisan db:seed --class=UserSeeder

# Seeder siswa saja
php artisan db:seed --class=SiswaSeeder

# Seeder guru saja
php artisan db:seed --class=GuruSeeder

# Seeder ujian saja
php artisan db:seed --class=UjianSeeder
```

---

## 🔄 Reset Database (Development)

### Full Reset (Drop + Migrate + Seed)

**Windows:**

```bash
php artisan migrate:fresh --seed
```

**Atau dengan konfirmasi:**

```bash
setup-fresh.bat
```

### Rollback + Re-migrate + Seed

```bash
php artisan migrate:rollback
php artisan migrate
php artisan db:seed
```

### Wipe Database (Drop semua tabel)

```bash
php artisan db:wipe
php artisan migrate
php artisan db:seed
```

---

## 📊 Data yang Dibuat

Setelah seeding lengkap, database akan berisi:

| Resource         | Jumlah (approx) |
| ---------------- | --------------- |
| Institutions     | 4               |
| Users            | 5+              |
| Roles            | 6               |
| Permissions      | 50+             |
| Guru             | 10+             |
| Siswa            | 20+             |
| Kelas            | 20+             |
| Jadwal Pelajaran | 30+             |
| Ujian            | 5+              |
| Soal Ujian       | 45+             |
| Ujian Siswa      | 10+             |
| Jawaban Siswa    | 100+            |

---

## 🛠️ Troubleshooting

### Error: "Class X does not exist"

**Solusi:**

```bash
composer dump-autoload
php artisan db:seed
```

### Error: "Foreign key constraint"

**Solusi:**

```bash
# Reset database
php artisan migrate:fresh
php artisan db:seed
```

### Error: "Duplicate entry"

**Solusi:**

```bash
# Truncate tables first
php artisan migrate:fresh --seed
```

### Seeder berjalan terlalu lambat

**Optimasi:**

```bash
# Disable model events temporarily
php artisan db:seed --no-model-events
```

---

## 📝 Membuat Seeder Baru

```bash
# Generate seeder
php artisan make:seeder NamaSeeder

# Edit file di database/seeders/NamaSeeder.php
# Tambahkan ke DatabaseSeeder.php
```

**Contoh Seeder:**

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\YourModel;

class YourSeeder extends Seeder
{
    public function run(): void
    {
        YourModel::create([
            'field1' => 'value1',
            'field2' => 'value2',
        ]);

        $this->command->info('✅ Data berhasil ditambahkan!');
    }
}
```

---

## 🔒 Production Considerations

### PENTING untuk Production:

1. **Jangan gunakan** `migrate:fresh` di production
2. **Ganti password default** sebelum deploy
3. **Backup database** sebelum seeding
4. **Gunakan `.env.production`** dengan kredensial kuat

### Safe Production Seeding:

```bash
# Backup dulu
php artisan db:backup

# Seed only specific seeders
php artisan db:seed --class=InstitutionSeeder
php artisan db:seed --class=PermissionSeeder

# Verify
php artisan tinker
>>> User::count()
```

---

## 📞 Support

Jika ada masalah dengan seeding, check:

1. **Logs:** `storage/logs/laravel.log`
2. **Migration status:** `php artisan migrate:status`
3. **Database connection:** `php artisan tinker` → `DB::connection()->getPdo();`

---

## 🎓 Tips & Best Practices

### 1. Development Environment

```bash
# Quick reset for development
php artisan migrate:fresh --seed
```

### 2. Testing Environment

```bash
# Use SQLite in-memory for fast tests
# Set in phpunit.xml:
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

### 3. Custom Seeding for Institution

```php
// Seed hanya untuk institution tertentu
php artisan tinker

$institution = Institution::find(1);
// Create data for this institution...
```

### 4. Verifikasi Seeding

```bash
php artisan tinker

# Check data
>>> User::count()
>>> Institution::count()
>>> Siswa::count()
>>> Guru::count()

# Check relationships
>>> User::find(1)->roles
>>> Siswa::with('kelas')->first()
```

---

## 📅 Maintenance

### Weekly (Development)

```bash
# Refresh data development
php artisan migrate:fresh --seed
```

### Monthly (Staging)

```bash
# Backup + Update
php artisan db:backup
php artisan migrate
php artisan db:seed --class=MasterDataSeeder
```

---

**Last Updated:** April 4, 2026  
**Version:** 1.0  
**Maintainer:** JIBAS Development Team
