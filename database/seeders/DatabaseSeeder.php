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
        // Create Admin User
        User::create([
            'name' => 'Admin E-Ponpes',
            'email' => 'admin@eponpes.id',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create Test User
        User::create([
            'name' => 'User Test',
            'email' => 'user@eponpes.id',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create additional demo users
        User::create([
            'name' => 'John Doe',
            'email' => 'john@eponpes.id',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@eponpes.id',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
    }
}
