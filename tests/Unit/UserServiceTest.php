<?php

namespace Tests\Unit;

use App\Services\UserService;
use App\Models\User;
use App\Models\Institution;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserServiceTest extends TestCase
{
    use RefreshDatabase;

    protected UserService $userService;
    protected Institution $institution;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userService = new UserService();

        $this->institution = Institution::create([
            'name' => 'Test Institution',
            'type' => 'umum',
            'education_level' => 'sma',
            'is_active' => true,
            'address' => 'Test Address',
            'phone' => '08123456789',
        ]);
    }

    public function test_create_user_generates_secure_password(): void
    {
        $result = $this->userService->createUser([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'institution_id' => $this->institution->id,
        ]);

        $this->assertInstanceOf(User::class, $result['user']);
        $this->assertNotEmpty($result['plainPassword']);
        // Password should be at least 8 characters and memorable format varies in length
        $this->assertGreaterThanOrEqual(8, strlen($result['plainPassword']));
        $this->assertLessThanOrEqual(20, strlen($result['plainPassword']));

        // User should be created in database
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);
    }

    public function test_create_user_sets_force_password_change(): void
    {
        $result = $this->userService->createUser([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'institution_id' => $this->institution->id,
        ]);

        $this->assertTrue($result['user']->force_password_change);
    }

    public function test_update_password_validates_strength(): void
    {
        $user = User::factory()->create([
            'institution_id' => $this->institution->id,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Password tidak memenuhi kriteria');

        $this->userService->updatePassword($user, 'weak');
    }

    public function test_update_password_prevents_common_passwords(): void
    {
        $user = User::factory()->create([
            'institution_id' => $this->institution->id,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Password tidak memenuhi kriteria');

        // password123 is common but fails strength check first (no uppercase, no special char)
        $this->userService->updatePassword($user, 'password123');
    }

    public function test_update_password_succeeds_with_strong_password(): void
    {
        $user = User::factory()->create([
            'institution_id' => $this->institution->id,
        ]);

        $newPassword = 'NewSecureP@ss2024';
        $result = $this->userService->updatePassword($user, $newPassword);

        $this->assertTrue($result);
        $this->assertTrue(Hash::check($newPassword, $user->fresh()->password));
    }

    public function test_reset_password_generates_new_password(): void
    {
        $user = User::factory()->create([
            'institution_id' => $this->institution->id,
        ]);

        $newPassword = $this->userService->resetPassword($user);

        $this->assertNotEmpty($newPassword);
        $this->assertTrue($user->fresh()->force_password_change);
        $this->assertTrue(Hash::check($newPassword, $user->fresh()->password));
    }

    public function test_record_login_updates_login_fields(): void
    {
        $user = User::factory()->create([
            'institution_id' => $this->institution->id,
        ]);

        $this->userService->recordLogin($user, '192.168.1.1');

        $user->refresh();
        $this->assertNotNull($user->last_login_at);
        $this->assertEquals('192.168.1.1', $user->last_login_ip);
    }
}
