<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AssetsController extends Controller
{
    public function index()
    {
        $assets = [
            ['id' => 'AST-WRK-001', 'asset_name' => 'Dual RTX 6000 Ada BIM Workstations (Cluster)', 'gross_purchase_amount' => 48000, 'opening_accumulated_depreciation' => 12000, 'current_value' => 36000, 'status' => 'In Use'],
            ['id' => 'AST-LIB-002', 'asset_name' => 'Architectural Rare Material Archive & Sliding Vitrines', 'gross_purchase_amount' => 165000, 'opening_accumulated_depreciation' => 25000, 'current_value' => 140000, 'status' => 'In Use'],
        ];

        return response()->json(['message' => 'success', 'data' => $assets]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'asset_name' => 'required|string',
            'item_code' => 'nullable|string',
            'gross_purchase_amount' => 'required|numeric|min:0',
            'purchase_date' => 'nullable|date',
            'status' => 'nullable|string',
        ]);

        if (empty($data['id'])) {
            $data['id'] = 'AST-NEW-' . rand(100, 999);
        }
        $data['current_value'] = $data['gross_purchase_amount'];
        $data['opening_accumulated_depreciation'] = 0;

        return response()->json([
            'message' => 'Asset registered successfully',
            'data' => $data,
        ], 201);
    }
}
