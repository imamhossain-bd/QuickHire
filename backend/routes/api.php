<?php

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\StatsController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn() => response()->json(['success' => true, 'message' => 'QuickHire API is running 🚀']));

// ─── Auth ─────────────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });
});

// ─── Public: Jobs ─────────────────────────────────────────────────────────────
Route::prefix('jobs')->group(function () {
    Route::get('/',           [JobController::class, 'index']);
    Route::get('/categories', [JobController::class, 'categories']);
    Route::get('/locations',  [JobController::class, 'locations']);
    Route::get('/{id}',       [JobController::class, 'show']);
});

// ─── Public: Submit Application ───────────────────────────────────────────────
Route::post('/applications', [ApplicationController::class, 'store']);

// ─── Authenticated User ───────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::get('/applications', [ApplicationController::class, 'myApplications']);
});

// ─── Admin Routes (X-Admin-Token) ─────────────────────────────────────────────
Route::prefix('admin')->middleware('admin.token')->group(function () {
    Route::get('/stats', [StatsController::class, 'index']);

    Route::prefix('jobs')->group(function () {
        Route::get('/',                     [JobController::class, 'adminIndex']);
        Route::post('/',                    [JobController::class, 'store']);
        Route::put('/{id}',                 [JobController::class, 'update']);
        Route::delete('/{id}',              [JobController::class, 'destroy']);
        Route::patch('/{id}/toggle',        [JobController::class, 'toggleStatus']);
        Route::get('/{jobId}/applications', [ApplicationController::class, 'byJob']);
    });

    Route::prefix('applications')->group(function () {
        Route::get('/',              [ApplicationController::class, 'adminIndex']);
        Route::get('/{id}',          [ApplicationController::class, 'adminShow']);
        Route::patch('/{id}/status', [ApplicationController::class, 'updateStatus']);
        Route::delete('/{id}',       [ApplicationController::class, 'destroy']);
    });

    Route::prefix('users')->group(function () {
        Route::get('/',                    [RoleController::class, 'index']);
        Route::patch('/{id}/role',         [RoleController::class, 'updateRole']);
        Route::delete('/{id}',             [RoleController::class, 'destroy']);
    });
});

Route::fallback(fn() => response()->json(['success' => false, 'message' => 'API endpoint not found.'], 404));