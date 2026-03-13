# Dokumentasi Pengaturan Institusi

## 🎯 Fitur

Sistem pengaturan institusi berbasis database yang memungkinkan setiap user memiliki institusi dan pengaturan masing-masing. Sistem ini mendukung:

- **Multi-institusi**: Setiap user dapat memiliki institusi berbeda
- **Shared access**: Beberapa user dapat mengakses institusi yang sama
- **Persistent data**: Data tersimpan di database, bukan localStorage
- **Real-time sync**: Perubahan langsung tersinkronisasi

## 📋 Yang Sudah Dibuat

### 1. Database

- **Migration**: `2024_03_13_000010_create_institutions_table.php`
    - Tabel `institutions` untuk menyimpan data institusi
    - Kolom `institution_id` di tabel `users` (foreign key)

### 2. Backend

- **Model**: `Institution.php` - Model untuk tabel institutions
- **Controller**: `InstitutionController.php` - Handle API requests
    - `GET /api/institution/settings` - Ambil settings user
    - `POST /api/institution/settings` - Simpan/update settings
    - `POST /api/institution/share-access` - Share access ke user lain

### 3. Frontend

- **Context**: `SettingsContext.tsx` - Global state management dengan API
- **Page**: `Settings.tsx` - Halaman pengaturan dengan async handling
- **Integration**: Terintegrasi dengan SidebarLayout dan Dashboard

## 🚀 Cara Install

### 1. Jalankan Migration

```bash
php artisan migrate
```

### 2. Restart Development Server

Terminal 1 (Backend):

```bash
php artisan serve
```

Terminal 2 (Frontend - jika belum running):

```bash
npm run dev
```

## 📖 Cara Penggunaan

### Untuk User Pertama Kali

1. Login ke sistem
2. Klik menu **"Pengaturan"** di sidebar
3. Pilih **Jenis Institusi** (Pesantren/Umum/Madrasah)
4. Pilih **Tingkat Pendidikan** (RA/MI/MTs/MA atau TK/SD/SMP/SMA)
5. Isi **Detail Institusi**
6. Klik **"Simpan Pengaturan"**

### Untuk Berbagi Akses (Optional)

Jika ingin memberi akses institusi yang sama ke user lain:

```javascript
// Contoh API call
POST /api/institution/share-access
{
    "user_emails": ["user1@example.com", "user2@example.com"]
}
```

## 🔐 Logika Sistem

### Skenario 1: User Baru

- User belum punya `institution_id`
- Saat save settings → Buat institution baru
- Assign `institution_id` ke user

### Skenario 2: User Sudah Ada Institusi

- User sudah punya `institution_id`
- Saat save settings → Update data institution yang ada
- Tidak membuat institution baru

### Skenario 3: Multiple Users, Same Institution

- Admin share access ke user lain
- Multiple users dapat `institution_id` yang sama
- Semua user lihat data institusi yang sama
- Update dari satu user terlihat oleh user lain

## 📊 Struktur Database

```sql
-- Tabel institutions
CREATE TABLE institutions (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    type ENUM('pesantren', 'umum', 'madrasah'),
    education_level VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    logo VARCHAR(255),
    website VARCHAR(255),
    npsn VARCHAR(20),
    nss VARCHAR(20),
    vision TEXT,
    mission TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Relasi di tabel users
ALTER TABLE users ADD COLUMN institution_id BIGINT;
ALTER TABLE users ADD FOREIGN KEY (institution_id) REFERENCES institutions(id);
```

## 🎨 Flow Data

```
User Login
    ↓
SettingsContext Load (GET /api/institution/settings)
    ↓
    ├─→ institution_id = null → Show "Belum dikonfigurasi"
    └─→ institution_id exists → Load & Display Data
    ↓
User Update Settings (POST /api/institution/settings)
    ↓
    ├─→ No institution → Create new + Assign to user
    └─→ Has institution → Update existing
    ↓
Context Refresh
    ↓
UI Update (Sidebar, Dashboard)
```

## 🔧 Troubleshooting

### Error: "Table institutions doesn't exist"

**Solusi**: Jalankan migration

```bash
php artisan migrate
```

### Error: "Column institution_id not found in users table"

**Solusi**: Rollback dan migrate ulang

```bash
php artisan migrate:fresh --seed
```

### Settings tidak tersimpan

**Solusi**:

1. Cek console browser untuk error
2. Pastikan route API sudah terdaftar: `php artisan route:list | grep institution`
3. Clear cache: `php artisan config:clear && php artisan cache:clear`

## 📝 Catatan Penting

⚠️ **Breaking Change**:

- Sistem berubah dari localStorage ke database
- Data settings lama di localStorage tidak akan ter-migrate otomatis
- User perlu setup ulang institusi mereka

✅ **Best Practice**:

- Backup database sebelum migrate
- Test di environment development dulu
- Seeder harus update untuk include institution_id

## 🎯 Next Steps (Optional Enhancements)

1. **Role-based Access**: Super admin vs staff institusi
2. **Logo Upload**: Upload dan manage logo institusi
3. **Institution Profile Page**: Public profile institusi
4. **Multi-branch**: Satu institusi dengan beberapa cabang
5. **Audit Log**: Track perubahan settings

---

Dibuat: 13 Maret 2026
