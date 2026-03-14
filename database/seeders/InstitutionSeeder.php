<?php

namespace Database\Seeders;

use App\Models\Institution;
use Illuminate\Database\Seeder;

class InstitutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Contoh Institusi 1: Pondok Pesantren
        $pesantren = Institution::create([
            'name' => 'Pondok Pesantren Al-Hikmah',
            'type' => 'pesantren',
            'education_level' => 'MA',
            'address' => 'Jl. Raya Pesantren No. 123, Bogor, Jawa Barat',
            'phone' => '021-87654321',
            'email' => 'info@alhikmah.sch.id',
            'website' => 'https://alhikmah.sch.id',
            'npsn' => '20123456',
            'vision' => 'Menjadi pesantren terdepan dalam membentuk generasi berilmu dan berakhlak mulia',
            'mission' => 'Menyelenggarakan pendidikan Islam yang komprehensif dan berkualitas',
            'is_active' => true,
        ]);

        // Contoh Institusi 2: Sekolah Umum
        $sekolah = Institution::create([
            'name' => 'SMA Negeri 1 Jakarta',
            'type' => 'umum',
            'education_level' => 'SMA',
            'address' => 'Jl. Pendidikan No. 45, Jakarta Pusat',
            'phone' => '021-12345678',
            'email' => 'admin@sman1jkt.sch.id',
            'website' => 'https://sman1jkt.sch.id',
            'npsn' => '20234567',
            'vision' => 'Terwujudnya generasi cerdas, kreatif, dan berkarakter',
            'mission' => 'Menyelenggarakan pendidikan berkualitas dengan berbasis teknologi',
            'is_active' => true,
        ]);

        // Contoh Institusi 3: Madrasah
        $madrasah = Institution::create([
            'name' => 'Madrasah Tsanawiyah Negeri 1 Bandung',
            'type' => 'madrasah',
            'education_level' => 'MTs',
            'address' => 'Jl. Madrasah No. 78, Bandung, Jawa Barat',
            'phone' => '022-87654321',
            'email' => 'info@mtsn1bdg.sch.id',
            'website' => 'https://mtsn1bdg.sch.id',
            'npsn' => '20345678',
            'vision' => 'Madrasah unggul dalam prestasi dan berakhlak karimah',
            'mission' => 'Membentuk siswa yang beriman, berilmu, dan beramal',
            'is_active' => true,
        ]);

        // Contoh Institusi 4: SMP A
        $smpA = Institution::create([
            'name' => 'SMP A',
            'type' => 'umum',
            'education_level' => 'SMP',
            'address' => 'Jl. Pendidikan Raya No. 100, Jakarta Selatan',
            'phone' => '021-11223344',
            'email' => 'admin@smpa.sch.id',
            'website' => 'https://smpa.sch.id',
            'npsn' => '20456789',
            'vision' => 'Menjadi sekolah unggulan dengan prestasi gemilang',
            'mission' => 'Membentuk siswa berprestasi, berkarakter, dan berwawasan global',
            'is_active' => true,
        ]);

        $this->command->info('✅ 4 Contoh institusi berhasil dibuat!');
        $this->command->newLine();
        $this->command->line('1. ' . $pesantren->name . ' (ID: ' . $pesantren->id . ')');
        $this->command->line('2. ' . $sekolah->name . ' (ID: ' . $sekolah->id . ')');
        $this->command->line('3. ' . $madrasah->name . ' (ID: ' . $madrasah->id . ')');
        $this->command->line('4. ' . $smpA->name . ' (ID: ' . $smpA->id . ')');
        $this->command->newLine();
        $this->command->warn('💡 Tip: Assign user ke institusi dengan:');
        $this->command->line('   User::find(1)->update([\'institution_id\' => 1]);');
    }
}
