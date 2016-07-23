<?php

Route::group(['middleware' => ['auth']], function() {

	Route::get('/admin', 'AdminController@getIndex');

    /**
     * Admin interface
     */
    Route::group(['prefix' => 'admin'], function() {
        Route::get('pages', 'AdminController@getPages');
        Route::get('themes', 'AdminController@getThemes');
        Route::get('users', 'AdminController@getUsers');
    });

    /**
     * Pages Resource
     */
    Route::get('pages', 'PageController@pages');
    Route::post('pages/new', 'PageController@create');
    Route::post('pages/{id}/update', 'PageController@update');
    Route::post('pages/{id}/delete', 'PageController@delete');
    Route::get('pages/{id}/tvs', 'TVController@getPageTVs');
    Route::get('pages/top', 'PageController@topPerforming');

    /**
     * Themes
     */
    Route::get('list-themes', 'ThemeController@getListOfThemes');

    /**
     * Templates
     */
    Route::get('templates', 'ThemeController@getListOfTemplates');

    /**
     * Template Variables
     */
    Route::post('template-variables', 'ThemeController@getListOfTemplateVariables');
    Route::post('template-variables/save', 'TVController@create');

    /**
     * Options
     */
    Route::post('option', 'OptionController@option');
    Route::post('option/update', 'OptionController@update');

    /**
     * User
     */
    Route::get('users', 'UserController@users');
    Route::get('user', 'UserController@user');
    Route::post('users/new', 'UserController@create');
    Route::post('users/update', 'UserController@update');
    Route::post('users/delete', 'UserController@delete');

    /**
     * Flat files
     */
    Route::post('generate-flat-files', 'FlatFileController@generate');
});

/**
 * Auth
 */
Route::group(['middleware' => ['guest']], function() {
	Route::get('/login', 'UserController@login');
	Route::post('/login', 'UserController@login');
});

Route::get('/logout', 'UserController@logout');

Route::get('/test', function() {
    Auth::loginUsingId(1);
});

/**
 * Catch-all route for CMS pages
 */
Route::get('{slug}', 'PageController@show')->where('slug', '.*');

