<?php

use Illuminate\Support\Facades\Route;

/**
 * Pesantren - Hafalan Module Routes
 * 
 * Routes for Quran memorization tracking (Pesantren only)
 */
Route::middleware(['auth', 'institution:pesantren'])
    ->prefix('pesantren/hafalan')
    ->name('pesantren.hafalan.')
    ->group(function () {

        // TODO: Add Hafalan Controller routes
        // Route::get('/', [HafalanController::class, 'index'])->name('index');
        // Route::get('/create', [HafalanController::class, 'create'])->name('create');
        // Route::post('/', [HafalanController::class, 'store'])->name('store');
        // Route::get('/{hafalan}', [HafalanController::class, 'show'])->name('show');
        // Route::get('/progress/{siswa}', [HafalanController::class, 'progress'])->name('progress');
        // Route::get('/leaderboard', [HafalanController::class, 'leaderboard'])->name('leaderboard');
    });
