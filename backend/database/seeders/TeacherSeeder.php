<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = file_get_contents(base_path('/dump/teachers.json'));
        $teachers = json_decode($teachers);
        $index = 1;
        foreach ($teachers as $teacher) {
            $teacher = collect($teacher)->toArray();
            $teacher['password'] = Hash::make('123456789');
            $teacher['shortcode'] = 'GVDH' . str_pad($index, 8, '0', STR_PAD_LEFT);
            $teacher['username'] = 'teacher_' . uniqid();
            User::create($teacher);
            $index += 1;
        }
    }
}
