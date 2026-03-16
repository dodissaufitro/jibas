# Database Seeding Guide

## Overview

Semua seeder sudah dijadikan dalam satu script utama: **`DatabaseSeeder.php`**

Anda cukup menjalankan satu command untuk setup database lengkap dengan semua data contoh.

## Quick Start

### Fresh Installation (Recommended)

```bash
php artisan migrate:fresh --seed
```

Command ini akan:

1. Drop semua tabel
2. Jalankan semua migration
3. Jalankan semua seeder secara otomatis

### Seed Only (tanpa migrate)

```bash
php artisan db:seed
```

Gunakan jika database sudah di-migrate dan hanya ingin menambah data.

## Urutan Seeding

`DatabaseSeeder.php` menjalankan seeder dalam urutan yang tepat:

### 1️⃣ **InstitutionSeeder**

- Membuat data institusi/sekolah
- **Harus pertama** karena user memerlukan institution_id

### 2️⃣ **PermissionSeeder**

- Membuat permissions dan roles
- Permissions: view_users, create_users, edit_users, delete_users, dll
- Roles: super_admin, admin, guru, siswa, orang_tua

### 3️⃣ **MasterDataSeeder**

- Membuat data master: Jenjang (SD, SMP, SMA, SMK)
- Jurusan (IPA, IPS, RPL, TKJ, dll)
- Kelas untuk semua jenjang
- Mata Pelajaran (Matematika, IPA, Bahasa Indonesia, dll)
- Tahun Ajaran dan Semester

### 4️⃣ **AkademikDataSeeder**

- Membuat data akademik tambahan
- Kurikulum

### 5️⃣ **UserSeeder**

- Membuat users dengan berbagai role:
    - Super Admin (superadmin@jibas.com)
    - Admin (admin@jibas.com)
    - Sample guru dan siswa

### 6️⃣ **GuruSeeder**

- Membuat data guru
- Link dengan user account

### 7️⃣ **SiswaSeeder**

- Membuat data siswa
- Link dengan user account
- Assign ke kelas

### 8️⃣ **GuruKelasSeeder**

- Assign guru sebagai wali kelas

### 9️⃣ **AsramaSeeder**

- Membuat data asrama (untuk pesantren)
- Kamar dan penempatan santri

### 🔟 **JenisPembayaranSeeder**

- Membuat jenis-jenis pembayaran
- SPP, Uang Gedung, Seragam, dll

### 1️⃣1️⃣ **TagihanSeeder**

- Membuat tagihan contoh untuk siswa

### 1️⃣2️⃣ **PresensiSiswaSeeder**

- Membuat data presensi contoh

### 1️⃣3️⃣ **UjianSeeder**

- Membuat ujian-ujian contoh

### 1️⃣4️⃣ **SoalUjianSeeder**

- Membuat 30 soal ujian Matematika Kelas 7

### 1️⃣5️⃣ **GuruJadwalUjianSeeder**

- Membuat 3 guru pengajar (Matematika, IPA, Bahasa Indonesia)
- Membuat jadwal pelajaran untuk Kelas A
- Membuat ujian dari guru-guru tersebut
- Membuat soal-soal ujian

### 1️⃣6️⃣ **SoalUjianMatematikaSeeder**

- Membuat 15 soal tambahan untuk ujian Matematika
- Topik: Bilangan Bulat dan Pecahan

### 1️⃣7️⃣ **ContohSiswaSeeder**

- Membuat 10 contoh siswa dari berbagai jenjang:
    - SMP: VII-A, VIII-A, IX-A
    - SMA: X-A, XI IPA-1, XII IPA-1, X-B
    - SMK: X RPL-1, XI RPL-1, XII RPL-2

## List Semua Seeder

| No  | Seeder                    | Deskripsi              | Status     |
| --- | ------------------------- | ---------------------- | ---------- |
| 1   | InstitutionSeeder         | Data institusi/sekolah | ✅ Include |
| 2   | PermissionSeeder          | Roles dan permissions  | ✅ Include |
| 3   | MasterDataSeeder          | Jenjang, kelas, mapel  | ✅ Include |
| 4   | AkademikDataSeeder        | Data akademik          | ✅ Include |
| 5   | UserSeeder                | User accounts          | ✅ Include |
| 6   | GuruSeeder                | Data guru              | ✅ Include |
| 7   | SiswaSeeder               | Data siswa             | ✅ Include |
| 8   | GuruKelasSeeder           | Wali kelas             | ✅ Include |
| 9   | AsramaSeeder              | Data asrama            | ✅ Include |
| 10  | JenisPembayaranSeeder     | Jenis pembayaran       | ✅ Include |
| 11  | TagihanSeeder             | Tagihan siswa          | ✅ Include |
| 12  | PresensiSiswaSeeder       | Presensi contoh        | ✅ Include |
| 13  | UjianSeeder               | Ujian contoh           | ✅ Include |
| 14  | SoalUjianSeeder           | 30 soal Matematika     | ✅ Include |
| 15  | GuruJadwalUjianSeeder     | Guru, jadwal, ujian    | ✅ Include |
| 16  | SoalUjianMatematikaSeeder | 15 soal tambahan       | ✅ Include |
| 17  | ContohSiswaSeeder         | 10 siswa contoh        | ✅ Include |

