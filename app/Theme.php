<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    protected $fillable = [
      'name', 'active'
    ];

    public $casts = [
        'active' => 'boolean'
    ];
}
