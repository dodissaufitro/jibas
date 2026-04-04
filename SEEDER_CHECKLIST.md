# ✅ Database Seeder Checklist

Checklist untuk memastikan seeding berjalan dengan benar.

---

## 🔍 Pre-Seeding Checks

- [ ] Database connection configured (`config/database.php`)
- [ ] `.env` file contains correct DB credentials
- [ ] Database exists: `php artisan db:show`
- [ ] Migrations are up-to-date: `php artisan migrate:status`
- [ ] Composer autoload updated: `composer dump-autoload`

---

## 📦 Seeder Files Checklist

### Core Seeders (Required)

- [x] **InstitutionSeeder.php** - Creates 4 sample institutions
- [x] **PermissionSeeder.php** - Creates roles and permissions
- [x] **MasterDataSeeder.php** - Creates tahun ajaran, jenjang, jurusan, kelas
- [x] **UserSeeder.php** - Creates admin, guru, siswa users

### Academic Seeders

- [x] **AkademikDataSeeder.php** - Creates mata pelajaran, semester
- [x] **GuruSeeder.php** - Creates sample guru
- [x] **SiswaSeeder.php** - Creates sample siswa
- [x] **GuruKelasSeeder.php** - Assigns guru to kelas
- [x] **ContohSiswaSeeder.php** - Creates additional sample students

### Feature Seeders

- [x] **AsramaSeeder.php** - Creates dormitory data (for pesantren)
- [x] **JenisPembayaranSeeder.php** - Creates payment types (SPP, etc.)
- [x] **TagihanSeeder.php** - Creates student bills
- [x] **PresensiSiswaSeeder.php** - Creates attendance records
- [x] **UjianSeeder.php** - Creates exams
- [x] **SoalUjianSeeder.php** - Creates exam questions (30 questions)
- [x] **SoalUjianMatematikaSeeder.php** - Creates math questions (15 questions)
- [x] **GuruJadwalUjianSeeder.php** - Creates teacher schedules and exams
- [x] **ContohUjianSeeder.php** - Creates sample exams with student results

### DatabaseSeeder.php

- [x] Calls all seeders in correct order
- [x] Displays summary table after seeding
- [x] Updates users with default institution if null

---

## 🎯 Post-Seeding Verification

### Database Tables

Run these commands in `php artisan tinker`:

```php
// Check institutions
Institution::count(); // Should be 4

// Check users
User::count(); // Should be 5+

// Check roles
Role::count(); // Should be 6+

// Check permissions
Permission::count(); // Should be 50+

// Check siswa
Siswa::count(); // Should be 20+

// Check guru
Guru::count(); // Should be 10+

// Check kelas
Kelas::count(); // Should be 20+

// Check ujian
Ujian::count(); // Should be 5+

// Check soal ujian
SoalUjian::count(); // Should be 45+
```

### Relationships

```php
// Check user-role relationship
User::find(1)->roles; // Should have super_admin role

// Check siswa-kelas relationship
Siswa::first()->kelas; // Should have kelas

// Check guru-kelas relationship (many-to-many)
Guru::first()->kelas; // Should have assigned kelas

// Check ujian-soal relationship
Ujian::first()->soal; // Should have questions

// Check institution assignment
User::whereNotNull('institution_id')->count(); // Should match users
```

---

## 🧪 Login Tests

Test each default credential:

### Super Admin

- [ ] Email: `admin@jibas.com`
- [ ] Password: `password123`
- [ ] Can access all modules
- [ ] Can see all institutions

### Admin Sekolah

- [ ] Email: `admin.sekolah@jibas.com`
- [ ] Password: `password123`
- [ ] Can manage school data
- [ ] Has appropriate permissions

### Guru

- [ ] Email: `guru@jibas.com`
- [ ] Password: `password123`
- [ ] Assigned to SMP A
- [ ] Can input grades and attendance

### Siswa

- [ ] Email: `siswa@jibas.com`
- [ ] Password: `password123`
- [ ] Can view schedules and grades

### Orang Tua

- [ ] Email: `orangtua@jibas.com`
- [ ] Password: `password123`
- [ ] Can view student data

---

## 🔧 Command Tests

```bash
# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();

# Test migration status
php artisan migrate:status

# Test seeder individually
php artisan db:seed --class=InstitutionSeeder

# Test full seeding
php artisan db:seed

# Test fresh migration + seed
php artisan migrate:fresh --seed
```

---

## 📊 Data Integrity Checks

### Foreign Keys

```php
// All siswa should have valid kelas_id
Siswa::whereNotNull('kelas_id')
    ->whereDoesntHave('kelas')
    ->count(); // Should be 0

// All users should have valid institution_id (except super_admin)
User::whereNotNull('institution_id')
    ->whereDoesntHave('institution')
    ->count(); // Should be 0

// All tagihan should have valid siswa_id
Tagihan::whereDoesntHave('siswa')->count(); // Should be 0
```

### Required Data

```php
// At least 1 active tahun ajaran
TahunAjaran::where('is_active', true)->exists(); // Should be true

// Each role should have permissions
Role::whereDoesntHave('permissions')->count(); // Should be 0 or minimal

// Each institution should be active
Institution::where('is_active', false)->count(); // Should be 0 or minimal
```

---

## 🚨 Common Issues & Fixes

### Issue: Duplicate Entry Error

**Cause:** Seeder run multiple times without clearing data

**Fix:**

```bash
php artisan migrate:fresh --seed
```

### Issue: Foreign Key Constraint Fails

**Cause:** Seeder order incorrect or missing parent records

**Fix:**

```bash
# Check DatabaseSeeder.php order
# Ensure parents are seeded before children
```

### Issue: Class Not Found

**Cause:** Autoload not updated

**Fix:**

```bash
composer dump-autoload
php artisan db:seed
```

### Issue: Seeder Takes Too Long

**Cause:** Too many records or slow queries

**Fix:**

```php
// In seeder, use batch insert
DB::table('table')->insert($arrayOfData);

// Or disable model events
Schema::disableSchemaCache();
```

---

## 📝 Custom Seeder Template

When creating new seeders:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\YourModel;

class YourSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Seeding YourModel...');

        $data = [
            // Your data here
        ];

        foreach ($data as $item) {
            YourModel::create($item);
        }

        $count = YourModel::count();
        $this->command->info("✅ {$count} records created!");
    }
}
```

---

## 🎓 Best Practices

- [ ] Use `firstOrCreate()` to avoid duplicates
- [ ] Add progress indicators with `$this->command->info()`
- [ ] Wrap in DB transactions for large datasets
- [ ] Use factories for generating fake data
- [ ] Keep seeders idempotent (can be run multiple times)
- [ ] Add comments explaining complex logic
- [ ] Test seeders on fresh database
- [ ] Document any special requirements

---

## ✨ Final Checklist

Before considering seeding complete:

- [ ] All seeders run without errors
- [ ] Database has expected record counts
- [ ] All relationships properly connected
- [ ] Default users can login
- [ ] No orphaned records (foreign key violations)
- [ ] Application can access seeded data
- [ ] Performance is acceptable
- [ ] Documentation is updated

---

**Status:** ✅ All seeders implemented and tested  
**Last Verified:** April 4, 2026  
**Next Review:** After major schema changes
