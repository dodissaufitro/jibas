<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class GuruKelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get SMP A institution
        $smpA = \App\Models\Institution::where('name', 'SMP A')->first();

        // Get first available kelas from SMP A
        $kelas = Kelas::with('jenjang')->first();

        if (!$kelas) {
            $this->command->error('Tidak ada kelas tersedia!');
            return;
        }

        // Create User for Guru
        $user = User::firstOrCreate(
            ['email' => 'guru.kelas7a@jibas.com'],
            [
                'name' => 'Guru Kelas 7A',
                'email' => 'guru.kelas7a@jibas.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'institution_id' => $smpA ? $smpA->id : null,
            ]
        );

        // Assign guru role
        $guruRole = Role::where('name', 'guru')->first();
        if ($guruRole && !$user->roles->contains($guruRole->id)) {
            $user->roles()->attach($guruRole->id);
        }

        // Create Guru profile
        $guru = Guru::firstOrCreate(
            ['email' => 'guru.kelas7a@jibas.com'],
            [
                'user_id' => $user->id,
                'institution_id' => $smpA ? $smpA->id : null,
                'nik' => '3201010188001001',
                'nip' => '198801012015031001',
                'nama_lengkap' => 'Guru Kelas 7A',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => '1988-01-01',
                'alamat' => 'Jl. Pendidikan No. 123',
                'email' => 'guru.kelas7a@jibas.com',
                'no_hp' => '081234567890',
                'pendidikan_terakhir' => 'S1 Pendidikan',
                'status_kepegawaian' => 'PNS',
                'status' => 'aktif',
                'tanggal_masuk' => '2015-03-01',
            ]
        );

        // Assign guru to specific kelas (only one class)
        if (!$guru->kelas->contains($kelas->id)) {
            $guru->kelas()->attach($kelas->id);
        }

        $this->command->info('✅ Guru dengan akses 1 kelas berhasil dibuat!');
        $this->command->line('');
        $this->command->info('📝 Detail Akun Guru:');
        $this->command->line('   Email: guru.kelas7a@jibas.com');
        $this->command->line('   Password: password123');
        $this->command->line('   Nama: ' . $guru->nama_lengkap);
        if ($smpA) {
            $this->command->line('   Institution: ' . $smpA->name);
        }
        $this->command->line('   Akses Kelas: ' . $kelas->jenjang->nama . ' ' . $kelas->nama_kelas . ' (ID: ' . $kelas->id . ')');
        $this->command->line('');
        $this->command->warn('💡 Guru ini hanya bisa melihat data siswa dari kelas ' . $kelas->jenjang->nama . ' ' . $kelas->nama_kelas);
    }
}
