<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\ChildController;
use App\Http\Controllers\User\ImmunizationController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('User/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/anak-pertumbuhan', [ChildController::class, 'index'])->name('Children.index');
    Route::post('/anak-pertumbuhan/catat', [ChildController::class, 'storeMeasurement'])->name('Children.store');
    Route::get('/imunisasi-jadwal', [ImmunizationController::class, 'index'])->name('immunization.index');
    Route::post('/imunisasi-jadwal/antrian', [ImmunizationController::class, 'takeQueue'])->name('immunization.queue');
});

require __DIR__.'/auth.php';
