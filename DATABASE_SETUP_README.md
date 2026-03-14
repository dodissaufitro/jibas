# 🗄️ Database Setup - Quick Start

Ada beberapa cara untuk setup database JIBAS. Pilih yang sesuai dengan kebutuhan Anda:

---

## 🚀 Quick Commands

### 1. Artisan Command (Recommended) ⭐

```bash
php artisan jibas:setup --fresh
```

### 2. Bash Script (Linux Server)

```bash
chmod +x setup-database.sh
./setup-database.sh
```

### 3. Batch Script (Windows)

```batch
setup-database.bat
```

### 4. Standard Laravel

```bash
php artisan migrate:fresh --seed
```

---

## 📚 Dokumentasi Lengkap

| File                                                   | Untuk Apa?                                     |
| ------------------------------------------------------ | ---------------------------------------------- |
| **[SETUP_QUICK_REF.txt](SETUP_QUICK_REF.txt)**         | Referensi cepat command & troubleshooting      |
| **[SETUP_FILES_OVERVIEW.md](SETUP_FILES_OVERVIEW.md)** | Overview semua file setup & kapan pakainya     |
| **[DATABASE_SETUP.md](DATABASE_SETUP.md)**             | Panduan lengkap setup development & production |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | Checklist deployment ke server production      |

---

## ⚡ Super Quick Start

### Development (Local):

1. Configure `.env`
2. Run: `php artisan jibas:setup --fresh`
3. Done! Login: `admin@jibas.com` / `password123`

### Production (Server):

1. **Read [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) first!** ⚠️
2. Upload files to server
3. Configure `.env` (production settings)
4. Run: `./setup-database.sh`
5. **Change default passwords immediately!**

---

## 👥 Default Accounts

After setup, you can login with:

- **Super Admin**: `admin@jibas.com` / `password123`
- **Guru (All Classes)**: `guru@jibas.com` / `password123`
- **Guru (Single Class)**: `guru.kelas7a@jibas.com` / `password123`

⚠️ **CHANGE PASSWORDS IN PRODUCTION!**

---

## ⚠️ Important Notes

### Development:

- ✅ Safe to run `migrate:fresh` anytime
- ✅ Data will be reset on each setup

### Production:

- ❌ **NEVER** run `migrate:fresh` (deletes all data!)
- ✅ Use `php artisan migrate --force` for updates
- ✅ Always backup before migration!

---

## 🆘 Need Help?

- Quick reference: [SETUP_QUICK_REF.txt](SETUP_QUICK_REF.txt)
- Troubleshooting: [DATABASE_SETUP.md](DATABASE_SETUP.md#troubleshooting)
- Production issues: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md#troubleshooting-common-issues)

---

Created: March 15, 2026
