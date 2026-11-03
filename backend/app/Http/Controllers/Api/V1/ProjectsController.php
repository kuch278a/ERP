<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectsController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'success',
            'data' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'name' => 'required|string',
            'type' => 'nullable|string',
            'location' => 'nullable|string',
            'area' => 'nullable|string',
            'client' => 'nullable|string',
            'clientId' => 'nullable|string',
            'totalBudget' => 'numeric|min:0',
            'designFee' => 'numeric|min:0',
            'invoicedAmount' => 'nullable|numeric|min:0',
            'stage' => 'nullable|string',
            'progress' => 'nullable|integer|min:0|max:100',
            'leadArchitect' => 'nullable|string',
            'leadId' => 'nullable|string',
            'startDate' => 'nullable|date',
            'targetHandover' => 'nullable|date',
            'image' => 'nullable|string',
            'health' => 'nullable|string',
            'aesthetic' => 'nullable|string',
            'description' => 'nullable|string',
            'phases' => 'nullable|array',
            'roomSchedule' => 'nullable|array',
        ]);

        if (empty($data['id'])) {
            $count = Project::count() + 1;
            $data['id'] = sprintf('PRJ-%s-%03d', date('Y'), $count);
        }

        $project = Project::create($data);

        return response()->json([
            'message' => 'Project created successfully',
            'data' => $project,
        ], 201);
    }

    public function show($id)
    {
        $project = Project::findOrFail($id);

        return response()->json([
            'message' => 'success',
            'data' => $project,
        ]);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $project->update($request->all());

        return response()->json([
            'message' => 'Project updated successfully',
            'data' => $project,
        ]);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully',
        ]);
    }
}

