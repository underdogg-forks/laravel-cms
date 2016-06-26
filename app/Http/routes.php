<?php

Route::group(['middleware' => ['web', 'auth']], function() {

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
    Route::post('users/update', 'UserController@update');
});

/**
 * Auth
 */
Route::group(['middleware' => ['web', 'guest']], function() {
	Route::get('/login', 'UserController@login');
	Route::post('/login', 'UserController@login');

	Route::get('/register', 'UserController@create');
	Route::post('/register', 'UserController@create');
});

Route::get('/logout', 'UserController@logout');

/**
 * Catch-all route for CMS pages
 */
Route::get('{slug}', 'PageController@show')->where('slug', '.*');

