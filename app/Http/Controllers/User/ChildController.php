<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\Measurement;
use App\Models\Schedule;
use App\Services\StatusGiziCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class ChildController extends Controller
{
    /**
     * Tampilkan halaman data anak & riwayat pengukuran milik Bunda
     */
    public function index()
    {
        $user = Auth::user();

        $children = Child::with(['measurements' => function ($q) {
            $q->where('is_verified', true)->orderByDesc('measured_at');
        }, 'posyandu'])
        ->where('user_id', $user->id)
        ->get()
        ->map(function ($child) {
            $lastMeasurement = $child->measurements->first();
            $pendingCount    = $child->pendingMeasurements()->count();

            return [
                'id'           => $child->id,
                'name'         => $child->name,
                'nik'          => $child->nik,
                'gender'       => $child->gender,
                'birth_date'   => $child->birth_date?->format('Y-m-d'),
                'birth_place'  => $child->birth_place,
                'birth_weight' => $child->birth_weight,
                'birth_height' => $child->birth_height,
                'father_name'  => $child->father_name,
                'mother_name'  => $child->mother_name,
                'photo'        => $child->photo,
                'age_display'  => $child->age_display,
                'age_months'   => $child->age_in_months,
                'status'       => $child->status,
                'posyandu'     => $child->posyandu?->name,
                'pending_count' => $pendingCount,
                'last_measurement' => $lastMeasurement ? [
                    'weight'       => $lastMeasurement->weight,
                    'height'       => $lastMeasurement->height,
                    'status_gizi'  => $lastMeasurement->status_gizi,
                    'status_tinggi' => $lastMeasurement->status_tinggi,
                    'measured_at'  => $lastMeasurement->measured_at?->format('d M Y'),
                ] : null,
                'history' => $child->measurements->take(10)->map(fn($m) => [
                    'id'           => $m->id,
                    'measured_at'  => $m->measured_at?->format('Y-m-d'),
                    'age_months'   => $m->age_in_months,
                    'weight'       => $m->weight,
                    'height'       => $m->height,
                    'head_circumference' => $m->head_circumference,
                    'status_gizi'  => $m->status_gizi,
                    'status_tinggi' => $m->status_tinggi,
                    'z_score_bbu'  => $m->z_score_bbu,
                    'z_score_tbu'  => $m->z_score_tbu,
                    'notes'        => $m->notes,
                    'is_verified'  => $m->is_verified,
                ])->values(),
            ];
        });

        return Inertia::render('User/Children', [
            'children' => $children,
        ]);
    }

    /**
     * Daftarkan data anak baru oleh Bunda
     */
    public function store(Request $request)
    {
        $request->validate([
            'nik'          => 'nullable|string|max:20|unique:children,nik',
            'name'         => 'required|string|max:255',
            'gender'       => 'required|in:Laki-laki,Perempuan',
            'birth_date'   => 'required|date|before:today',
            'birth_place'  => 'nullable|string|max:255',
            'birth_weight' => 'nullable|numeric|min:0.5|max:10',
            'birth_height' => 'nullable|numeric|min:20|max:70',
            'father_name'  => 'nullable|string|max:255',
            'mother_name'  => 'nullable|string|max:255',
        ]);

        Child::create([
            'user_id'      => Auth::id(),
            'nik'          => $request->nik,
            'name'         => $request->name,
            'gender'       => $request->gender,
            'birth_date'   => $request->birth_date,
            'birth_place'  => $request->birth_place,
            'birth_weight' => $request->birth_weight,
            'birth_height' => $request->birth_height,
            'father_name'  => $request->father_name,
            'mother_name'  => $request->mother_name,
            'status'       => 'Butuh Verifikasi',
        ]);

        return redirect()->back()->with('success', 'Data anak berhasil didaftarkan. Menunggu verifikasi Kader.');
    }

    /**
     * Bunda catat pengukuran mandiri (menunggu verifikasi Kader)
     */
    public function storeMeasurement(Request $request)
    {
        $request->validate([
            'child_id'           => 'required|exists:children,id',
            'measured_at'        => 'required|date|before_or_equal:today',
            'weight'             => 'required|numeric|min:0.5|max:60',
            'height'             => 'nullable|numeric|min:20|max:130',
            'head_circumference' => 'nullable|numeric|min:20|max:65',
            'notes'              => 'nullable|string|max:500',
        ]);

        $child = Child::where('id', $request->child_id)
                      ->where('user_id', Auth::id())
                      ->firstOrFail();

        $ageInMonths = (int) Carbon::parse($child->birth_date)
            ->diffInMonths(Carbon::parse($request->measured_at));

        // Hitung z-score awal meski belum diverifikasi kader
        $giziResult = StatusGiziCalculator::calculate(
            weight:    $request->weight,
            height:    $request->height,
            headCirc:  $request->head_circumference,
            ageMonths: $ageInMonths,
            gender:    $child->gender
        );

        Measurement::create([
            'child_id'           => $child->id,
            'kader_id'           => null,
            'measured_at'        => $request->measured_at,
            'age_in_months'      => $ageInMonths,
            'weight'             => $request->weight,
            'height'             => $request->height,
            'head_circumference' => $request->head_circumference,
            'status_gizi'        => $giziResult['status_gizi'],
            'status_tinggi'      => $giziResult['status_tinggi'],
            'status_kepala'      => $giziResult['status_kepala'],
            'z_score_bbu'        => $giziResult['z_score_bbu'],
            'z_score_tbu'        => $giziResult['z_score_tbu'],
            'notes'              => $request->notes,
            'is_verified'        => false, // Menunggu verifikasi Kader
        ]);

        $child->update(['status' => 'Butuh Verifikasi']);

        return redirect()->back()->with('success', 'Data pengukuran berhasil dicatat. Menunggu verifikasi Kader Posyandu.');
    }
}