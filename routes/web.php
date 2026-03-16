<?php

use App\Http\Controllers\GuruController;
use App\Http\Controllers\InstitutionController;
use App\Http\Controllers\JadwalPelajaranController;
use App\Http\Controllers\JenjangController;
use App\Http\Controllers\JurusanController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MataPelajaranController;
use App\Http\Controllers\OrangTuaController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\PpdbPendaftaranController;
use App\Http\Controllers\PpdbPengumumanController;
use App\Http\Controllers\PresensiGuruController;
use App\Http\Controllers\PresensiSiswaController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RekapPresensiSiswaController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\SiswaExamController;
use App\Http\Controllers\SoalUjianController;
use App\Http\Controllers\TagihanController;
use App\Http\Controllers\TahunAjaranController;
use App\Http\Controllers\UjianController;
use App\Http\Controllers\UjianSiswaController;
use App\Http\Controllers\UserController;
use App\Modules\InstitutionSpecific\Pesantren\Hafalan\Controllers\HafalanController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Custom Login Routes
Route::middleware('guest')->group(function () {
    Route::get('/custom-login', [LoginController::class, 'show'])->name('custom.login.show');
    Route::post('/custom-login', [LoginController::class, 'login'])->name('custom.login');
});

Route::middleware('auth')->group(function () {
    Route::post('/custom-logout', [LoginController::class, 'logout'])->name('custom.logout');
});

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('custom.login.show');
});

Route::get('/dashboard', function () {

    return Inertia::render('SchoolDashboard', [
        'stats' => [
            'totalSiswa' => 856,
            'totalGuru' => 48,
            'totalKelas' => 24,
            'ppdbAktif' => 156,
            'tunggakan' => 26750000,
            'presensiHariIni' => 94,
        ]
    ]);
})->middleware(['auth'])->name('dashboard');

Route::get('/settings', function () {
    return Inertia::render('Settings');
})->middleware(['auth'])->name('settings');

