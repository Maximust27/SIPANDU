<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PosyanduManagementController extends Controller
{
    public function index()
    {
        return inertia('Admin/PosyanduManagement');
    }
}
