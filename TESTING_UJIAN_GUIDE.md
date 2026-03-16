# 🔧 TESTING GUIDE - Tampilan Ujian Baru

## ✅ Status: Ready to Test!

- ✅ Frontend compiled successfully
- ✅ Laravel cache cleared
- ✅ Kerjakan.tsx updated (Google Forms style)
- ✅ No errors found

---

## 🧪 Cara Testing:

### **LANGKAH 1: Hard Refresh Browser**

**Penting:** Clear cache browser terlebih dahulu!

**Chrome/Edge:**

```
1. Buka Developer Tools (F12)
2. Klik kanan pada tombol refresh
3. Pilih "Empty Cache and Hard Reload"

ATAU tekan: Ctrl + Shift + R (Windows)
```

**Firefox:**

```
Ctrl + Shift + Delete → Clear cache → OK
Kemudian: Ctrl + F5
```

---

### **LANGKAH 2: Logout & Login Ulang**

```
1. Logout dari akun siswa yang sedang login
2. Login ulang dengan:
   Email: siswa@jibas.com
   Password: password123
```

**URL setelah login:**

```
http://127.0.0.1:8000/siswa/exam/dashboard
```

---

### **LANGKAH 3: Test Flow Ujian**

#### **A. Di Exam Dashboard:**

1. ✅ Cari card ujian: **"Ujian Matematika - Bilangan Bulat dan Pecahan"**
2. ✅ Badge status harus: **"berlangsung"** (hijau)
3. ✅ Klik tombol **"Mulai Ujian"** (biru)

#### **B. Di Halaman Ujian (BARU!):**

**Tampilan yang HARUS muncul:**

```
┌─────────────────────────────────────────────┐
│ [Fixed Header]                              │
│ Ujian Matematika - Bilangan Bulat dan...   │
│ [Timer: 01:30:00] [Progress: 0/30]         │
│ ████▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Progress Bar            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ℹ️ Petunjuk: Pilih salah satu jawaban...   │
└─────────────────────────────────────────────┘

┌─││─────────────────────────────────────[X]─┐
│█││ Hasil dari -8 + 15 adalah...           │
│ ││ ○ A. -23                                │
│ ││ ○ B. -7                                 │
│ ││ ○ C. 7                                  │
│ ││ ○ D. 23                                 │
└─││──────────────────────────────────────────┘
  ↑↑
  Blue border

[Card soal 2...]
[Card soal 3...]
...
[Card soal 30...]

         [Submit Ujian]
```

**Ciri-ciri tampilan baru:**

- ✅ **Semua 30 soal tampil sekaligus** (scroll ke bawah)
- ✅ **Border biru di kiri** setiap card soal
- ✅ **Radio button** untuk pilihan (○)
- ✅ **Button X** di kanan atas setiap soal (hapus jawaban)
- ✅ **Fixed header** dengan timer dan progress
- ✅ **Progress bar** bergerak saat jawab soal
- ✅ **Background putih bersih** dengan shadow card
- ✅ **No pagination** - tidak ada tombol "Next Soal"

---

### **LANGKAH 4: Test Fitur**

#### **A. Pilih Jawaban:**

1. Klik radio button pada jawaban
2. Card akan berubah warna jadi **biru muda** (bg-blue-50)
3. Progress di header bertambah: **1/30 → 2/30**
4. Progress bar bergerak ke kanan

#### **B. Hapus Jawaban:**

1. Klik tombol **X** di kanan atas soal
2. Selection hilang
3. Progress berkurang

#### **C. Timer Countdown:**

1. Lihat timer di header (format: HH:MM:SS)
2. Timer harus countdown dari 01:30:00
3. Jika < 5 menit → timer berubah **merah**

#### **D. Submit:**

1. Scroll ke bawah sampai akhir
2. Klik **"Submit Ujian"**
3. Konfirmasi muncul
4. Redirect ke halaman hasil

---

## ❌ Jika Tampilan BELUM Berubah:

### **Problem 1: Masih Tampilan Lama (1 soal per halaman)**

**Penyebab:** Browser cache belum clear

