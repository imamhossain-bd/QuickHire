<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    use ApiResponse;

    
    public function index(): JsonResponse
    {
        $totalJobs         = Job::count();
        $activeJobs        = Job::active()->count();
        $totalApplications = Application::count();
        $pendingApplications = Application::where('status', 'pending')->count();

        $applicationsByStatus = Application::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $jobsByCategory = Job::active()
            ->select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();

        $topJobs = Job::withCount('applications')
            ->orderByDesc('applications_count')
            ->limit(5)
            ->get(['id', 'title', 'company', 'applications_count']);
        $recentApplications = Application::with('job:id,title,company')
            ->latest()
            ->limit(5)
            ->get();

        return $this->successResponse(
            [
                'overview' => [
                    'total_jobs'           => $totalJobs,
                    'active_jobs'          => $activeJobs,
                    'inactive_jobs'        => $totalJobs - $activeJobs,
                    'total_applications'   => $totalApplications,
                    'pending_applications' => $pendingApplications,
                ],
                'applications_by_status' => $applicationsByStatus,
                'jobs_by_category'       => $jobsByCategory,
                'top_jobs'               => $topJobs,
                'recent_applications'    => $recentApplications,
            ],
            'Stats retrieved successfully'
        );
    }
}
