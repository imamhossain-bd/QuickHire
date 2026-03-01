<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobRequest;
use App\Http\Requests\UpdateJobRequest;
use App\Models\Job;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Job::active()
            ->search($request->input('search'))
            ->byCategory($request->input('category'))
            ->byLocation($request->input('location'))
            ->byJobType($request->input('job_type'))
            ->withCount('applications')
            ->latest();

        $perPage = min((int) $request->input('per_page', 10), 50);
        $jobs    = $query->paginate($perPage);

        return $this->successResponse(
            [
                'jobs'       => collect($jobs->items())->map(fn($job) => $this->formatJob($job)),
                'pagination' => [
                    'current_page' => $jobs->currentPage(),
                    'last_page'    => $jobs->lastPage(),
                    'per_page'     => $jobs->perPage(),
                    'total'        => $jobs->total(),
                    'from'         => $jobs->firstItem(),
                    'to'           => $jobs->lastItem(),
                ],
                'filters' => [
                    'search'   => $request->input('search'),
                    'category' => $request->input('category'),
                    'location' => $request->input('location'),
                    'job_type' => $request->input('job_type'),
                ],
            ],
            'Jobs retrieved successfully'
        );
    }

    public function show(int $id): JsonResponse
    {
        $job = Job::withCount('applications')->find($id);
        if (!$job) return $this->notFoundResponse('Job not found');
        return $this->successResponse($this->formatJob($job), 'Job retrieved successfully');
    }

    public function store(StoreJobRequest $request): JsonResponse
    {
        $job = Job::create($request->validated());
        return $this->createdResponse($this->formatJob($job), 'Job created successfully');
    }

    public function update(UpdateJobRequest $request, int $id): JsonResponse
    {
        $job = Job::find($id);
        if (!$job) return $this->notFoundResponse('Job not found');
        $job->update($request->validated());
        return $this->successResponse($this->formatJob($job->fresh()), 'Job updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $job = Job::find($id);
        if (!$job) return $this->notFoundResponse('Job not found');
        $job->applications()->delete();
        $job->delete();
        return $this->successResponse(null, 'Job deleted successfully');
    }

    public function categories(): JsonResponse
    {
        $categories = Job::active()
            ->selectRaw('category, COUNT(*) as job_count')
            ->groupBy('category')
            ->orderBy('category')
            ->get()
            ->map(fn($row) => [
                'name'      => $row->category,
                'job_count' => (int) $row->job_count,
            ])
            ->values();

        return $this->successResponse($categories, 'Categories retrieved successfully');
    }

    public function locations(): JsonResponse
    {
        $locations = Job::active()->distinct()->pluck('location')->sort()->values();
        return $this->successResponse($locations, 'Locations retrieved successfully');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $query = Job::withCount('applications')
            ->search($request->input('search'))
            ->byCategory($request->input('category'))
            ->latest();

        $perPage = min((int) $request->input('per_page', 15), 100);
        $jobs    = $query->paginate($perPage);

        return $this->successResponse(
            [
                'jobs'       => collect($jobs->items())->map(fn($job) => $this->formatJob($job)),
                'pagination' => [
                    'current_page' => $jobs->currentPage(),
                    'last_page'    => $jobs->lastPage(),
                    'per_page'     => $jobs->perPage(),
                    'total'        => $jobs->total(),
                ],
            ],
            'Admin jobs retrieved successfully'
        );
    }

    public function toggleStatus(int $id): JsonResponse
    {
        $job = Job::find($id);
        if (!$job) return $this->notFoundResponse('Job not found');
        $job->update(['is_active' => !$job->is_active]);
        $status = $job->is_active ? 'activated' : 'deactivated';
        return $this->successResponse($this->formatJob($job), "Job {$status} successfully");
    }

   
    private function formatJob(Job $job): array
    {
        $data               = $job->toArray();
        $data['company_logo'] = $this->resolveLogoUrl($job->company_logo);
        return $data;
    }

   
    private function resolveLogoUrl(?string $logo): ?string
    {
        if (!$logo)                           return null;
        if (str_starts_with($logo, 'http'))   return $logo;
        return url('storage/' . ltrim($logo, '/'));
    }
}