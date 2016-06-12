<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TV extends Model
{
    protected $table = 'tvs';

    protected $fillable = ['name', 'value', 'page_id'];

    public function page() {
        return $this->belongsTo(Page::class);
    }
}
