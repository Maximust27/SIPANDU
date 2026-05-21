<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\Measurement;
use App\Services\StatusGiziCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GrowthMonitoringController extends Controller
{
    /**
     * Tampilkan halaman pemantauan pertumbuhan (KMS) dengan data real
     */
    public function index()
    {
        $kader = Auth::user();

        $query = Child::with(['measurements' => function ($q) {
            $q->where('is_verified', true)->orderBy('measured_at');
        }]);

        if ($kader->posyandu_id) {
            $query->where('posyandu_id', $kader->posyandu_id);
        } elseif ($kader->kelurahan) {
            $query->whereHas('parent', fn($q) => $q->where('kelurahan', $kader->kelurahan));
        }

        $children = $query->get()->map(function ($child) {
            return [
                'id'          => $child->id,
                'name'        => $child->name,
                'gender'      => $child->gender,
                'ageMonths'   => $child->age_in_months,
                'ageStr'      => $child->age_display,
                'birthDate'   => $child->birth_date?->format('Y-m-d'),
                'motherName'  => $child->parent?->name,
                'measurements' => $child->measurements->map(fn($m) => [
                    'id'          => $m->id,
                    'date'        => $m->measured_at?->format('Y-m-d'),
                    'weight'      => (float) $m->weight,
                    'height'      => (float) $m->height,
                    'headCirc'    => (float) $m->head_circumference,
                    'statusGizi'  => $m->status_gizi,
                    'statusTinggi' => $m->status_tinggi,
                    'statusKepala' => $m->status_kepala,
                    'zScoreBbu'   => $m->z_score_bbu,
                    'zScoreTbu'   => $m->z_score_tbu,
                ])->values(),
            ];
        });

        return Inertia::render('Kader/GrowthMonitoring', [
            'initialChildren' => $children,
        ]);
    }

    /**
     * Catat pengukuran baru oleh Kader (langsung verified)
     */
    public function store(Request $request, $childId)
    {
        $child = Child::findOrFail($childId);

        $request->validate([
            'measured_at'        => 'required|date|before_or_equal:today',
            'weight'             => 'required|numeric|min:0.5|max:60',
            'height'             => 'nullable|numeric|min:20|max:130',
            'head_circumference' => 'nullable|numeric|min:20|max:65',
            'notes'              => 'nullable|string|max:500',
        ]);

        // Hitung umur saat pengukuran
        $ageInMonths = (int) \Carbon\Carbon::parse($child->birth_date)
            ->diffInMonths(\Carbon\Carbon::parse($request->measured_at));

        // Hitung status gizi otomatis via WHO z-score
        $giziResult = StatusGiziCalculator::calculate(
            weight:   $request->weight,
            height:   $request->height,
            headCirc: $request->head_circumference,
            ageMonths: $ageInMonths,
            gender:   $child->gender
        );

        Measurement::create([
            'child_id'          => $child->id,
            'kader_id'          => Auth::id(),
            'measured_at'       => $request->measured_at,
            'age_in_months'     => $ageInMonths,
            'weight'            => $request->weight,
            'height'            => $request->height,
            'head_circumference' => $request->head_circumference,
            'status_gizi'       => $giziResult['status_gizi'],
            'status_tinggi'     => $giziResult['status_tinggi'],
            'status_kepala'     => $giziResult['status_kepala'],
            'z_score_bbu'       => $giziResult['z_score_bbu'],
            'z_score_tbu'       => $giziResult['z_score_tbu'],
            'notes'             => $request->notes,
            'is_verified'       => true, // Kader input = langsung verified
            'verified_at'       => now(),
        ]);

        return redirect()->back()->with('success', 'Data pengukuran berhasil dicatat. Status gizi dihitung otomatis.');
    }
}