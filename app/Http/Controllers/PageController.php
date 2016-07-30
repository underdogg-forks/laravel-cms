<?php

namespace App\Http\Controllers;

use App\Page;
use App\TV;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use App\Http\Requests;

use Cocur\Slugify\Slugify;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Redis\Database as Redis;

use Symfony\Component\Yaml\Yaml;
use Parsedown;

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
     * @var Redis
     */
    private $redis;

    /**
     * PageController constructor.
     *
     * @param Page $pageModel
     * @param Request $request
     * @param TV $tvModel
     * @param Redis $redis
     */
    public function __construct(Page $pageModel, Request $request, TV $tvModel, Redis $redis)
    {
        $this->pageModel = $pageModel;
        $this->request = $request;
        $this->tvModel = $tvModel;
        $this->pageSlug = '';
        $this->redis = $redis;
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
        $page = null;

        if ($slug == '/') {
            $page = $this->pageModel->find(getSiteOption('indexPage'));
        } else {

            $url = explode('/', $slug);

            // Get all pages with the matching last slug
            $pages = $this->pageModel->whereSlug($url[sizeof($url) - 1])->get();

            foreach ($pages as $p) {
                // not a match, try again
                if ($p->permalink() != $slug) {
                    continue;
                } else {
                    $page = $p;
                    break;
                }
            }
        }

        if (!$page) {
            abort(404);
        }

        if ($page->markdown) {
            $page->content = Parsedown::instance()->setMarkupEscaped(false)->text($page->content);
        }

        // Grab the TVs for this page
        $temp = $this->tvModel->where('page_id', '=', $page->id)->get();

        $tvs = [];

        foreach ($temp as $t) {
            $tvs[$t->category][$t->name] = $t->value;
        }

        $tvs = arrayToObj($tvs);

        // Increment page view in redis
        $redisKey = 'page:' . $page->id . ':views';

        if (!$this->redis->exists($redisKey)) {
            $this->redis->set($redisKey, 0);
        }

        $this->redis->incr($redisKey);

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
            ($page->parent()->count() && $this->pageModel->whereSlug($this->request->slug)->where('parent_id', '=', $page->parent->id)->exists() && $page->slug != $this->request->slug)
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
     * Retrieve pages with most views
     *
     * @return JsonResponse
     */
    public function topPerforming()
    {
        $pages = $this->pageModel->orderBy('views', 'desc')->take('5')->get();

        return successResponse('Retrieved pages', ['pages' => $pages]);
    }
}
