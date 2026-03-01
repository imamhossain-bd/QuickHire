<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        return [
            'job_id'      => Job::inRandomOrder()->first()?->id ?? Job::factory(),
            'name'        => $this->faker->name(),
            'email'       => $this->faker->unique()->safeEmail(),
            'resume_link' => 'https://drive.google.com/file/d/' . $this->faker->uuid() . '/view',
            'cover_note'  => $this->faker->paragraph(3),
            'status'      => $this->faker->randomElement(['pending', 'reviewed', 'shortlisted', 'rejected']),
        ];
    }
}
