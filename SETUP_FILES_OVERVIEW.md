# 🚀 File Setup Database yang Tersedia

Dokumentasi lengkap tentang file-file yang tersedia untuk setup database JIBAS.

---

## 📦 Daftar File

| File                        | Type            | Platform  | Description                               |
| --------------------------- | --------------- | --------- | ----------------------------------------- |
| **setup-database.sh**       | Bash Script     | Linux/Mac | Script otomatis untuk server production   |
| **setup-database.bat**      | Batch Script    | Windows   | Script otomatis untuk Windows             |
| **jibas:setup**             | Artisan Command | All       | Custom Laravel command (recommended)      |
| **DatabaseSeeder.php**      | PHP Seeder      | All       | Master seeder yang memanggil semua seeder |
| **DATABASE_SETUP.md**       | Documentation   | All       | Panduan lengkap setup database            |
| **DEPLOYMENT_CHECKLIST.md** | Documentation   | All       | Checklist deployment production           |
| **SETUP_QUICK_REF.txt**     | Quick Reference | All       | Referensi cepat command                   |

---

## 📝 Detail Setiap File

### 1. DatabaseSeeder.php

**Location:** `database/seeders/DatabaseSeeder.php`

**Fungsi:**

- Master seeder yang memanggil semua seeder lain
- Urutan seeding yang benar dan logical
- Progress info untuk setiap step
- Summary statistics setelah selesai

**Urutan Seeding:**

1. InstitutionSeeder (Institutions)
2. PermissionSeeder (Roles & Permissions)
3. MasterDataSeeder (Jenjang, Jurusan, etc)
4. AkademikDataSeeder (Tahun Ajaran, Kelas)
5. UserSeeder (Users with roles)
6. GuruSeeder (Guru profiles)
7. SiswaSeeder (Siswa profiles)
8. GuruKelasSeeder (Guru-Kelas assignments)
9. AsramaSeeder (Dormitory data)
10. JenisPembayaranSeeder (Payment types)
11. TagihanSeeder (Bills)
12. PresensiSiswaSeeder (Attendance samples)
13. UjianSeeder (Exam samples)

**Cara Pakai:**

```bash
# Via standard Laravel command
php artisan db:seed

# Via migrate fresh
php artisan migrate:fresh --seed
```

---

### 2. setup-database.sh (Bash Script)

**Location:** `setup-database.sh`
**Platform:** Linux / Mac / Unix Server

**Fungsi:**

- One-command complete setup
- Interactive confirmation
- Color-coded output
- Auto optimization
- Summary display

**Features:**
✅ Clear all cache
✅ Fresh migration
✅ Seed all data
✅ Optimize application
✅ Display statistics
✅ Show default accounts

**Cara Pakai:**

```bash
# Berikan permission
chmod +x setup-database.sh

# Jalankan
./setup-database.sh
```

**Kapan Digunakan:**

- ✅ Deployment initial di server Linux
- ✅ Reset database development
- ✅ Setup server staging/production
- ❌ Jangan di production kalau sudah ada data!

---

### 3. setup-database.bat (Batch Script)

**Location:** `setup-database.bat`
**Platform:** Windows

**Fungsi:**

- Windows-friendly setup script
- User-friendly interface
- Automatic error handling
- Pause untuk review result

**Features:**
✅ No command line needed
✅ Double-click to run
✅ Color output
✅ Error detection
✅ Auto pause at end

**Cara Pakai:**

```batch
# Method 1: Double-click file

# Method 2: Via command prompt
setup-database.bat
```

**Kapan Digunakan:**

- ✅ Development di Windows (Laragon/XAMPP)
- ✅ Reset database lokal
- ✅ First-time setup
- ❌ Jangan di production server!

---

### 4. jibas:setup (Artisan Command)

**Location:** `app/Console/Commands/SetupDatabase.php`
**Platform:** All (Laravel)

**Fungsi:**

- Professional CLI command
- Full-featured dengan options
- Database connection check
- Interactive confirmation
- Progress indicators

