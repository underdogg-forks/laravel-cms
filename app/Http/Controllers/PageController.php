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
     * @var string
     */
    private $pageSlug;

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
        $this->pageSlug = '';
    }

    /**
     * Gets a list of all pages
     *
     * @return JsonResponse
     */
    public function pages()
    {
        $pages = $this->pageModel->with('children')->with('parent')->latest()->get();

        $indexPage = getSiteOption('indexPage');

        $i = 0;
        foreach ($pages->all() as $page) {
            $page['child'] = !empty($page["parent"]);
            $page['permalink'] = $pages->get($i)->permalink();
            $page['isIndex'] = ($page['id'] == $indexPage) ? true : false;
            $i++;
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

        $slug = $slugify->slugify($this->request->name);

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
        if ($slug == '/') {
            $page = $this->pageModel->find(getSiteOption('indexPage'));
        } else {

            $url = explode('/', $slug);

            // Get all pages with the matching last slug
            $pages = $this->pageModel->whereSlug($url[sizeof($url) - 1])->get();

            $found = false;

            /**
             * Loops through each of the matching pages parent, building a url
             * if the page + parents slugs don't make a URL that matches the one in the request, abort
             */
            foreach ($pages as $page) {
                if (!$found) {
                    // If the page has parents, build out the full slug
                    if ($page->parent()->count()) {
                        $this->getParentSlug($page->parent);
                    }

                    $this->pageSlug .= $page->slug;

                    // not a match, try again
                    if ($this->pageSlug != implode('/', $url)) {
                        $this->pageSlug = '';
                        continue;
                    } else {
                        $found = true;
                    }
                } else {
                    break;
                }
            }

            if (!$found) {
                abort(404);
            }
        }

        // Grab the TVs for this page
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

        $errors = [];

        if ($this->pageModel->whereName($this->request->name)->exists() && $this->request->name != $page->name) {
            $errors['name'] = 'Name in use';
        }

        if (
            ($page->parent()->count() && $this->pageModel->whereSlug($this->request->slug)->where('parent_id', '=', $page->parent->id)->exists())
        || (!$page->parent()->count() && $this->pageModel->whereSlug($this->request->slug)->where('parent_id', '=', null)->exists() && $page->slug != $this->request->slug)
        )
        {
            $errors['slug'] = 'Slug in use';
        }

        if (!empty($errors)) {
            return errorResponse('Form Errors', ['errors' => $errors]);
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

    /**
     * Builds out the slug of all parent pages
     *
     * @param $parent
     */
    private function getParentSlug($parent) {
        if ($parent->parent()->count()) {
            $this->pageSlug .= $parent->slug . '/';
            $this->getParentSlug($parent->parent);
        } else {
            $this->pageSlug .= $parent->slug;

            $temp = explode('/', $this->pageSlug);

            $this->pageSlug = implode('/', array_reverse($temp)) . '/';
        }
    }
}
