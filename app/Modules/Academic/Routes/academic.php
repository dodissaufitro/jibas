<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\GuruController;

/**
 * Academic Module Routes
 * 
 * All routes for academic module
 */
Route::middleware(['auth'])->prefix('academic')->name('academic.')->group(function () {

    // Siswa Management
    Route::resource('siswa', SiswaController::class);

    // Guru Management
    Route::resource('guru', GuruController::class);

    // TODO: Add more academic routes
    // - Nilai (Grades)
    // - Jadwal (Schedule)
    // - Raport (Report Cards)
});
