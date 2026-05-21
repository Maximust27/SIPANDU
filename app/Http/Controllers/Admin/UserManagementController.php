<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Posyandu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Tampilkan halaman manajemen user dengan semua data dari DB
     */
    public function index()
    {
        $users = User::with('posyandu')
            ->whereIn('role', ['kader', 'pengguna'])
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'email'       => $user->email,
                    'phone'       => $user->phone,
                    'address'     => $user->address,
                    'role'        => $user->role,
                    'status'      => $user->status,
                    'kecamatan'   => $user->kecamatan,
                    'kelurahan'   => $user->kelurahan,
                    'posyandu'    => $user->posyandu ? $user->posyandu->name : null,
                    'posyandu_id' => $user->posyandu_id,
                    'created_at'  => $user->created_at->format('d M Y'),
                ];
            });

        $posyanduList = Posyandu::where('status', 'aktif')
            ->get(['id', 'name', 'kelurahan']);

        return Inertia::render('Admin/UserManagement', [
            'initialUsers'   => $users,
            'posyanduList'   => $posyanduList,
        ]);
    }

    /**
     * Buat akun Kader baru (hanya Admin yang bisa)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'phone'       => 'required|string|max:20',
            'address'     => 'required|string',
            'role'        => 'required|in:kader,pengguna',
            'posyandu_id' => 'nullable|exists:posyandu,id',
        ]);

        User::create([
            'name'        => $request->name,
            'email'       => $request->email,
            'phone'       => $request->phone,
            'address'     => $request->address,
            'role'        => $request->role,
            'status'      => 'aktif',
            'kabupaten'   => 'Cilacap',
            'posyandu_id' => $request->posyandu_id,
            'password'    => Hash::make('password'), // Password default
        ]);

        return redirect()->back()->with('success', 'Akun berhasil dibuat. Password default: password');
    }

    /**
     * Update data profil kader
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email,' . $id,
            'phone'       => 'nullable|string|max:20',
            'address'     => 'nullable|string',
            'role'        => 'required|in:kader,pengguna',
            'posyandu_id' => 'nullable|exists:posyandu,id',
        ]);

        $user->update([
            'name'        => $request->name,
            'email'       => $request->email,
            'phone'       => $request->phone,
            'address'     => $request->address,
            'role'        => $request->role,
            'posyandu_id' => $request->posyandu_id,
        ]);

        return redirect()->back()->with('success', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Hapus akun pengguna
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Jangan bisa hapus diri sendiri
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Akun berhasil dihapus.');
    }

    /**
     * Aktifkan / Nonaktifkan akun
     */
    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menonaktifkan akun sendiri.');
        }

        $user->update([
            'status' => $request->status,
        ]);

        $statusText = $request->status === 'aktif' ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()->with('success', "Akun {$user->name} berhasil {$statusText}.");
    }

    /**
     * Reset password ke default 'password'
     */
    public function resetPassword($id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'password' => Hash::make('password'),
        ]);

        return redirect()->back()->with('success', "Password {$user->name} berhasil direset ke: password");
    }
}
