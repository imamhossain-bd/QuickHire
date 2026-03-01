<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('applications')) {
            Schema::create('applications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('job_id')->constrained('jobs')->onDelete('cascade');
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->string('name');
                $table->string('email');
                $table->string('resume_link');
                $table->string('cv_path')->nullable();
                $table->text('cover_note')->nullable();
                $table->enum('status', ['pending', 'reviewed', 'shortlisted', 'rejected'])->default('pending');
                $table->timestamps();

                $table->index('job_id');
                $table->index('user_id');
                $table->index('email');
                $table->index('status');
                $table->index('created_at');

                $table->unique(['job_id', 'email']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
