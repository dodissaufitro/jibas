# 🎓 Quick Guide - Guru Melihat Hasil Ujian

## 📋 Ringkasan Data yang Tersedia

| Ujian ID | Judul                               | Status         | Siswa   | Nilai Rata-rata |
| -------- | ----------------------------------- | -------------- | ------- | --------------- |
| **#12**  | Ulangan Harian Matematika - Aljabar | ✅ Selesai     | 2 siswa | 81.5            |
| **#13**  | Quiz Matematika - Geometri          | 🔄 Berlangsung | 5 siswa | -               |
| **#14**  | UTS Matematika Semester Genap       | 📅 Dijadwalkan | -       | -               |

---

## 🚀 Panduan Cepat untuk Guru

### 1️⃣ Melihat Hasil Ujian yang Sudah Selesai

**Step-by-Step:**

```
┌─────────────────────────────────────────────────────┐
│  1. Login sebagai Guru/Admin                        │
│  2. Klik menu "Ujian" di sidebar                    │
│  3. Lihat tabel daftar ujian                        │
│  4. Cari baris dengan:                              │
│     - ID: #12                                       │
│     - Judul: "...Aljabar (SELESAI)"                │
│     - Status: Badge hijau "selesai"                 │
│  5. Di kolom "Aksi", klik icon HIJAU (clipboard)   │
│     Tooltip: "Lihat Hasil Siswa"                    │
└─────────────────────────────────────────────────────┘
```

**Yang Akan Anda Lihat:**

✅ **Header Ujian**

- Kode Ujian: #12
- Judul: Ulangan Harian Matematika - Aljabar (SELESAI)
- Mata Pelajaran: Matematika
- Kelas: (sesuai data Anda)
- KKM: 75
- Durasi: 60 menit

📊 **Statistik Cards (5 Cards)**

- Total Siswa: 2
- Selesai: 2
- Rata-rata: 81.5
- Lulus: 2
- Tidak Lulus: 0

📋 **Tabel Detail Siswa**
| No | NIS | Nama Siswa | Status | Nilai | Benar | Salah | Kosong | Waktu Mulai | Waktu Selesai | Durasi |
|----|-----|------------|--------|-------|-------|-------|--------|-------------|---------------|--------|
| 1 | ... | Siswa 1 | ✅ Selesai | **85** | 8/10 | 2/10 | 0/10 | 14 Mar 08:00 | 14 Mar 08:50 | 50 menit |
| 2 | ... | Siswa 2 | ✅ Selesai | **78** | 7/10 | 3/10 | 0/10 | 14 Mar 08:02 | 14 Mar 08:55 | 53 menit |

**Warna Nilai:**

- 🟢 **Hijau Bold** = Lulus (≥ KKM)
- 🔴 **Merah Bold** = Tidak Lulus (< KKM)

---

### 2️⃣ Melihat Ujian yang Sedang Berlangsung

**Step-by-Step:**

```
┌─────────────────────────────────────────────────────┐
│  1. Dari menu "Ujian"                               │
│  2. Cari ujian dengan:                              │
│     - ID: #13                                       │
│     - Judul: "...Geometri (BERLANGSUNG)"           │
│     - Status: Badge biru "berlangsung"              │
│  3. Klik icon HIJAU "Lihat Hasil Siswa"            │
└─────────────────────────────────────────────────────┘
```

**Yang Akan Anda Lihat:**

✅ **Header Ujian**

- Kode Ujian: #13
- Judul: Quiz Matematika - Geometri (BERLANGSUNG)
- Status: 🔄 Berlangsung
- KKM: 70
- Durasi: 30 menit

📊 **Statistik Cards**

- Total Siswa: 5
- Selesai: 0
- Sedang Mengerjakan: 3
- Belum Mulai: 2

📋 **Tabel Detail Siswa**
| No | NIS | Nama Siswa | Status | Nilai | Benar | Salah | Waktu Mulai | Waktu Selesai | Durasi |
|----|-----|------------|--------|-------|-------|-------|-------------|---------------|--------|
| 1 | ... | Siswa 1 | 🔄 Sedang Mengerjakan | 0 | 0 | 0 | 17 Mar 10:12 | - | - |
| 2 | ... | Siswa 2 | 🔄 Sedang Mengerjakan | 0 | 0 | 0 | 17 Mar 10:15 | - | - |
| 3 | ... | Siswa 3 | 🔄 Sedang Mengerjakan | 0 | 0 | 0 | 17 Mar 10:18 | - | - |
| 4 | ... | Siswa 4 | ⏸️ Belum Mulai | 0 | 0 | 0 | - | - | - |
| 5 | ... | Siswa 5 | ⏸️ Belum Mulai | 0 | 0 | 0 | - | - | - |

