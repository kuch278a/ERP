<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Snag;
use Illuminate\Http\Request;

class SnagsController extends Controller
{
    public function index()
    {
        $snags = Snag::orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'success',
            'data' => $snags,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'projectId' => 'nullable|string',
            'projectName' => 'nullable|string',
            'location' => 'nullable|string',
            'description' => 'required|string',
            'category' => 'nullable|string',
            'severity' => 'nullable|string',
            'contractor' => 'nullable|string',
            'loggedBy' => 'nullable|string',
            'dateLogged' => 'nullable|date',
            'dueDate' => 'nullable|date',
            'status' => 'nullable|string',
            'photoUrl' => 'nullable|string',
            'rectificationPlan' => 'nullable|string',
        ]);

        if (empty($data['id'])) {
            $count = Snag::count() + 101;
            $data['id'] = sprintf('SNG-%03d', $count);
        }

        $snag = Snag::create($data);

        return response()->json([
            'message' => 'Site snag logged successfully',
            'data' => $snag,
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $snag = Snag::findOrFail($id);
        $snag->update(['status' => $request->input('status')]);

        return response()->json([
            'message' => 'Snag status updated',
            'data' => $snag,
        ]);
    }

    public function destroy($id)
    {
        $snag = Snag::findOrFail($id);
        $snag->delete();

        return response()->json([
            'message' => 'Snag deleted successfully',
        ]);
    }
}

