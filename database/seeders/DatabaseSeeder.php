<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            InstitutionSeeder::class,
            MasterDataSeeder::class,
            SiswaSeeder::class,
        ]);

        // Create Admin User
        User::firstOrCreate([
            'email' => 'admin@eponpes.id',
        ], [
            'name' => 'Admin E-Ponpes',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create Test User
        User::firstOrCreate([
            'email' => 'user@eponpes.id',
        ], [
            'name' => 'User Test',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create additional demo users
        User::firstOrCreate([
            'email' => 'john@eponpes.id',
        ], [
            'name' => 'John Doe',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::firstOrCreate([
            'email' => 'jane@eponpes.id',
        ], [
            'name' => 'Jane Smith',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $defaultInstitutionId = \App\Models\Institution::query()->orderBy('id')->value('id');
        if ($defaultInstitutionId) {
            User::query()->whereNull('institution_id')->update(['institution_id' => $defaultInstitutionId]);
        }

        $this->call([
            AsramaSeeder::class,
        ]);
    }
}
