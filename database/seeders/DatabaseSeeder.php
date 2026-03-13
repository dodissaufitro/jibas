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
            'name' => 'Admin JIBAS',
            'email' => 'admin@jibas.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create Test User
        User::create([
            'name' => 'User Test',
            'email' => 'user@jibas.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create additional demo users
        User::create([
            'name' => 'John Doe',
            'email' => 'john@jibas.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@jibas.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
    }
}
