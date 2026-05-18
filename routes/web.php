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

// --- Nanti Abang bisa tambahkan Controller Kader & Admin di sini ---
// use App\Http\Controllers\Kader\KaderDashboardController;
// use App\Http\Controllers\Admin\AdminDashboardController;


// =========================================================================
// PUBLIC ROUTES (Belum Login)
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
// GENERAL AUTH ROUTES (Bisa diakses Semua Role: Admin, Kader, User)
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
// Semua URL otomatis berawalan /kader/ (contoh: /kader/dashboard)
// Semua Name otomatis berawalan kader. (contoh: kader.dashboard)
Route::prefix('kader')->name('kader.')->middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard Kader
    Route::get('/dashboard', function () {
        // Asumsi file React Kader ada di resources/js/Pages/Kader/Dashboard.jsx
        return Inertia::render('Kader/Dashboard'); 
    })->name('dashboard');

    // Nanti rute kader lainnya taruh di sini
    // Route::get('/data-balita', ...)->name('balita.index');

});


// =========================================================================
// ROLE: ADMIN
// =========================================================================
// Semua URL otomatis berawalan /admin/
// Semua Name otomatis berawalan admin.
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard Admin
    Route::get('/dashboard', function () {
        // Asumsi file React Admin ada di resources/js/Pages/Admin/Dashboard.jsx
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Nanti rute admin lainnya taruh di sini
    // Route::get('/kelola-kader', ...)->name('kader.manage');

});


require __DIR__.'/auth.php';