<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Contracts\Auth\Guard;
use App\User;

use App\Http\Requests;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class UserController
 *
 * @package App\Http\Controllers
 */
class UserController extends Controller
{
    /**
     * @var Guard
     */
	private $auth;

    /**
     * @var Request
     */
    private $request;

    /**
     * @var User
     */
    private $userModel;

    /**
     * UserController constructor.
     *
     * @param Guard $auth
     * @param Request $request
     * @param User $userModel
     * @param Validator $validator
     */
	public function __construct(Guard $auth, Request $request, User $userModel)
	{
        $this->auth = $auth;
        $this->request = $request;
        $this->userModel = $userModel;
	}

    /**
     * Creates and logs in the user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function create() 
    {
        if (!$this->request->ajax()) {
            return view('auth.register');
        }

        $valid = validateAjaxForm($this->request->all(), [
            'name' => 'required',
            'username' => 'required|unique:users',
            'password' => 'required|confirmed',
        ]);

        if ($valid instanceof JsonResponse) {
            return $valid;
        }

        $user = $this->userModel->create([
            'name' => $this->request->name,
            'username' => $this->request->username,
            'password' => bcrypt($this->request->password),
        ]);

        if (empty($this->request->donotlogin))
            $this->auth->login($user);

        return response()->json([
            'status' => 'success',
            'message' => 'User created'
        ]);
    }

    /**
     * Updates the user
     *
     * @return bool|\Illuminate\Http\JsonResponse
     */
    public function update()
    {
        $user = $this->userModel->find($this->request->id);

        $rules = [
            'name' => 'required',
            'username' => 'required'
        ];

        if (!empty($this->request->password)) {
            $rules['password'] = 'required|confirmed';
        }

        $valid = validateAjaxForm($this->request->all(), $rules);

        if ($valid instanceof JsonResponse) {
            return $valid;
        }

        $errors = [];

        if ($this->userModel->whereUsername($this->request->username)->exists() && $this->request->username != $user->username) {
            $errors['username'] = 'Username is in use';
        }

        if (!empty($errors)) {
            return errorResponse('From Errors', ['errors' => $errors]);
        }

        $user->username = $this->request->username;
        $user->name = $this->request->name;
        $user->password = bcrypt($this->request->password);
        $user->save();

        return successResponse('User updated');
    }

    public function delete()
    {
        $user = $this->userModel->findOrFail($this->request->id);

        $user->delete();

        return successResponse('User deleted');
    }

    /**
     * Logs in the user or displays the view if not ajax
     *
     * @return JSON
     */
    public function login()
    {
        if (!$this->request->ajax())
        {
            return view('auth.login');
        }

        $valid = validateAjaxForm($this->request->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);

        if ($valid instanceof JsonResponse) {
            return $valid;
        }

        if ($this->auth->attempt($this->request->all())) {
            return response()->json([
                'status' => 'success',
                'message' => 'User logged in'
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
                'errors' => ['username' => 'Incorrect username or password', 'password' => 'Incorrect username or password']
            ]);
        }
    }

    /**
     * Logs the user out and redirects
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function logout()
    {
        $this->auth->logout();
        return redirect('/login');
    }

    /**
     * Return list of all users
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function users()
    {
        $users = $this->userModel->latest()->get();

        return successResponse('Users retrieved', [ 'users' => $users ]);
    }

    /**
     * Returns currently logged in user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function user()
    {
        return successResponse('User Retrieved', ['user' => $this->auth->user()]);
    }

    public function getErrors($values, $fields)
    {
        $errors = [];

        foreach ($fields as $field => $rule)
        {
            switch($rule)
            {
                case 'required':
                    if (empty($values[$field])) {
                        $errors[$field] = ucfirst($field) . ' is required';
                    }
                    break;
            }
        }

        return $errors;
    }
}
