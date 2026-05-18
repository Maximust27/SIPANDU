<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EducationController extends Controller
{
    public function index()
    {
        return Inertia::render('User/EdukasiKesehatan'); // Sesuaikan nama file .jsx
    }
}