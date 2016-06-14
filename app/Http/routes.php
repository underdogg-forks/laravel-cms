<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

use Illuminate\Support\Facades\Auth;

Route::group(['middleware' => ['web', 'auth']], function() {
    Route::get('/', function() {
        return redirect('/admin');
    });

	Route::get('/admin', function() {
	    return view('index');
	});

    Route::group(['prefix' => 'admin'], function() {
       Route::get('pages', 'AdminController@getPages');
        Route::get('themes', 'AdminController@getThemes');
    });

    Route::get('pages', 'PageController@pages');
    Route::post('pages/new', 'PageController@create');
    Route::post('pages/{id}/update', 'PageController@update');
    Route::get('pages/{id}/tvs', 'TVController@getPageTVs');

    Route::get('themes', 'ThemeController@getListOfThemes');

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


Route::get('/logout', function() {
    Auth::logout();

    return redirect('/login');
});

Route::get('tst', function() {
    thdg();
});

Route::get('{slug}', 'PageController@show')->where('slug', '.*');;