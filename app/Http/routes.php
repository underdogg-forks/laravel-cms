<?php

Route::group(['middleware' => ['web', 'auth']], function() {
    Route::get('/', function() {
        return redirect('/admin');
    });

	Route::get('/admin', 'AdminController@getIndex');

    Route::group(['prefix' => 'admin'], function() {
       Route::get('pages', 'AdminController@getPages');
        Route::get('themes', 'AdminController@getThemes');
    });

    Route::get('pages', 'PageController@pages');
    Route::post('pages/new', 'PageController@create');
    Route::post('pages/{id}/update', 'PageController@update');
    Route::post('pages/{id}/delete', 'PageController@delete');
    Route::get('pages/{id}/tvs', 'TVController@getPageTVs');

    Route::get('list-themes', 'ThemeController@getListOfThemes');

    Route::get('templates', 'ThemeController@getListOfTemplates');

    Route::post('template-variables', 'ThemeController@getListOfTemplateVariables');
    Route::post('template-variables/save', 'TVController@create');

    Route::post('option', 'OptionController@option');
    Route::post('option/update', 'OptionController@update');
});

Route::group(['middleware' => ['web', 'guest']], function() {
	Route::get('/login', 'UserController@login');
	Route::post('/login', 'UserController@login');

	Route::get('/register', 'UserController@create');
	Route::post('/register', 'UserController@create');
});


Route::get('/logout', 'UserController@logout');

Route::get('{slug}', 'PageController@show')->where('slug', '.*');

