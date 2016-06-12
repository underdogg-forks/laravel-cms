<?php

namespace App\Http\Controllers;

use App\Page;
use App\TV;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use App\Http\Requests;

use Cocur\Slugify\Slugify;
use Illuminate\Support\Facades\Storage;

use Symfony\Component\Yaml\Yaml;

class PageController extends Controller
{
    private $pageModel;

    private $request;

    private $tvModel;

    /**
     * PageController constructor.
     * @param Page $pageModel
     * @param Request $request
     * @param TV $tvModel
     */
    public function __construct(Page $pageModel, Request $request, TV $tvModel)
    {
        $this->pageModel = $pageModel;
        $this->request = $request;
        $this->tvModel = $tvModel;
    }

    public function pages()
    {
        $pages = $this->pageModel->latest()->get();

        return successResponse('Retrieved pages', ['pages' => $pages]);
    }

    public function create()
    {
        $validate = validateAjaxForm($this->request->all(), [
            'name'     => 'required|unique:pages',
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

        $theme = getSiteOption('active_theme');

        $temp = $this->tvModel->where('page_id', '=', $page->id)->get();

        foreach ($temp as $t) {
            $tvs[$t->name] = $t->value;
        }

        $tvs = arrayToObj($tvs);

        return view('themes.' . $theme . '.templates.' . $page->template, compact('tvs'));
    }
}
