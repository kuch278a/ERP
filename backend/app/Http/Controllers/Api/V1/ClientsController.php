<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientsController extends Controller
{
    public function index()
    {
        $clients = Client::orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'success',
            'data' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'name' => 'required|string',
            'type' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'city' => 'nullable|string',
            'stylePreference' => 'nullable|string',
            'activeProjects' => 'nullable|array',
            'lifetimeValue' => 'nullable|numeric|min:0',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if (empty($data['id'])) {
            $count = Client::count() + 1;
            $data['id'] = sprintf('CLI-%03d', $count);
        }

        $client = Client::create($data);

        return response()->json([
            'message' => 'Client created successfully',
            'data' => $client,
        ], 201);
    }

    public function show($id)
    {
        $client = Client::findOrFail($id);

        return response()->json([
            'message' => 'success',
            'data' => $client,
        ]);
    }

    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);
        $client->update($request->all());

        return response()->json([
            'message' => 'Client updated successfully',
            'data' => $client,
        ]);
    }

    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json([
            'message' => 'Client deleted successfully',
        ]);
    }
}

