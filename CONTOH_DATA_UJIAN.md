# 📋 Contoh Data Ujian - Panduan Penggunaan

Data contoh ujian telah berhasil dibuat pada tanggal: **17 Maret 2026**

## 📊 Data Yang Telah Dibuat

### 1. ✅ Ujian yang Sudah Selesai (ID: #12)

**Judul:** Ulangan Harian Matematika - Aljabar (SELESAI)

**Detail Ujian:**

- **Status:** Selesai
- **Jenis:** Harian
- **Tanggal:** 3 hari yang lalu (14 Maret 2026, 08:00)
- **Durasi:** 60 menit
- **KKM:** 75
- **Bobot:** 100
- **Jumlah Soal:** 10 soal pilihan ganda (masing-masing bobot 10 poin)

**Hasil Siswa:**

- Total siswa yang mengikuti: **2 siswa**
- Nilai rata-rata kelas: **81.5**
- Status: Semua siswa sudah selesai mengerjakan
- Data yang tersedia:
    - ✓ Nilai masing-masing siswa
    - ✓ Jumlah jawaban benar/salah/kosong
    - ✓ Waktu mulai dan selesai
    - ✓ Durasi pengerjaan
    - ✓ Jawaban per soal

**Nilai Siswa:**

1. Siswa 1: 85 (LULUS - di atas KKM)
2. Siswa 2: 78 (LULUS - di atas KKM)

---

### 2. 🔄 Ujian yang Sedang Berlangsung (ID: #13)

**Judul:** Quiz Matematika - Geometri (BERLANGSUNG)

**Detail Ujian:**

- **Status:** Berlangsung
- **Jenis:** Quiz
- **Tanggal:** Hari ini (17 Maret 2026, 10:00)
- **Durasi:** 30 menit
- **KKM:** 70
- **Bobot:** 100
- **Jumlah Soal:** 5 soal pilihan ganda (masing-masing bobot 20 poin)

**Status Siswa:**

- Total siswa terdaftar: **5 siswa**
- Sedang mengerjakan: **3 siswa** (sudah mulai 10-20 menit yang lalu)
- Belum mulai: **2 siswa**

**Catatan:** Ujian masih berlangsung, belum ada nilai final

---

### 3. 📅 Ujian yang Dijadwalkan (ID: #14) - BONUS

**Judul:** UTS Matematika Semester Genap

**Detail Ujian:**

- **Status:** Dijadwalkan
- **Jenis:** UTS
- **Tanggal:** 2 hari lagi (19 Maret 2026, 08:00)
- **Durasi:** 90 menit
- **KKM:** 75
- **Bobot:** 100

---

## 🎯 Cara Mengakses Data

### Untuk Guru:

#### 1. Melihat Hasil Ujian yang Sudah Selesai (#12)

```
1. Login sebagai Guru
2. Buka menu "Ujian" dari sidebar
3. Cari ujian "Ulangan Harian Matematika - Aljabar (SELESAI)" atau ID #12
4. Klik icon HIJAU (clipboard) dengan label "Lihat Hasil Siswa"
5. Anda akan melihat:
   - Informasi lengkap ujian
   - Statistik (total siswa, rata-rata, lulus/tidak lulus)
   - Tabel detail hasil per siswa
   - Nilai, jawaban benar/salah, waktu pengerjaan
```

#### 2. Melihat Ujian yang Sedang Berlangsung (#13)

```
1. Dari menu "Ujian"
2. Cari ujian "Quiz Matematika - Geometri (BERLANGSUNG)" atau ID #13
3. Klik icon HIJAU "Lihat Hasil Siswa"
4. Anda akan melihat:
   - Status real-time siswa
   - 3 siswa sedang mengerjakan
   - 2 siswa belum mulai
   - Nilai masih 0 karena ujian belum selesai
```

#### 3. Melihat Semua Ujian

```
Menu: Ujian → Akan muncul tabel dengan:
- Status badge berwarna untuk setiap ujian
- Filter berdasarkan status
- Aksi untuk setiap ujian (Lihat Hasil, Kelola Soal, Edit, Hapus)
```

---

### Untuk Siswa:

#### 1. Melihat Hasil Ujian yang Sudah Selesai (#12)

```
1. Login sebagai Siswa (yang sudah mengerjakan ujian #12)
2. Buka menu "Ujian Saya" dari sidebar
3. Cari ujian "Ulangan Harian Matematika - Aljabar (SELESAI)"
4. Status akan menunjukkan: "Selesai"
5. Nilai akan terlihat di kartu ujian
6. Klik button "Lihat Hasil" untuk detail lengkap
```

#### 2. Melanjutkan Ujian yang Sedang Berlangsung (#13)

```
1. Buka menu "Ujian Saya"
2. Cari ujian "Quiz Matematika - Geometri (BERLANGSUNG)"
3. Jika sudah mulai: Klik button BIRU "Lanjutkan"
4. Jika belum mulai: Klik button UNGU "Mulai Ujian"
5. Masukkan kode ujian: 13
```

#### 3. Akses Cepat dengan Kode Ujian

```
1. Di halaman "Ujian Saya"
2. Gunakan form "Akses Cepat Ujian"
3. Masukkan kode: 12 (untuk ujian selesai) atau 13 (untuk ujian berlangsung)
4. Klik "Mulai Ujian"
```

---

## 📈 Statistik Data

### Ujian #12 (Selesai):

- Total Siswa: 2
- Selesai: 2 (100%)
- Rata-rata Nilai: 81.5
- Lulus (≥75): 2 siswa (100%)
- Tidak Lulus (<75): 0 siswa (0%)
- Nilai Tertinggi: 85
- Nilai Terendah: 78

### Ujian #13 (Berlangsung):

- Total Siswa: 5
- Sedang Mengerjakan: 3 (60%)
- Belum Mulai: 2 (40%)
- Selesai: 0 (0%)

---

## 🔄 Menjalankan Ulang Seeder

Jika ingin membuat data contoh lagi:

```bash
php artisan db:seed --class=ContohUjianSeeder
```

**Catatan:**

- Seeder akan membuat data baru (tidak menimpa yang lama)
- Pastikan sudah ada data master: guru, kelas, mata pelajaran, siswa, tahun ajaran, semester
- ID ujian akan bertambah setiap kali seeder dijalankan

---

## 🎨 Tampilan di Interface

### Guru - Halaman Hasil Ujian:

- 📊 Card statistik: Total Siswa, Selesai, Rata-rata, Lulus, Tidak Lulus
- 📋 Tabel detail dengan kolom: No, NIS, Nama, Status, Nilai, Benar, Salah, Kosong, Waktu, Durasi
- 🎨 Warna indikator: Hijau (lulus), Merah (tidak lulus), Abu-abu (belum selesai)
- 🔙 Button "Kembali" ke daftar ujian

### Siswa - Halaman Ujian Saya:

- 📝 Card ujian dengan badge status
- 💯 Nilai ditampilkan untuk ujian yang sudah selesai
- 🎯 Button aksi sesuai status: Mulai / Lanjutkan / Lihat Hasil
- ⚡ Form akses cepat dengan input kode ujian

---

## 📞 Support

Jika ada pertanyaan atau kendala:

1. Cek log Laravel: `storage/logs/laravel.log`
2. Cek browser console untuk error JavaScript
3. Refresh browser dengan Ctrl+F5 setelah rebuild assets

---

**Dibuat pada:** 17 Maret 2026, 18:34 WIB
**Status:** ✅ Seeder berhasil dijalankan
**Environment:** Development
