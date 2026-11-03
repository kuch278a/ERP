<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Snag extends Model
{
    protected $table = 'atelier_snags';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $guarded = [];

    protected $casts = [
        'dateLogged' => 'date:Y-m-d',
        'dueDate' => 'date:Y-m-d',
    ];
}

