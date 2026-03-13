<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Check Institution Type Middleware
 * 
 * Ensure user's institution matches required type
 * Usage: Route::middleware(['auth', 'institution:pesantren'])
 */
class CheckInstitutionType
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $type): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        if (!$user->institution) {
            abort(403, 'Institusi belum dikonfigurasi. Silakan setup institusi terlebih dahulu.');
        }

        if ($user->institution->type !== $type) {
            abort(403, "Fitur ini hanya tersedia untuk institusi tipe: {$type}.");
        }

        return $next($request);
    }
}
