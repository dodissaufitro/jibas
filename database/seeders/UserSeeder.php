<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin User
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@jibas.com'],
            [
                'name' => 'Super Administrator',
                'email' => 'admin@jibas.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // Assign super_admin role
        $superAdminRole = Role::where('name', 'super_admin')->first();
        if ($superAdminRole && !$superAdmin->roles->contains($superAdminRole->id)) {
            $superAdmin->roles()->attach($superAdminRole->id);
        }

        $this->command->info('Super Admin created successfully!');
        $this->command->info('Email: admin@jibas.com');
        $this->command->info('Password: password123');
        $this->command->line('');

        // Create additional test users for different roles
        $this->createTestUsers();
    }

    private function createTestUsers(): void
    {
        $testUsers = [
            [
                'name' => 'Admin Sekolah',
                'email' => 'admin.sekolah@jibas.com',
                'password' => 'password123',
                'role' => 'admin',
            ],
            [
                'name' => 'Guru Matematika',
                'email' => 'guru@jibas.com',
                'password' => 'password123',
                'role' => 'guru',
            ],
            [
                'name' => 'Siswa Test',
                'email' => 'siswa@jibas.com',
                'password' => 'password123',
                'role' => 'siswa',
            ],
            [
                'name' => 'Orang Tua Siswa',
                'email' => 'orangtua@jibas.com',
                'password' => 'password123',
                'role' => 'orang_tua',
            ],
        ];

        foreach ($testUsers as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'password' => Hash::make($userData['password']),
                    'email_verified_at' => now(),
                ]
            );

            $role = Role::where('name', $userData['role'])->first();
            if ($role && !$user->roles->contains($role->id)) {
                $user->roles()->attach($role->id);
            }

            $this->command->info("✓ {$userData['name']} ({$userData['email']}) - Role: {$userData['role']}");
        }

        $this->command->line('');
        $this->command->info('All test users created successfully!');
        $this->command->warn('Default password for all users: password123');
    }
}