**Catatan:** Nilai akan muncul setelah siswa selesai mengerjakan dan submit ujian.

---

## 🎨 Visual Guide - Icon di Tabel Ujian

Pada kolom **Aksi** di halaman Ujian, Anda akan melihat:

```
┌─────────────────────────────────────────────────────────┐
│  🟢 Icon Hijau (Clipboard) → Lihat Hasil Siswa         │
│  🟣 Icon Ungu (Document)   → Kelola Soal                │
│  🔵 Icon Biru (Edit)       → Edit Ujian                 │
│  🔴 Icon Merah (Trash)     → Hapus Ujian                │
└─────────────────────────────────────────────────────────┘
```

**Yang Anda Butuhkan:** Klik **Icon Hijau** untuk melihat hasil siswa!

---

## 📱 Akses dari Menu Lain

### Cara Alternatif 1: Dari Dashboard

```
Dashboard → Widget "Ujian Terbaru" → Klik ujian → Lihat Hasil Siswa
```

### Cara Alternatif 2: URL Langsung

```
Buka browser: http://localhost/jibas/ujian/12/hasil-siswa
Atau: http://localhost/jibas/ujian/13/hasil-siswa
```

_(Ganti localhost sesuai domain Anda)_

---

## 🔍 Tips & Trik

### 💡 Tip 1: Filter Ujian

- Gunakan search box untuk mencari ujian spesifik
- Ketik: "Aljabar" atau "Geometri" atau "#12"

### 💡 Tip 2: Sortir Nilai

- Tabel sudah otomatis diurutkan dari nilai tertinggi ke terendah
- Siswa terbaik akan muncul di atas

### 💡 Tip 3: Export Data (Coming Soon)

- Fitur export ke Excel/PDF akan segera tersedia
- Untuk sekarang, bisa screenshot atau copy table

### 💡 Tip 4: Real-time Update

- Untuk ujian yang sedang berlangsung, refresh halaman untuk update terbaru
- Tekan **F5** atau **Ctrl+R**

---

## 🎯 Checklist untuk Guru

Pastikan Anda sudah:

- [ ] Login sebagai user dengan role **Guru** atau **Admin**
- [ ] Memiliki permission **view_ujian**
- [ ] Browser sudah di-refresh (Ctrl+F5) setelah build
- [ ] Seeder sudah dijalankan: `php artisan db:seed --class=ContohUjianSeeder`

---

## ❓ FAQ

**Q: Kenapa saya tidak melihat button "Lihat Hasil Siswa"?**

- A: Pastikan Anda login sebagai Guru/Admin dengan permission `view_ujian`

**Q: Nilai siswa masih 0 semua?**

- A: Cek status ujian. Jika masih "berlangsung" atau "belum_mulai", nilai belum final.

**Q: Data tidak muncul?**

- A: Pastikan seeder sudah dijalankan dan tidak ada error.

**Q: Halaman blank/putih?**

- A: Hard refresh browser (Ctrl+Shift+R) dan cek console browser (F12).

**Q: Bagaimana cara melihat detail jawaban siswa per soal?**

- A: Fitur detail pembahasan akan tersedia di update berikutnya.

---

## 🆘 Troubleshooting

### Problem: Icon tidak muncul

**Solution:**

```bash
npm run build
# Refresh browser dengan Ctrl+F5
```

### Problem: Error 404 Not Found

**Solution:**

- Cek route: `php artisan route:list | grep hasil-siswa`
- Pastikan route terdaftar: `ujian.hasil-siswa`

### Problem: Data kosong

**Solution:**

```bash
# Jalankan seeder lagi
php artisan db:seed --class=ContohUjianSeeder
```

---

## 📞 Support

Jika masih ada kendala:

1. Cek log: `storage/logs/laravel.log`
2. Cek browser console (F12 → Console tab)
3. Screenshot error dan laporkan

---

**Last Updated:** 17 Maret 2026, 18:34 WIB
**Version:** 1.0
**Status:** ✅ Production Ready
