<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Job;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Seeding QuickHire database...');
        
        $this->call(AdminUserSeeder::class);

        // Create 20 demo jobs
        $this->command->info('Creating jobs...');
        $jobs = Job::factory(20)->create();

        // Create 2-5 applications per job
        $this->command->info('Creating applications...');
        $jobs->each(function (Job $job) {
            $count = rand(1, 5);
            Application::factory($count)->create([
                'job_id' => $job->id,
            ]);
        });

        // Create some specific demo jobs for good UX
        $this->createDemoJobs();

        $this->command->info('✅ Database seeded successfully!');
        $this->command->table(
            ['Model', 'Count'],
            [
                ['Jobs', Job::count()],
                ['Applications', Application::count()],
            ]
        );
    }

    private function createDemoJobs(): void
    {
        $demoJobs = [
            [
                'title'        => 'Senior React Developer',
                'company'      => 'Brain Station 23',
                'company_logo' => 'https://instasize.com/p/b14568d9e2989af83d104f8661e02b7a5623cbdb0ef70075b10137641a307265',
                'location'     => 'Dhaka, Bangladesh',
                'category'     => 'Engineering',
                'job_type'     => 'full-time',
                'salary_min'   => 80000,
                'salary_max'   => 120000,
                'description'  => 'We are looking for an experienced React Developer to join our growing team. You will be responsible for developing and maintaining high-quality web applications. You will work closely with our product and design teams to deliver exceptional user experiences. The ideal candidate has strong expertise in React.js, TypeScript, and modern frontend tooling.',
                'requirements' => "• 4+ years of experience with React.js\n• Strong knowledge of TypeScript\n• Experience with Redux or Zustand\n• Familiarity with REST APIs and GraphQL\n• Strong problem-solving skills",
                'benefits'     => "• Competitive salary\n• Health & life insurance\n• 20 days annual leave\n• Work from home flexibility\n• Annual performance bonus",
                'is_active'    => true,
            ],
            [
                'title'        => 'Laravel Backend Engineer',
                'company'      => 'Pathao',
                'company_logo' => 'https://logo.clearbit.com/pathao.com',
                'location'     => 'Dhaka (Hybrid)',
                'category'     => 'Engineering',
                'job_type'     => 'full-time',
                'salary_min'   => 70000,
                'salary_max'   => 110000,
                'description'  => 'Pathao is seeking a talented Laravel Backend Engineer to help scale our platform serving millions of users across Bangladesh. You will design, build, and maintain efficient, reusable, and reliable PHP code using the Laravel framework. You will collaborate with cross-functional teams to define, design, and ship new features.',
                'requirements' => "• 3+ years of Laravel experience\n• Strong SQL/MySQL skills\n• Knowledge of Redis and queue systems\n• Experience with RESTful API design\n• Familiarity with microservices architecture",
                'benefits'     => "• Market-competitive salary\n• Health insurance\n• Flexible working hours\n• Learning & development budget\n• Team retreats",
                'is_active'    => true,
            ],
            [
                'title'        => 'UI/UX Designer',
                'company'      => 'Shajgoj',
                'company_logo' => 'https://logo.clearbit.com/shajgoj.com',
                'location'     => 'Remote',
                'category'     => 'Design',
                'job_type'     => 'remote',
                'salary_min'   => 50000,
                'salary_max'   => 80000,
                'description'  => 'Shajgoj is the largest beauty & lifestyle platform in Bangladesh. We are looking for a creative UI/UX Designer to craft beautiful, user-centric digital experiences. You will work on our e-commerce platform, mobile apps, and marketing materials. If you love turning complex problems into simple, beautiful designs, we want to hear from you!',
                'requirements' => "• 2+ years of UI/UX design experience\n• Proficiency in Figma\n• Strong portfolio of digital product designs\n• Understanding of mobile-first design\n• Knowledge of design systems",
                'benefits'     => "• Fully remote work\n• Flexible schedule\n• Equipment allowance\n• Health insurance\n• Creative freedom",
                'is_active'    => true,
            ],
            [
                'title'        => 'Digital Marketing Manager',
                'company'      => 'Chaldal',
                'company_logo' => 'https://logo.clearbit.com/chaldal.com',
                'location'     => 'Dhaka, Bangladesh',
                'category'     => 'Marketing',
                'job_type'     => 'full-time',
                'salary_min'   => 60000,
                'salary_max'   => 90000,
                'description'  => 'Chaldal is Bangladesh\'s leading online grocery platform. We are looking for an experienced Digital Marketing Manager to drive our online growth. You will develop and execute digital marketing strategies across SEO, SEM, social media, email, and content marketing. You will analyze campaign performance and optimize for maximum ROI.',
                'requirements' => "• 4+ years in digital marketing\n• Experience with Google Ads & Meta Ads\n• Strong analytical skills (Google Analytics)\n• SEO/SEM expertise\n• Proven track record of growth",
                'benefits'     => "• Competitive package\n• Health insurance\n• Performance bonus\n• Annual leave\n• Professional growth",
                'is_active'    => true,
            ],
            [
                'title'        => 'Data Scientist',
                'company'      => 'DataSoft Systems',
                'company_logo' => 'https://i.ibb.co.com/YThYp8LN/Brand-Designer2.png',
                'location'     => 'Dhaka, Bangladesh',
                'category'     => 'Data Science',
                'job_type'     => 'full-time',
                'salary_min'   => 90000,
                'salary_max'   => 140000,
                'description'  => 'DataSoft is looking for a Data Scientist to join our analytics team. You will use statistical analysis, machine learning, and data visualization to solve complex business problems. You will work with large datasets, build predictive models, and communicate insights to stakeholders across the organization.',
                'requirements' => "• MS/BS in Computer Science, Statistics, or related field\n• Proficiency in Python (pandas, scikit-learn, TensorFlow)\n• Experience with SQL and big data tools\n• Strong statistical knowledge\n• Excellent communication skills",
                'benefits'     => "• Top-tier salary\n• Research budget\n• Health & dental insurance\n• Remote work options\n• Conference attendance",
                'is_active'    => true,
            ],
        ];

        foreach ($demoJobs as $jobData) {
            $job = Job::create($jobData);

            // Add some applications to each demo job
            Application::factory(rand(3, 8))->create(['job_id' => $job->id]);
        }
    }
}
