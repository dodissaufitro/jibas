# 🚀 JIBAS - Quick Database Setup

## One-Command Setup

```bash
# Windows
setup-fresh.bat

# Linux/Mac
./setup-fresh.sh

# Manual
php artisan migrate:fresh --seed
```

---

## 👤 Default Logins

| Role            | Email                   | Password    |
| --------------- | ----------------------- | ----------- |
| **Super Admin** | admin@jibas.com         | password123 |
| **Admin**       | admin.sekolah@jibas.com | password123 |
| **Guru**        | guru@jibas.com          | password123 |
| **Siswa**       | siswa@jibas.com         | password123 |
| **Orang Tua**   | orangtua@jibas.com      | password123 |

---

## 📋 Common Commands

```bash
# Fresh migration + seed
php artisan migrate:fresh --seed

# Migration only
php artisan migrate

# Seed only
php artisan db:seed

# Specific seeder
php artisan db:seed --class=InstitutionSeeder

# Check migration status
php artisan migrate:status

# Rollback
php artisan migrate:rollback

# Reset database
php artisan db:wipe
```

---

## 🏫 Seeded Institutions

1. Pondok Pesantren Al-Hikmah (MA)
2. SMA Negeri 1 Jakarta (SMA)
3. MTsN 1 Bandung (MTs)
4. SMP A (SMP)

---

## 🔧 Troubleshooting

```bash
# Class not found
composer dump-autoload

# Foreign key error
php artisan migrate:fresh --seed

# Check data
php artisan tinker
>>> User::count()
>>> Institution::count()
```

---

## 📊 Expected Data After Seeding

- Institutions: 4
- Users: 5+
- Roles: 6+
- Permissions: 50+
- Guru: 10+
- Siswa: 20+
- Ujian: 5+
- Soal: 45+

---

**📚 Full docs:** DATABASE_SEEDING_GUIDE.md
