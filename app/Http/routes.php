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

Route::group(['middleware' => ['web', 'auth']], function() {
	Route::get('/', function () {
	    return view('index');
	});
});

Route::group(['middleware' => ['web', 'guest']], function() {
	Route::get('/login', 'UserController@create');
	Route::post('/login', 'UserController@getLogin');
});


Route::get('/test', 'UserController@create');

