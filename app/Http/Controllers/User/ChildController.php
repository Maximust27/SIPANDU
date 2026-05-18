<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Child;

class ChildController extends Controller
{
    public function index()
    {
        // Di sini Abang bisa me-load data anak dari database
        // $childData = Child::where('user_id', auth()->id())->first();
        
        return Inertia::render('User/Children', [
            // 'child' => $childData
        ]);
    }

    public function storeMeasurement(Request $request)
    {
        $request->validate([
            'weight' => 'required|numeric',
            'height' => 'required|numeric',
        ]);

        // Proses simpan ke database di sini...

        return back()->with('success', 'Data pertumbuhan berhasil dicatat!');
    }
}