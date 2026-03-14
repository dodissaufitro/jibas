# JIBAS Database Setup Guide

Panduan lengkap untuk setup database JIBAS dari awal (fresh installation) atau seeding ulang data.

## 📋 Daftar Isi

1. [Metode Setup Database](#metode-setup-database)
2. [Untuk Development (Local)](#untuk-development-local)
3. [Untuk Production (Server)](#untuk-production-server)
4. [Troubleshooting](#troubleshooting)

---

## 🎯 Metode Setup Database

JIBAS menyediakan 4 metode untuk setup database:

### 1️⃣ Artisan Command (Recommended) ⭐

```bash
# Setup lengkap (fresh migration + seed)
php artisan jibas:setup --fresh

# Hanya seed data (tanpa migration)
php artisan jibas:setup --seed-only

# Setup tanpa cache optimization
php artisan jibas:setup --fresh --no-cache
```

**Kelebihan:**

- ✅ Interactive confirmation
- ✅ Database connection check
- ✅ Progress indicator
- ✅ Summary statistics
- ✅ Flexible options

### 2️⃣ Laravel Standard Command

```bash
# Fresh migration dengan seed
php artisan migrate:fresh --seed

# Atau step by step
php artisan migrate:fresh
php artisan db:seed
```

**Kelebihan:**

- ✅ Native Laravel command
- ✅ Reliable dan tested
- ✅ Simple dan straightforward

### 3️⃣ Bash Script (Linux/Mac Server) 🐧

```bash
# Berikan permission execute
chmod +x setup-database.sh

# Jalankan script
./setup-database.sh
```

**Kelebihan:**

- ✅ One-command setup
- ✅ Includes cache clearing
- ✅ Color-coded output
- ✅ Auto optimization

### 4️⃣ Batch Script (Windows) 🪟

```batch
# Double-click atau run:
setup-database.bat
```

**Kelebihan:**

- ✅ User-friendly untuk Windows
- ✅ No command line needed
- ✅ Automatic error handling

---

## 💻 Untuk Development (Local)

### Setup Pertama Kali

```bash
# 1. Clone repository
git clone <repository-url> jibas
cd jibas

# 2. Install dependencies
composer install
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Generate app key
php artisan key:generate

# 5. Configure database di .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=jibas
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Setup database (pilih salah satu):
php artisan jibas:setup --fresh
# ATAU
php artisan migrate:fresh --seed
# ATAU (Windows)
setup-database.bat

# 7. Build frontend assets
npm run build

# 8. Start development server
php artisan serve
```

### Reset Database (Saat Development)

```bash
# Metode 1: Artisan command
php artisan jibas:setup --fresh

# Metode 2: Manual
php artisan migrate:fresh --seed
```

---

## 🚀 Untuk Production (Server)

### Deployment Pertama Kali

```bash
# 1. Upload files ke server
# 2. Set proper permissions
chmod -R 755 storage bootstrap/cache
chmod +x setup-database.sh

# 3. Configure .env untuk production
# APP_ENV=production
# APP_DEBUG=false
# DB_CONNECTION=mysql
# DB_HOST=localhost
# DB_DATABASE=your_database
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# 4. Install dependencies (production mode)
composer install --no-dev --optimize-autoloader
npm install --production
npm run build

# 5. Setup database
./setup-database.sh
# ATAU
php artisan jibas:setup --fresh

# 6. Set proper permissions (important!)
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Update Production Database

```bash
# Jika hanya perlu migration baru (TIDAK menghapus data)
php artisan migrate --force

# Jika perlu reset database (HAPUS SEMUA DATA)
php artisan jibas:setup --fresh
```

---

## 📊 Data yang Di-seed

Setelah setup, database akan berisi:

### 1. Master Data

- ✅ 4 Institutions (SD, SMP, SMA, SMK)
- ✅ Jenjang (SD, SMP, SMA, SMK)
- ✅ Jurusan (IPA, IPS, dll)
- ✅ Tahun Ajaran
- ✅ 64 Kelas

### 2. Users & Permissions

- ✅ Roles & Permissions lengkap
- ✅ Super Admin Account
- ✅ Guru Accounts (2 guru)
- ✅ Siswa Accounts (sample)

### 3. Academic Data

- ✅ 10 Guru profiles
- ✅ 15 Siswa profiles
- ✅ Guru-Kelas assignments
- ✅ Sample Presensi
- ✅ Sample Ujian

### 4. Financial Data

- ✅ Jenis Pembayaran
- ✅ Sample Tagihan

### 5. Other Data

- ✅ Asrama (dormitory)

---

## 👥 Default Accounts

| Role               | Email                  | Password    | Description  |
| ------------------ | ---------------------- | ----------- | ------------ |
| **Super Admin**    | admin@jibas.com        | password123 | Full access  |
| **Guru (All)**     | guru@jibas.com         | password123 | SMP A access |
| **Guru (1 Class)** | guru.kelas7a@jibas.com | password123 | Single class |

⚠️ **IMPORTANT:** Change passwords on production!

---

## 🔧 Troubleshooting

### Error: "Database connection failed"

```bash
# Check MySQL service
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Test connection
php artisan tinker
>>> DB::connection()->getPdo();
```

### Error: "Class not found"

```bash
# Clear all cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Regenerate autoload
composer dump-autoload
```

### Error: "SQLSTATE[42S01]: Base table or view already exists"

```bash
# Use fresh migration
php artisan migrate:fresh --seed
```

### Error: "Permission denied"

```bash
# Set proper permissions (Linux)
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# For Laragon (Windows) - run as Administrator
```

### Error: "Memory limit exceeded"

```bash
# Increase PHP memory limit in php.ini
memory_limit = 512M

# Or run with increased memory
php -d memory_limit=512M artisan migrate:fresh --seed
```

### Seeder Specific Issues

```bash
# Run specific seeder only
php artisan db:seed --class=InstitutionSeeder

# List all seeders
ls database/seeders/

# Check seeder order in DatabaseSeeder.php
```

---

## 📝 Best Practices

### Development

1. ✅ Use `php artisan migrate:fresh --seed` frequently
2. ✅ Keep seeders updated with real-world data
3. ✅ Test all features after seeding
4. ✅ Commit seed changes to git

### Production

1. ⚠️ **NEVER** run `migrate:fresh` on production (will delete all data!)
2. ✅ Always backup database before migration
3. ✅ Run migrations during maintenance window
4. ✅ Test migrations on staging first
5. ✅ Use `--force` flag on production

### Backup Before Setup

```bash
# MySQL backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore if needed
mysql -u username -p database_name < backup_20260315_120000.sql
```

---

## 🔄 Urutan Seeder (Automated)

DatabaseSeeder akan menjalankan dalam urutan:

1. InstitutionSeeder (Institutions)
2. PermissionSeeder (Roles & Permissions)
3. MasterDataSeeder (Jenjang, Jurusan, dll)
4. AkademikDataSeeder (Tahun Ajaran, Kelas)
5. UserSeeder (Users with roles)
6. GuruSeeder (Guru profiles)
7. SiswaSeeder (Siswa profiles)
8. GuruKelasSeeder (Assign guru to classes)
9. AsramaSeeder (Dormitory data)
10. JenisPembayaranSeeder (Payment types)
11. TagihanSeeder (Bills)
12. PresensiSiswaSeeder (Attendance samples)
13. UjianSeeder (Exam samples)

---

## 📞 Support

Jika mengalami masalah:

1. Cek error message dengan teliti
2. Baca log: `storage/logs/laravel.log`
3. Periksa konfigurasi `.env`
4. Lihat troubleshooting section di atas

---

Happy Coding! 🚀
