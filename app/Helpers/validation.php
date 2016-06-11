<?php

use Illuminate\Support\Facades\Validator;

function validateAjaxForm($fields, $rules)
{
    $validator = Validator::make($fields, $rules);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Form errors',
            'errors' => $validator->errors()
        ]);
    }

    return true;
}

function successResponse($message, $extra = null)
{
    $data = [
        'status' => 'success',
        'message' => $message
    ];

    if (isset($extra)) {
        $data = array_merge($data, $extra);
    }

    return response()->json($data);
}