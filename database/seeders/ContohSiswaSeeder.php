<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Siswa;
use App\Models\Kelas;

class ContohSiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting ContohSiswaSeeder...');

        // Get siswa role
        $siswaRole = Role::where('name', 'siswa')->first();

        if (!$siswaRole) {
            $this->command->error('❌ Role siswa tidak ditemukan!');
            return;
        }

        // Get institution (assuming ID 1 exists)
        $institutionId = 1;

        // ==========================================
        // CLEANUP: Remove example users if exist
        // ==========================================
        $this->command->info('🧹 Cleaning up existing example data...');

        $exampleEmails = [
            'siswa.smp7a@jibas.com',
            'siswa.smp8a@jibas.com',
            'siswa.smp9a@jibas.com',
            'siswa.sma10a@jibas.com',
            'siswa.sma11ipa@jibas.com',
            'siswa.sma12ipa@jibas.com',
            'siswa.smk10rpl@jibas.com',
            'siswa.smk11rpl@jibas.com',
            'siswa.smk12rpl@jibas.com',
            'siswa.sma10b@jibas.com',
        ];

        // Delete siswa entries first (foreign key)
        Siswa::whereIn('email', $exampleEmails)->delete();

        // Get user IDs to delete
        $userIds = DB::table('users')->whereIn('email', $exampleEmails)->pluck('id');

        // Delete user_roles pivot entries
        DB::table('user_roles')->whereIn('user_id', $userIds)->delete();

        // Delete users
        DB::table('users')->whereIn('email', $exampleEmails)->delete();

        $this->command->info('✅ Cleanup completed');

        // ==========================================
        // CREATE EXAMPLE STUDENTS
        // ==========================================
        $this->command->info('👨‍🎓 Creating example students...');

        $studentsData = [
            // SMP Kelas 7 (VII-A)
            [
                'name' => 'Ahmad Rizki',
                'email' => 'siswa.smp7a@jibas.com',
                'phone' => '081234560001',
                'kelas_nama' => 'VII-A',
                'jenjang' => 'SMP',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => '2011-05-15',
                'nis' => 'SMP2024001',
                'nisn' => '0111234567',
            ],

            // SMP Kelas 8 (VIII-A)
            [
                'name' => 'Siti Fatimah',
                'email' => 'siswa.smp8a@jibas.com',
                'phone' => '081234560002',
                'kelas_nama' => 'VIII-A',
                'jenjang' => 'SMP',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2010-08-20',
                'nis' => 'SMP2023002',
                'nisn' => '0101234568',
            ],

            // SMP Kelas 9 (IX-A)
            [
                'name' => 'Budi Santoso',
                'email' => 'siswa.smp9a@jibas.com',
                'phone' => '081234560003',
                'kelas_nama' => 'IX-A',
                'jenjang' => 'SMP',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Surabaya',
                'tanggal_lahir' => '2009-03-10',
                'nis' => 'SMP2022003',
                'nisn' => '0091234569',
            ],

            // SMA Kelas 10 (X-IPA-1)
            [
                'name' => 'Dewi Lestari',
                'email' => 'siswa.sma10a@jibas.com',
                'phone' => '081234560004',
                'kelas_nama' => 'X-A',
                'jenjang' => 'SMA',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Yogyakarta',
                'tanggal_lahir' => '2008-11-25',
                'nis' => 'SMA2023004',
                'nisn' => '0081234570',
            ],

            // SMA Kelas 11 (XI-IPA-1)
            [
                'name' => 'Eko Prasetyo',
                'email' => 'siswa.sma11ipa@jibas.com',
                'phone' => '081234560005',
                'kelas_nama' => 'XI IPA-1',
                'jenjang' => 'SMA',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Semarang',
                'tanggal_lahir' => '2007-01-30',
                'nis' => 'SMA2022005',
                'nisn' => '0071234571',
            ],

            // SMA Kelas 12 (XII-IPA-1)
            [
                'name' => 'Fitri Handayani',
                'email' => 'siswa.sma12ipa@jibas.com',
                'phone' => '081234560006',
                'kelas_nama' => 'XII IPA-1',
                'jenjang' => 'SMA',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Medan',
                'tanggal_lahir' => '2006-07-18',
                'nis' => 'SMA2021006',
                'nisn' => '0061234572',
            ],

            // SMK Kelas 10 (X-RPL-1)
            [
                'name' => 'Hendra Setiawan',
                'email' => 'siswa.smk10rpl@jibas.com',
                'phone' => '081234560007',
                'kelas_nama' => 'X RPL-1',
                'jenjang' => 'SMK',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Palembang',
                'tanggal_lahir' => '2008-09-12',
                'nis' => 'SMK2023007',
                'nisn' => '0081234573',
            ],

            // SMK Kelas 11 (XI-RPL-1)
            [
                'name' => 'Indah Permata',
                'email' => 'siswa.smk11rpl@jibas.com',
                'phone' => '081234560008',
                'kelas_nama' => 'XI RPL-1',
                'jenjang' => 'SMK',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Makassar',
                'tanggal_lahir' => '2007-04-22',
                'nis' => 'SMK2022008',
                'nisn' => '0071234574',
            ],

            // SMK Kelas 12 (XII-RPL-2)
            [
                'name' => 'Joko Widodo',
                'email' => 'siswa.smk12rpl@jibas.com',
                'phone' => '081234560009',
                'kelas_nama' => 'XII RPL-2',
                'jenjang' => 'SMK',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Solo',
                'tanggal_lahir' => '2006-06-21',
                'nis' => 'SMK2021009',
                'nisn' => '0061234575',
            ],

            // SMA Kelas 10 IPS (X-IPS-1)
            [
                'name' => 'Kartika Sari',
                'email' => 'siswa.sma10b@jibas.com',
                'phone' => '081234560010',
                'kelas_nama' => 'X-B',
                'jenjang' => 'SMA',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Malang',
                'tanggal_lahir' => '2008-02-14',
                'nis' => 'SMA2023010',
                'nisn' => '0081234576',
            ],
        ];

        $created = 0;
        $skipped = 0;

        foreach ($studentsData as $studentData) {
            // Find kelas by exact name using 'nama' field
            $kelas = Kelas::where('nama', $studentData['kelas_nama'])->first();

            if (!$kelas) {
                $this->command->warn("⚠️  Kelas tidak ditemukan: {$studentData['kelas_nama']} - Skip {$studentData['name']}");
                $skipped++;
                continue;
            }

            // Create user
            $user = User::create([
                'name' => $studentData['name'],
                'email' => $studentData['email'],
                'password' => Hash::make('password123'),
                'phone' => $studentData['phone'],
                'is_active' => true,
                'institution_id' => $institutionId,
            ]);

            // Assign siswa role
            DB::table('user_roles')->insert([
                'user_id' => $user->id,
                'role_id' => $siswaRole->id,
            ]);

            // Create siswa entry
            Siswa::create([
                'user_id' => $user->id,
                'institution_id' => $institutionId,
                'nis' => $studentData['nis'],
                'nisn' => $studentData['nisn'],
                'nama_lengkap' => $studentData['name'],
                'jenis_kelamin' => $studentData['jenis_kelamin'],
                'tempat_lahir' => $studentData['tempat_lahir'],
                'tanggal_lahir' => $studentData['tanggal_lahir'],
                'alamat' => 'Alamat lengkap ' . $studentData['name'],
                'email' => $studentData['email'],
                'no_hp' => $studentData['phone'],
                'nama_ayah' => 'Ayah ' . $studentData['name'],
                'nama_ibu' => 'Ibu ' . $studentData['name'],
                'no_hp_ortu' => '081234569999',
                'kelas_id' => $kelas->id,
                'status' => 'aktif',
                'tanggal_masuk' => '2023-07-15',
            ]);

            $this->command->info("✅ Created: {$studentData['name']} - Kelas: {$kelas->nama_kelas}");
            $created++;
        }

        $this->command->newLine();
        $this->command->info("🎉 ContohSiswaSeeder completed!");
        $this->command->info("✅ Created: {$created} students");
        if ($skipped > 0) {
            $this->command->warn("⚠️  Skipped: {$skipped} students (kelas not found)");
        }

        // Display credentials table
        $this->command->newLine();
        $this->command->info('📌 Login Credentials (All passwords: password123):');
        $this->command->table(
            ['Jenjang', 'Email', 'Nama'],
            [
                ['SMP VII-A', 'siswa.smp7a@jibas.com', 'Ahmad Rizki'],
                ['SMP VIII-A', 'siswa.smp8a@jibas.com', 'Siti Fatimah'],
                ['SMP IX-A', 'siswa.smp9a@jibas.com', 'Budi Santoso'],
                ['SMA X-A', 'siswa.sma10a@jibas.com', 'Dewi Lestari'],
                ['SMA XI IPA-1', 'siswa.sma11ipa@jibas.com', 'Eko Prasetyo'],
                ['SMA XII IPA-1', 'siswa.sma12ipa@jibas.com', 'Fitri Handayani'],
                ['SMK X RPL-1', 'siswa.smk10rpl@jibas.com', 'Hendra Setiawan'],
                ['SMK XI RPL-1', 'siswa.smk11rpl@jibas.com', 'Indah Permata'],
                ['SMK XII RPL-2', 'siswa.smk12rpl@jibas.com', 'Joko Widodo'],
                ['SMA X-B', 'siswa.sma10b@jibas.com', 'Kartika Sari'],
            ]
        );
    }
}
