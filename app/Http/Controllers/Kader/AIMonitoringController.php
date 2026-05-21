<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AIMonitoringController extends Controller
{
    public function index()
    {
        return inertia('Kader/AIMonitoring');
    }
}
