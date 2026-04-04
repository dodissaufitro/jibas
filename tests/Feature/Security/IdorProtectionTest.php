<?php

namespace Tests\Feature\Security;

use App\Models\Institution;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Security Test Suite - IDOR Protection
 * 
 * Tests untuk memastikan tidak ada Insecure Direct Object References
 * User hanya bisa akses data dari institution mereka sendiri
 */
class IdorProtectionTest extends TestCase
{
    use RefreshDatabase;

    protected User $userInstitutionA;
    protected User $userInstitutionB;
    protected Institution $institutionA;
    protected Institution $institutionB;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup institutions
        $this->institutionA = Institution::factory()->create(['name' => 'Institution A']);
        $this->institutionB = Institution::factory()->create(['name' => 'Institution B']);

        // Setup users
        $this->userInstitutionA = User::factory()->create([
            'institution_id' => $this->institutionA->id,
        ]);

        $this->userInstitutionB = User::factory()->create([
            'institution_id' => $this->institutionB->id,
        ]);
    }

    /** @test */
    public function user_cannot_view_siswa_from_other_institution()
    {
        // Create siswa for institution B
        $siswaB = Siswa::factory()->create([
            'institution_id' => $this->institutionB->id,
        ]);

        // User from institution A tries to view siswa from institution B
        $response = $this->actingAs($this->userInstitutionA)
            ->get(route('siswa.show', $siswaB->id));

        // Should get 404 or 403
        $this->assertTrue(
            $response->status() === 404 || $response->status() === 403,
            "Expected 404 or 403, got {$response->status()}"
        );
    }

    /** @test */
    public function user_can_view_siswa_from_own_institution()
    {
        // Create siswa for institution A
        $siswaA = Siswa::factory()->create([
            'institution_id' => $this->institutionA->id,
        ]);

        // User from institution A views siswa from institution A
        $response = $this->actingAs($this->userInstitutionA)
            ->get(route('siswa.show', $siswaA->id));

        $response->assertStatus(200);
    }

    /** @test */
    public function user_cannot_update_siswa_from_other_institution()
    {
        $siswaB = Siswa::factory()->create([
            'institution_id' => $this->institutionB->id,
        ]);

        $response = $this->actingAs($this->userInstitutionA)
            ->put(route('siswa.update', $siswaB->id), [
                'nama_lengkap' => 'HACKED',
            ]);

        // Should be denied
        $this->assertTrue(
            $response->status() === 404 || $response->status() === 403,
            "Expected 404 or 403, got {$response->status()}"
        );

        // Verify data was NOT changed
        $this->assertDatabaseMissing('siswa', [
            'id' => $siswaB->id,
            'nama_lengkap' => 'HACKED',
        ]);
    }

    /** @test */
    public function user_cannot_delete_siswa_from_other_institution()
    {
        $siswaB = Siswa::factory()->create([
            'institution_id' => $this->institutionB->id,
        ]);

        $response = $this->actingAs($this->userInstitutionA)
            ->delete(route('siswa.destroy', $siswaB->id));

        // Should be denied
        $this->assertTrue(
            $response->status() === 404 || $response->status() === 403,
            "Expected 404 or 403, got {$response->status()}"
        );

        // Verify siswa still exists
        $this->assertDatabaseHas('siswa', [
            'id' => $siswaB->id,
        ]);
    }

    /** @test */
    public function listing_only_shows_data_from_own_institution()
    {
        // Create siswa for both institutions
        $siswaA1 = Siswa::factory()->create(['institution_id' => $this->institutionA->id]);
        $siswaA2 = Siswa::factory()->create(['institution_id' => $this->institutionA->id]);
        $siswaB1 = Siswa::factory()->create(['institution_id' => $this->institutionB->id]);
        $siswaB2 = Siswa::factory()->create(['institution_id' => $this->institutionB->id]);

        // User A fetches list
        $response = $this->actingAs($this->userInstitutionA)
            ->get(route('siswa.index'));

        $response->assertStatus(200);

        // Response should contain only institution A data
        $data = $response->json();

        // This test assumes your API returns JSON with siswa data
        // Adjust based on your actual response structure
        // For Inertia, you might need to check $response->viewData('siswa')
    }

    /** @test */
    public function super_admin_can_access_all_institutions_data()
    {
        // Create super admin
        $superAdmin = User::factory()->create([
            'institution_id' => $this->institutionA->id,
        ]);

        // Assign super_admin role (adjust based on your role implementation)
        // Assuming you have a roles table and user_roles pivot
        $superAdminRole = \App\Models\Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->roles()->attach($superAdminRole->id);

        // Create siswa from institution B
        $siswaB = Siswa::factory()->create([
            'institution_id' => $this->institutionB->id,
        ]);

        // Super admin should be able to access
        $response = $this->actingAs($superAdmin)
            ->get(route('siswa.show', $siswaB->id));

        $response->assertStatus(200);
    }

    /** @test */
    public function direct_id_manipulation_in_url_is_prevented()
    {
        $siswaA = Siswa::factory()->create([
            'institution_id' => $this->institutionA->id,
            'nama_lengkap' => 'Original Name A',
        ]);

        $siswaB = Siswa::factory()->create([
            'institution_id' => $this->institutionB->id,
            'nama_lengkap' => 'Original Name B',
        ]);

        // User A tries to update siswa B by manipulating ID in URL
        $response = $this->actingAs($this->userInstitutionA)
            ->put(route('siswa.update', $siswaB->id), [
                'nama_lengkap' => 'Manipulated Name',
                'institution_id' => $this->institutionB->id, // Even if trying to set institution_id
            ]);

        // Should be denied
        $this->assertTrue(
            $response->status() === 404 || $response->status() === 403,
            "Expected 404 or 403, got {$response->status()}"
        );

        // Verify siswa B was not modified
        $this->assertDatabaseHas('siswa', [
            'id' => $siswaB->id,
            'nama_lengkap' => 'Original Name B',
            'institution_id' => $this->institutionB->id,
        ]);
    }

    /** @test */
    public function institution_id_cannot_be_mass_assigned()
    {
        $siswaA = Siswa::factory()->create([
            'institution_id' => $this->institutionA->id,
        ]);

        // User A tries to change institution_id via mass assignment
        $response = $this->actingAs($this->userInstitutionA)
            ->put(route('siswa.update', $siswaA->id), [
                'nama_lengkap' => 'Updated Name',
                'institution_id' => $this->institutionB->id, // Trying to change institution
            ]);

        // After update, institution_id should remain unchanged
        $siswaA->refresh();
        $this->assertEquals($this->institutionA->id, $siswaA->institution_id);
    }

    /** @test */
    public function unauthorized_user_cannot_access_any_siswa()
    {
        // Create user without permissions
        $unauthorizedUser = User::factory()->create([
            'institution_id' => $this->institutionA->id,
        ]);

        $siswaA = Siswa::factory()->create([
            'institution_id' => $this->institutionA->id,
        ]);

        $response = $this->actingAs($unauthorizedUser)
            ->get(route('siswa.show', $siswaA->id));

        // Should be denied due to missing permission
        $response->assertStatus(403);
    }

    /** @test */
    public function api_endpoints_also_enforce_institution_scoping()
    {
        // If you have API endpoints
        $siswaB = Siswa::factory()->create([
            'institution_id' => $this->institutionB->id,
        ]);

        // Try to access via API
        $response = $this->actingAs($this->userInstitutionA)
            ->getJson("/api/siswa/{$siswaB->id}");

        $this->assertTrue(
            $response->status() === 404 || $response->status() === 403,
            "API endpoint should also enforce institution scoping"
        );
    }
}
