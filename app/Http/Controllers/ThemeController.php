<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Yaml\Yaml;

class ThemeController extends Controller
{
    /**
     * @var Request
     */
    private $request;

    /**
     * ThemeController constructor.
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Returns a list of all themes in the themes directory
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getListOfThemes()
    {
        $it = new \DirectoryIterator(base_path() . '/public/themes/');
        $dirs = [];
        while($it->valid()){
            if ($it->getBasename() != '.' && $it->getBasename() != '..') {
                $dirs[] = $it->getBasename();
            }
            $it->next();
        }

        return successResponse('Got theme folders', ['folders' => $dirs]);
    }

    /**
     * Returns all of a themes template files
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getListOfTemplates()
    {
        $files = scandir(base_path() . themePath() . '/templates/');

        $templates = [];

        foreach ($files as $file) {
            if (!is_dir($file)) {
                $templates[] = explode('.', $file)[0];
            }
        }

        return successResponse('Got theme folders', ['templates' => $templates]);
    }

    /**
     * Returns all of a themes template variables
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getListOfTemplateVariables()
    {
        if (file_exists(base_path() . themePath() . '/variables.yaml')) {
            $config = Yaml::parse(file_get_contents(base_path() . themePath() . '/variables.yaml'));
        } else {
            return errorResponse('Template variable file does not exist');
        }

        $categories = [];

        if (isset($config[$this->request->template])) {
            $categories = $config[$this->request->template];
        }

        return successResponse('Retrieved template variables', ['categories' => $categories]);
    }
}