**Features:**
✅ Multiple options (--fresh, --seed-only, --no-cache)
✅ Database connection validation
✅ Beautiful table output
✅ Default accounts display
✅ Statistics summary

**Cara Pakai:**

```bash
# Setup lengkap (recommended)
php artisan jibas:setup --fresh

# Hanya seed
php artisan jibas:setup --seed-only

# Tanpa cache optimization
php artisan jibas:setup --fresh --no-cache

# Lihat help
php artisan jibas:setup --help
```

**Options:**

- `--fresh` : Run migrate:fresh (drop all tables)
- `--seed-only` : Skip migration, only seed
- `--no-cache` : Skip cache optimization

**Kapan Digunakan:**

- ✅ **Development** - Setiap kali perlu reset DB
- ✅ **Production Initial Setup** - First deployment
- ✅ **Seeding Only** - Update data tanpa migration
- ✅ **CI/CD Pipeline** - Automated testing

---

### 5. DATABASE_SETUP.md

**Location:** `DATABASE_SETUP.md`
**Type:** Comprehensive Documentation

**Isi:**

1. Overview semua metode setup
2. Step-by-step untuk development
3. Step-by-step untuk production
4. Data yang di-seed
5. Default accounts
6. Troubleshooting lengkap
7. Best practices
8. Backup & restore guide

**Kapan Dibaca:**

- ✅ Sebelum setup pertama kali
- ✅ Sebelum deployment production
- ✅ Saat troubleshooting error
- ✅ Setup tim development baru

---

### 6. DEPLOYMENT_CHECKLIST.md

**Location:** `DEPLOYMENT_CHECKLIST.md`
**Type:** Production Deployment Guide

**Isi:**

1. Pre-deployment checklist
2. Server requirements
3. Step-by-step deployment
4. Web server configuration (Apache/Nginx)
5. SSL setup dengan Let's Encrypt
6. Security checklist
7. Backup strategy
8. Update deployment procedure
9. Troubleshooting common issues

**Kapan Dibaca:**

- ✅ **WAJIB** sebelum deploy ke production
- ✅ Setup server baru
- ✅ Update deployment
- ✅ Troubleshooting production issues

---

### 7. SETUP_QUICK_REF.txt

**Location:** `SETUP_QUICK_REF.txt`
**Type:** Quick Reference Card

**Isi:**

- Quick commands overview
- Default accounts
- Common troubleshooting
- One-page reference

**Kapan Dibaca:**

- ✅ Quick lookup commands
- ✅ Lupa syntax command
- ✅ Team onboarding

---

## 🎯 Kapan Pakai File Mana?

### Scenario 1: Setup Development Pertama Kali

```bash
# Pilihan A: Artisan command (Recommended)
php artisan jibas:setup --fresh

# Pilihan B: Batch script (Windows)
setup-database.bat

# Pilihan C: Standard Laravel
php artisan migrate:fresh --seed
```

### Scenario 2: Reset Database saat Development

```bash
# Baca: SETUP_QUICK_REF.txt
# Run: php artisan jibas:setup --fresh
```

### Scenario 3: Deployment ke Production Server (Linux)

```bash
# 1. Baca: DEPLOYMENT_CHECKLIST.md (WAJIB!)
# 2. Upload files via git
# 3. Configure .env
# 4. Run: ./setup-database.sh
# 5. Follow post-deployment checklist
```

### Scenario 4: Update Production (Ada Migration Baru)

```bash
# JANGAN pakai --fresh!
# Run: php artisan migrate --force
# Optional: php artisan db:seed --class=SpecificSeeder
```

### Scenario 5: Troubleshooting Error

```bash
# 1. Check: storage/logs/laravel.log
# 2. Baca: DATABASE_SETUP.md (Troubleshooting section)
# 3. Baca: DEPLOYMENT_CHECKLIST.md (Troubleshooting section)
```

---

## ⚠️ IMPORTANT WARNINGS

