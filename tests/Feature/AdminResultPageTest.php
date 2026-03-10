<?php

use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin results index page can be rendered', function () {
    $user = User::factory()->admin()->create();
    $exam = Exam::factory()->create([
        'title' => 'Ujian Fisika',
    ]);
    $participant = User::factory()->create([
        'name' => 'Peserta Satu',
    ]);

    ExamAttempt::query()->create([
        'user_id' => $participant->id,
        'exam_id' => $exam->id,
        'score' => 80,
        'question_order' => [1, 2, 3],
        'started_at' => now()->subHour(),
        'finished_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('adminResultsIndex'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Results/Index')
            ->has('results.data', 1)
            ->where('results.data.0.user.name', 'Peserta Satu')
            ->where('results.data.0.exam.title', 'Ujian Fisika')
            ->where('results.data.0.score', 80)
            ->etc(),
        );
});

test('admin results only include finished attempts', function () {
    $user = User::factory()->admin()->create();
    $exam = Exam::factory()->create();
    $participant = User::factory()->create();

    ExamAttempt::query()->create([
        'user_id' => $participant->id,
        'exam_id' => $exam->id,
        'score' => null,
        'question_order' => [1, 2, 3],
        'started_at' => now()->subMinutes(30),
        'finished_at' => null,
    ]);

    $this->actingAs($user)
        ->get(route('adminResultsIndex'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Results/Index')
            ->has('results.data', 0)
            ->etc(),
        );
});
