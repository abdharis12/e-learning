<?php

use App\Enums\UserRole;
use App\Models\Exam;
use App\Models\ExamAssignment;
use App\Models\ExamAttempt;
use App\Models\Option;
use App\Models\Question;
use App\Models\User;

function createScheduledExam(): Exam
{
    $exam = Exam::factory()->create();

    $question = Question::factory()->create([
        'exam_id' => $exam->id,
    ]);

    Option::query()->create([
        'question_id' => $question->id,
        'option_text' => 'A',
        'is_correct' => true,
    ]);

    return $exam;
}

test('admin routes are forbidden for peserta role', function () {
    $peserta = User::factory()->create();

    $this->actingAs($peserta)
        ->get(route('adminExamsIndex'))
        ->assertForbidden();
});

test('participant routes can be opened by admin role', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('examsIndex'))
        ->assertOk();
});

test('participant can not start exam without assignment', function () {
    $peserta = User::factory()->create();
    $exam = createScheduledExam();

    $this->actingAs($peserta)
        ->post(route('examsStart', $exam->id))
        ->assertRedirect(route('examsIndex', absolute: false));

    $this->assertDatabaseCount('exam_attempts', 0);
});

test('participant can only attempt based on max attempts setting', function () {
    $peserta = User::factory()->create();
    $exam = createScheduledExam();

    ExamAssignment::factory()->create([
        'user_id' => $peserta->id,
        'exam_id' => $exam->id,
        'max_attempts' => 1,
    ]);

    ExamAttempt::query()->create([
        'user_id' => $peserta->id,
        'exam_id' => $exam->id,
        'question_order' => [$exam->questions()->first()->id],
        'started_at' => now()->subMinutes(20),
        'finished_at' => now()->subMinutes(5),
        'score' => 10,
    ]);

    $this->actingAs($peserta)
        ->post(route('examsStart', $exam->id))
        ->assertRedirect(route('examsIndex', absolute: false));
});

test('participant can not start outside configured schedule', function () {
    $peserta = User::factory()->create();
    $exam = createScheduledExam();

    ExamAssignment::factory()->create([
        'user_id' => $peserta->id,
        'exam_id' => $exam->id,
        'max_attempts' => 2,
        'available_from' => now()->addHour(),
        'available_until' => now()->addHours(2),
    ]);

    $this->actingAs($peserta)
        ->post(route('examsStart', $exam->id))
        ->assertRedirect(route('examsIndex', absolute: false));
});

test('admin can open assignment management page', function () {
    $admin = User::factory()->admin()->create();
    $exam = createScheduledExam();

    $this->actingAs($admin)
        ->get(route('adminExamAssignmentsIndex', $exam->id))
        ->assertOk();
});

test('new users default to peserta role', function () {
    $user = User::factory()->create();

    expect($user->role)->toBe(UserRole::Peserta);
});
