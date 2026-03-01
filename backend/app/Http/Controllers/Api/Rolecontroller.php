<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = User::latest();

        if ($request->filled('search')) {
            $kw = $request->input('search');
            $query->where(fn($q) => $q
                ->where('full_name', 'LIKE', "%{$kw}%")
                ->orWhere('email', 'LIKE', "%{$kw}%")
            );
        }

        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        $perPage = min((int) $request->input('per_page', 20), 100);
        $users   = $query->paginate($perPage);

        return $this->successResponse(
            [
                'users' => collect($users->items())->map(fn($u) => $this->formatUser($u)),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'last_page'    => $users->lastPage(),
                    'per_page'     => $users->perPage(),
                    'total'        => $users->total(),
                ],
            ],
            'Users retrieved successfully.'
        );
    }

    public function updateRole(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'role' => ['required', 'in:user,admin'],
        ]);

        $user = User::find($id);

        if (!$user) {
            return $this->notFoundResponse('User not found.');
        }

        $user->update(['role' => $request->input('role')]);

        return $this->successResponse(
            $this->formatUser($user->fresh()),
            'User role updated successfully.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return $this->notFoundResponse('User not found.');
        }

        if ($user->isAdmin()) {
            return $this->errorResponse('Cannot delete an admin account.', null, 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return $this->successResponse(null, 'User deleted successfully.');
    }

    private function formatUser(User $user): array
    {
        return [
            'id'                  => $user->id,
            'full_name'           => $user->full_name,
            'email'               => $user->email,
            'role'                => $user->role,
            'is_admin'            => $user->isAdmin(),
            'applications_count'  => $user->applications()->count(),
            'created_at'          => $user->created_at?->format('M d, Y'),
        ];
    }
}