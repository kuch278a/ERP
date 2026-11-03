<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FfeItem extends Model
{
    protected $table = 'atelier_ffe_items';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $guarded = [];

    protected $casts = [
        'unitCost' => 'float',
        'markupPct' => 'float',
        'clientPrice' => 'float',
        'qty' => 'integer',
        'sampleApproved' => 'boolean',
    ];
}

