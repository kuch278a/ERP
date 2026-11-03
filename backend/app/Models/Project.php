<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'atelier_projects';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $guarded = [];

    protected $casts = [
        'totalBudget' => 'float',
        'designFee' => 'float',
        'invoicedAmount' => 'float',
        'progress' => 'integer',
        'phases' => 'array',
        'roomSchedule' => 'array',
        'startDate' => 'date:Y-m-d',
        'targetHandover' => 'date:Y-m-d',
    ];
}

