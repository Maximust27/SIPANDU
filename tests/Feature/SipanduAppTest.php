<?php

namespace Tests\Feature;

use App\Models\Child;
use App\Models\Measurement;
use App\Models\Posyandu;
use App\Models\Queue;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SipanduAppTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $kader;
    private User $pengguna;
    private Posyandu $posyandu;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a test posyandu
        $this->posyandu = Posyandu::create([
            'name' => 'Posyandu Melati',
            'kelurahan' => 'Sidanegara',
            'kecamatan' => 'Cilacap Tengah',
            'kabupaten' => 'Cilacap',
            'address' => 'Jl. Kenanga No. 10',
            'contact' => '08123456789',
            'quota_per_session' => 50,
            'status' => 'aktif',
        ]);

        // Create Admin
        $this->admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        // Create Kader
        $this->kader = User::factory()->create([
            'role' => 'kader',
            'status' => 'aktif',
            'posyandu_id' => $this->posyandu->id,
            'kecamatan' => 'Cilacap Tengah',
            'kelurahan' => 'Sidanegara',
        ]);

        // Create Pengguna/Bunda
        $this->pengguna = User::factory()->create([
            'role' => 'pengguna',
            'status' => 'aktif',
            'kecamatan' => 'Cilacap Tengah',
            'kelurahan' => 'Sidanegara',
        ]);
    }

    // =========================================================================
    // 1. MIDDLEWARE & ROLE ACCESS TESTS
    // =========================================================================

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect(route('login'));
    }

    public function test_nonactive_user_cannot_access_dashboard(): void
    {
        $this->pengguna->update(['status' => 'nonaktif']);

        $response = $this->actingAs($this->pengguna)->get('/dashboard');
        $response->assertStatus(403);
    }

    public function test_pengguna_can_access_user_dashboard(): void
    {
        $response = $this->actingAs($this->pengguna)->get('/dashboard');
        $response->assertStatus(200);
    }

    public function test_pengguna_cannot_access_kader_dashboard(): void
    {
        $response = $this->actingAs($this->pengguna)->get('/kader/dashboard');
        $response->assertStatus(403);
    }

    public function test_kader_can_access_kader_dashboard(): void
    {
        $response = $this->actingAs($this->kader)->get('/kader/dashboard');
        $response->assertStatus(200);
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    // =========================================================================
    // 2. ADMIN CRUD TESTS
    // =========================================================================

    public function test_admin_user_management_crud(): void
    {
        // View Users
        $response = $this->actingAs($this->admin)->get('/admin/users');
        $response->assertStatus(200);

        // Create User
        $response = $this->actingAs($this->admin)->post('/admin/users', [
            'name' => 'Kader Baru',
            'email' => 'kaderbaru@sipandu.id',
            'phone' => '08987654321',
            'address' => 'Jl. Mawar No. 5',
            'role' => 'kader',
            'posyandu_id' => $this->posyandu->id,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['email' => 'kaderbaru@sipandu.id']);

        $newUser = User::where('email', 'kaderbaru@sipandu.id')->first();

        // Update User
        $response = $this->actingAs($this->admin)->put("/admin/users/{$newUser->id}", [
            'name' => 'Kader Baru Updated',
            'email' => 'kaderbaru@sipandu.id',
            'phone' => '08987654321',
            'address' => 'Jl. Mawar No. 15',
            'role' => 'kader',
            'posyandu_id' => $this->posyandu->id,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['name' => 'Kader Baru Updated']);

        // Toggle Status User
        $response = $this->actingAs($this->admin)->patch("/admin/users/{$newUser->id}/toggle-status", [
            'status' => 'nonaktif',
        ]);
        $response->assertRedirect();
        $this->assertEquals('nonaktif', $newUser->fresh()->status);

        // Reset Password User
        $response = $this->actingAs($this->admin)->post("/admin/users/{$newUser->id}/reset-password");
        $response->assertRedirect();
        $this->assertTrue(Hash::check('password', $newUser->fresh()->password));

        // Delete User
        $response = $this->actingAs($this->admin)->delete("/admin/users/{$newUser->id}");
        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $newUser->id]);
    }

    public function test_admin_posyandu_management_crud(): void
    {
        // View Posyandu
        $response = $this->actingAs($this->admin)->get('/admin/posyandu');
        $response->assertStatus(200);

        // Create Posyandu
        $response = $this->actingAs($this->admin)->post('/admin/posyandu', [
            'name' => 'Posyandu Mawar',
            'kelurahan' => 'Sidanegara',
            'kecamatan' => 'Cilacap Tengah',
            'address' => 'Jl. Mawar Indah',
            'contact' => '0822334455',
            'quota_per_session' => 60,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('posyandu', ['name' => 'Posyandu Mawar']);

        $posyandu2 = Posyandu::where('name', 'Posyandu Mawar')->first();

        // Update Posyandu
        $response = $this->actingAs($this->admin)->put("/admin/posyandu/{$posyandu2->id}", [
            'name' => 'Posyandu Mawar Updated',
            'kelurahan' => 'Sidanegara',
            'kecamatan' => 'Cilacap Tengah',
            'address' => 'Jl. Mawar Indah 2',
            'contact' => '0822334455',
            'quota_per_session' => 70,
            'status' => 'aktif',
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('posyandu', ['name' => 'Posyandu Mawar Updated']);

        // Delete Posyandu
        $response = $this->actingAs($this->admin)->delete("/admin/posyandu/{$posyandu2->id}");
        $response->assertRedirect();
        $this->assertDatabaseMissing('posyandu', ['id' => $posyandu2->id]);
    }

    public function test_admin_reports_rendered(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/reports');
        $response->assertStatus(200);
    }

    // =========================================================================
    // 3. KADER CRUD TESTS
    // =========================================================================

    public function test_kader_can_register_child_and_update_it(): void
    {
        // View children list
        $response = $this->actingAs($this->kader)->get('/kader/data-anak');
        $response->assertStatus(200);

        // Register child
        $response = $this->actingAs($this->kader)->post('/kader/data-anak/simpan', [
            'nik' => '1234567890123456',
            'name' => 'Dian Kusuma',
            'gender' => 'Perempuan',
            'birth_date' => '2024-05-10',
            'father_name' => 'Kusuma',
            'mother_name' => 'Ratih',
            'phone' => '081223344556',
            'address' => 'Sidanegara',
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('children', ['name' => 'Dian Kusuma']);
        
        $child = Child::where('nik', '1234567890123456')->first();

        // Update child details
        $response = $this->actingAs($this->kader)->put("/kader/data-anak/update/{$child->id}", [
            'name' => 'Dian Kusuma Updated',
            'gender' => 'Perempuan',
            'birth_date' => '2024-05-10',
            'father_name' => 'Kusuma',
            'mother_name' => 'Ratih Updated',
            'phone' => '081223344556',
            'address' => 'Sidanegara Indah',
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('children', ['name' => 'Dian Kusuma Updated']);
    }

    public function test_kader_can_record_measurement_and_schedule(): void
    {
        $child = Child::create([
            'user_id' => $this->pengguna->id,
            'posyandu_id' => $this->posyandu->id,
            'name' => 'Rian Hidayat',
            'gender' => 'Laki-laki',
            'birth_date' => '2024-01-10',
            'mother_name' => $this->pengguna->name,
            'status' => 'Terverifikasi',
        ]);

        // Record child measurement (direct verification, triggers Z-Score calculation)
        $response = $this->actingAs($this->kader)->post("/kader/pemantauan-pertumbuhan/catat/{$child->id}", [
            'measured_at' => today()->toDateString(),
            'weight' => 8.5,
            'height' => 70.0,
            'head_circumference' => 44.0,
            'notes' => 'Tumbuh sehat',
        ]);
        $response->assertRedirect();
        
        $this->assertDatabaseHas('measurements', [
            'child_id' => $child->id,
            'weight' => 8.5,
            'height' => 70.0,
            'is_verified' => true,
        ]);

        // Make sure it calculated nutrition statuses
        $m = Measurement::where('child_id', $child->id)->first();
        $this->assertNotNull($m->status_gizi);
        $this->assertNotNull($m->status_tinggi);

        // Kader create schedule
        $response = $this->actingAs($this->kader)->post('/kader/jadwal-antrian/buat', [
            'date' => today()->addDays(5)->toDateString(),
            'timeStart' => '08:00',
            'timeEnd' => '11:00',
            'agenda' => 'Imunisasi Polio',
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('schedules', ['agenda' => 'Imunisasi Polio']);
    }

    // =========================================================================
    // 4. USER (BUNDA) CRUD TESTS
    // =========================================================================

    public function test_user_can_register_child_and_submit_self_measurement(): void
    {
        // View children
        $response = $this->actingAs($this->pengguna)->get('/anak-pertumbuhan');
        $response->assertStatus(200);

        // Register child
        $response = $this->actingAs($this->pengguna)->post('/anak-pertumbuhan/simpan', [
            'name' => 'Adit Nugroho',
            'gender' => 'Laki-laki',
            'birth_date' => '2024-03-15',
            'birth_place' => 'Cilacap',
            'birth_weight' => 3.2,
            'birth_height' => 49.0,
            'father_name' => 'Nugroho',
            'mother_name' => $this->pengguna->name,
        ]);
        $response->assertRedirect();
        
        $child = Child::where('name' , 'Adit Nugroho')->first();
        $this->assertEquals('Butuh Verifikasi', $child->status);

        // User submit self-measurement
        $response = $this->actingAs($this->pengguna)->post('/anak-pertumbuhan/catat', [
            'child_id' => $child->id,
            'measured_at' => today()->toDateString(),
            'weight' => 6.5,
            'height' => 62.0,
            'head_circumference' => 40.0,
            'notes' => 'Ukur mandiri di rumah',
        ]);
        $response->assertRedirect();

        $this->assertDatabaseHas('measurements', [
            'child_id' => $child->id,
            'weight' => 6.5,
            'is_verified' => false,
        ]);

        $m = Measurement::where('child_id', $child->id)->first();

        // Now Kader approves it
        $response = $this->actingAs($this->kader)->post("/kader/data-anak/verifikasi/{$child->id}", [
            'status' => 'approve',
            'measurement_id' => $m->id,
        ]);
        $response->assertRedirect();
        
        $this->assertTrue($m->fresh()->is_verified);
        $this->assertEquals('Terverifikasi', $child->fresh()->status);
    }

    public function test_user_can_take_queue_ticket(): void
    {
        $child = Child::create([
            'user_id' => $this->pengguna->id,
            'posyandu_id' => $this->posyandu->id,
            'name' => 'Bayu',
            'gender' => 'Laki-laki',
            'birth_date' => '2024-02-20',
            'mother_name' => $this->pengguna->name,
            'status' => 'Terverifikasi',
        ]);

        $schedule = Schedule::create([
            'posyandu_id' => $this->posyandu->id,
            'kader_id' => $this->kader->id,
            'scheduled_date' => today()->addDays(2),
            'time_start' => '08:00',
            'time_end' => '10:00',
            'agenda' => 'Imunisasi BCG',
            'status' => 'upcoming',
        ]);

        // Take queue ticket
        $response = $this->actingAs($this->pengguna)->post('/imunisasi-jadwal/antrian', [
            'schedule_id' => $schedule->id,
            'child_id' => $child->id,
            'agenda' => 'Imunisasi BCG',
        ]);
        $response->assertRedirect();

        $this->assertDatabaseHas('queues', [
            'schedule_id' => $schedule->id,
            'child_id' => $child->id,
            'status' => 'menunggu',
            'ticket_code' => 'A-01',
        ]);
    }
}
