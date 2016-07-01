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
     * @var string
     */
    private $location;

    /**
     * @var Request
     */
    private $request;

    /**
     * FlatFileController constructor.
     * @param Page $pageModel
     * @param TV $tvModel
     * @param Request $request
     */
    public function __construct(Page $pageModel, TV $tvModel, Request $request)
    {
        $this->pageModel = $pageModel;
        $this->tvModel = $tvModel;
        $this->location = 'flatfile';
        $this->request = $request;
    }

    /**
     * Creates the files and returns a response
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function generate()
    {
        $pages = $this->pageModel->where('parent_id', '=' , null)->get();

        if (file_exists(storage_path() . '/' . $this->location . '/')) {
            $this->deleteFolder(storage_path() . '/' . $this->location . '/');
        }

        foreach ($pages as $page) {
            $this->createDirectories($page);
        }

        //create the index page
        $page = $this->pageModel->find(getSiteOption('indexPage'));

        $this->createFiles($page, storage_path() . '/' . $this->location . '/');

        // move assets over
        $assetDir = storage_path() . '/' .$this->location . '/assets/';

        $this->xcopy(base_path() . themePath() . '/assets', $assetDir);

        if (!$this->request->ajax()) {
            return redirect('/admin')->with('message', 'Flat files generated to ' . storage_path() . '/' . $this->location);
        }

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
        if (!file_exists(storage_path() . '/' . $this->location . '/')) {
            mkdir(storage_path() . '/' . $this->location . '/');
        }

        // Page is a parent
        if (empty($parent)) {
            $parent = storage_path() . '/' . $this->location . '/';
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

    /**
     * https://stackoverflow.com/questions/1334398/how-to-delete-a-folder-with-contents-using-php
     * @param $path
     * @return bool
     */
    private function deleteFolder($path)
    {
        if (is_dir($path) === true && $path != '/')
        {
            $files = array_diff(scandir($path), array('.', '..'));

            foreach ($files as $file)
            {
                $this->deleteFolder(realpath($path) . '/' . $file);
            }

            return rmdir($path);
        }

        else if (is_file($path) === true)
        {
            return unlink($path);
        }

        return false;
    }
}
