<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PosyanduManagementController extends Controller
{
    /**
     * Tampilkan daftar posyandu dengan statistik
     */
    public function index()
    {
        $posyandus = Posyandu::withCount(['children', 'kaders', 'schedules'])
            ->with('kaders:id,name,posyandu_id')
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id'              => $p->id,
                    'name'            => $p->name,
                    'kelurahan'       => $p->kelurahan,
                    'kecamatan'       => $p->kecamatan,
                    'kabupaten'       => $p->kabupaten,
                    'address'         => $p->address,
                    'contact'         => $p->contact,
                    'quota_per_session' => $p->quota_per_session,
                    'status'          => $p->status,
                    'total_anak'      => $p->children_count,
                    'total_kader'     => $p->kaders_count,
                    'total_jadwal'    => $p->schedules_count,
                    'kaders'          => $p->kaders->map(fn($k) => ['id' => $k->id, 'name' => $k->name]),
                ];
            });

        // Kader yang belum assigned ke posyandu manapun
        $availableKaders = User::where('role', 'kader')
            ->whereNull('posyandu_id')
            ->get(['id', 'name']);

        return Inertia::render('Admin/PosyanduManagement', [
            'initialPosyandu' => $posyandus,
            'availableKaders' => $availableKaders,
        ]);
    }

    /**
     * Buat posyandu baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'             => 'required|string|max:255',
            'kelurahan'        => 'required|string|max:255',
            'kecamatan'        => 'required|string|max:255',
            'address'          => 'nullable|string',
            'contact'          => 'nullable|string|max:20',
            'quota_per_session' => 'nullable|integer|min:1|max:500',
        ]);

        Posyandu::create([
            'name'             => $request->name,
            'kelurahan'        => $request->kelurahan,
            'kecamatan'        => $request->kecamatan,
            'kabupaten'        => 'Cilacap',
            'address'          => $request->address,
            'contact'          => $request->contact,
            'quota_per_session' => $request->quota_per_session ?? 50,
            'status'           => 'aktif',
        ]);

        return redirect()->back()->with('success', 'Posyandu baru berhasil ditambahkan.');
    }

    /**
     * Update data posyandu
     */
    public function update(Request $request, $id)
    {
        $posyandu = Posyandu::findOrFail($id);

        $request->validate([
            'name'             => 'required|string|max:255',
            'kelurahan'        => 'required|string|max:255',
            'kecamatan'        => 'required|string|max:255',
            'address'          => 'nullable|string',
            'contact'          => 'nullable|string|max:20',
            'quota_per_session' => 'nullable|integer|min:1|max:500',
            'status'           => 'required|in:aktif,nonaktif',
        ]);

        $posyandu->update($request->only([
            'name', 'kelurahan', 'kecamatan', 'address',
            'contact', 'quota_per_session', 'status'
        ]));

        return redirect()->back()->with('success', 'Data posyandu berhasil diperbarui.');
    }

    /**
     * Hapus posyandu
     */
    public function destroy($id)
    {
        $posyandu = Posyandu::findOrFail($id);

        // Lepas semua kader dari posyandu ini sebelum hapus
        User::where('posyandu_id', $id)->update(['posyandu_id' => null]);

        $posyandu->delete();

        return redirect()->back()->with('success', 'Posyandu berhasil dihapus.');
    }
}
