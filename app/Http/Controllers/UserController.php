<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Contracts\Auth\Guard;
use App\User;

use App\Http\Requests;
use Illuminate\Support\Facades\Validator;

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

    private $validator;

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

        $validator = Validator::make($this->request->all(), [
            'name' => 'required',
            'username' => 'required|unique:users',
            'password' => 'required|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $user = $this->userModel->create([
            'name' => $this->request->name,
            'username' => $this->request->username,
            'password' => bcrypt($this->request->password),
        ]);

        $this->auth->login($user);

        return response()->json([
            'status' => 'success',
            'message' => 'User created'
        ]);
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

        $validator = Validator::make($this->request->all(), [
            'username' => 'required',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
                'errors' => $validator->errors()
            ]);
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
