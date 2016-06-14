<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'name', 'slug', 'template', 'content', 'parent_id'
    ];

    public function tvs()
    {
        return $this->hasMany(TV::class, 'tvs');
    }

    public function children()
    {
        return $this->hasMany(Page::class, 'parent_id', 'id');
    }

    public function parent()
    {
        return $this->belongsTo(Page::class, 'parent_id', 'id');
    }
}
