<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\Measurement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class ChildController extends Controller
{
    /**
     * Tampilkan daftar anak di wilayah kader ini (berdasarkan posyandu atau kelurahan)
     */
    public function index()
    {
        $kader = Auth::user();

        // Query anak di wilayah kader (berdasarkan posyandu atau kelurahan)
        $query = Child::with(['parent', 'measurements' => function ($q) {
            $q->latest('measured_at');
        }]);

        if ($kader->posyandu_id) {
            $query->where('posyandu_id', $kader->posyandu_id);
        } elseif ($kader->kelurahan) {
            $query->whereHas('parent', fn($q) => $q->where('kelurahan', $kader->kelurahan));
        }

        $children = $query->latest()->get()->map(function ($child) {
            $lastMeasurement = $child->measurements->first();
            $pendingMeasurements = $child->measurements->where('is_verified', false);

            return [
                'id'          => $child->id,
                'name'        => $child->name,
                'nik'         => $child->nik,
                'gender'      => $child->gender,
                'birth_date'  => $child->birth_date?->format('Y-m-d'),
                'age_str'     => $child->age_display,
                'father_name' => $child->father_name,
                'mother_name' => $child->mother_name,
                'phone'       => $child->parent?->phone,
                'address'     => $child->parent?->address,
                'status'      => $child->status,
                'pending_verification' => $pendingMeasurements->isNotEmpty() ? [
                    'id'           => $pendingMeasurements->first()->id,
                    'weight'       => $pendingMeasurements->first()->weight,
                    'height'       => $pendingMeasurements->first()->height,
                    'head_circulation' => $pendingMeasurements->first()->head_circumference,
                    'date'         => $pendingMeasurements->first()->measured_at?->format('Y-m-d'),
                    'submitted_by' => 'Bunda (Input Mandiri)',
                ] : null,
                'history' => $child->measurements->where('is_verified', true)->take(5)->map(fn($m) => [
                    'id'               => $m->id,
                    'date'             => $m->measured_at?->format('Y-m-d'),
                    'weight'           => $m->weight,
                    'height'           => $m->height,
                    'head_circulation' => $m->head_circumference,
                    'notes'            => $m->notes,
                ])->values(),
            ];
        });

        return Inertia::render('Kader/ChildrenManagement', [
            'initialChildren' => $children,
        ]);
    }

    /**
     * Simpan data anak baru oleh Kader
     */
    public function store(Request $request)
    {
        $request->validate([
            'nik'         => 'nullable|string|max:20|unique:children,nik',
            'name'        => 'required|string|max:255',
            'gender'      => 'required|in:Laki-laki,Perempuan',
            'birth_date'  => 'required|date|before:today',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'required|string|max:255',
            'phone'       => 'required|string|max:20',
            'address'     => 'nullable|string|max:500',
        ]);

        $kader = Auth::user();

        // Cari atau buat User Bunda (pengguna) berdasarkan phone/email
        $email = $request->phone . '@sipandu.id';
        $user = User::where('phone', $request->phone)
            ->orWhere('email', $email)
            ->first();

        if (!$user) {
            $user = User::create([
                'name'       => $request->mother_name,
                'email'      => $email,
                'phone'      => $request->phone,
                'role'       => 'pengguna',
                'status'     => 'aktif',
                'address'    => $request->address,
                'kabupaten'  => $kader->kabupaten ?? 'Cilacap',
                'kecamatan'  => $kader->kecamatan,
                'kelurahan'  => $kader->kelurahan,
                'password'   => \Illuminate\Support\Facades\Hash::make('password'),
            ]);
        } else {
            if ($request->address) {
                $user->update(['address' => $request->address]);
            }
        }

        Child::create([
            'nik'          => $request->nik,
            'name'         => $request->name,
            'gender'       => $request->gender,
            'birth_date'   => $request->birth_date,
            'father_name'  => $request->father_name,
            'mother_name'  => $request->mother_name,
            'user_id'      => $user->id,
            'posyandu_id'  => $kader->posyandu_id,
            'status'       => 'Terverifikasi',
        ]);

        return redirect()->back()->with('success', 'Data anak berhasil didaftarkan.');
    }

    /**
     * Update profil anak
     */
    public function update(Request $request, $id)
    {
        $child = Child::findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:255',
            'gender'      => 'required|in:Laki-laki,Perempuan',
            'birth_date'  => 'required|date',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'phone'       => 'nullable|string|max:20',
            'address'     => 'nullable|string|max:500',
        ]);

        $child->update($request->only([
            'nik', 'name', 'gender', 'birth_date', 'father_name', 'mother_name',
        ]));

        if ($child->parent) {
            $parentData = [];
            if ($request->phone) {
                $parentData['phone'] = $request->phone;
            }
            if ($request->address) {
                $parentData['address'] = $request->address;
            }
            if ($request->mother_name) {
                $parentData['name'] = $request->mother_name;
            }
            if (!empty($parentData)) {
                $child->parent->update($parentData);
            }
        }

        return redirect()->back()->with('success', 'Data profil anak berhasil diperbarui.');
    }

    /**
     * Verifikasi atau tolak pengukuran mandiri dari Bunda
     */
    public function verify(Request $request, $id)
    {
        $request->validate([
            'status'         => 'required|in:approve,reject',
            'measurement_id' => 'required|exists:measurements,id',
        ]);

        $measurement = \App\Models\Measurement::findOrFail($request->measurement_id);
        $child       = Child::findOrFail($id);

        if ($request->status === 'approve') {
            $measurement->update([
                'is_verified' => true,
                'verified_at' => now(),
                'kader_id'    => Auth::id(),
            ]);
            $child->update(['status' => 'Terverifikasi']);
            $message = 'Pengukuran berhasil disetujui dan dicatat.';
        } else {
            $measurement->delete();
            $child->update(['status' => 'Terverifikasi']);
            $message = 'Pengukuran berhasil ditolak dan dihapus.';
        }

        return redirect()->back()->with('success', $message);
    }
}