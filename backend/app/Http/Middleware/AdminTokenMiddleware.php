<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminTokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-Admin-Token');
        $secret = config('app.admin_token') ?: 'quickhire-admin-secret-2024';

        if (!$token || $token !== $secret) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized admin access.',
            ], 401);
        }

        return $next($request);
    }
}
