<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $table = 'atelier_invoices';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $guarded = [];

    protected $casts = [
        'amount' => 'float',
        'taxRate' => 'float',
        'totalWithTax' => 'float',
        'issueDate' => 'date:Y-m-d',
        'dueDate' => 'date:Y-m-d',
    ];
}

