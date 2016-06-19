<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Yaml\Yaml;
use App\Http\Requests;

class OptionController extends Controller
{
    /**
     * @var Request
     */
    private $request;

    /**
     * @var string
     */
    private $configPath;

    /**
     * OptionController constructor.
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->configPath = base_path() . '/storage/site/config.yaml';
    }

    /**
     * Retrieves an option from the sites config
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function option()
    {
        $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));

        $value = $config[$this->request->option];

        return successResponse('Got option', ['option' => $value]);
    }

    /**
     * Updates an option in the sites config
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update()
    {
        $config = Yaml::parse(file_get_contents($this->configPath));

        $config[$this->request->option] = $this->request->value;

        file_put_contents($this->configPath, Yaml::dump($config));

        return successResponse('Updated option');
    }
}
