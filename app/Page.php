<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    /**
     * Mass assignable DB fields
     * @var array
     */
    protected $fillable = [
        'name', 'slug', 'template', 'content', 'parent_id'
    ];

    /**
     * TV relationship
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tvs()
    {
        return $this->hasMany(TV::class, 'tvs');
    }

    /**
     * Child relationship with this class
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany(Page::class, 'parent_id', 'id');
    }

    /**
     * Recursively get all children
     *
     * @return mixed
     */
    public function allChildren()
    {
        return $this->children()->with('allChildren');
    }

    /**
     * Parent relationship with this class
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parent()
    {
        return $this->belongsTo(Page::class, 'parent_id', 'id');
    }

    /**
     * Recursively get all parents
     *
     * @return mixed
     */
    public function allParents()
    {
        return $this->parent()->with('allParents');
    }
}
