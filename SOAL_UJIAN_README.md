# 📚 SOAL UJIAN MATEMATIKA KELAS 7

## ✅ Status Seeder

**BERHASIL DIBUAT!**

### Informasi Ujian:

- **ID Ujian**: 5
- **Judul**: Ujian Matematika - Bilangan Bulat dan Pecahan
- **Mata Pelajaran**: Matematika
- **Kelas**: VII-A (Kelas ID: 1)
- **Jumlah Soal**: 30 soal pilihan ganda (A, B, C, D)
- **Status**: berlangsung (aktif)
- **Tanggal**: 2026-03-17 08:00:00
- **Durasi**: 90 menit
- **KKM**: 75
- **Jenis**: UTS (Ujian Tengah Semester)

---

## 📝 Distribusi Soal

### Tingkat Kesulitan:

1. **Mudah (Soal 1-10)**: 10 soal @ 3 poin
    - Operasi bilangan bulat dasar
    - Pecahan sederhana
    - Pembagian dan perkalian

2. **Sedang (Soal 11-20)**: 10 soal @ 3.5 poin
    - Operasi campuran bilangan bulat
    - Pecahan campuran
    - Persentase dan diskon
    - Aljabar sederhana

3. **Sulit (Soal 21-30)**: 10 soal @ 4 poin
    - Pangkat dan akar
    - Operasi kompleks
    - FPB dan KPK
    - Himpunan bilangan prima

---

## 🎯 Materi yang Dicakup (Kurikulum Merdeka)

### 1. Bilangan Bulat

- Operasi penjumlahan dan pengurangan bilangan negatif
- Perkalian bilangan negatif
- Pembagian bilangan negatif
- Operasi campuran

### 2. Pecahan

- Konversi desimal ke pecahan
- Penjumlahan dan pengurangan pecahan
- Perkalian pecahan
- Pembagian pecahan
- Pecahan campuran

### 3. Persentase & Aplikasi

- Konversi pecahan ke persen
- Perhitungan diskon
- Persentase dari total

### 4. Aljabar Dasar

- Variabel dan substitusi
- Persamaan linear sederhana

### 5. Bilangan Berpangkat

- Pangkat dua dan tiga
- Akar kuadrat

### 6. Teori Bilangan

- FPB (Faktor Persekutuan Terbesar)
- KPK (Kelipatan Persekutuan Terkecil)
- Bilangan prima
- Himpunan

---

## 🧪 Cara Testing Ujian

### 1. Login sebagai Siswa

```
Email: siswa@jibas.com
Password: password123
```

**PENTING**: Pastikan user siswa ini memiliki kelas_id = 1 (VII-A)

**⚠️ VERIFIKASI DATA SISWA TERLEBIH DAHULU:**

```bash
# Cek apakah siswa@jibas.com punya record Siswa
php artisan tinker
>>> $user = App\Models\User::where('email', 'siswa@jibas.com')->first();
>>> $siswa = App\Models\Siswa::where('user_id', $user->id)->first();
>>>
>>> if ($siswa) {
...     echo "✓ Siswa: {$siswa->nama_lengkap}\n";
...     echo "✓ Kelas ID: {$siswa->kelas_id}\n";
...     echo "✓ Kelas: {$siswa->kelas->nama}\n";
... } else {
...     echo "✗ SISWA TIDAK DITEMUKAN - HARUS DIBUAT!\n";
... }
```

**Jika siswa tidak ada, buat dengan:**

```bash
>>> $user = App\Models\User::where('email', 'siswa@jibas.com')->first();
>>> App\Models\Siswa::create([
...     'user_id' => $user->id,
...     'kelas_id' => 1,
...     'nama_lengkap' => 'Siswa Test Ujian',
...     'nisn' => '1234567890',
...     'jenis_kelamin' => 'L',
...     'tanggal_lahir' => '2010-01-01',
...     'status' => 'aktif',
... ]);
>>> echo "✓ Siswa berhasil dibuat!\n";
```

### 2. Akses Ujian

Setelah login, siswa akan diarahkan ke:

