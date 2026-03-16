<?php

namespace App\Providers;

use App\Policies\KelasPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Register Kelas Policy gates
        Gate::define('view-kelas', [KelasPolicy::class, 'viewKelas']);
        Gate::define('access-kelas-resource', [KelasPolicy::class, 'accessKelasResource']);
        Gate::define('view-classmate', [KelasPolicy::class, 'viewClassmate']);
    }
}
