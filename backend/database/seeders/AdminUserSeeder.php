<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'full_name' => 'QuickHire Admin',
                'email'     => 'admin@gmail.com',
                'password'  => Hash::make('admin123456'),
                'role'      => 'admin',
            ]
        );

        $this->command->info('Admin user seeded: admin@gmail.com / admin123456');
    }
}