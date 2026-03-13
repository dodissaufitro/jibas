# 🎯 Cara Menggunakan Sistem Multi-Institusi

## 📖 Overview

Sistem ini sekarang mendukung **multi-institusi** dimana:

- ✅ Setiap user dapat memiliki institusi sendiri
- ✅ Data tersimpan di **database** (bukan localStorage)
- ✅ Beberapa user dapat berbagi institusi yang sama
- ✅ Perubahan langsung tersinkronisasi antar user

---

## 🚀 Quick Start

### 1️⃣ Login ke Sistem

Gunakan kredensial yang sudah ada atau buat user baru.

### 2️⃣ Konfigurasi Institusi (Pertama Kali)

1. Klik menu **"Pengaturan"** di sidebar
2. Pilih **Jenis Institusi**:
    - 🕌 Pondok Pesantren / Yayasan
    - 🏫 Sekolah Umum
    - 📚 Madrasah

3. Pilih **Tingkat Pendidikan**:
    - Pesantren/Madrasah: RA, MI, MTs, MA
    - Sekolah Umum: TK, SD, SMP, SMA, SMK

4. Isi **Detail Institusi**:
    - Nama institusi (wajib)
    - Alamat
    - Telepon
    - Email
    - Website
    - NPSN & NSS
    - Visi & Misi

5. Klik **"💾 Simpan Pengaturan"**

### 3️⃣ Lihat Hasil

- **Sidebar** akan menampilkan nama institusi Anda
- **Dashboard** tidak lagi menampilkan banner peringatan
- Data tersimpan dan akan muncul setiap kali login

---

## 👥 Skenario Penggunaan

### Skenario A: Institusi Terpisah

**Kasus**: Setiap user adalah institusi berbeda

```
User A → Login → Setup "Pondok Pesantren Al-Hikmah"
User B → Login → Setup "SMA Negeri 1 Jakarta"
User C → Login → Setup "MTsN Bandung"
```

✅ Setiap user memiliki data dan pengaturan sendiri-sendiri

---

### Skenario B: Institusi Bersama

**Kasus**: Tim dari institusi yang sama

```
Admin  → Setup "Pondok Pesantren Al-Hikmah"
Staff1 → Belum setup, perlu di-share access
Staff2 → Belum setup, perlu di-share access
```

**Cara Share Access**:

```bash
# Via Tinker (temporary)
php artisan tinker

# Assign institution_id ke user lain
User::where('email', 'staff1@example.com')->update(['institution_id' => 1]);
User::where('email', 'staff2@example.com')->update(['institution_id' => 1]);
```

Atau bisa request via API:

```javascript
POST /api/institution/share-access
{
    "user_emails": ["staff1@example.com", "staff2@example.com"]
}
```

✅ Semua staff akan melihat data institusi yang sama

---

## 🔐 Testing Multi-User

### Test 1: User Berbeda, Institusi Berbeda

1. **Browser 1** (Chrome):
    - Login sebagai `admin@eponpes.id`
    - Setup "Pondok Pesantren ABC"
    - Lihat sidebar menampilkan "Pondok Pesantren ABC"

2. **Browser 2** (Firefox/Incognito):
    - Login sebagai `user@eponpes.id`
    - Setup "SMA XYZ"
    - Lihat sidebar menampilkan "SMA XYZ"

✅ **Result**: Dua institusi berbeda dengan data terpisah

---

### Test 2: User Berbeda, Institusi Sama

1. **Setup awal** (Browser 1):
    - Login sebagai `admin@eponpes.id`
    - Setup "Pondok Pesantren Al-Hikmah"
    - Ingat institution_id (misal: ID = 5)

2. **Assign user kedua** (Terminal):

    ```bash
    php artisan tinker
    User::where('email', 'user@eponpes.id')->update(['institution_id' => 5]);
    exit
    ```

3. **Test** (Browser 2):
    - Login sebagai `user@eponpes.id`
    - Langsung lihat data "Pondok Pesantren Al-Hikmah"
    - Update data institusi
4. **Verifikasi** (Browser 1):
    - Refresh halaman Settings
    - Perubahan dari user kedua terlihat!

✅ **Result**: Shared institution dengan data tersinkronisasi

---

## 🛠️ Troubleshooting

### ❌ Institusi tidak tersimpan

**Solusi**:

```bash
# Clear cache
php artisan config:clear
php artisan cache:clear

# Cek route API
php artisan route:list | grep institution

# Restart Vite
npm run dev
```

### ❌ Data hilang setelah logout

**Cek**: Apakah Anda sudah migrate database?

```bash
php artisan migrate:status
```

Jika belum:

```bash
php artisan migrate
```

### ❌ Error "institution_id column not found"

**Solusi**: Migration belum jalan

```bash
php artisan migrate
```

---

## 📊 Database Query Berguna

### Cek institusi yang ada:

```sql
SELECT * FROM institutions;
```

### Cek user dan institution_id mereka:

```sql
SELECT id, name, email, institution_id FROM users;
```

### Assign user ke institusi:

```bash
php artisan tinker
User::find(1)->update(['institution_id' => 2]);
```

### Lihat semua user di satu institusi:

```bash
php artisan tinker
Institution::find(1)->users;
```

---

## 🎨 Fitur Sidebar & Dashboard

### Sidebar

- Menampilkan **nama institusi**
- Menampilkan **tingkat pendidikan** (RA, MI, SMA, dll)
- Logo institusi (huruf pertama nama)

### Dashboard

- **Banner kuning** jika belum setup institusi
- Tombol langsung ke halaman Pengaturan
- Banner hilang setelah konfigurasi selesai

---

## 📝 Catatan Penting

⚠️ **Breaking Change dari localStorage**:

- Sistem lama: Data di browser (hilang saat clear cache)
- Sistem baru: Data di database (persisten)
- User perlu **setup ulang** institusi mereka

✅ **Keuntungan sistem baru**:

- Data tidak hilang saat logout
- Multi-device support
- Team collaboration (shared institution)
- Centralized data management

---

## 🎯 Next Steps (Opsional)

Fitur tambahan yang bisa dikembangkan:

1. ✨ Upload logo institusi
2. 🔐 Role management (admin vs staff)
3. 📊 Dashboard analytics per institusi
4. 🏢 Multi-branch support
5. 📧 Invitation system (email invite)

---

**Selamat menggunakan! 🎉**

Jika ada pertanyaan atau issue, cek file `INSTITUTION_SETUP.md` untuk detail teknis.