### ❌ JANGAN LAKUKAN INI DI PRODUCTION:

```bash
# ❌ JANGAN! Ini akan HAPUS SEMUA DATA!
php artisan migrate:fresh --seed

# ❌ JANGAN! Ini akan HAPUS SEMUA DATA!
php artisan jibas:setup --fresh

# ❌ JANGAN! Ini akan RESET DATABASE!
./setup-database.sh
```

### ✅ YANG AMAN DI PRODUCTION:

```bash
# ✅ Migration tanpa drop table
php artisan migrate --force

# ✅ Seed specific seeder (hati-hati, check logic dulu!)
php artisan db:seed --class=SpecificSeeder --force

# ✅ Seed only (tanpa migration) - check logic dulu!
php artisan jibas:setup --seed-only
```

---

## 📊 Comparison Table

| Feature              | Artisan Command | Bash Script | Batch Script | Standard    |
| -------------------- | --------------- | ----------- | ------------ | ----------- |
| **Platform**         | All             | Linux/Mac   | Windows      | All         |
| **Interactive**      | ✅ Yes          | ✅ Yes      | ⚠️ Limited   | ❌ No       |
| **Options**          | ✅ Multiple     | ❌ No       | ❌ No        | ✅ Some     |
| **Connection Check** | ✅ Yes          | ❌ No       | ❌ No        | ❌ No       |
| **Progress Display** | ✅ Beautiful    | ✅ Good     | ⚠️ Basic     | ✅ Standard |
| **Statistics**       | ✅ Detailed     | ⚠️ Basic    | ❌ No        | ❌ No       |
| **Optimization**     | ✅ Optional     | ✅ Auto     | ✅ Auto      | ❌ Manual   |
| **Error Handling**   | ✅ Good         | ⚠️ Basic    | ⚠️ Basic     | ⚠️ Basic    |

**Recommendation:**

- Development: `php artisan jibas:setup --fresh` ⭐
- Production Initial: `./setup-database.sh` atau `php artisan jibas:setup --fresh`
- Windows Dev: `setup-database.bat`

---

## 🔄 Workflow Summary

### Development Workflow:

```
1. Edit code/seeders
   ↓
2. Run: php artisan jibas:setup --fresh
   ↓
3. Test features
   ↓
4. Repeat
```

### Production Deployment Workflow:

```
1. Read DEPLOYMENT_CHECKLIST.md
   ↓
2. Backup existing database (if any)
   ↓
3. Upload code to server
   ↓
4. Configure .env
   ↓
5. Run: ./setup-database.sh (initial) or php artisan migrate --force (update)
   ↓
6. Test thoroughly
   ↓
7. Change default passwords!
   ↓
8. Monitor logs
```

---

## 📞 Need Help?

| Question                 | Answer Location                             |
| ------------------------ | ------------------------------------------- |
| "How to setup database?" | SETUP_QUICK_REF.txt                         |
| "Deploy to production?"  | DEPLOYMENT_CHECKLIST.md                     |
| "Detailed explanation?"  | DATABASE_SETUP.md                           |
| "Troubleshooting?"       | DATABASE_SETUP.md + DEPLOYMENT_CHECKLIST.md |
| "Quick command syntax?"  | SETUP_QUICK_REF.txt                         |

---

## 🎯 Best Practices

### DO ✅

- Read documentation before deployment
- Test in staging first
- Backup before any database operation
- Use `--fresh` only in development
- Change default passwords immediately
- Monitor logs after deployment
- Keep documentation updated

### DON'T ❌

- Run migrate:fresh on production with data
- Skip reading DEPLOYMENT_CHECKLIST.md
- Deploy without testing
- Use default passwords in production
- Ignore error logs
- Skip backups

---

**Created:** March 15, 2026
**Version:** 1.0
**Maintained by:** JIBAS Development Team

---

Semua file ini bekerja sama untuk memastikan setup database JIBAS yang mudah, aman, dan reliable di semua environment! 🚀
