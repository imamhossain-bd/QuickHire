<?php

namespace Database\Factories;

use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobFactory extends Factory
{
    protected $model = Job::class;

    private array $categories = [
        'Engineering',
        'Design',
        'Marketing',
        'Finance',
        'Human Resources',
        'Product',
        'Sales',
        'Customer Support',
        'Data Science',
        'DevOps',
    ];

    private array $companies = [
        ['name' => 'TechCorp BD',      'logo' => 'logos/Social-Media-Assistant.png'],
        ['name' => 'Pathao',           'logo' => 'logos/Social-Media-Assistant2.png'],
        ['name' => 'Chaldal',          'logo' => 'logos/Brand-Designer.png'],
        ['name' => 'Shajgoj',          'logo' => 'logos/Brand-Designer2.png'],
        ['name' => 'Brain Station 23', 'logo' => 'logos/Interactive-Developer.png'],
        ['name' => 'BJIT Limited',     'logo' => 'logos/Interactive-Developer2.png'],
        ['name' => 'Augmedix',         'logo' => 'logos/HR-Manager.png'],
        ['name' => 'Shohoz',           'logo' => 'logos/HR-Manager2.png'],
        ['name' => 'Kaan Pete Roi',    'logo' => 'logos/logo.png'],
        ['name' => 'DataSoft',         'logo' => 'logos/logo.png'],
    ];

    private array $locations = [
        'Dhaka, Bangladesh',
        'Chittagong, Bangladesh',
        'Sylhet, Bangladesh',
        'Rajshahi, Bangladesh',
        'Remote',
        'Dhaka (Hybrid)',
    ];

    public function definition(): array
    {
        $company   = $this->faker->randomElement($this->companies);
        $salaryMin = $this->faker->numberBetween(20000, 80000);
        $salaryMax = $salaryMin + $this->faker->numberBetween(10000, 50000);

        return [
            'title'        => $this->faker->randomElement([
                'Senior Software Engineer',
                'Full Stack Developer',
                'React Developer',
                'Laravel Developer',
                'UI/UX Designer',
                'Product Manager',
                'Data Analyst',
                'DevOps Engineer',
                'Marketing Manager',
                'HR Executive',
                'Business Analyst',
                'QA Engineer',
                'Mobile App Developer',
                'Backend Developer',
                'Cloud Architect',
            ]),
            'company'      => $company['name'],
            'company_logo' => $company['logo'],
            'location'     => $this->faker->randomElement($this->locations),
            'category'     => $this->faker->randomElement($this->categories),
            'job_type'     => $this->faker->randomElement(['full-time', 'part-time', 'remote', 'contract', 'internship']),
            'salary_min'   => $salaryMin,
            'salary_max'   => $salaryMax,
            'description'  => $this->faker->paragraphs(4, true),
            'requirements' => $this->faker->paragraphs(2, true),
            'benefits'     => "Health Insurance\nFlexible Hours\nAnnual Bonus\nRemote Work Options\nProfessional Development",
            'is_active'    => $this->faker->boolean(85),
        ];
    }
}
