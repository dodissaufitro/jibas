<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class SetupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jibas:setup 
                            {--fresh : Run fresh migration (will drop all tables)}
                            {--seed-only : Only run seeders without migration}
                            {--no-cache : Skip cache optimization}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup JIBAS database with migrations and seeders';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->displayBanner();

        // Check database connection
        if (!$this->checkDatabaseConnection()) {
            return Command::FAILURE;
        }

        // Parse options
        $fresh = $this->option('fresh');
        $seedOnly = $this->option('seed-only');
        $noCache = $this->option('no-cache');

        // Confirmation for fresh migration
        if ($fresh && !$seedOnly) {
            if (!$this->confirm('⚠️  This will DELETE ALL DATA in the database. Continue?', false)) {
                $this->warn('Setup cancelled.');
                return Command::SUCCESS;
            }
        }

        $this->newLine();
        $this->info('🚀 Starting JIBAS database setup...');
        $this->newLine();

        // Step 1: Clear cache
        if (!$noCache) {
            $this->task('Clearing cache', function () {
                Artisan::call('cache:clear');
                Artisan::call('config:clear');
                Artisan::call('route:clear');
                Artisan::call('view:clear');
            });
        }

        // Step 2: Run migrations
        if (!$seedOnly) {
            if ($fresh) {
                $this->task('Running fresh migrations', function () {
                    Artisan::call('migrate:fresh', ['--force' => true]);
                });
            } else {
                $this->task('Running migrations', function () {
                    Artisan::call('migrate', ['--force' => true]);
                });
            }
        }

        // Step 3: Seed database
        $this->task('Seeding database', function () {
            Artisan::call('db:seed', [
                '--force' => true,
                '--class' => 'Database\\Seeders\\DatabaseSeeder'
            ]);
        });

        // Step 4: Optimize application
        if (!$noCache) {
            $this->task('Optimizing application', function () {
                Artisan::call('config:cache');
                Artisan::call('route:cache');
                Artisan::call('view:cache');
            });
        }

        $this->newLine();
        $this->displaySummary();
        $this->displayDefaultAccounts();

        return Command::SUCCESS;
    }

    /**
     * Check database connection
     */
    private function checkDatabaseConnection(): bool
    {
        try {
            DB::connection()->getPdo();
            $this->info('✓ Database connection successful');
            return true;
        } catch (\Exception $e) {
            $this->error('✗ Database connection failed!');
            $this->error('Error: ' . $e->getMessage());
            $this->newLine();
            $this->warn('Please check your .env file and ensure database credentials are correct.');
            return false;
        }
    }

    /**
     * Display banner
     */
    private function displayBanner(): void
    {
        $this->newLine();
        $this->line('╔════════════════════════════════════════════════════════════════╗');
        $this->line('║              JIBAS - Database Setup Command                    ║');
        $this->line('╚════════════════════════════════════════════════════════════════╝');
        $this->newLine();
    }

    /**
     * Display summary
     */
    private function displaySummary(): void
    {
        $this->info('✅ Database setup completed successfully!');
        $this->newLine();

        // Display statistics
        $stats = [
            ['Institutions', \App\Models\Institution::count()],
            ['Users', \App\Models\User::count()],
            ['Roles', \App\Models\Role::count()],
            ['Permissions', \App\Models\Permission::count()],
            ['Guru', \App\Models\Guru::count()],
            ['Siswa', \App\Models\Siswa::count()],
            ['Kelas', \App\Models\Kelas::count()],
            ['Presensi Siswa', \App\Models\PresensiSiswa::count()],
        ];

        $this->table(['Resource', 'Count'], $stats);
    }

    /**
     * Display default accounts
     */
    private function displayDefaultAccounts(): void
    {
        $this->newLine();
        $this->info('📧 Default Accounts:');
        $this->newLine();

        $accounts = [
            ['Super Admin', 'admin@jibas.com', 'password123', 'Full access to all features'],
            ['Guru (All Classes)', 'guru@jibas.com', 'password123', 'Access to SMP A institution'],
            ['Guru (Single Class)', 'guru.kelas7a@jibas.com', 'password123', 'Access to one class only'],
        ];

        $this->table(['Role', 'Email', 'Password', 'Description'], $accounts);

        $this->newLine();
        $this->warn('⚠️  IMPORTANT: Change these passwords in production!');
        $this->newLine();
    }
}
