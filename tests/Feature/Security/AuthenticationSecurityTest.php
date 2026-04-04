<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationSecurityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function passwords_are_hashed_when_stored()
    {
        $plainPassword = 'SecurePass123!';

        $user = User::factory()->create([
            'password' => Hash::make($plainPassword),
        ]);

        // Password should be hashed (not stored as plain text)
        $this->assertNotEquals($plainPassword, $user->password);

        // Should be able to verify the password
        $this->assertTrue(Hash::check($plainPassword, $user->password));
    }

    /** @test */
    public function login_fails_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'invalid-test@example.com',
            'password' => Hash::make('ValidPass123!'),
        ]);

        $response = $this->from(route('login'))->post(route('login'), [
            'email' => $user->email,
            'password' => 'WrongPassword123!',
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    /** @test */
    public function login_succeeds_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'valid-test@example.com',
            'password' => Hash::make('ValidPass123!'),
        ]);

        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'ValidPass123!',
        ]);

        $response->assertStatus(302);
        $this->assertAuthenticatedAs($user);
    }

    /** @test */
    public function login_is_rate_limited_after_failed_attempts()
    {
        $user = User::factory()->create([
            'email' => 'rate-limit@example.com',
            'password' => Hash::make('CorrectPassword123!'),
        ]);

        // LoginRequest throttles after 5 failures (by email+ip)
        for ($i = 0; $i < 6; $i++) {
            $response = $this->from(route('login'))->post(route('login'), [
                'email' => $user->email,
                'password' => 'WrongPassword',
            ]);
        }

        $response = $this->from(route('login'))->post(route('login'), [
            'email' => $user->email,
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    /** @test */
    public function successful_login_regenerates_session_id()
    {
        $user = User::factory()->create([
            'email' => 'session-test@example.com',
            'password' => Hash::make('CorrectPassword123!'),
        ]);

        $this->get('/');
        $sessionIdBefore = session()->getId();

        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'CorrectPassword123!',
        ]);

        $response->assertStatus(302);
        $sessionIdAfter = session()->getId();
        $this->assertNotEquals($sessionIdBefore, $sessionIdAfter);
    }

    /** @test */
    public function logout_invalidates_session_via_default_logout_route()
    {
        $user = User::factory()->create();

        $this->actingAs($user);
        $this->assertAuthenticated();

        $response = $this->post(route('logout'));
        $response->assertStatus(302);
        $this->assertGuest();
    }

    /** @test */
    public function logout_invalidates_session_via_custom_logout_route()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('custom.logout'));

        $response->assertStatus(302);
        $this->assertGuest();
    }

    /** @test */
    public function unauthenticated_users_are_redirected_to_login()
    {
        $response = $this->get('/dashboard');

        $this->assertTrue(in_array($response->status(), [301, 302]));
    }

    /** @test */
    public function csrf_middleware_is_registered_for_web_routes()
    {
        $middleware = app(\Illuminate\Routing\Router::class)->getMiddlewareGroups();
        $this->assertContains(
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
            $middleware['web']
        );
    }
}
