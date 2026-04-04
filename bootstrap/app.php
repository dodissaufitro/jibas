<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Redirect unauthenticated users to custom login
        $middleware->redirectGuestsTo('/custom-login');

        // Register middleware aliases
        $middleware->alias([
            'institution' => \App\Http\Middleware\CheckInstitutionType::class,
            'permission' => \App\Http\Middleware\CheckPermission::class,
            'role' => \App\Http\Middleware\CheckRole::class,
            'kelas.access' => \App\Http\Middleware\CheckKelasAccess::class,
            'password.expired' => \App\Http\Middleware\CheckPasswordExpired::class,
        ]);

        // Apply password expiration check globally for authenticated routes
        $middleware->web(append: [
            \App\Http\Middleware\CheckPasswordExpired::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
