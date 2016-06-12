<?php

use Symfony\Component\Yaml\Yaml;

require "validation.php";

function arrayToObj($array)
{
    return json_decode(json_encode($array), false);
}

function getSiteOption($option)
{
    $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));

    return $config[$option];
}

function thdg()
{
    $config = Yaml::parse(file_get_contents(base_path() . '/resources/views/themes/neher/variables.yaml'));

    $headers = [];

    foreach ($config['index'] as $category => $fields) {
        foreach ($fields as $field => $properties) {
            foreach($properties as $key => $value) {

            }
        }
    }

    dd();
}