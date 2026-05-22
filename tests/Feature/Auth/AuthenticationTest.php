<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');
 
         $this->assertGuest();
         $response->assertRedirect('/');
     }

    public function test_pengguna_user_is_not_redirected_to_kader_intended_url(): void
    {
        $user = User::factory()->create(['role' => 'pengguna']);

        // Simulasikan intended URL kader di session
        $response = $this->withSession(['url.intended' => 'http://localhost/kader/dashboard'])
            ->post('/login', [
                'email' => $user->email,
                'password' => 'password',
            ]);

        $this->assertAuthenticated();
        // Harusnya diredirect ke dashboard pengguna, bukan kader
        $response->assertRedirect(route('dashboard'));
        $this->assertNull(session('url.intended'));
    }

    public function test_pengguna_user_is_redirected_to_valid_intended_url(): void
    {
        $user = User::factory()->create(['role' => 'pengguna']);

        // Simulasikan intended URL pengguna di session
        $response = $this->withSession(['url.intended' => 'http://localhost/anak-pertumbuhan'])
            ->post('/login', [
                'email' => $user->email,
                'password' => 'password',
            ]);

        $this->assertAuthenticated();
        $response->assertRedirect('http://localhost/anak-pertumbuhan');
    }

    public function test_kader_user_is_redirected_to_kader_intended_url(): void
    {
        $user = User::factory()->create(['role' => 'kader']);

        // Simulasikan intended URL kader di session
        $response = $this->withSession(['url.intended' => 'http://localhost/kader/dashboard'])
            ->post('/login', [
                'email' => $user->email,
                'password' => 'password',
            ]);

        $this->assertAuthenticated();
        $response->assertRedirect('http://localhost/kader/dashboard');
    }
}