✅ **Total: 17 seeder, semua sudah include dalam DatabaseSeeder.php**

## Menjalankan Seeder Tertentu

Jika Anda hanya ingin menjalankan seeder tertentu:

```bash
# Hanya MasterDataSeeder
php artisan db:seed --class=MasterDataSeeder

# Hanya ContohSiswaSeeder
php artisan db:seed --class=ContohSiswaSeeder

# Hanya GuruJadwalUjianSeeder
php artisan db:seed --class=GuruJadwalUjianSeeder
```

## Default Login Credentials

Setelah seeding, Anda dapat login dengan:

### Super Admin

- **Email**: superadmin@jibas.com
- **Password**: password

### Admin

- **Email**: admin@jibas.com
- **Password**: password

### Guru Contoh

- **Email**: guru.matematika@jibas.com
- **Password**: password

- **Email**: guru.ipa@jibas.com
- **Password**: password

- **Email**: guru.bahasa@jibas.com
- **Password**: password

### Siswa Contoh

#### SMP

- **Email**: siswa.smp7a@jibas.com (Ahmad Rizki - Kelas VII-A)
- **Email**: siswa.smp8a@jibas.com (Siti Fatimah - Kelas VIII-A)
- **Email**: siswa.smp9a@jibas.com (Budi Santoso - Kelas IX-A)

#### SMA

- **Email**: siswa.sma10a@jibas.com (Dewi Lestari - Kelas X-A)
- **Email**: siswa.sma11ipa@jibas.com (Eko Prasetyo - Kelas XI IPA-1)
- **Email**: siswa.sma12ipa@jibas.com (Fitri Handayani - Kelas XII IPA-1)
- **Email**: siswa.sma10b@jibas.com (Kartika Sari - Kelas X-B)

#### SMK

- **Email**: siswa.smk10rpl@jibas.com (Hendra Setiawan - Kelas X RPL-1)
- **Email**: siswa.smk11rpl@jibas.com (Indah Permata - Kelas XI RPL-1)
- **Email**: siswa.smk12rpl@jibas.com (Joko Widodo - Kelas XII RPL-2)

**Semua password**: password123 atau password

## Summary Output

Setelah seeding selesai, akan ditampilkan summary:

```
┌─────────────────────┬───────┐
│ Resource            │ Count │
├─────────────────────┼───────┤
│ Institutions        │ 1     │
│ Users               │ XX    │
│ Roles               │ 5     │
│ Permissions         │ XX    │
│ Guru                │ XX    │
│ Siswa               │ XX    │
│ Kelas               │ XX    │
│ Jadwal Pelajaran    │ XX    │
│ Ujian               │ XX    │
│ Soal Ujian          │ XX    │
└─────────────────────┴───────┘
```

## Troubleshooting

### Jika ada error saat seeding:

1. **Clear cache terlebih dahulu**:

```bash
php artisan optimize:clear
```

2. **Reset database dan seed ulang**:

```bash
php artisan migrate:fresh --seed
```

3. **Periksa konfigurasi database** di `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jibas_db
DB_USERNAME=root
DB_PASSWORD=
```

### Jika seeder tertentu gagal:

1. Hapus data terkait secara manual di database
2. Jalankan seeder tersebut saja:

```bash
php artisan db:seed --class=NamaSeeder
```

## Best Practices

1. **Development Environment**: Gunakan `migrate:fresh --seed` saat development
2. **Production Environment**: JANGAN gunakan migrate:fresh di production!
3. **Custom Seeder**: Buat seeder terpisah untuk data production
4. **Testing**: Seeder ini cocok untuk testing dan demo

## Data yang Dibuat

### Master Data

- 4 Jenjang (SD, SMP, SMA, SMK)
- 10+ Jurusan
- 50+ Kelas (semua tingkat)
- 15+ Mata Pelajaran
- Tahun Ajaran dan Semester aktif

### Users & Accounts

- 1 Super Admin
- 1 Admin
- 10+ Guru (termasuk 3 guru dengan jadwal lengkap)
- 20+ Siswa (termasuk 10 contoh dari berbagai jenjang)

### Academic Data

- 10+ Jadwal Pelajaran
- 5+ Ujian dengan soal
- 45+ Soal Ujian (30 + 15 soal Matematika)

### Financial Data

- Jenis Pembayaran (SPP, Uang Gedung, dll)
- Tagihan contoh

### Others

- Data Asrama
- Presensi Siswa
- Wali Kelas

## Kesimpulan

✅ **Semua 17 seeder sudah dijadikan dalam satu script: `DatabaseSeeder.php`**

Cukup jalankan:

```bash
php artisan migrate:fresh --seed
```

Dan semua data contoh akan tersetup dengan sempurna! 🎉

## Update History

- **2026-03-16**: Menambahkan GuruJadwalUjianSeeder, SoalUjianMatematikaSeeder, dan ContohSiswaSeeder ke DatabaseSeeder
- **2026-03-16**: Update summary table dengan Jadwal Pelajaran, Ujian, dan Soal Ujian
- **Initial**: Setup 14 seeder dasar
