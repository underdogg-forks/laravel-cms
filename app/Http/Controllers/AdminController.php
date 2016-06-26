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

    public function getIndex()
    {
        $pages = $this->pageModel->latest()->take(5)->get();

        return view('index', compact('pages'));
    }

    public function test()
    {
        $page = $this->pageModel->with('allParents')->whereId(7)->first();

        if ($page->parent->count()) {
            $this->getParentSlug($page->parent);
        }

        $this->slug .= $page->slug;

        dd($this->slug);

        return response()->json($this->slug);
    }

    function getParentSlug($parent) {
        if ($parent->parent && $parent->parent->count()) {
            $this->slug .= $parent->slug . '/';
            $this->getParentSlug($parent->parent);
        } else {
            $this->slug .= $parent->slug . '/';

            $temp = explode('/', $this->slug);

            $this->slug = implode('/', array_reverse($temp)) . '/';
        }
    }
}
