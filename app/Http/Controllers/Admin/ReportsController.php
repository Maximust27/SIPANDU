<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\Measurement;
use App\Models\User;
use App\Models\Posyandu;
use App\Models\Queue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        $year = intval($request->input('year', now()->year));

        $months = [];
        if ($year === intval(now()->year)) {
            // Last 6 months up to now
            for ($i = 5; $i >= 0; $i--) {
                $months[] = now()->subMonths($i);
            }
        } else {
            // Last 6 months of the selected year
            $endOfYear = \Carbon\Carbon::createFromDate($year, 12, 31);
            for ($i = 5; $i >= 0; $i--) {
                $months[] = $endOfYear->copy()->subMonths($i);
            }
        }

        $monthlyStunting = [];
        $monthlyImunisasi = [];
        
        foreach ($months as $m) {
            $start = $m->copy()->startOfMonth();
            $end = $m->copy()->endOfMonth();
            
            // Count stunted cases in this month
            $stuntingCases = Measurement::where('is_verified', true)
                ->whereBetween('measured_at', [$start, $end])
                ->where(function($q) {
                    $q->where('status_tinggi', 'Pendek (Stunted)')
                      ->orWhere('status_tinggi', 'Sangat Pendek (Severely Stunted)');
                })
                ->distinct('child_id')
                ->count('child_id');
                
            // Count immunization cases in this month (completed queues)
            $imunisasiCases = Queue::where('status', 'selesai')
                ->whereBetween('finished_at', [$start, $end])
                ->count();

            $monthlyStunting[] = [
                'month' => $m->translatedFormat('M'),
                'cases' => $stuntingCases,
            ];
            
            $monthlyImunisasi[] = [
                'month' => $m->translatedFormat('M'),
                'cases' => $imunisasiCases,
            ];
        }

        $startDate = \Carbon\Carbon::createFromDate($year, 1, 1)->startOfDay();
        $endDate = \Carbon\Carbon::createFromDate($year, 12, 31)->endOfDay();

        $stuntingRegions = [];
        $imunisasiRegions = [];
        
        $posyandus = Posyandu::all();
        foreach ($posyandus as $p) {
            // Stunting regions
            $totalAnak = Child::where('posyandu_id', $p->id)
                ->where('created_at', '<=', $endDate)
                ->count();

            $stuntingCount = Child::where('posyandu_id', $p->id)
                ->whereIn('id', function($query) use ($startDate, $endDate) {
                    $query->select('child_id')
                        ->from('measurements')
                        ->whereBetween('measured_at', [$startDate, $endDate])
                        ->whereIn('id', function($subQuery) use ($startDate, $endDate) {
                            $subQuery->select(DB::raw('MAX(id)'))
                                ->from('measurements')
                                ->where('is_verified', true)
                                ->whereBetween('measured_at', [$startDate, $endDate])
                                ->groupBy('child_id');
                        })
                        ->where(function($q) {
                            $q->where('status_tinggi', 'Pendek (Stunted)')
                              ->orWhere('status_tinggi', 'Sangat Pendek (Severely Stunted)');
                        });
                })
                ->count();
            
            $stuntingPercentage = $totalAnak > 0 ? number_format(($stuntingCount / $totalAnak) * 100, 1) . '%' : '0%';
            
            $stuntingRegions[] = [
                'name' => $p->name,
                'totalAnak' => $totalAnak,
                'stunting' => $stuntingCount,
                'percentage' => $stuntingPercentage,
            ];
            
            // Imunisasi regions
            $totalQueues = Queue::whereIn('schedule_id', function($q) use ($p) {
                $q->select('id')->from('schedules')->where('posyandu_id', $p->id);
            })
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
            
            $achievedQueues = Queue::whereIn('schedule_id', function($q) use ($p) {
                $q->select('id')->from('schedules')->where('posyandu_id', $p->id);
            })
            ->where('status', 'selesai')
            ->whereBetween('finished_at', [$startDate, $endDate])
            ->count();
            
            $imunisasiPercentage = $totalQueues > 0 ? number_format(($achievedQueues / $totalQueues) * 100, 1) . '%' : '0%';
            
            $imunisasiRegions[] = [
                'name' => $p->name,
                'target' => $totalQueues,
                'achieved' => $achievedQueues,
                'percentage' => $imunisasiPercentage,
            ];
        }

        return Inertia::render('Admin/Reports', [
            'initialStuntingData' => [
                'monthly' => $monthlyStunting,
                'regions' => $stuntingRegions,
            ],
            'initialImunisasiData' => [
                'monthly' => $monthlyImunisasi,
                'regions' => $imunisasiRegions,
            ],
            'currentYear' => (string) $year,
        ]);
    }
}
