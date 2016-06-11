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