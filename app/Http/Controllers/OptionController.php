<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Yaml\Yaml;
use App\Http\Requests;

class OptionController extends Controller
{
    private $request;
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

    public function option()
    {
//        $option = explode('.', $this->request->option);
//
//        $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));
//
//        $value = $config;
//
//        for ($i = 0; $i < sizeof($option); $i++) {
//            $value = $value[$option[$i]];
//        }

        $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));

        $value = $config[$this->request->option];

        return successResponse('Got option', ['option' => $value]);
    }

    public function update()
    {
        $config = Yaml::parse(file_get_contents($this->configPath));

        $config[$this->request->option] = $this->request->value;

        file_put_contents($this->configPath, Yaml::dump($config));

        return successResponse('Updated option');
    }
}
