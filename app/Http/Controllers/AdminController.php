<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class AdminController extends Controller
{
    public function getPages()
    {
        return view('admin.pages');
    }

    public function getThemes()
    {
        return view('admin.themes');
    }
}
