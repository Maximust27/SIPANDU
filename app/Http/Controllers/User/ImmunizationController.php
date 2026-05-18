<?php

namespace App\Http\Controllers\User; 

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImmunizationController extends Controller
{
    public function index()
    {
        return Inertia::render('User/Immunization');
    }

    public function takeQueue(Request $request)
    {
        return back()->with('success', 'Berhasil mengambil tiket antrian!');
    }
}