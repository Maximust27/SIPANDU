<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();
    
        $role = $request->user()->role; 
    
        // Bersihkan url.intended jika tidak sesuai dengan role user untuk mencegah error 403
        $intendedUrl = $request->session()->get('url.intended');
        if ($intendedUrl) {
            $path = parse_url($intendedUrl, PHP_URL_PATH) ?? '';
            $isValid = false;

            if ($role === 'admin') {
                if (str_starts_with($path, '/admin') || str_starts_with($path, '/profile')) {
                    $isValid = true;
                }
            } elseif ($role === 'kader') {
                if (str_starts_with($path, '/kader') || str_starts_with($path, '/profile')) {
                    $isValid = true;
                }
            } else {
                // Default untuk role 'pengguna' (Bunda)
                if (!str_starts_with($path, '/admin') && !str_starts_with($path, '/kader')) {
                    $isValid = true;
                }
            }

            if (!$isValid) {
                $request->session()->forget('url.intended');
            }
        }

        if ($role === 'admin') {
            return redirect()->intended(route('admin.dashboard'));
        } elseif ($role === 'kader') {
            return redirect()->intended(route('kader.dashboard'));
        } else {
            // Default untuk role 'user' (Bunda)
            return redirect()->intended(route('dashboard'));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
