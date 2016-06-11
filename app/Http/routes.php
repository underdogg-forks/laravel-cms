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
use Illuminate\Support\Facades\Request;

Route::group(['middleware' => ['web', 'auth']], function() {
	Route::get('/', function () {
	    return view('index');
	});
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

Route::get('/test/{token?}', function($token, Request $request) {

});

