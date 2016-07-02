<?php

namespace App\Http\Controllers;

use App\Page;
use App\TV;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;


class AdminController extends Controller
{
    /**
     * @var Page
     */
    private $pageModel;

    /**
     * @var string
     */
    private $slug;

    /**
     * @var TV
     */
    private $tvModel;

    /**
     * AdminController constructor.
     * @param Page $pageModel
     * @param TV $tvModel
     */
    public function __construct(Page $pageModel, TV $tvModel)
    {
        $this->slug = '';
        $this->pageModel = $pageModel;
        $this->tvModel = $tvModel;
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

        $totalPageViews = DB::select('SELECT SUM(views) as sum from pages');

        $totalPageViews = $totalPageViews[0]->sum;

        return view('index', compact('pages', 'totalPageViews'));
    }

    /**
     * Manage users page
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getUsers()
    {
        return view('admin.users');
    }
}