**Solusi:**

```bash
# 1. Hard refresh browser (Ctrl + Shift + R)
# 2. Atau Clear cache manual:
#    Chrome: Settings → Privacy → Clear Browsing Data
#    Pilih: Cached images and files → Clear

# 3. Atau buka Incognito/Private Mode:
#    Ctrl + Shift + N (Chrome)
#    Ctrl + Shift + P (Firefox)
```

---

### **Problem 2: Error 404 Not Found**

**Penyebab:** Route belum ter-load

**Solusi:**

```bash
php artisan route:clear
php artisan route:cache
php artisan optimize:clear
```

---

### **Problem 3: Halaman Blank/White Screen**

**Penyebab:** JavaScript error

**Solusi:**

```bash
# 1. Check console browser (F12 → Console tab)
# 2. Rebuild frontend:
npm run build

# 3. Clear cache:
php artisan optimize:clear
```

---

### **Problem 4: Soal Tidak Muncul**

**Penyebab:** Database belum di-seed

**Solusi:**

```bash
# Re-seed soal ujian
php artisan db:seed --class=SoalUjianSeeder

# Check jumlah soal:
php artisan tinker
>>> App\Models\SoalUjian::where('ujian_id', 5)->count();
>>> // Harus output: 30
```

---

### **Problem 5: User Siswa Tidak Bisa Login**

**Penyebab:** User tidak punya record Siswa

**Solusi:**

```bash
php artisan tinker
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
```

---

## 🔍 Verifikasi File

### **File yang Sudah Diupdate:**

```
✅ resources/js/Pages/Siswa/Ujian/Kerjakan.tsx (NEW)
✅ resources/js/Pages/Siswa/Ujian/Kerjakan.old.tsx (BACKUP)
✅ public/build/assets/*.js (COMPILED)
```

### **Check Manual:**

```bash
# 1. Cek file Kerjakan.tsx ada `soal.map()`:
cat resources/js/Pages/Siswa/Ujian/Kerjakan.tsx | Select-String "soal.map"

# 2. Cek build assets terbaru:
Get-ChildItem public/build/assets/*.js | Sort-Object LastWriteTime -Descending | Select-Object -First 3
```

---

## 📸 Screenshot Perbandingan

### **LAMA (Sebelum):**

- 1 soal per halaman
- Ada tombol "Next" dan "Previous"
- Full screen dengan sidebar

### **BARU (Sekarang):**

- Semua 30 soal tampil sekaligus
- Scroll untuk lihat semua soal
- Border biru di kiri card
- Fixed header dengan timer
- Clean Google Forms style

---

## ✅ Checklist Testing

- [ ] Hard refresh browser (Ctrl + Shift + R)
- [ ] Logout dan login ulang
- [ ] Klik "Mulai Ujian" dari Exam Dashboard
- [ ] **LIHAT: Semua 30 soal tampil** (bukan 1 per halaman)
- [ ] Card soal ada border biru di kiri
- [ ] Radio button untuk pilihan
- [ ] Button X untuk hapus jawaban
- [ ] Fixed header dengan timer
- [ ] Progress bar bergerak saat jawab
- [ ] Submit button di bawah

---

## 🆘 Masih Belum Berubah?

**Jika setelah langkah di atas masih tampilan lama:**

1. **Screenshot** tampilan yang muncul
2. **Buka Console** browser (F12 → Console)
3. **Copy error** jika ada (warna merah)
4. **Check URL** yang muncul di address bar
5. Share info tersebut untuk debugging lebih lanjut

---

## 📞 Debug Command

```bash
# Full reset (jika perlu):
npm run build
php artisan optimize:clear
php artisan route:clear
php artisan view:clear
php artisan config:clear

# Restart Laravel server:
# Tekan Ctrl+C di terminal server
# Jalankan ulang: php artisan serve
```

---

**Status terakhir:**

- ✅ Build: SUCCESS
- ✅ Cache: CLEARED
- ✅ Errors: NONE
- ✅ File: UPDATED

**Next:** Hard refresh browser dan test!