- **URL**: `http://127.0.0.1:8000/siswa/exam/dashboard`
- **View**: ExamDashboard (full-screen)

### 3. Lihat Ujian yang Tersedia

Di ExamDashboard, akan muncul:

- Stats card: Total Ujian, Belum Dikerjakan, dll
- Grid ujian aktif dengan card "Ujian Matematika - Bilangan Bulat dan Pecahan"
- Badge status: "berlangsung" (hijau)
- Button: **"Mulai Ujian"**

### 4. Mulai Ujian

Klik "Mulai Ujian" → redirect ke:

- **Route**: `siswa.ujian.mulai` → `siswa.ujian.kerjakan`
- **View**: `Siswa/Ujian/Kerjakan.tsx` (CAT interface)

**Proses Backend:**

1. `UjianSiswaController@mulai($ujianId)` - Buat record UjianSiswa
2. Validasi: Cek kelas siswa sesuai dengan kelas ujian
3. Auto-create/update status menjadi 'sedang_mengerjakan'
4. Redirect ke `siswa.ujian.kerjakan` dengan `ujian_siswa_id`

**Load Soal:**

```php
// Di UjianSiswaController@kerjakan
$soal = SoalUjian::where('ujian_id', $ujianSiswa->ujian_id)
    ->where('tipe_soal', 'pilihan_ganda')
    ->orderBy('nomor_soal')
    ->get();
```

- ✅ Soal diload berdasarkan `ujian_id` dari ujian yang diklik
- ✅ Mata pelajaran Matematika → soal Matematika
- ✅ 30 soal untuk ujian ID 5 (Matematika Kelas VII-A)

### 5. Mengerjakan Soal

- Tampil 1 soal per halaman
- Pilihan jawaban: A, B, C, D
- Timer countdown: 90 menit
- Progress bar: X/30 soal
- Auto-save jawaban saat pilih opsi
- Button "Soal Selanjutnya"
- Button "Submit Ujian" di soal terakhir

### 6. Submit Ujian

- Klik "Submit Ujian"
- Sistem auto-hitung nilai
- Redirect ke halaman hasil
- Tampil: Nilai akhir, status lulus/tidak lulus

---

## 🔧 Troubleshooting

### Problem: Ujian tidak muncul di dashboard siswa

**Penyebab:**

1. Siswa tidak memiliki kelas_id yang sesuai
2. Status ujian bukan 'berlangsung' atau 'dijadwalkan'
3. Tanggal ujian belum tiba

**Solusi:**

```bash
# Cek siswa kelas
php artisan tinker
>>> $user = App\Models\User::where('email', 'siswa@jibas.com')->first();
>>> $siswa = App\Models\Siswa::where('user_id', $user->id)->first();
>>> $siswa->kelas_id; // Harus = 1 (VII-A)

# Update kelas siswa jika perlu
>>> $siswa->update(['kelas_id' => 1]);

# Atau buat siswa baru untuk kelas VII-A
>>> $siswa = App\Models\Siswa::create([
    'user_id' => $user->id,
    'kelas_id' => 1,
    'nama_lengkap' => 'Siswa Test',
    'nisn' => '1234567890',
    'jenis_kelamin' => 'L',
    'tanggal_lahir' => '2010-01-01',
]);
```

### Problem: Soal tidak tampil saat ujian

**Penyebab:**

1. Tidak ada soal untuk ujian_id tersebut
2. Semua soal bukan tipe 'pilihan_ganda'
3. Database belum di-seed dengan SoalUjianSeeder

**Cek:**

```bash
php artisan tinker
>>> # Verifikasi soal exist
>>> App\Models\SoalUjian::where('ujian_id', 5)->count();
>>> // Output: 30 (jika berhasil di-seed)

>>> # Lihat soal pertama
>>> $soal = App\Models\SoalUjian::where('ujian_id', 5)->first();
>>> echo "Soal: {$soal->pertanyaan}\n";
>>> echo "Jawaban: {$soal->jawaban_benar}\n";

>>> # Cek ujian info
>>> $ujian = App\Models\Ujian::find(5);
>>> echo "Ujian: {$ujian->judul_ujian}\n";
>>> echo "Mata Pelajaran: {$ujian->mataPelajaran->nama}\n";
>>> echo "Kelas: {$ujian->kelas->nama}\n";
```

