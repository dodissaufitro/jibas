<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    /**
     * Display the custom login view.
     */
    public function show(): Response
    {
        return Inertia::render('CustomLogin', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            // Record login activity
            $this->userService->recordLogin(
                Auth::user(),
                $request->ip()
            );

            // Log successful authentication
            \App\Models\ActivityLog::logAuth(
                'login_success',
                'User berhasil login',
                ['email' => $credentials['email']]
            );

            return redirect()->intended(route('dashboard'));
        }

        // Log failed login attempt
        \App\Models\ActivityLog::logAuth(
            'login_failed',
            'Percobaan login gagal',
            [
                'email' => $credentials['email'],
                'reason' => 'Invalid credentials'
            ]
        );

        throw ValidationException::withMessages([
            'email' => 'Email atau password yang Anda masukkan salah.',
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request): RedirectResponse
    {
        // Log logout
        \App\Models\ActivityLog::logAuth('logout', 'User logout');

        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/custom-login');
    }
}
