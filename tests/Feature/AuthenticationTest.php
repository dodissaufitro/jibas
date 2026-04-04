<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Institution;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected Institution $institution;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test institution
        $this->institution = Institution::create([
            'name' => 'Test Institution',
            'type' => 'umum',
            'is_active' => true,
            'address' => 'Test Address',
            'phone' => '08123456789',
        ]);
    }

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/custom-login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create([
            'institution_id' => $this->institution->id,
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post('/custom-login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard'));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create([
            'institution_id' => $this->institution->id,
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $this->post('/custom-login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_login_is_rate_limited_after_multiple_failed_attempts(): void
    {
        $user = User::factory()->create([
            'institution_id' => $this->institution->id,
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Make 5 failed login attempts
        for ($i = 0; $i < 5; $i++) {
            $this->post('/custom-login', [
                'email' => 'test@example.com',
                'password' => 'wrong-password',
            ]);
        }

        // 6th attempt should be rate limited
        $response = $this->post('/custom-login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(429); // Too Many Requests
    }
}
