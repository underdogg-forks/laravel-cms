<?php

namespace App\Http\Controllers;

use App\Page;
use Illuminate\Http\Request;

use App\Http\Requests;

class AdminController extends Controller
{
    /**
     * @var Page
     */
    private $pageModel;
    private $slug;

    /**
     * AdminController constructor.
     * @param Page $pageModel
     */
    public function __construct(Page $pageModel)
    {
        $this->slug = '';
        $this->pageModel = $pageModel;
    }

    /**
     * Show the "Pages" page
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getPages()
    {
        return view('admin.pages');
    }

    /**
     * Show the "Theme" page
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getThemes()
    {
        return view('admin.themes');
    }

    /**
     * Admin dashboard
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getIndex()
    {
        $pages = $this->pageModel->latest()->take(5)->get();

        return view('index', compact('pages'));
    }

    public function getUsers()
    {
        return view('admin.users');
    }
}
