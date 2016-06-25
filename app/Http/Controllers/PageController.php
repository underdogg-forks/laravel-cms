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
    /**
     * @var Page
     */
    private $pageModel;

    /**
     * @var Request
     */
    private $request;

    /**
     * @var TV
     */
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

    /**
     * Gets a list of all pages
     *
     * @return JsonResponse
     */
    public function pages()
    {
        $pages = $this->pageModel->with('children')->with('parent')->latest()->get();

        foreach ($pages->all() as $page) {
            $page['child'] = !empty($page["parent"]);
        }

        return successResponse('Retrieved pages', ['pages' => $pages]);
    }

    /**
     * Stores a page in the DB
     *
     * @return bool|JsonResponse
     */
    public function create()
    {
        $validate = validateAjaxForm($this->request->all(), [
            'name' => 'required|unique:pages',
            'template' => 'required'
        ]);

        if ($validate instanceof JsonResponse) {
            return $validate;
        }

        $slugify = new Slugify();

        $parent = empty($this->request->parent) ? null : $this->request->parent;

        if (!empty($parent)) {
            $slug = $this->pageModel->whereId($parent)->firstOrFail()->slug . '/' . $slugify->slugify($this->request->name);
        } else {
            $slug = $slugify->slugify($this->request->name);
        }

        $page = $this->pageModel->create([
            'name' => $this->request->name,
            'slug' => $slug,
            'template' => $this->request->template,
            'parent_id' => $parent
        ]);

        return successResponse('Page created', ['slug' => $page->slug]);
    }

    /**
     * Shows a page
     *
     * @param $slug
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show($slug)
    {
        $page = $this->pageModel->whereSlug($slug)->firstOrFail();

        $temp = $this->tvModel->where('page_id', '=', $page->id)->get();

        $tvs = [];

        foreach ($temp as $t) {
            $tvs[$t->category][$t->name] = $t->value;
        }

        $tvs = arrayToObj($tvs);

        return view(themef() . 'templates.' . $page->template, compact('tvs', 'page'));
    }

    /**
     * Updates a page
     *
     * @param $id
     * @return bool|JsonResponse
     */
    public function update($id)
    {
        $page = $this->pageModel->whereId($id)->firstOrFail();

        // TODO: Check if page name is unique but not current page
        $validate = validateAjaxForm($this->request->all(), [
            'name' => 'required',
            'template' => 'required',
            'slug' => 'required'
        ]);

        if ($validate instanceof JsonResponse) {
            return $validate;
        }

        if ($this->request->template != $page->template) {
            $this->tvModel->where('page_id', '=', $page->id)->delete();
        }

        $page->fill($this->request->except('parent'));
        $page->save();

        return successResponse('Updated page');
    }

    /**
     * Deletes a page
     *
     * @param $id
     * @return JsonResponse
     */
    public function delete($id)
    {
        $page = $this->pageModel->whereId($id)->firstOrFail();

        $page->delete();

        return successResponse('Page deleted');
    }

}
