<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Job extends Model
{
    use HasFactory;

    protected $table = 'jobs';

    protected $fillable = [
        'title', 'company', 'company_logo', 'location', 'category', 'job_type', 'salary_min', 'salary_max',
        'description', 'requirements', 'benefits', 'is_active',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'salary_min' => 'integer',
        'salary_max' => 'integer',
    ];

  
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'job_id');
    }

   
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

   
    public function scopeSearch($query, ?string $keyword)
    {
        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('company', 'LIKE', "%{$keyword}%")
                  ->orWhere('description', 'LIKE', "%{$keyword}%");
            });
        }

        return $query;
    }

   
    public function scopeByCategory($query, ?string $category)
    {
        if ($category) {
            $query->where('category', $category);
        }

        return $query;
    }

   
    public function scopeByLocation($query, ?string $location)
    {
        if ($location) {
            $query->where('location', 'LIKE', "%{$location}%");
        }

        return $query;
    }

    
    public function scopeByJobType($query, ?string $jobType)
    {
        if ($jobType) {
            $query->where('job_type', $jobType);
        }

        return $query;
    }
}
