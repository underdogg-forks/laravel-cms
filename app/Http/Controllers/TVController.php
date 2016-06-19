<?php

namespace App\Http\Controllers;

use App\TV;
use Illuminate\Http\Request;

use App\Http\Requests;

class TVController extends Controller
{
    /**
     * @var TV
     */
    private $tvModel;

    /**
     * @var Request
     */
    private $request;

    /**
     * TVController constructor.
     * @param TV $tvModel
     * @param Request $request
     */
    public function __construct(TV $tvModel, Request $request)
    {
        $this->tvModel = $tvModel;
        $this->request = $request;
    }

    /**
     * Stores the TVs
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function create()
    {
        $tvs = $this->request->tvs;

        foreach ($tvs as $category => $fields) {
            foreach ($fields as $field => $value) {

                $existing = $this->tvModel->whereName($field)
                                            ->where('page_id', '=', $this->request->pageId)
                                            ->whereCategory($category)
                                            ->first();

                if (!empty($existing)) {
                    $existing->value = $value;
                    $existing->save();
                } else {
                    $this->tvModel->create([
                        'name' => $field,
                        'category' => $category,
                        'value' => $value,
                        'page_id' => $this->request->pageId
                    ]);
                }
            }
        }

        return successResponse('TVs created');
    }

    /**
     * Returns a list of the pages tvs
     *
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPageTVs($id)
    {
        $tvs = $this->tvModel->where('page_id', '=', $id)->get();

        $temp = [];

        foreach ($tvs as $tv) {
            $temp[$tv->category][$tv->name] = $tv->value;
        }

        $results = true;

        if (empty($temp)) {
            $results = false;
        }

        return successResponse('Retrieved tvs for page', ['tvs' => $temp, 'results' => $results]);
    }
}
