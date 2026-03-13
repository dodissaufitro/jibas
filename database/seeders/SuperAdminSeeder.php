<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SuperAdminSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * 
     * Seeder ini akan membuat:
     * 1. Role Super Admin
     * 2. User Super Admin dengan kredensial:
     *    - Email: superadmin@jibas.com
     *    - Password: SuperAdmin123!
     */
    public function run(): void
    {
        // Buat role Super Admin jika belum ada
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'super_admin'],
            [
                'display_name' => 'Super Administrator',
                'description' => 'Super Admin memiliki akses penuh ke seluruh sistem tanpa batasan'
            ]
        );

        // Buat role-role lainnya jika belum ada
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Administrator sekolah dengan akses luas'
            ],
            [
                'name' => 'guru',
                'display_name' => 'Guru',
                'description' => 'Guru/Pengajar dengan akses ke akademik dan presensi'
            ],
            [
                'name' => 'siswa',
                'display_name' => 'Siswa',
                'description' => 'Siswa dengan akses terbatas melihat data pribadi'
            ],
            [
                'name' => 'orang_tua',
                'display_name' => 'Orang Tua',
                'description' => 'Orang tua siswa dengan akses melihat data anak'
            ],
            [
                'name' => 'calon_siswa',
                'display_name' => 'Calon Siswa',
                'description' => 'Calon siswa untuk pendaftaran PPDB'
            ]
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['name' => $roleData['name']],
                [
                    'display_name' => $roleData['display_name'],
                    'description' => $roleData['description']
                ]
            );
        }

        // Buat user Super Admin
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@jibas.com'],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make('SuperAdmin123!'),
                'email_verified_at' => now(),
                'phone' => '081234567890',
                'address' => 'Jl. Contoh No. 123, Jakarta',
                'is_active' => true
            ]
        );

        // Assign role super_admin ke user
        DB::table('user_roles')->updateOrInsert(
            [
                'user_id' => $superAdmin->id,
                'role_id' => $superAdminRole->id
            ],
            [
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        // Output informasi
        $this->command->info('✅ Super Admin berhasil dibuat!');
        $this->command->newLine();
        $this->command->line('📧 Email    : superadmin@jibas.com');
        $this->command->line('🔐 Password : SuperAdmin123!');
        $this->command->newLine();
        $this->command->warn('⚠️  Harap ubah password setelah login pertama kali untuk keamanan!');
    }
}
