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

    public function create()
    {
        $tvs = $this->request->tvs;

        /*
         * $tvs = [
         *  'header' => [
         *    'title' => 'my title'
         *  ]
         * ]
         */

        foreach ($tvs as $category => $fields) {
            foreach ($fields as $field => $value) {
                $variableName =  $category . '_' . $field;

                $existing = $this->tvModel->whereName($variableName)->where('page_id', '=', $this->request->pageId)->first();

                if (!empty($existing)) {
                    $existing->value = $value;
                    $existing->save();
                } else {
                    $this->tvModel->create([
                        'name' => $variableName,
                        'value' => $value,
                        'page_id' => $this->request->pageId
                    ]);
                }
            }
        }

        return successResponse('TVs created');
    }

    public function getPageTVs($id)
    {
        $tvs = $this->tvModel->where('page_id', '=', $id)->get();

        $temp = [];

        foreach ($tvs as $tv) {
            $columns = explode('_', $tv->name);

            $temp[$columns[0]][$columns[1]] = $tv->value;
        }

        $results = true;

        if (empty($temp)) {
            $results = false;
        }

        return successResponse('Retrieved tvs for page', ['tvs' => $temp, 'results' => $results]);
    }
}