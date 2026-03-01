<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'full_name' => $request->full_name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'user',
        ]);

        return $this->createdResponse(
            ['user' => $this->formatUser($user)],
            'Account created successfully.'
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Invalid email or password.', null, 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse(
            [
                'user'       => $this->formatUser($user),
                'token'      => $token,
                'token_type' => 'Bearer',
            ],
            'Logged in successfully.'
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return $this->successResponse(null, 'Logged out successfully.');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->formatUser($request->user()),
            'User retrieved successfully.'
        );
    }

    private function formatUser(User $user): array
    {
        return [
            'id'         => $user->id,
            'full_name'  => $user->full_name,
            'email'      => $user->email,
            'role'       => $user->role,
            'is_admin'   => $user->isAdmin(),
            'created_at' => $user->created_at,
        ];
    }
}