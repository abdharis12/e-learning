<?php

use App\Models\Exam;
use App\Models\Question;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin questions index page can be rendered', function () {
    $user = User::factory()->admin()->create();
    $exam = Exam::factory()->create();
    Question::factory()->create([
        'exam_id' => $exam->id,
        'question_text' => 'Contoh pertanyaan',
        'score' => 10,
    ]);

    $this->actingAs($user)
        ->get(route('questions.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Questions/Index')
            ->has('questions.data', 1)
            ->where('questions.data.0.exam.title', $exam->title)
            ->where('questions.data.0.score', 10)
            ->etc(),
        );
});

test('admin questions create page can be rendered', function () {
    $user = User::factory()->admin()->create();
    $exam = Exam::factory()->create([
        'title' => 'Ujian Matematika',
    ]);

    $this->actingAs($user)
        ->get(route('questions.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Questions/Create')
            ->where("exams.{$exam->id}", 'Ujian Matematika')
            ->etc(),
        );
});
