<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    public function issues()
    {
        $issues = [
            ['id' => 'ISS-2026-018', 'subject' => 'Brass Reveal Trim Thermal Expansion Gap', 'projectName' => 'Villa Al-Manara Sanctuary', 'priority' => 'High', 'status' => 'Investigating', 'technician' => 'Matteo Rossi'],
            ['id' => 'ISS-2026-022', 'subject' => 'Dali Dimming Protocol Micro-Flicker in Master Suite', 'projectName' => 'Penthouse One Palm Jumeirah', 'priority' => 'Medium', 'status' => 'Resolved', 'technician' => 'Samir Al-Mansoor'],
        ];

        return response()->json(['message' => 'success', 'data' => $issues]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'subject' => 'required|string',
            'projectName' => 'nullable|string',
            'priority' => 'nullable|string',
            'status' => 'nullable|string',
            'technician' => 'nullable|string',
        ]);

        if (empty($data['id'])) {
            $data['id'] = 'ISS-' . date('Y') . '-' . rand(100, 999);
        }

        return response()->json([
            'message' => 'Support issue logged successfully',
            'data' => $data,
        ], 201);
    }
}