// Institution Settings API
Route::middleware('auth')->prefix('api')->group(function () {
    Route::get('/institution/settings', [InstitutionController::class, 'getSettings'])->name('api.institution.settings');
    Route::post('/institution/settings', [InstitutionController::class, 'updateSettings'])->name('api.institution.update');
    Route::post('/institution/share-access', [InstitutionController::class, 'shareAccess'])->name('api.institution.share');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Master Data Routes
    Route::prefix('master')->name('master.')->middleware('permission:view_master_data')->group(function () {
        Route::resource('tahun-ajaran', TahunAjaranController::class);
        Route::resource('jenjang', JenjangController::class);
        Route::resource('jurusan', JurusanController::class);
        Route::resource('kelas', KelasController::class);
        Route::resource('mata-pelajaran', MataPelajaranController::class);
    });

    // PPDB Routes
    Route::prefix('ppdb')->name('ppdb.')->middleware('permission:view_ppdb')->group(function () {
        Route::resource('pendaftaran', PpdbPendaftaranController::class);
        Route::get('/calon', [PpdbPendaftaranController::class, 'calon'])->name('calon');
        Route::get('/seleksi', [PpdbPendaftaranController::class, 'seleksi'])->name('seleksi');
        Route::post('/seleksi/{id}/update-status', [PpdbPendaftaranController::class, 'updateStatus'])->name('seleksi.updateStatus');
        Route::get('/pembayaran-ppdb', [PpdbPendaftaranController::class, 'pembayaran'])->name('pembayaran');
        Route::post('/pembayaran-ppdb/{id}/bayar', [PpdbPendaftaranController::class, 'prosesBayar'])->name('pembayaran.bayar');
        Route::resource('pengumuman', PpdbPengumumanController::class);
    });

    // Akademik Routes
    Route::prefix('akademik')->name('akademik.')->middleware('permission:view_akademik')->group(function () {
        Route::resource('siswa', SiswaController::class);
        Route::resource('guru', GuruController::class);
        Route::resource('jadwal', JadwalPelajaranController::class);
        Route::get('/nilai', fn() => Inertia::render('ComingSoon', ['module' => 'Akademik - Penilaian']))->name('nilai');
        Route::get('/raport', fn() => Inertia::render('ComingSoon', ['module' => 'Akademik - Raport']))->name('raport');
    });

    // Ujian Routes (dengan granular permissions)
    Route::prefix('ujian')->name('ujian.')->group(function () {
        // View routes - untuk semua yang punya permission view_ujian (guru, admin)
        Route::get('/', [UjianController::class, 'index'])->middleware('permission:view_ujian')->name('index');

        // Jadwal Ujian - untuk yang punya permission view_jadwal_ujian (siswa, guru, admin)
        Route::get('/jadwal', [UjianController::class, 'jadwal'])->middleware('permission:view_jadwal_ujian')->name('jadwal');

        // Create routes - hanya untuk yang punya permission create_ujian (admin, guru)
        Route::get('/create', [UjianController::class, 'create'])->middleware('permission:create_ujian')->name('create');
        Route::post('/', [UjianController::class, 'store'])->middleware('permission:create_ujian')->name('store');

        // Edit routes - hanya untuk yang punya permission edit_ujian (admin, guru)
        Route::get('/{ujian}/edit', [UjianController::class, 'edit'])->middleware('permission:edit_ujian')->name('edit');
        Route::put('/{ujian}', [UjianController::class, 'update'])->middleware('permission:edit_ujian')->name('update');

        // Delete route - hanya untuk yang punya permission delete_ujian (admin)
        Route::delete('/{ujian}', [UjianController::class, 'destroy'])->middleware('permission:delete_ujian')->name('destroy');

        // Show route - taruh di akhir agar tidak menangkap route lainnya
        Route::get('/{ujian}', [UjianController::class, 'show'])->middleware('permission:view_ujian')->name('show');
    });

    // Jadwal Ujian (calendar view) - deprecated, sudah ada di atas
    // Route::get('ujian-jadwal', [UjianController::class, 'jadwal'])->middleware('permission:view_ujian')->name('ujian.jadwal');

    // Soal Ujian Routes (hanya untuk admin/guru dengan permission manage_soal_ujian)
    Route::prefix('ujian/{ujian}/soal')->name('ujian.soal.')->middleware('permission:manage_soal_ujian')->group(function () {
        Route::get('/', [SoalUjianController::class, 'index'])->name('index');
        Route::get('/create', [SoalUjianController::class, 'create'])->name('create');
        Route::post('/', [SoalUjianController::class, 'store'])->name('store');
        Route::get('/{soal}/edit', [SoalUjianController::class, 'edit'])->name('edit');
        Route::put('/{soal}', [SoalUjianController::class, 'update'])->name('update');
        Route::delete('/{soal}', [SoalUjianController::class, 'destroy'])->name('destroy');
    });

    // Siswa Exam Dashboard (full-screen exam interface)
    Route::prefix('siswa/exam')->name('siswa.exam.')->middleware('role:siswa')->group(function () {
        Route::get('/dashboard', [SiswaExamController::class, 'dashboard'])->name('dashboard');
        Route::get('/jadwal', [SiswaExamController::class, 'jadwalPelajaran'])->name('jadwal');
    });

    // Ujian Siswa Routes (untuk siswa mengerjakan ujian)
    // Siswa hanya bisa melihat dan mengikuti ujian, TIDAK bisa create/edit/delete
    Route::prefix('siswa/ujian')->name('siswa.ujian.')->middleware('role:siswa')->group(function () {
        Route::get('/', [UjianSiswaController::class, 'index'])->name('index');
        Route::post('/akses-kode', [UjianSiswaController::class, 'aksesKode'])->name('akses-kode');
        Route::get('/{ujian}/mulai', [UjianSiswaController::class, 'mulai'])->name('mulai');
        Route::get('/{ujianSiswa}/kerjakan', [UjianSiswaController::class, 'kerjakan'])->name('kerjakan');
        Route::post('/{ujianSiswa}/simpan-jawaban', [UjianSiswaController::class, 'simpanJawaban'])->name('simpan-jawaban');
        Route::post('/{ujianSiswa}/submit', [UjianSiswaController::class, 'submit'])->name('submit');
        Route::get('/{ujianSiswa}/hasil', [UjianSiswaController::class, 'hasil'])->name('hasil');
    });

    // Presensi Routes
    Route::prefix('presensi')->name('presensi.')->middleware('permission:view_presensi')->group(function () {
        Route::get('siswa/ambil-absen', [PresensiSiswaController::class, 'ambilAbsen'])->name('siswa.ambil-absen');
        Route::post('siswa/ambil-absen', [PresensiSiswaController::class, 'storeAmbilAbsen'])->name('siswa.store-absen');
        Route::resource('siswa', PresensiSiswaController::class);
        Route::resource('guru', PresensiGuruController::class);

        // Rekap Presensi Routes
        Route::get('/rekap', [RekapPresensiSiswaController::class, 'index'])->name('rekap');
        Route::post('/rekap/generate', [RekapPresensiSiswaController::class, 'generate'])->name('rekap.generate');
        Route::get('/rekap/{siswaId}', [RekapPresensiSiswaController::class, 'show'])->name('rekap.show');
    });

    // Keuangan Routes
    Route::prefix('keuangan')->name('keuangan.')->middleware('permission:view_keuangan')->group(function () {
        Route::resource('tagihan', TagihanController::class);
        Route::resource('pembayaran', PembayaranController::class);
        Route::get('/laporan', fn() => Inertia::render('ComingSoon', ['module' => 'Keuangan - Laporan Kas']))->name('laporan');
        Route::get('/tunggakan', fn() => Inertia::render('ComingSoon', ['module' => 'Keuangan - Tunggakan']))->name('tunggakan');
    });

    // Orang Tua Routes
    Route::prefix('orangtua')->name('orangtua.')->group(function () {
        Route::get('/data', [OrangTuaController::class, 'index'])->name('data');
        Route::get('/create', [OrangTuaController::class, 'create'])->name('create');
        Route::post('/', [OrangTuaController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [OrangTuaController::class, 'edit'])->name('edit');
        Route::put('/{id}', [OrangTuaController::class, 'update'])->name('update');
        Route::delete('/{id}', [OrangTuaController::class, 'destroy'])->name('destroy');

        // Coming Soon Routes
        Route::get('/akun', fn() => Inertia::render('ComingSoon', ['module' => 'Orang Tua - Akun']))->name('akun');
        Route::get('/komunikasi', fn() => Inertia::render('ComingSoon', ['module' => 'Orang Tua - Komunikasi']))->name('komunikasi');
    });

    // Administrasi Routes
    Route::prefix('admin')->group(function () {
        Route::get('/surat-masuk', fn() => Inertia::render('ComingSoon', ['module' => 'Admin - Surat Masuk']))->name('admin.surat-masuk');
        Route::get('/surat-keluar', fn() => Inertia::render('ComingSoon', ['module' => 'Admin - Surat Keluar']))->name('admin.surat-keluar');
        Route::get('/arsip', fn() => Inertia::render('ComingSoon', ['module' => 'Admin - Arsip Digital']))->name('admin.arsip');
        Route::get('/laporan', fn() => Inertia::render('ComingSoon', ['module' => 'Admin - Laporan']))->name('admin.laporan');
    });

    // User Management Routes
    Route::middleware('permission:view_users')->group(function () {
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::get('/create', [UserController::class, 'create'])->name('create');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('/{id}/edit', [UserController::class, 'edit'])->name('edit');
            Route::put('/{id}', [UserController::class, 'update'])->name('update');
            Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');

            // Permission Management
            Route::get('/permissions', [UserController::class, 'permissions'])->name('permissions');
            Route::put('/roles/{roleId}/permissions', [UserController::class, 'updateRolePermissions'])->name('roles.permissions.update');

            // Sync Siswa to Master Data
            Route::post('/sync-siswa', [UserController::class, 'syncSiswaToMasterData'])->name('sync-siswa');
        });

        // Role Management Routes
        Route::resource('roles', \App\Http\Controllers\RoleController::class);
    });

    // Pesantren Routes (Institution-Specific)
    Route::prefix('pesantren')->name('pesantren.')->group(function () {
        Route::resource('hafalan', HafalanController::class);
        Route::get('/hafalan/{siswaId}/progress', [HafalanController::class, 'progress'])->name('hafalan.progress');

        // Izin Pulang
        Route::resource('izin-pulang', \App\Modules\InstitutionSpecific\Pesantren\IzinPulang\Controllers\IzinPulangController::class)
            ->only(['index', 'create', 'store', 'edit', 'update']);
        Route::post('/izin-pulang/{id}/approve', [\App\Modules\InstitutionSpecific\Pesantren\IzinPulang\Controllers\IzinPulangController::class, 'approve'])
            ->name('izin-pulang.approve');
        Route::post('/izin-pulang/{id}/reject', [\App\Modules\InstitutionSpecific\Pesantren\IzinPulang\Controllers\IzinPulangController::class, 'reject'])
            ->name('izin-pulang.reject');
        Route::post('/izin-pulang/{id}/mark-return', [\App\Modules\InstitutionSpecific\Pesantren\IzinPulang\Controllers\IzinPulangController::class, 'markReturn'])
            ->name('izin-pulang.mark-return');

        // Asrama
        Route::resource('asrama', \App\Modules\InstitutionSpecific\Pesantren\Asrama\Controllers\AsramaController::class)
            ->only(['index', 'create', 'store', 'edit', 'update']);
        Route::get('/akhlak', fn() => Inertia::render('ComingSoon', ['module' => 'Pesantren - Pembinaan Akhlak']))->name('akhlak.index');
    });

    // School Routes (Institution-Specific)
    Route::prefix('school')->name('school.')->group(function () {
        // Ekstrakurikuler
        Route::resource('ekstrakurikuler', \App\Modules\InstitutionSpecific\School\Ekstrakurikuler\Controllers\EkstrakurikulerController::class);

        // Prestasi
        Route::resource('prestasi', \App\Modules\InstitutionSpecific\School\Analisis\Controllers\PrestasiController::class);

        // Placeholder routes - Coming Soon
        Route::get('/osis', fn() => Inertia::render('ComingSoon', ['module' => 'Sekolah - Organisasi OSIS']))->name('osis.index');
    });

    // Madrasah Routes (Institution-Specific)
    Route::prefix('madrasah')->name('madrasah.')->group(function () {
        // Evaluasi Ibadah
        Route::resource('evaluasi-ibadah', \App\Modules\InstitutionSpecific\Madrasah\EvaluasiIbadah\Controllers\EvaluasiIbadahController::class);

        // Placeholder routes - Coming Soon
        Route::get('/nilai-agama', fn() => Inertia::render('ComingSoon', ['module' => 'Madrasah - Nilai Pelajaran Agama']))->name('nilai-agama.index');
        Route::get('/kegiatan-keagamaan', fn() => Inertia::render('ComingSoon', ['module' => 'Madrasah - Kegiatan Keagamaan']))->name('kegiatan-keagamaan.index');
    });
});

require __DIR__ . '/auth.php';
