<?php

namespace App\Http\Controllers;

use App\Theme;
use Illuminate\Http\Request;

use App\Http\Requests;
use Symfony\Component\HttpFoundation\JsonResponse;

class ThemeController extends Controller
{
    private $themeModel;

    private $request;

    /**
     * ThemeController constructor.
     * @param Theme $themeModel
     * @param Request $request
     */
    public function __construct(Theme $themeModel, Request $request)
    {
        $this->themeModel = $themeModel;
        $this->request = $request;
    }

    /**
     * Return all themes
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function themes()
    {
        $themes = $this->themeModel->latest()->get();

        return successResponse('Retrieved themes', ['themes' => $themes]);
    }

    /**
     * Creates a theme
     *
     * @return bool|\Illuminate\Http\JsonResponse
     */
    public function create()
    {
        $validate = validateAjaxForm($this->request->all(), [
            'name' => 'required|unique:themes'
        ]);

        if ($validate instanceof JsonResponse) {
            return $validate;
        }

        $theme = $this->themeModel->create([
            'name' => $this->request->name,
            'active' => $this->request->active
        ]);

        return successResponse('Theme added');
    }
}
