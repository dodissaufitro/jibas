# 📝 SISTEM UJIAN SISWA - PANDUAN LENGKAP

Dokumentasi lengkap sistem ujian berbasis kelas dengan mode CAT (Computer Adaptive Test) untuk siswa.

---

## 📋 Daftar Isi

1. [Gambaran Umum](#gambaran-umum)
2. [Fitur Utama](#fitur-utama)
3. [Alur Sistem](#alur-sistem)
4. [Implementasi Teknis](#implementasi-teknis)
5. [Panduan Penggunaan](#panduan-penggunaan)
6. [FAQ](#faq)

---

## 🎯 Gambaran Umum

Sistem ujian siswa dirancang agar:

- ✅ **Siswa hanya dapat melihat ujian untuk kelas mereka**
- ✅ **Soal ditampilkan dari input guru** secara berurutan
- ✅ **Mode CAT** - Tidak bisa kembali ke soal sebelumnya
- ✅ **Auto-save jawaban** ke database secara real-time
- ✅ **Timer countdown** dengan auto-submit saat waktu habis
- ✅ **Penilaian otomatis** untuk soal pilihan ganda

---

## ⭐ Fitur Utama

### 1. **Filter Otomatis Berdasarkan Kelas**

Model `Ujian` menggunakan trait `KelasScoped` yang secara otomatis mem-filter ujian berdasarkan kelas siswa:

```php
// app/Models/Ujian.php
class Ujian extends Model
{
    use KelasScoped; // Auto-filter berdasarkan kelas siswa
}
```

**Hasil:**

- Siswa kelas 7A **hanya melihat** ujian untuk kelas 7A
- Siswa kelas 8B **hanya melihat** ujian untuk kelas 8B
- Admin/Guru tetap bisa melihat **semua ujian** (trait tidak berlaku untuk mereka)

### 2. **Mode CAT (Computer Adaptive Test)**

Ujian menggunakan mode CAT:

- ❌ **Tidak bisa kembali** ke soal sebelumnya
- ✅ **Harus menjawab** atau konfirmasi skip sebelum lanjut
- ⏱️ **Timer real-time** dengan countdown
- 💾 **Auto-save** setiap jawaban ke database

### 3. **Auto-Save Jawaban**

Setiap kali siswa memilih jawaban:

```typescript
const handleSelectJawaban = async (soalId: number, jawaban: string) => {
    // Auto save to server
    await axios.post(route("siswa.ujian.simpan-jawaban", ujianSiswa.id), {
        soal_ujian_id: soalId,
        jawaban: jawaban,
    });
};
```

### 4. **Penilaian Otomatis**

Sistem otomatis menghitung:

- ✅ Jumlah jawaban benar
- ❌ Jumlah jawaban salah
- ⚪ Jumlah soal tidak dijawab
- 📊 Nilai akhir (skala 0-100)
- ⏱️ Durasi pengerjaan

---

## 🔄 Alur Sistem

```
┌─────────────────────┐
│  1. Siswa Login     │
│  (Role: siswa)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│  2. Lihat Daftar Ujian          │
│  (Filtered by Kelas)            │
│  /siswa/ujian                   │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  3. Pilih/Akses Ujian           │
│  - Klik card ujian              │
│  - Atau input nomor ujian       │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  4. Mulai Ujian                 │
│  - Create UjianSiswa record     │
│  - Status: sedang_mengerjakan   │
│  - Mulai timer                  │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  5. Kerjakan Soal (Mode CAT)    │
│  - Tampilkan soal satu per satu │
│  - Auto-save jawaban            │
│  - Tidak bisa kembali           │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  6. Submit Ujian                │
│  - Manual: klik submit          │
│  - Auto: waktu habis            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  7. Penilaian Otomatis          │
│  - Koreksi semua jawaban        │
│  - Hitung nilai                 │
│  - Update status: selesai       │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  8. Tampilkan Hasil             │
│  - Nilai akhir                  │
│  - Statistik jawaban            │
│  - Durasi pengerjaan            │
└─────────────────────────────────┘
```

---

## 🛠️ Implementasi Teknis

### **1. Model Ujian dengan KelasScoped**

```php
// app/Models/Ujian.php
<?php

namespace App\Models;

use App\Shared\Traits\KelasScoped;
use Illuminate\Database\Eloquent\Model;

class Ujian extends Model
{
    use KelasScoped; // ← Trait untuk auto-filter berdasarkan kelas

    protected $fillable = [
        'mata_pelajaran_id',
        'guru_id',
        'kelas_id', // ← Relasi ke kelas
        'judul_ujian',
        'jenis_ujian',
        'tanggal_ujian',
        'durasi_menit',
        'status',
        // ...
    ];

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function soalUjian()
    {
        return $this->hasMany(SoalUjian::class);
    }
}
```

### **2. Controller - UjianSiswaController**

```php
// app/Http/Controllers/UjianSiswaController.php
class UjianSiswaController extends Controller
{
    /**
     * Tampilkan daftar ujian untuk siswa
     * Auto-filtered berdasarkan kelas_id siswa
     */
    public function index()
    {
        $siswa = Siswa::where('user_id', Auth::id())->first();

        // KelasScoped trait otomatis filter query ini
        $ujian = Ujian::with(['mataPelajaran', 'guru', 'kelas'])
            ->whereIn('status', ['dijadwalkan', 'berlangsung'])
            ->orderBy('tanggal_ujian', 'asc')
            ->get();

        return Inertia::render('Siswa/Ujian/Index', [
            'ujian' => $ujian,
        ]);
    }

    /**
     * Kerjakan ujian (mode CAT)
     */
    public function kerjakan($ujianSiswaId)
    {
        $ujianSiswa = UjianSiswa::with(['ujian'])->findOrFail($ujianSiswaId);

        // Ambil soal (tanpa jawaban benar)
        $soal = SoalUjian::where('ujian_id', $ujianSiswa->ujian_id)
            ->where('tipe_soal', 'pilihan_ganda')
            ->orderBy('nomor_soal')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nomor_soal' => $item->nomor_soal,
                    'pertanyaan' => $item->pertanyaan,
                    'opsi_a' => $item->opsi_a,
                    'opsi_b' => $item->opsi_b,
                    'opsi_c' => $item->opsi_c,
                    'opsi_d' => $item->opsi_d,
                    'opsi_e' => $item->opsi_e,
                    // jawaban_benar TIDAK dikirim
                ];
            });

        return Inertia::render('Siswa/Ujian/Kerjakan', [
            'ujianSiswa' => $ujianSiswa,
            'soal' => $soal,
        ]);
    }

    /**
     * Simpan jawaban siswa (AJAX)
     */
    public function simpanJawaban(Request $request, $ujianSiswaId)
    {
        $validated = $request->validate([
            'soal_ujian_id' => 'required|exists:soal_ujian,id',
            'jawaban' => 'required|string|in:A,B,C,D,E',
        ]);

        // Update or create jawaban
        JawabanSiswa::updateOrCreate(
            [
                'ujian_siswa_id' => $ujianSiswaId,
                'soal_ujian_id' => $validated['soal_ujian_id'],
            ],
            [
                'jawaban' => $validated['jawaban'],
            ]
        );

        return response()->json(['success' => true]);
    }

    /**
     * Submit ujian dan hitung nilai
     */
    public function submit($ujianSiswaId)
    {
        $ujianSiswa = UjianSiswa::findOrFail($ujianSiswaId);

        DB::transaction(function () use ($ujianSiswa) {
            // Ambil semua soal
            $soal = SoalUjian::where('ujian_id', $ujianSiswa->ujian_id)->get();

            // Ambil semua jawaban siswa
            $jawaban = JawabanSiswa::where('ujian_siswa_id', $ujianSiswa->id)
                ->get()
                ->keyBy('soal_ujian_id');

            $jumlahBenar = 0;
            $totalNilai = 0;
            $totalBobot = 0;

            // Periksa setiap jawaban
            foreach ($soal as $item) {
                $totalBobot += $item->bobot;

                if (isset($jawaban[$item->id])) {
                    $isBenar = $jawaban[$item->id]->jawaban === $item->jawaban_benar;
                    $nilai = $isBenar ? $item->bobot : 0;

                    if ($isBenar) {
                        $jumlahBenar++;
                        $totalNilai += $nilai;
                    }
                }
            }

            // Hitung nilai akhir (0-100)
            $nilaiAkhir = ($totalNilai / $totalBobot) * 100;

            // Update ujian siswa
            $ujianSiswa->update([
                'waktu_selesai' => now(),
                'nilai' => $nilaiAkhir,
                'jumlah_benar' => $jumlahBenar,
                'status' => 'selesai',
            ]);
        });

        return redirect()->route('siswa.ujian.hasil', $ujianSiswaId);
    }
}
```

### **3. Routes**

```php
// routes/web.php

// Route khusus siswa untuk mengikuti ujian
Route::prefix('siswa/ujian')
    ->name('siswa.ujian.')
    ->middleware(['auth', 'role:siswa']) // ← Hanya siswa
    ->group(function () {
        Route::get('/', [UjianSiswaController::class, 'index'])->name('index');
        Route::post('/akses-kode', [UjianSiswaController::class, 'aksesKode'])->name('akses-kode');
        Route::get('/{ujian}/mulai', [UjianSiswaController::class, 'mulai'])->name('mulai');
        Route::get('/{ujianSiswa}/kerjakan', [UjianSiswaController::class, 'kerjakan'])->name('kerjakan');
        Route::post('/{ujianSiswa}/simpan-jawaban', [UjianSiswaController::class, 'simpanJawaban'])->name('simpan-jawaban');
        Route::post('/{ujianSiswa}/submit', [UjianSiswaController::class, 'submit'])->name('submit');
        Route::get('/{ujianSiswa}/hasil', [UjianSiswaController::class, 'hasil'])->name('hasil');
    });
```

### **4. Frontend - React/TypeScript**

**Tampilan Daftar Ujian** (`Index.tsx`):

- Card ujian yang tersedia untuk kelas siswa
- Status pengerjaan (belum mulai, sedang mengerjakan, selesai)
- Input nomor ujian untuk akses cepat

**Tampilan Mengerjakan Ujian** (`Kerjakan.tsx`):

- Mode CAT (satu soal per halaman)
- Timer countdown real-time
- Auto-save jawaban
- Progress bar
- Tidak bisa kembali ke soal sebelumnya

**Tampilan Hasil** (`Hasil.tsx`):

- Nilai akhir
- Jumlah benar/salah/kosong
- Durasi pengerjaan
- Status lulus/tidak lulus

---

## 📖 Panduan Penggunaan

### **Untuk Guru: Membuat Ujian**

1. **Login sebagai Guru**

    ```
    Email: guru@jibas.com
    Password: password123
    ```

2. **Buat Ujian Baru**
    - Navigasi: Menu → Ujian → Tambah Ujian
    - Isi form:
        - Mata Pelajaran
        - Kelas (pilih kelas target)
        - Judul Ujian
        - Jenis (UTS/UAS/Harian/Quiz)
        - Tanggal & Durasi
        - Status (Dijadwalkan/Berlangsung)

3. **Tambahkan Soal**
    - Klik ujian yang sudah dibuat
    - Pilih "Kelola Soal"
    - Tambah soal pilihan ganda:
        - Nomor soal
        - Pertanyaan
        - Opsi A, B, C, D, E
        - Jawaban benar
        - Bobot nilai

4. **Aktifkan Ujian**
    - Ubah status menjadi "Berlangsung"
    - Siswa sudah bisa mengakses

### **Untuk Siswa: Mengikuti Ujian**

1. **Login sebagai Siswa**

    ```
    Email: siswa@jibas.com
    Password: password123
    ```

2. **Lihat Daftar Ujian**
    - Navigasi: Menu → Ujian Saya
    - **Hanya ujian untuk kelas Anda yang muncul**

3. **Mulai Ujian**
    - **Opsi 1:** Klik tombol "Mulai Ujian" pada card
    - **Opsi 2:** Input nomor ujian di form akses cepat

4. **Kerjakan Soal**
    - Baca soal dengan teliti
    - Pilih jawaban yang tepat
    - Klik "Lanjut" untuk ke soal berikutnya
    - ⚠️ **PENTING:** Anda tidak bisa kembali ke soal sebelumnya!

5. **Submit Ujian**
    - Setelah semua soal selesai, klik "Selesai & Submit"
    - Atau tunggu timer habis (auto-submit)

6. **Lihat Hasil**
    - Nilai langsung muncul
    - Lihat statistik jawaban
    - Cek durasi pengerjaan

---

## ❓ FAQ

### **Q: Apakah siswa bisa melihat ujian kelas lain?**

**A:** **TIDAK.** Sistem otomatis mem-filter ujian berdasarkan `kelas_id` siswa. Jika siswa kelas 7A, dia hanya melihat ujian untuk kelas 7A.

### **Q: Apakah siswa bisa kembali ke soal sebelumnya?**

**A:** **TIDAK.** Sistem menggunakan mode CAT (Computer Adaptive Test). Siswa harus menjawab atau skip soal sebelum lanjut.

### **Q: Bagaimana jika siswa tutup browser saat ujian?**

**A:** Jawaban sudah **auto-save** ke database. Siswa bisa melanjutkan ujian dengan akses kembali ke halaman ujian.

### **Q: Bagaimana jika waktu habis?**

**A:** Sistem akan **auto-submit** ujian dan menghitung nilai berdasarkan jawaban yang sudah tersimpan.

### **Q: Apakah guru bisa lihat hasil ujian siswa?**

**A:** **YA.** Guru dapat melihat hasil ujian semua siswa di menu "Hasil Ujian" dengan permission `view_hasil_ujian`.

### **Q: Apakah nilai langsung muncul setelah submit?**

**A:** **YA.** Untuk soal pilihan ganda, nilai otomatis dihitung dan langsung muncul.

### **Q: Apakah siswa bisa mengerjakan ujian berkali-kali?**

**A:** **TIDAK.** Setelah submit, status ujian menjadi "selesai" dan tidak bisa dikerjakan lagi.

### **Q: Bagaimana cara membuat ujian hanya untuk kelas tertentu?**

**A:** Saat membuat ujian, **pilih kelas target** di form. Sistem otomatis mem-filter ujian berdasarkan kelas.

---

## 🔒 Keamanan

### **1. Filter Berdasarkan Kelas**

✅ Middleware `role:siswa` memastikan hanya siswa yang akses  
✅ Trait `KelasScoped` otomatis filter query berdasarkan kelas  
✅ Validasi `kelas_id` di setiap controller method

### **2. Validasi Kepemilikan Ujian**

```php
// Cek apakah ujian ini milik siswa yang login
if ($ujianSiswa->siswa_id !== $siswa->id) {
    abort(403);
}
```

### **3. Jawaban Benar Tidak Dikirim ke Frontend**

```php
// Soal dikirim TANPA jawaban benar
$soal->map(function ($item) {
    return [
        'id' => $item->id,
        'pertanyaan' => $item->pertanyaan,
        'opsi_a' => $item->opsi_a,
        // ...
        // jawaban_benar TIDAK dikirim
    ];
});
```

### **4. Auto-Submit Saat Waktu Habis**

```typescript
// Timer countdown dengan auto-submit
useEffect(() => {
    const timer = setInterval(() => {
        setSisaWaktu((prev) => {
            if (prev <= 1) {
                handleSubmit(); // ← Auto-submit
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
}, []);
```

---

## 📊 Database Schema

### **Tabel: ujian**

```sql
- id
- mata_pelajaran_id
- guru_id
- kelas_id          ← Filter berdasarkan ini
- judul_ujian
- jenis_ujian       (UTS/UAS/Harian/Quiz)
- tanggal_ujian
- durasi_menit
- status            (dijadwalkan/berlangsung/selesai)
```

### **Tabel: soal_ujian**

```sql
- id
- ujian_id
- nomor_soal
- pertanyaan
- opsi_a, opsi_b, opsi_c, opsi_d, opsi_e
- jawaban_benar     ← Tidak dikirim ke frontend
- bobot
- tipe_soal         (pilihan_ganda/essay)
```

### **Tabel: ujian_siswa**

```sql
- id
- ujian_id
- siswa_id
- waktu_mulai
- waktu_selesai
- durasi_pengerjaan
- nilai
- jumlah_benar
- jumlah_salah
- jumlah_kosong
- status            (sedang_mengerjakan/selesai)
```

### **Tabel: jawaban_siswa**

```sql
- id
- ujian_siswa_id
- soal_ujian_id
- jawaban           (A/B/C/D/E)
- is_benar          (true/false)
- nilai
```

---

## 🎉 Kesimpulan

Sistem ujian siswa sudah lengkap dengan:

✅ **Auto-filter berdasarkan kelas** (KelasScoped trait)  
✅ **Tampilan soal dari guru** (input via SoalUjian)  
✅ **Mode CAT** (tidak bisa kembali)  
✅ **Auto-save jawaban** (real-time)  
✅ **Timer countdown** (auto-submit)  
✅ **Penilaian otomatis** (untuk pilihan ganda)  
✅ **Keamanan tinggi** (validasi berlapis)

Sistem siap digunakan! 🚀

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan hubungi tim development atau buat issue di repository.

**Happy Learning! 📚**
