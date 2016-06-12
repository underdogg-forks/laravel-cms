<?php

namespace App\Http\Controllers;

use App\Theme;
use Illuminate\Http\Request;

use App\Http\Requests;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Yaml\Yaml;

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

    public function getListOfThemes()
    {
        //$dirs = glob(base_path() . '/resources/views/themes/*', GLOB_ONLYDIR);

        $it = new \DirectoryIterator(base_path() . '/resources/views/themes/');
        $dirs = [];
        while($it->valid()){
            if ($it->getBasename() != '.' && $it->getBasename() != '..') {
                $dirs[] = $it->getBasename();
            }
            $it->next();
        }

        return successResponse('Got theme folders', ['folders' => $dirs]);
    }

    public function getListOfTemplates()
    {
        $files = scandir(base_path() . '/resources/views/themes/' . getSiteOption('active_theme') . '/templates/');

        $templates = [];

        foreach ($files as $file) {
            if (!is_dir($file)) {
                $templates[] = explode('.', $file)[0];
            }
        }

        return successResponse('Got theme folders', ['templates' => $templates]);
    }

    public function getListOfTemplateVariables()
    {
        $config = Yaml::parse(file_get_contents(base_path() . '/resources/views/themes/' . getSiteOption('active_theme') . '/variables.yaml'));

        $categories = [];

        if (isset($config[$this->request->template])) {
            $categories = $config[$this->request->template];
        }

        return successResponse('Retrieved template variables', ['categories' => $categories]);
    }

    public function getActive()
    {
        $activeTheme = $this->themeModel->whereActive(true)->firstOrFail();

        return successResponse('Retrieved active theme', ['activeTheme' => $activeTheme]);
    }
}