**Solusi jika soal kosong:**

```bash
# Re-seed soal ujian
php artisan db:seed --class=SoalUjianSeeder

# Atau reset semua database
php artisan migrate:fresh --seed
```

**🔍 Cara Soal Ditampilkan:**

Soal diload berdasarkan `ujian_id`, bukan langsung dari mata_pelajaran. Flow:

1. Siswa klik "Mulai Ujian" pada ujian tertentu (misal: Ujian Matematika ID 5)
2. Controller ambil `ujian_id` = 5
3. Query: `SoalUjian::where('ujian_id', 5)->get()`
4. Karena ujian ID 5 adalah Matematika, maka tampil 30 soal Matematika
5. Setiap ujian memiliki soal sendiri di tabel `soal_ujian`

**Contoh Relasi:**

- Ujian ID 5 → Matematika → 30 soal (nomor 1-30)
- Ujian ID 6 → Bahasa Indonesia → X soal (nomor 1-X)
- Soal tersimpan per ujian, bukan per mata pelajaran global

### Problem: Error saat submit jawaban

**Penyebab**: Tidak ada record UjianSiswa atau JawabanSiswa

**Solusi**: Controller UjianSiswaController sudah auto-create record saat mulai ujian.

---

## 📊 Contoh Tampilan Soal

### Soal #1 (Mudah)

**Pertanyaan**: Hasil dari -8 + 15 adalah...

- A. -23
- B. -7
- C. 7 ✅
- D. 23

**Pembahasan**: -8 + 15 = 15 - 8 = 7

---

### Soal #15 (Sedang)

**Pertanyaan**: Hasil dari 2 1/4 + 1 1/2 adalah...

- A. 3 1/4
- B. 3 3/4 ✅
- C. 3 1/2
- D. 4

**Pembahasan**: 2 1/4 + 1 1/2 = 2 1/4 + 1 2/4 = 3 3/4

---

### Soal #29 (Sulit)

**Pertanyaan**: FPB dari 24 dan 36 adalah...

- A. 6
- B. 8
- C. 12 ✅
- D. 18

**Pembahasan**: Faktor 24: 1, 2, 3, 4, 6, 8, 12, 24. Faktor 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. FPB = 12

---

## 🚀 Quick Test Command

```bash
# Re-seed ujian dan soal (jika perlu)
php artisan db:seed --class=SoalUjianSeeder

# Atau fresh migration + seed semua
php artisan migrate:fresh --seed

# Check berhasil
php artisan tinker --execute="echo 'Total soal: ' . \App\Models\SoalUjian::where('ujian_id', 5)->count();"
```

---

## 📁 File yang Dibuat

1. **database/seeders/SoalUjianSeeder.php**
    - Seeder untuk 30 soal Matematika kelas 7
    - Auto-create ujian dengan status 'berlangsung'
    - Distribusi soal: mudah, sedang, sulit

2. **database/seeders/DatabaseSeeder.php** (updated)
    - Added call to SoalUjianSeeder after UjianSeeder

---

## ✅ Checklist Testing

- [ ] Login sebagai siswa → redirect ke exam dashboard
- [ ] Lihat ujian "Matematika - Bilangan Bulat dan Pecahan" di grid
- [ ] Klik "Mulai Ujian"
- [ ] Soal tampil 1 per halaman (30 soal total)
- [ ] Pilih jawaban → auto-save
- [ ] Timer countdown dari 90 menit
- [ ] Progress bar update setiap soal
- [ ] Submit ujian → tampil hasil dan nilai
- [ ] Cek nilai >= 75 (lulus) atau < 75 (tidak lulus)

---

**✨ Ujian siap digunakan! Siswa dapat langsung mengerjakan 30 soal Matematika kelas 7.**
