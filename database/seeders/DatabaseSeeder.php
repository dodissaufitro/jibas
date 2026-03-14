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
            PermissionSeeder::class,  // Seed permissions and roles first
            UserSeeder::class,         // Then create users with roles
        ]);

        // Update users with default institution
        $defaultInstitutionId = \App\Models\Institution::query()->orderBy('id')->value('id');
        if ($defaultInstitutionId) {
            User::query()->whereNull('institution_id')->update(['institution_id' => $defaultInstitutionId]);
        }

        $this->call([
            AsramaSeeder::class,
        ]);
    }
}
