<?php

namespace App\Http\Middleware;

use App\Services\UserService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPasswordExpired
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return $next($request);
        }

        $user = $request->user();

        // Check if user must change password on first login
        if ($user->force_password_change) {
            if (!$request->routeIs('profile.edit') && !$request->routeIs('profile.update')) {
                return redirect()->route('profile.edit')
                    ->with('warning', 'Anda harus mengganti password default terlebih dahulu.');
            }
        }

        // Check if password has expired
        if ($this->userService->isPasswordExpired($user)) {
            if (!$request->routeIs('profile.edit') && !$request->routeIs('profile.update')) {
                return redirect()->route('profile.edit')
                    ->with('warning', 'Password Anda telah kadaluarsa. Silakan ganti password Anda.');
            }
        }

        return $next($request);
    }
}
