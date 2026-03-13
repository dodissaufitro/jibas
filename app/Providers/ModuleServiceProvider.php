<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

/**
 * Module Service Provider
 * 
 * Auto-loads all module routes
 */
class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Module routes to load
     */
    protected array $moduleRoutes = [
        'academic' => 'app/Modules/Academic/Routes/academic.php',
        // 'finance' => 'app/Modules/Finance/Routes/finance.php',
        // 'ppdb' => 'app/Modules/PPDB/Routes/ppdb.php',
        // 'attendance' => 'app/Modules/Attendance/Routes/attendance.php',
        // 'communication' => 'app/Modules/Communication/Routes/communication.php',
    ];

    /**
     * Institution-specific module routes (loaded conditionally)
     */
    protected array $institutionRoutes = [
        'pesantren' => [
            'hafalan' => 'app/Modules/InstitutionSpecific/Pesantren/Hafalan/Routes/hafalan.php',
            // 'asrama' => 'app/Modules/InstitutionSpecific/Pesantren/Asrama/Routes/asrama.php',
        ],
        // 'umum' => [
        //     'ekstrakurikuler' => 'app/Modules/InstitutionSpecific/School/Ekstrakurikuler/Routes/ekstrakurikuler.php',
        // ],
        // 'madrasah' => [
        //     'btq' => 'app/Modules/InstitutionSpecific/Madrasah/BTQ/Routes/btq.php',
        // ],
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load module routes
        $this->loadModuleRoutes();

        // Load institution-specific routes
        $this->loadInstitutionRoutes();
    }

    /**
     * Load all module routes
     */
    protected function loadModuleRoutes(): void
    {
        foreach ($this->moduleRoutes as $name => $path) {
            $fullPath = base_path($path);

            if (file_exists($fullPath)) {
                Route::middleware('web')
                    ->group($fullPath);
            }
        }
    }

    /**
     * Load institution-specific routes
     */
    protected function loadInstitutionRoutes(): void
    {
        foreach ($this->institutionRoutes as $type => $routes) {
            foreach ($routes as $name => $path) {
                $fullPath = base_path($path);

                if (file_exists($fullPath)) {
                    Route::middleware(['web'])
                        ->group($fullPath);
                }
            }
        }
    }
}
