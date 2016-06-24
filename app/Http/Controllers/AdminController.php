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

    /**
     * AdminController constructor.
     * @param Page $pageModel
     */
    public function __construct(Page $pageModel)
    {

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
}
