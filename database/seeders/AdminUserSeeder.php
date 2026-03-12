<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@dpmptsp.muaraenimkab.go.id'],
            [
                'name' => 'Admin',
                'password' => Hash::make('Dpmptsp@1234'),
                'role' => UserRole::Admin,
                'email_verified_at' => now(),
            ],
        );
    }
}
