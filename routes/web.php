<?php

use App\Http\Controllers\GuruController;
use App\Http\Controllers\InstitutionController;
use App\Http\Controllers\JenjangController;
use App\Http\Controllers\JurusanController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MataPelajaranController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\PpdbPendaftaranController;
use App\Http\Controllers\PpdbPengumumanController;
use App\Http\Controllers\PresensiGuruController;
use App\Http\Controllers\PresensiSiswaController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\TagihanController;
use App\Http\Controllers\TahunAjaranController;
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
    Route::prefix('master')->name('master.')->group(function () {
        Route::resource('tahun-ajaran', TahunAjaranController::class);
        Route::resource('jenjang', JenjangController::class);
        Route::resource('jurusan', JurusanController::class);
        Route::resource('kelas', KelasController::class);
        Route::resource('mata-pelajaran', MataPelajaranController::class);
    });

    // PPDB Routes
    Route::prefix('ppdb')->name('ppdb.')->group(function () {
        Route::resource('pendaftaran', PpdbPendaftaranController::class);
        Route::get('/calon', [PpdbPendaftaranController::class, 'calon'])->name('calon');
        Route::get('/seleksi', [PpdbPendaftaranController::class, 'seleksi'])->name('seleksi');
        Route::post('/seleksi/{id}/update-status', [PpdbPendaftaranController::class, 'updateStatus'])->name('seleksi.updateStatus');
        Route::get('/pembayaran-ppdb', [PpdbPendaftaranController::class, 'pembayaran'])->name('pembayaran');
        Route::post('/pembayaran-ppdb/{id}/bayar', [PpdbPendaftaranController::class, 'prosesBayar'])->name('pembayaran.bayar');
        Route::resource('pengumuman', PpdbPengumumanController::class);
    });

    // Akademik Routes
    Route::prefix('akademik')->name('akademik.')->group(function () {
        Route::resource('siswa', SiswaController::class);
        Route::resource('guru', GuruController::class);
        Route::get('/jadwal', fn() => Inertia::render('ComingSoon', ['module' => 'Akademik - Jadwal Pelajaran']))->name('jadwal');
        Route::get('/nilai', fn() => Inertia::render('ComingSoon', ['module' => 'Akademik - Penilaian']))->name('nilai');
        Route::get('/raport', fn() => Inertia::render('ComingSoon', ['module' => 'Akademik - Raport']))->name('raport');
    });

    // Presensi Routes
    Route::prefix('presensi')->name('presensi.')->group(function () {
        Route::resource('siswa', PresensiSiswaController::class);
        Route::resource('guru', PresensiGuruController::class);
        Route::get('/rekap', fn() => Inertia::render('ComingSoon', ['module' => 'Presensi - Rekap']))->name('rekap');
    });

    // Keuangan Routes
    Route::prefix('keuangan')->name('keuangan.')->group(function () {
        Route::resource('tagihan', TagihanController::class);
        Route::resource('pembayaran', PembayaranController::class);
        Route::get('/laporan', fn() => Inertia::render('ComingSoon', ['module' => 'Keuangan - Laporan Kas']))->name('laporan');
        Route::get('/tunggakan', fn() => Inertia::render('ComingSoon', ['module' => 'Keuangan - Tunggakan']))->name('tunggakan');
    });

    // Orang Tua Routes
    Route::prefix('orangtua')->group(function () {
        Route::get('/data', fn() => Inertia::render('ComingSoon', ['module' => 'Orang Tua - Data Wali Murid']))->name('orangtua.data');
        Route::get('/akun', fn() => Inertia::render('ComingSoon', ['module' => 'Orang Tua - Akun']))->name('orangtua.akun');
        Route::get('/komunikasi', fn() => Inertia::render('ComingSoon', ['module' => 'Orang Tua - Komunikasi']))->name('orangtua.komunikasi');
    });

    // Administrasi Routes
    Route::prefix('admin')->group(function () {
        Route::get('/surat-masuk', fn() => Inertia::render('ComingSoon', ['module' => 'Admin - Surat Masuk']))->name('admin.surat-masuk');
        Route::get('/surat-keluar', fn() => Inertia::render('ComingSoon', ['module' => 'Admin - Surat Keluar']))->name('admin.surat-keluar');
        Route::get('/arsip', fn() => Inertia::render('ComingSoon', ['module' => 'Admin - Arsip Digital']))->name('admin.arsip');
        Route::get('/laporan', fn() => Inertia::render('ComingSoon', ['module' => 'Admin - Laporan']))->name('admin.laporan');
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

        // Placeholder routes - Coming Soon
        Route::get('/asrama', fn() => Inertia::render('ComingSoon', ['module' => 'Pesantren - Manajemen Asrama']))->name('asrama.index');
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
