<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * 
     * This seeder calls all other seeders in the correct order.
     * Use this when setting up a fresh installation or resetting the database.
     * 
     * Run with: php artisan db:seed
     * Or: php artisan migrate:fresh --seed
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');

        // 1. Seed Institutions (must be first)
        $this->command->info('📍 Seeding institutions...');
        $this->call(InstitutionSeeder::class);

        // 2. Seed Permissions and Roles (before users)
        $this->command->info('🔐 Seeding permissions and roles...');
        $this->call(PermissionSeeder::class);

        // 3. Seed Master Data (jenjang, jurusan, etc.)
        $this->command->info('📚 Seeding master data...');
        $this->call(MasterDataSeeder::class);

        // 4. Seed Academic Data (tahun ajaran, kelas, dll)
        $this->command->info('🎓 Seeding academic data...');
        $this->call(AkademikDataSeeder::class);

        // 5. Seed Users with Roles
        $this->command->info('👥 Seeding users...');
        $this->call(UserSeeder::class);

        // Update users with default institution (for users without institution)
        $defaultInstitutionId = \App\Models\Institution::query()->orderBy('id')->value('id');
        if ($defaultInstitutionId) {
            User::query()->whereNull('institution_id')->update(['institution_id' => $defaultInstitutionId]);
            $this->command->info('✓ Updated users with default institution');
        }

        // 6. Seed Guru
        $this->command->info('👨‍🏫 Seeding guru...');
        $this->call(GuruSeeder::class);

        // 7. Seed Siswa
        $this->command->info('👨‍🎓 Seeding siswa...');
        $this->call(SiswaSeeder::class);

        // 8. Assign Guru to Kelas
        $this->command->info('📋 Assigning guru to kelas...');
        $this->call(GuruKelasSeeder::class);

        // 9. Seed Asrama
        $this->command->info('🏠 Seeding asrama...');
        $this->call(AsramaSeeder::class);

        // 10. Seed Jenis Pembayaran
        $this->command->info('💰 Seeding jenis pembayaran...');
        $this->call(JenisPembayaranSeeder::class);

        // 11. Seed Tagihan
        $this->command->info('💳 Seeding tagihan...');
        $this->call(TagihanSeeder::class);

        // 12. Seed Presensi Siswa (sample data)
        $this->command->info('📝 Seeding presensi siswa...');
        $this->call(PresensiSiswaSeeder::class);

        // 13. Seed Ujian (sample data)
        $this->command->info('📄 Seeding ujian...');
        $this->call(UjianSeeder::class);

        // 14. Seed Soal Ujian (30 soal Matematika Kelas 7)
        $this->command->info('📝 Seeding soal ujian...');
        $this->call(SoalUjianSeeder::class);

        // 15. Seed Guru, Jadwal Pelajaran dan Ujian (sample data lengkap)
        $this->command->info('👨‍🏫 Seeding guru, jadwal, dan ujian (sample)...');
        $this->call(GuruJadwalUjianSeeder::class);

        // 16. Seed Soal Ujian Matematika (15 soal tambahan)
        $this->command->info('📝 Seeding soal ujian matematika...');
        $this->call(SoalUjianMatematikaSeeder::class);

        // 17. Seed Contoh Siswa dari berbagai jenjang (10 siswa)
        $this->command->info('👨‍🎓 Seeding contoh siswa (SMP, SMA, SMK)...');
        $this->call(ContohSiswaSeeder::class);

        $this->command->newLine();
        $this->command->info('✅ Database seeding completed successfully!');
        $this->command->newLine();

        // Display summary
        $this->command->table(
            ['Resource', 'Count'],
            [
                ['Institutions', \App\Models\Institution::count()],
                ['Users', User::count()],
                ['Roles', \App\Models\Role::count()],
                ['Permissions', \App\Models\Permission::count()],
                ['Guru', \App\Models\Guru::count()],
                ['Siswa', \App\Models\Siswa::count()],
                ['Kelas', \App\Models\Kelas::count()],
                ['Jadwal Pelajaran', \App\Models\JadwalPelajaran::count()],
                ['Ujian', \App\Models\Ujian::count()],
                ['Soal Ujian', \App\Models\SoalUjian::count()],
            ]
        );
    }
}
