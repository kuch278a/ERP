<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        // In local environment, seed default principal user if not found
        if (! $user && app()->environment('local', 'testing')) {
            $user = User::create([
                'name' => 'Sarah Al-Mansoor',
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
        }

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'error' => 'InvalidCredentials',
                'message' => 'The provided credentials do not match our records.',
            ], 401);
        }

        $token = $user->createToken('ashara_spa_token')->plainTextToken;

        return response()->json([
            'message' => 'success',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => 'Principal Director',
                ],
            ],
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'message' => 'success',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => 'Principal Director',
            ],
        ]);
    }
}

