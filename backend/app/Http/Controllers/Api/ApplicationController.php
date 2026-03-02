<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Models\Application;
use App\Models\Job;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/applications
     * Submit a job application (supports cv file upload).
     */
    public function store(StoreApplicationRequest $request): JsonResponse
    {
        $data = $request->validated();

        $job = Job::active()->find($data['job_id']);
        if (!$job) {
            return $this->errorResponse('This job is no longer accepting applications.', null, 410);
        }

        // Get authenticated user if token is provided
        $userId = null;
        if ($request->bearerToken()) {
            $user   = $request->user('sanctum');
            $userId = $user?->id;
        }

        // Prevent duplicate application (same email + same job)
        $alreadyApplied = Application::where('job_id', $data['job_id'])
            ->where('email', $data['email'])
            ->exists();

        if ($alreadyApplied) {
            return $this->errorResponse(
                'You have already applied for this job with this email address.',
                null,
                409
            );
        }

        // Handle CV file upload
        $cvPath = null;
        if ($request->hasFile('cv_file')) {
            $cvPath = $request->file('cv_file')->store('cvs', 'public');
        }

        $application = Application::create([
            'job_id'      => $data['job_id'],
            'user_id'     => $userId,
            'name'        => $data['name'],
            'email'       => $data['email'],
            'resume_link' => $data['resume_link'] ?? null,
            'cv_path'     => $cvPath,
            'cover_note'  => $data['cover_note'] ?? null,
            'status'      => 'pending',
        ]);

        $application->load('job:id,title,company,location');

        return $this->createdResponse($application, 'Your application has been submitted successfully!');
    }

    /**
     * GET /api/user/applications
     * Get all applications for the authenticated user.
     */
    public function myApplications(Request $request): JsonResponse
    {
        $applications = Application::with('job:id,title,company,location,company_logo,job_type')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return $this->successResponse(
            [
                'applications' => $applications,
                'total'        => $applications->count(),
            ],
            'Applications retrieved successfully'
        );
    }

    /**
     * GET /api/admin/applications
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Application::with('job:id,title,company')->latest();

        if ($request->filled('job_id'))  $query->where('job_id', $request->input('job_id'));
        if ($request->filled('status'))  $query->where('status', $request->input('status'));
        if ($request->filled('search')) {
            $keyword = $request->input('search');
            $query->where(fn($q) => $q->where('name', 'LIKE', "%{$keyword}%")
                                      ->orWhere('email', 'LIKE', "%{$keyword}%"));
        }

        $perPage      = min((int) $request->input('per_page', 15), 100);
        $applications = $query->paginate($perPage);

        return $this->successResponse(
            [
                'applications' => $applications->items(),
                'pagination'   => [
                    'current_page' => $applications->currentPage(),
                    'last_page'    => $applications->lastPage(),
                    'per_page'     => $applications->perPage(),
                    'total'        => $applications->total(),
                ],
            ],
            'Applications retrieved successfully'
        );
    }

    public function adminShow(int $id): JsonResponse
    {
        $application = Application::with('job')->find($id);
        if (!$application) return $this->notFoundResponse('Application not found');
        return $this->successResponse($application, 'Application retrieved successfully');
    }

    public function byJob(int $jobId): JsonResponse
    {
        $job = Job::find($jobId);
        if (!$job) return $this->notFoundResponse('Job not found');

        $applications = Application::where('job_id', $jobId)->latest()->get();

        return $this->successResponse(
            ['job' => $job->only(['id', 'title', 'company']), 'applications' => $applications, 'total' => $applications->count()],
            'Applications retrieved successfully'
        );
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate(['status' => ['required', 'in:pending,reviewed,shortlisted,rejected']]);
        $application = Application::find($id);
        if (!$application) return $this->notFoundResponse('Application not found');
        $application->update(['status' => $request->input('status')]);
        return $this->successResponse($application, 'Application status updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $application = Application::find($id);
        if (!$application) return $this->notFoundResponse('Application not found');
        if ($application->cv_path) Storage::disk('public')->delete($application->cv_path);
        $application->delete();
        return $this->successResponse(null, 'Application deleted successfully');
    }
}