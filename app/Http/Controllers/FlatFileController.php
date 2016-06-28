<?php

namespace App\Http\Controllers;

use App\Page;
use App\TV;
use Illuminate\Http\Request;

use App\Http\Requests;

class FlatFileController extends Controller
{
    /**
     * @var Page
     */
    private $pageModel;
    /**
     * @var TV
     */
    private $tvModel;

    /**
     * FlatFileController constructor.
     * @param Page $pageModel
     * @param TV $tvModel
     */
    public function __construct(Page $pageModel, TV $tvModel)
    {
        $this->pageModel = $pageModel;
        $this->tvModel = $tvModel;
    }

    /**
     * Creates the files and returns a response
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function generate()
    {
        $pages = $this->pageModel->where('parent_id', '=' , null)->get();

        foreach ($pages as $page) {
            $this->createDirectories($page);
        }

        //create the index page
        $page = $this->pageModel->find(getSiteOption('indexPage'));

        $this->createFiles($page, storage_path() . '/flatfile/');

        // move assets over
        $assetDir = storage_path() . '/flatfile/assets/';

        $this->xcopy(base_path() . themePath() . '/assets', $assetDir);

        return successResponse('Flat files created');
    }

    /**
     * Creates the directories of pages
     * Builds an index.html inside the directory
     * Creates child pages recursively
     *
     * @param $page
     * @param string $parent
     * @throws \Exception
     * @throws \Throwable
     */
    public function createDirectories($page, $parent = '')
    {
        if (!file_exists(storage_path() . '/flatfile/')) {
            mkdir(storage_path() . '/flatfile/');
        }

        // Page is a parent
        if (empty($parent)) {
            $parent = storage_path() . '/flatfile/';
        }

        $parent .= $page->slug . '/';

        if (!file_exists($parent)) {
            mkdir($parent);
        }

        $this->createFiles($page, $parent);

        if ($page->children()->count()) {
            foreach ($page->children as $child) {
                $this->createDirectories($child, $parent);
            }
        }
    }

    /**
     * Builds an index.html inside the directory
     *
     * @param $page
     * @param $parent
     * @throws \Exception
     * @throws \Throwable
     */
    private function createFiles($page, $parent)
    {
        $temp = $this->tvModel->where('page_id', '=', $page->id)->get();

        $tvs = [];

        foreach ($temp as $t) {
            $tvs[$t->category][$t->name] = $t->value;
        }

        $tvs = arrayToObj($tvs);

        file_put_contents($parent . 'index.html', view(themef() . 'templates.' . $page->template, compact('tvs', 'page'))->render());
    }

    /**
     * Copy a file, or recursively copy a folder and its contents
     * @author      Aidan Lister <aidan@php.net>
     * @version     1.0.1
     * @link        http://aidanlister.com/2004/04/recursively-copying-directories-in-php/
     * @param       string   $source    Source path
     * @param       string   $dest      Destination path
     * @param       int      $permissions New folder creation permissions
     * @return      bool     Returns true on success, false on failure
     */
    private function xcopy($source, $dest, $permissions = 0755)
    {
        // Check for symlinks
        if (is_link($source)) {
            return symlink(readlink($source), $dest);
        }

        // Simple copy for a file
        if (is_file($source)) {
            return copy($source, $dest);
        }

        // Make destination directory
        if (!is_dir($dest)) {
            mkdir($dest, $permissions);
        }

        // Loop through the folder
        $dir = dir($source);
        while (false !== $entry = $dir->read()) {
            // Skip pointers
            if ($entry == '.' || $entry == '..') {
                continue;
            }

            // Deep copy directories
            $this->xcopy("$source/$entry", "$dest/$entry", $permissions);
        }

        // Clean up
        $dir->close();
        return true;
    }
}
