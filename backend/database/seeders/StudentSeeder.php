<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = file_get_contents(base_path('/dump/students.json'));
        $students = json_decode($students);
        foreach ($students as $student) {
            $student = collect($student)->toArray();
            $student['password'] = Hash::make('123456789');
            $student['username'] = 'student_' . uniqid();
            User::create($student);
        }
    }
}
