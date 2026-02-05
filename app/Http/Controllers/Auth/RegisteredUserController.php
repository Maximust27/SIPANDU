<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Tambahkan validasi untuk field baru (phone, kecamatan, kelurahan)
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'required|string|max:20',        // Validasi No HP
            'kecamatan' => 'required|string|max:255',   // Validasi Kecamatan
            'kelurahan' => 'required|string|max:255',   // Validasi Kelurahan
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 2. Masukkan data ke database saat User::create
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,           // Simpan No HP
            'kabupaten' => 'Cilacap',             // Default Value (sesuai form)
            'kecamatan' => $request->kecamatan,   // Simpan Kecamatan
            'kelurahan' => $request->kelurahan,   // Simpan Kelurahan
            'role' => 'pengguna',                 // Default Role untuk pendaftar umum
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}