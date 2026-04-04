<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Institution;
use App\Models\Jenjang;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SiswaManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Institution $institution;
    protected Kelas $kelas;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test institution
        $this->institution = Institution::create([
            'name' => 'Test School',
            'type' => 'umum',
            'education_level' => 'SMA',
            'is_active' => true,
            'address' => 'Test Address',
            'phone' => '08123456789',
        ]);

        // Create test tahun ajaran
        $tahunAjaran = \App\Models\TahunAjaran::create([
            'nama' => '2024/2025',
            'tahun_mulai' => 2024,
            'tahun_selesai' => 2025,
            'is_active' => true,
        ]);

        // Create test jenjang
        $jenjang = Jenjang::create([
            'nama' => 'SMA',
            'kode' => 'SMA',
        ]);

        // Create test kelas
        $this->kelas = Kelas::create([
            'institution_id' => $this->institution->id,
            'jenjang_id' => $jenjang->id,
            'tahun_ajaran_id' => $tahunAjaran->id,
            'nama' => '10-A',
            'nama_kelas' => 'A',
            'tingkat' => 10,
        ]);

        // Create authenticated user
        $this->user = User::factory()->create([
            'institution_id' => $this->institution->id,
            'email' => 'admin@test.com',
        ]);

        // Create role and permission for testing
        if (class_exists(\App\Models\Role::class) && class_exists(\App\Models\Permission::class)) {
            $viewAkademikPermission = \App\Models\Permission::firstOrCreate(
                ['name' => 'view_akademik'],
                [
                    'display_name' => 'View Akademik',
                    'description' => 'Access to akademik module',
                    'module' => 'akademik',
                ]
            );

            $adminRole = \App\Models\Role::firstOrCreate(
                ['name' => 'admin'],
                [
                    'display_name' => 'Administrator',
                    'description' => 'Admin access',
                ]
            );

            // Also create siswa role for the controller
            $siswaRole = \App\Models\Role::firstOrCreate(
                ['name' => 'siswa'],
                [
                    'display_name' => 'Siswa',
                    'description' => 'Student role',
                ]
            );

            // Attach permission to role
            if (!\Illuminate\Support\Facades\DB::table('role_permission')
                ->where('role_id', $adminRole->id)
                ->where('permission_id', $viewAkademikPermission->id)
                ->exists()) {
                \Illuminate\Support\Facades\DB::table('role_permission')->insert([
                    'role_id' => $adminRole->id,
                    'permission_id' => $viewAkademikPermission->id,
                ]);
            }

            // Assign role to user
            if (!\Illuminate\Support\Facades\DB::table('user_roles')
                ->where('user_id', $this->user->id)
                ->where('role_id', $adminRole->id)
                ->exists()) {
                \Illuminate\Support\Facades\DB::table('user_roles')->insert([
                    'user_id' => $this->user->id,
                    'role_id' => $adminRole->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Reload user with roles
            $this->user->load('roles');
        }
    }

    public function test_siswa_index_page_can_be_rendered(): void
    {
        $response = $this->actingAs($this->user)
            ->get(route('akademik.siswa.index'));

        $response->assertStatus(200);
    }

    public function test_siswa_can_be_created_with_valid_data(): void
    {
        Storage::fake('public');

        $siswaData = [
            'nis' => '1234567890',
            'nisn' => '0987654321',
            'nik' => '3173051234567890',
            'nama_lengkap' => 'Test Student',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '2005-01-01',
            'agama' => 'Islam',
            'alamat' => 'Test Address Street 123',
            'email' => 'student@test.com',
            'no_hp' => '08123456789',
            'nama_ayah' => 'Test Father',
            'nama_ibu' => 'Test Mother',
            'no_hp_ortu' => '08129876543',
            'kelas_id' => $this->kelas->id,
            'status' => 'aktif',
            'tanggal_masuk' => '2024-07-01',
            'foto' => UploadedFile::fake()->image('student.jpg', 200, 200),
        ];

        $response = $this->actingAs($this->user)
            ->post(route('akademik.siswa.store'), $siswaData);

        $response->assertRedirect(route('akademik.siswa.index'));

        $siswa = Siswa::where('nis', '1234567890')->first();
        $this->assertNotNull($siswa);
        $this->assertEquals('Test Student', $siswa->nama_lengkap);
        $this->assertNotNull($siswa->foto, 'Foto should be uploaded');
    }

    public function test_siswa_cannot_be_created_with_duplicate_nis(): void
    {
        Siswa::create([
            'institution_id' => $this->institution->id,
            'nis' => '3333333333',
            'nisn' => '4444444444',
            'nama_lengkap' => 'Existing Student',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '2005-01-01',
            'alamat' => 'Test Address',
            'nama_ayah' => 'Father',
            'nama_ibu' => 'Mother',
            'no_hp_ortu' => '08129876543',
            'kelas_id' => $this->kelas->id,
            'status' => 'aktif',
            'tanggal_masuk' => '2024-07-01',
        ]);

        $siswaData = [
            'nis' => '3333333333', // Duplicate NIS
            'nisn' => '1111111111',
            'nama_lengkap' => 'New Student',
            'jenis_kelamin' => 'P',
            'tempat_lahir' => 'Bandung',
            'tanggal_lahir' => '2005-02-01',
            'alamat' => 'New Address Street 456',
            'email' => 'newstudent@test.com',
            'nama_ayah' => 'New Father',
            'nama_ibu' => 'New Mother',
            'no_hp_ortu' => '08111222333',
            'kelas_id' => $this->kelas->id,
            'status' => 'aktif',
            'tanggal_masuk' => '2024-07-01',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('akademik.siswa.store'), $siswaData);

        $response->assertSessionHasErrors(['nis']);
    }

    public function test_siswa_can_be_updated(): void
    {
        $siswa = Siswa::create([
            'institution_id' => $this->institution->id,
            'nis' => '9876543210',
            'nisn' => '1234509876',
            'nama_lengkap' => 'Original Name',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '2005-01-01',
            'alamat' => 'Original Address',
            'nama_ayah' => 'Father',
            'nama_ibu' => 'Mother',
            'no_hp_ortu' => '08129876543',
            'kelas_id' => $this->kelas->id,
            'status' => 'aktif',
            'tanggal_masuk' => '2024-07-01',
        ]);

        $updateData = [
            'nis' => '9876543210',
            'nisn' => '1234509876',
            'nama_lengkap' => 'Updated Name',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Bandung',
            'tanggal_lahir' => '2005-01-01',
            'alamat' => 'Updated Address Street 789',
            'nama_ayah' => 'Father',
            'nama_ibu' => 'Mother',
            'no_hp_ortu' => '08129876543',
            'kelas_id' => $this->kelas->id,
            'status' => 'aktif',
            'tanggal_masuk' => '2024-07-01',
        ];

        $response = $this->actingAs($this->user)
            ->put(route('akademik.siswa.update', $siswa), $updateData);

        $response->assertRedirect(route('akademik.siswa.index'));
        $this->assertDatabaseHas('siswa', [
            'id' => $siswa->id,
            'nama_lengkap' => 'Updated Name',
            'tempat_lahir' => 'Bandung',
        ]);
    }

    public function test_siswa_can_be_deleted(): void
    {
        $siswa = Siswa::create([
            'institution_id' => $this->institution->id,
            'nis' => '5555555555',
            'nisn' => '6666666666',
            'nama_lengkap' => 'Test Student',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '2005-01-01',
            'alamat' => 'Test Address',
            'nama_ayah' => 'Father',
            'nama_ibu' => 'Mother',
            'no_hp_ortu' => '08129876543',
            'kelas_id' => $this->kelas->id,
            'status' => 'aktif',
            'tanggal_masuk' => '2024-07-01',
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('akademik.siswa.destroy', $siswa));

        $response->assertRedirect(route('akademik.siswa.index'));
        $this->assertDatabaseMissing('siswa', [
            'id' => $siswa->id,
        ]);
    }
}
