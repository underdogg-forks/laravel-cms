<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Contracts\Auth\Guard;
use App\User;

use App\Http\Requests;

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
            return view('index');
        }
        $errors = $this->getErrors($this->request->all(), [
            'username' => 'required',
            'password' => 'required'
        ]);

        if (!empty($errors)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Form errors',
                'errors' => $errors
            ]);
        }

        $user = $this->userModel->create([
            'name' => $this->request->name,
            'email' => $this->request->email,
            'password' => bcrypt($this->request->password),
        ]);

        $this->auth->login($user);

        return response()->json([
            'status' => 'success',
            'message' => 'User created'
        ]);
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
                        $errors[] = ucfirst($field) . ' is required';
                    }
                    break;
            }
        }

        return $errors;
    }
}
