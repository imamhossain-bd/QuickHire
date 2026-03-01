<?php

namespace Database\Seeders;

use App\Models\Job;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        $jobs = [
            [
                'title'       => 'Senior Frontend Developer',
                'company'     => 'TechCorp Bangladesh',
                'location'    => 'Dhaka, Bangladesh',
                'category'    => 'Engineering',
                'job_type'    => 'full-time',
                'salary_min'  => 80000,
                'salary_max'  => 120000,
                'description' => 'We are looking for an experienced Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining high-quality web applications using modern JavaScript frameworks.\n\nAs a Senior Frontend Developer, you will collaborate closely with our design and backend teams to deliver exceptional user experiences. You will mentor junior developers and contribute to architectural decisions.',
                'requirements' => "- 5+ years of experience in frontend development\n- Expert knowledge of React.js or Vue.js\n- Proficiency in TypeScript\n- Experience with Tailwind CSS or similar CSS frameworks\n- Understanding of RESTful APIs and GraphQL\n- Strong knowledge of web performance optimization\n- Familiarity with CI/CD pipelines\n- Excellent problem-solving skills",
                'benefits'    => "- Competitive salary\n- Health insurance\n- Flexible working hours\n- Remote work options\n- Annual performance bonus\n- Professional development budget\n- Modern office in Dhaka",
                'is_active'   => true,
            ],
            [
                'title'       => 'Backend Developer (Laravel)',
                'company'     => 'SoftSolution Ltd.',
                'location'    => 'Chittagong, Bangladesh',
                'category'    => 'Engineering',
                'job_type'    => 'full-time',
                'salary_min'  => 60000,
                'salary_max'  => 90000,
                'description' => 'SoftSolution Ltd. is seeking a skilled Laravel Backend Developer to help us build scalable, secure, and maintainable web applications. You will work in an agile environment and contribute to all stages of the development lifecycle.',
                'requirements' => "- 3+ years of experience with PHP and Laravel\n- Strong understanding of MVC architecture\n- Experience with MySQL and database optimization\n- Knowledge of RESTful API design\n- Familiarity with Redis, queues, and caching\n- Experience with Git version control\n- Good understanding of SOLID principles",
                'benefits'    => "- Competitive salary package\n- Medical allowance\n- Festival bonuses\n- Career growth opportunities\n- Friendly work environment",
                'is_active'   => true,
            ],
            [
                'title'       => 'UI/UX Designer',
                'company'     => 'Creative Minds Agency',
                'location'    => 'Dhaka, Bangladesh',
                'category'    => 'Design',
                'job_type'    => 'full-time',
                'salary_min'  => 50000,
                'salary_max'  => 75000,
                'description' => 'Creative Minds Agency is looking for a talented UI/UX Designer who can create beautiful, user-centered designs. You will work closely with product managers and developers to deliver outstanding digital experiences for our clients.',
                'requirements' => "- 3+ years of UI/UX design experience\n- Proficiency in Figma and Adobe XD\n- Strong portfolio showcasing web and mobile designs\n- Understanding of user research and usability testing\n- Knowledge of design systems and component libraries\n- Ability to create wireframes, prototypes, and high-fidelity designs\n- Good communication skills",
                'benefits'    => "- Creative and collaborative work environment\n- Competitive salary\n- Flexible working hours\n- Opportunity to work on international projects\n- Regular team outings",
                'is_active'   => true,
            ],
            [
                'title'       => 'DevOps Engineer',
                'company'     => 'CloudBase Technologies',
                'location'    => 'Remote',
                'category'    => 'DevOps',
                'job_type'    => 'remote',
                'salary_min'  => 100000,
                'salary_max'  => 150000,
                'description' => 'CloudBase Technologies is hiring a DevOps Engineer to manage and improve our cloud infrastructure. You will automate deployment pipelines, monitor system performance, and ensure the reliability and security of our platforms.',
                'requirements' => "- 4+ years of DevOps/SRE experience\n- Strong knowledge of AWS, GCP, or Azure\n- Experience with Docker and Kubernetes\n- Proficiency in CI/CD tools (GitHub Actions, Jenkins)\n- Infrastructure as Code experience (Terraform, Ansible)\n- Strong scripting skills (Bash, Python)\n- Understanding of networking and security principles",
                'benefits'    => "- Fully remote position\n- Competitive USD salary\n- Home office stipend\n- Health and wellness allowance\n- Flexible working hours across time zones",
                'is_active'   => true,
            ],
            [
                'title'       => 'Product Manager',
                'company'     => 'InnovateBD',
                'location'    => 'Dhaka, Bangladesh',
                'category'    => 'Product',
                'job_type'    => 'full-time',
                'salary_min'  => 70000,
                'salary_max'  => 110000,
                'description' => 'InnovateBD is looking for a strategic and customer-focused Product Manager to lead our product development initiatives. You will define product vision, roadmap, and work with cross-functional teams to deliver products that delight our users.',
                'requirements' => "- 4+ years of product management experience\n- Strong analytical and data-driven mindset\n- Experience with agile methodologies (Scrum, Kanban)\n- Excellent written and verbal communication skills\n- Ability to prioritize features and manage stakeholder expectations\n- Familiarity with product tools (Jira, Confluence, Notion)\n- Technical background is a plus",
                'benefits'    => "- Competitive salary\n- Stock options\n- Health insurance for family\n- Annual training budget\n- Flexible hybrid work policy",
                'is_active'   => true,
            ],
            [
                'title'       => 'Data Analyst',
                'company'     => 'DataDriven Corp',
                'location'    => 'Sylhet, Bangladesh',
                'category'    => 'Data Science',
                'job_type'    => 'full-time',
                'salary_min'  => 55000,
                'salary_max'  => 80000,
                'description' => 'DataDriven Corp is seeking a detail-oriented Data Analyst to help us make sense of complex datasets and drive business insights. You will work with large datasets and create actionable reports and dashboards for stakeholders.',
                'requirements' => "- 2+ years of data analysis experience\n- Proficiency in SQL and Python or R\n- Experience with data visualization tools (Power BI, Tableau, or Looker)\n- Strong Excel/Google Sheets skills\n- Understanding of statistical analysis\n- Ability to communicate insights to non-technical audiences\n- Experience with ETL processes is a plus",
                'benefits'    => "- Competitive salary\n- Training and certifications support\n- Flexible working hours\n- Annual bonus",
                'is_active'   => true,
            ],
            [
                'title'       => 'Mobile App Developer (React Native)',
                'company'     => 'AppFactory BD',
                'location'    => 'Dhaka, Bangladesh',
                'category'    => 'Engineering',
                'job_type'    => 'contract',
                'salary_min'  => 70000,
                'salary_max'  => 100000,
                'description' => 'AppFactory BD is looking for a React Native developer to build cross-platform mobile applications. This is a contract role with potential to convert to full-time. You will work on exciting projects for both local and international clients.',
                'requirements' => "- 3+ years of React Native experience\n- Published apps on Google Play or App Store\n- Strong JavaScript/TypeScript skills\n- Experience with Redux or Zustand for state management\n- Knowledge of native modules and platform-specific code\n- Familiarity with REST APIs and Firebase\n- Good understanding of mobile UI/UX principles",
                'benefits'    => "- Competitive contract rate\n- Flexible working hours\n- Remote-friendly\n- Opportunity for full-time conversion\n- Interesting and varied project portfolio",
                'is_active'   => true,
            ],
            [
                'title'       => 'Digital Marketing Specialist',
                'company'     => 'GrowthHub',
                'location'    => 'Dhaka, Bangladesh',
                'category'    => 'Marketing',
                'job_type'    => 'full-time',
                'salary_min'  => 40000,
                'salary_max'  => 65000,
                'description' => 'GrowthHub is looking for a Digital Marketing Specialist to plan and execute digital marketing campaigns across multiple channels. You will work to increase brand awareness, generate leads, and grow our online presence.',
                'requirements' => "- 2+ years of digital marketing experience\n- Proficiency in Google Ads and Facebook Ads\n- SEO/SEM knowledge\n- Experience with email marketing tools (Mailchimp, Sendinblue)\n- Familiarity with Google Analytics and social media analytics\n- Content creation and copywriting skills\n- Data-driven approach to campaign optimization",
                'benefits'    => "- Competitive salary\n- Performance bonuses\n- Health coverage\n- Learning and development budget\n- Friendly startup culture",
                'is_active'   => true,
            ],
        ];

        foreach ($jobs as $job) {
            Job::create($job);
        }

        $this->command->info('✅ Jobs seeded successfully! (' . count($jobs) . ' jobs created)');
    }
}
