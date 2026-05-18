<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AIAssistantController extends Controller
{
    public function index()
    {
        // Return view ke file React yang baru kita buat
        return Inertia::render('User/AIAssistant');
    }
}