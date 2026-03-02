<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory;

    protected $table = 'applications';

    protected $fillable = [
        'job_id', 'user_id', 'name', 'email', 'resume_link', 'cv_path', 'cover_note', 'status',
    ];

    protected $appends = ['cv_url'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function statuses(): array
    {
        return ['pending', 'reviewed', 'shortlisted', 'rejected'];
    }

    public function getCvUrlAttribute(): ?string
    {
        return $this->cv_path ? \Illuminate\Support\Facades\Storage::url($this->cv_path) : null;
    }
}