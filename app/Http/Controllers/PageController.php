<?php

namespace App\Http\Controllers;

use App\Page;
use App\Theme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use App\Http\Requests;

use Cocur\Slugify\Slugify;

class PageController extends Controller
{
    private $pageModel;

    private $request;

    private $themeModel;

    /**
     * PageController constructor.
     * @param Page $pageModel
     * @param Request $request
     * @param Theme $themeModel
     */
    public function __construct(Page $pageModel, Request $request, Theme $themeModel)
    {
        $this->pageModel = $pageModel;
        $this->request = $request;
        $this->themeModel = $themeModel;
    }

    public function pages()
    {
        $pages = $this->pageModel->latest()->get();

        return successResponse('Retrieved pages', ['pages' => $pages]);
    }

    public function create()
    {
        $validate = validateAjaxForm($this->request-all(), [
            'name'     => 'required|unique:pages',
            'slug'     => 'required|unique:pages',
            'template' => 'required'
        ]);

        if ($validate instanceof JsonResponse) {
            return $validate;
        }

        $slugify = new Slugify();

        $page = $this->pageModel->create([
            'name' => $this->request->name,
            'slug' => $slugify->slugify($this->request->name),
            'template' => $this->request->template
        ]);

        return successResponse('Page created', ['slug' => $page->slug]);
    }

    public function show($slug)
    {
        $page = $this->pageModel->whereSlug($slug)->firstOrFail();

        $theme = $this->themeModel->whereActive(true)->firstOrFail();

        return view('themes.' . $theme->name . '.templates.' . $page->template);
    }
}
