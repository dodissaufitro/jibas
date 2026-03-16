<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Check Kelas Access Middleware
 * 
 * Ensure student can only access resources related to their own kelas
 * Usage: Route::middleware(['auth', 'kelas.access'])
 */
class CheckKelasAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        // Only apply this middleware to students
        if (!$user->hasRole('siswa')) {
            return $next($request);
        }

        // Get siswa profile
        $siswa = $user->siswa;

        if (!$siswa) {
            abort(403, 'Profil siswa tidak ditemukan.');
        }

        if (!$siswa->kelas_id) {
            abort(403, 'Anda belum terdaftar di kelas manapun. Silakan hubungi administrator.');
        }

        // Store kelas_id in request for easy access in controllers
        $request->merge(['user_kelas_id' => $siswa->kelas_id]);

        return $next($request);
    }
}
