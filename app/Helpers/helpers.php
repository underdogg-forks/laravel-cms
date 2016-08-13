<?php

use Symfony\Component\Yaml\Yaml;
use App\Page;

require "validation.php";

/**
 * Converts an array to an object
 *
 * @param $array
 * @return mixed
 */
function arrayToObj($array)
{
    return json_decode(json_encode($array), false);
}

/**
 * Returns a site option at specified index
 *
 * @param $option
 * @return mixed
 */
function getSiteOption($option)
{
    $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));

    return $config[$option];
}

/**
 * Returns formatted theme string
 * eg. default::
 *
 * @return string
 */
function themef()
{
    $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));

    return $config['activeTheme'] . '::';
}

/**
 * Returns active themes asset folder path
 *
 * @return string
 */
function themeAssets()
{
    $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));

    return '/themes/' . $config['activeTheme'] . '/assets';
}

/**
 * Returns active theme folder path
 *
 * @return string
 */
function themePath()
{
    $config = Yaml::parse(file_get_contents(base_path() . '/storage/site/config.yaml'));

    return '/public/themes/' . $config['activeTheme'] . '';
}

/**
 * Gets full permalink of a page
 *
 * @param $id
 * @return string
 */
function permalink($id)
{
    $page = Page::findOrFail($id);

    if (!$page->parent()->count()) {
        return $page->slug;
    }

    $slug = '';

    getParentSlug($page, $slug);

    return $slug;
}

/**
 * Used by permalink()
 * Is there a better place for this?
 *
 * @param $parent
 * @param $slug
 */
function getParentSlug($parent, &$slug)
{
    if ($parent->parent()->count()) {
        $slug .= $parent->slug . '/';
        getParentSlug($parent->parent, $slug);
    } else {
        $slug .= $parent->slug;

        $temp = explode('/', $slug);

        $slug = implode('/', array_reverse($temp)) . '/';
    }
}

function getPage($id)
{
    return Page::findOrFail($id);
}