<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     * Contoh pemakaian di routes: middleware('role:admin') atau middleware('role:kader,admin')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Pastikan user sudah login
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Pastikan akun aktif
        if ($request->user()->status === 'nonaktif') {
            abort(403, 'Akun Anda telah dinonaktifkan. Hubungi administrator.');
        }

        // Cek apakah role user termasuk dalam daftar role yang diizinkan
        if (!in_array($request->user()->role, $roles)) {
            abort(403, 'Anda tidak memiliki izin untuk mengakses halaman ini.');
        }

        return $next($request);
    }
}
