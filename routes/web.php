<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// =========================================================================
// CONTROLLERS IMPORT
// =========================================================================
use App\Http\Controllers\ProfileController;

// --- User Controllers ---
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\ChildController;
use App\Http\Controllers\User\ImmunizationController;
use App\Http\Controllers\User\AIAssistantController;
use App\Http\Controllers\User\EducationController;

// --- Kader Controllers ---
use App\Http\Controllers\Kader\DashboardController as KaderDashboardController;
use App\Http\Controllers\Kader\ChildController as KaderChildController;
use App\Http\Controllers\Kader\GrowthMonitoringController as KaderGrowthMonitoringController;
use App\Http\Controllers\Kader\ScheduleQueueController;
use App\Http\Controllers\Kader\AIMonitoringController;

// --- Admin Controllers ---
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\PosyanduManagementController;
use App\Http\Controllers\Admin\ReportsController;

// =========================================================================
// PUBLIC ROUTES
// =========================================================================
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});


// =========================================================================
// GENERAL AUTH ROUTES (Bisa diakses Semua Role)
// =========================================================================
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// =========================================================================
// ROLE: USER (Bunda) — hanya role 'pengguna' yang bisa akses
// =========================================================================
Route::middleware(['auth', 'verified', 'role:pengguna'])->group(function () {

    // Dashboard User
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Anak & Pertumbuhan
    Route::get('/anak-pertumbuhan', [ChildController::class, 'index'])->name('Children.index');
    Route::post('/anak-pertumbuhan/simpan', [ChildController::class, 'store'])->name('Children.store');
    Route::post('/anak-pertumbuhan/catat', [ChildController::class, 'storeMeasurement'])->name('Children.storeMeasurement');

    // Imunisasi & Jadwal
    Route::get('/imunisasi-jadwal', [ImmunizationController::class, 'index'])->name('immunization.index');
    Route::post('/imunisasi-jadwal/antrian', [ImmunizationController::class, 'takeQueue'])->name('immunization.queue');

    // AI Assistant & Edukasi
    Route::get('/ai-assistant', [AIAssistantController::class, 'index'])->name('ai-assistant.index');
    Route::post('/ai-assistant/chat', [AIAssistantController::class, 'chat'])->name('ai-assistant.chat');
    Route::get('/edukasi-kesehatan', [EducationController::class, 'index'])->name('education.index');
});


// =========================================================================
// ROLE: KADER — hanya role 'kader' yang bisa akses
// =========================================================================
Route::prefix('kader')->name('kader.')->middleware(['auth', 'verified', 'role:kader'])->group(function () {

    // Dashboard Kader
    Route::get('/dashboard', [KaderDashboardController::class, 'index'])->name('dashboard');

    // Kelola Data Anak & Orang Tua
    Route::get('/data-anak', [KaderChildController::class, 'index'])->name('children.index');
    Route::post('/data-anak/simpan', [KaderChildController::class, 'store'])->name('children.store');
    Route::put('/data-anak/update/{id}', [KaderChildController::class, 'update'])->name('children.update');
    Route::post('/data-anak/verifikasi/{id}', [KaderChildController::class, 'verify'])->name('children.verify');

    // Pemantauan Pertumbuhan (KMS)
    Route::get('/pemantauan-pertumbuhan', [KaderGrowthMonitoringController::class, 'index'])->name('growth-monitoring.index');
    Route::post('/pemantauan-pertumbuhan/catat/{childId}', [KaderGrowthMonitoringController::class, 'store'])->name('growth-monitoring.store');

    // Jadwal & Antrian Posyandu
    Route::get('/jadwal-antrian', [ScheduleQueueController::class, 'index'])->name('schedule.index');
    Route::post('/jadwal-antrian/buat', [ScheduleQueueController::class, 'store'])->name('schedule.store');
    Route::patch('/jadwal-antrian/panggil/{queueId}', [ScheduleQueueController::class, 'callQueue'])->name('schedule.call');
    Route::patch('/jadwal-antrian/selesai/{queueId}', [ScheduleQueueController::class, 'finishQueue'])->name('schedule.finish');

    // AI Monitoring
    Route::get('/ai-monitoring', [AIMonitoringController::class, 'index'])->name('ai-monitoring.index');
    Route::post('/ai-monitoring/analyze/{childId}', [AIMonitoringController::class, 'analyze'])->name('ai-monitoring.analyze');
});


// =========================================================================
// ROLE: ADMIN — hanya role 'admin' yang bisa akses
// =========================================================================
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'role:admin'])->group(function () {

    // Dashboard Admin
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Kelola Akun Pengguna
    Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
    Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
    Route::put('/users/{id}', [UserManagementController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserManagementController::class, 'destroy'])->name('users.destroy');
    Route::patch('/users/{id}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('users.toggle-status');
    Route::post('/users/{id}/reset-password', [UserManagementController::class, 'resetPassword'])->name('users.reset-password');

    // Kelola Posyandu
    Route::get('/posyandu', [PosyanduManagementController::class, 'index'])->name('posyandu.index');
    Route::post('/posyandu', [PosyanduManagementController::class, 'store'])->name('posyandu.store');
    Route::put('/posyandu/{id}', [PosyanduManagementController::class, 'update'])->name('posyandu.update');
    Route::delete('/posyandu/{id}', [PosyanduManagementController::class, 'destroy'])->name('posyandu.destroy');

    // Laporan & Statistik
    Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');
});


require __DIR__.'/auth.php';