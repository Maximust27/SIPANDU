<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleQueueController extends Controller
{
    public function index()
    {
        return Inertia::render('Kader/ScheduleQueue');
    }
}
