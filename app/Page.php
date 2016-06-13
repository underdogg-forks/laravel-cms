<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'name', 'slug', 'template', 'content'
    ];

    public function tvs()
    {
        return $this->hasMany(TV::class, 'tvs');
    }
}
