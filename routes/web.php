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
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
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
// ROLE: USER (Bunda)
// =========================================================================
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard User
    Route::get('/dashboard', function () {
        return Inertia::render('User/Dashboard');
    })->name('dashboard');

    // Anak & Pertumbuhan
    Route::get('/anak-pertumbuhan', [ChildController::class, 'index'])->name('Children.index');
    Route::post('/anak-pertumbuhan/catat', [ChildController::class, 'storeMeasurement'])->name('Children.store');
    
    // Imunisasi & Jadwal
    Route::get('/imunisasi-jadwal', [ImmunizationController::class, 'index'])->name('immunization.index');
    Route::post('/imunisasi-jadwal/antrian', [ImmunizationController::class, 'takeQueue'])->name('immunization.queue');
    
    // AI Assistant & Edukasi
    Route::get('/ai-assistant', [AIAssistantController::class, 'index'])->name('ai-assistant.index');
    Route::get('/edukasi-kesehatan', [EducationController::class, 'index'])->name('education.index');

});


// =========================================================================
// ROLE: KADER
// =========================================================================
Route::prefix('kader')->name('kader.')->middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard Kader
    Route::get('/dashboard', function () {
        return Inertia::render('Kader/Dashboard'); 
    })->name('dashboard');

    // Kelola Data Anak & Orang Tua (Menghubungkan ke file Canvas kader/children-management.jsx)
    Route::get('/data-anak', [KaderChildController::class, 'index'])->name('children.index');
    Route::post('/data-anak/simpan', [KaderChildController::class, 'store'])->name('children.store');
    Route::post('/data-anak/update/{id}', [KaderChildController::class, 'update'])->name('children.update');
    Route::post('/data-anak/verifikasi/{id}', [KaderChildController::class, 'verify'])->name('children.verify');

    // Kelola Pemantauan Pertumbuhan (Menghubungkan ke file Canvas kader/growth-monitoring.jsx)
    Route::get('/pemantauan-pertumbuhan', [KaderGrowthMonitoringController::class, 'index'])->name('growth-monitoring.index');
    
    
    Route::get('/jadwal-antrian', [ScheduleQueueController::class, 'index'])->name('schedule.index');

    Route::get('/ai-monitoring', [AIMonitoringController::class, 'index'])->name('ai-monitoring.index');
});


// =========================================================================
// ROLE: ADMIN
// =========================================================================
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard Admin
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Kelola Akun Pengguna
    Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
    Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
    Route::put('/users/{id}', [UserManagementController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserManagementController::class, 'destroy'])->name('users.destroy');
    
    // Aksi Tambahan Akun
    Route::patch('/users/{id}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('users.toggle-status');
    Route::post('/users/{id}/reset-password', [UserManagementController::class, 'resetPassword'])->name('users.reset-password');

    // Kelola Posyandu
    Route::get('/posyandu', [PosyanduManagementController::class, 'index'])->name('posyandu.index');

    // Laporan & Statistik
    Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');

});


require __DIR__.'/auth.php';