<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\FfeItem;
use Illuminate\Http\Request;

class FfeController extends Controller
{
    public function index()
    {
        $items = FfeItem::orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'success',
            'data' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'specCode' => 'nullable|string',
            'name' => 'required|string',
            'category' => 'nullable|string',
            'room' => 'nullable|string',
            'projectId' => 'nullable|string',
            'projectName' => 'nullable|string',
            'vendor' => 'nullable|string',
            'finish' => 'nullable|string',
            'dimensions' => 'nullable|string',
            'leadTime' => 'nullable|string',
            'unitCost' => 'numeric|min:0',
            'markupPct' => 'numeric|min:0',
            'clientPrice' => 'numeric|min:0',
            'qty' => 'integer|min:1',
            'sampleApproved' => 'nullable|boolean',
            'poStatus' => 'nullable|string',
            'notes' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        if (empty($data['id'])) {
            $count = FfeItem::count() + 1;
            $data['id'] = sprintf('FFE-%03d', $count);
        }

        $item = FfeItem::create($data);

        return response()->json([
            'message' => 'FF&E item created successfully',
            'data' => $item,
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['poStatus' => 'required|string']);
        $item = FfeItem::findOrFail($id);
        $item->update(['poStatus' => $request->input('poStatus')]);

        return response()->json([
            'message' => 'Status updated',
            'data' => $item,
        ]);
    }

    public function toggleSample($id)
    {
        $item = FfeItem::findOrFail($id);
        $item->sampleApproved = ! $item->sampleApproved;
        $item->save();

        return response()->json([
            'message' => 'Sample approval toggled',
            'data' => $item,
        ]);
    }

    public function destroy($id)
    {
        $item = FfeItem::findOrFail($id);
        $item->delete();

        return response()->json([
            'message' => 'FF&E item deleted successfully',
        ]);
    }
}

