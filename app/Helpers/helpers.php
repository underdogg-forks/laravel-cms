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

function themef()
{
    $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));

    return $config['activeTheme'] . '::';
}

function themeAssets()
{
    $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));

    return '/themes/' . $config['activeTheme'] . '/assets';
}

function themePath()
{
    $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));

    return '/public/themes/' . $config['activeTheme'] . '';
}