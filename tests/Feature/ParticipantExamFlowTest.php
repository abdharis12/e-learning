<?php

use App\Models\Exam;
use App\Models\ExamAssignment;
use App\Models\ExamAttempt;
use App\Models\Option;
use App\Models\Question;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function createExamWithQuestions(): Exam
{
    $exam = Exam::factory()->create([
        'title' => 'Ujian Peserta',
        'duration_minutes' => 60,
    ]);

    $questionOne = Question::factory()->create([
        'exam_id' => $exam->id,
        'question_text' => '2 + 2 = ?',
        'score' => 10,
    ]);

    $questionTwo = Question::factory()->create([
        'exam_id' => $exam->id,
        'question_text' => '3 + 5 = ?',
        'score' => 20,
    ]);

    Option::query()->create([
        'question_id' => $questionOne->id,
        'option_text' => '4',
        'is_correct' => true,
    ]);

    Option::query()->create([
        'question_id' => $questionOne->id,
        'option_text' => '5',
        'is_correct' => false,
    ]);

    Option::query()->create([
        'question_id' => $questionTwo->id,
        'option_text' => '8',
        'is_correct' => true,
    ]);

    Option::query()->create([
        'question_id' => $questionTwo->id,
        'option_text' => '7',
        'is_correct' => false,
    ]);

    return $exam;
}

test('participant can view exams list', function () {
    $user = User::factory()->create();
    $exam = createExamWithQuestions();
    ExamAssignment::factory()->create([
        'user_id' => $user->id,
        'exam_id' => $exam->id,
    ]);

    $this->actingAs($user)
        ->get(route('examsIndex'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Exam/Index')
            ->where('exams.0.title', $exam->title)
            ->where('exams.0.questions_count', 2)
            ->etc(),
        );
});

test('participant can start exam', function () {
    $user = User::factory()->create();
    $exam = createExamWithQuestions();
    ExamAssignment::factory()->create([
        'user_id' => $user->id,
        'exam_id' => $exam->id,
    ]);

    $response = $this->actingAs($user)
        ->post(route('examsStart', $exam->id));

    $attempt = ExamAttempt::query()->first();

    expect($attempt)->not->toBeNull();
    expect($attempt->user_id)->toBe($user->id);
    expect($attempt->exam_id)->toBe($exam->id);

    $response->assertRedirect(route('examsShow', $attempt->id, absolute: false));
});

test('participant can not start exam without questions', function () {
    $user = User::factory()->create();
    $exam = Exam::factory()->create();
    ExamAssignment::factory()->create([
        'user_id' => $user->id,
        'exam_id' => $exam->id,
    ]);

    $response = $this->actingAs($user)
        ->post(route('examsStart', $exam->id));

    $response->assertRedirect(route('examsIndex', absolute: false));
    $this->assertDatabaseCount('exam_attempts', 0);
});

test('participant can submit exam and score is calculated', function () {
    $user = User::factory()->create();
    $exam = createExamWithQuestions();
    ExamAssignment::factory()->create([
        'user_id' => $user->id,
        'exam_id' => $exam->id,
        'max_attempts' => 2,
    ]);

    $attempt = ExamAttempt::query()->create([
        'user_id' => $user->id,
        'exam_id' => $exam->id,
        'question_order' => $exam->questions()->pluck('id')->all(),
        'started_at' => now()->subMinutes(20),
    ]);

    $firstQuestion = $exam->questions()->first();
    $secondQuestion = $exam->questions()->latest('id')->first();

    $firstCorrectOption = Option::query()
        ->where('question_id', $firstQuestion->id)
        ->where('is_correct', true)
        ->first();

    $secondWrongOption = Option::query()
        ->where('question_id', $secondQuestion->id)
        ->where('is_correct', false)
        ->first();

    $this->actingAs($user)->post(route('answersStore'), [
        'attempt_id' => $attempt->id,
        'question_id' => $firstQuestion->id,
        'option_id' => $firstCorrectOption->id,
    ])->assertRedirect();

    $this->actingAs($user)->post(route('answersStore'), [
        'attempt_id' => $attempt->id,
        'question_id' => $secondQuestion->id,
        'option_id' => $secondWrongOption->id,
    ])->assertRedirect();

    $response = $this->actingAs($user)
        ->post(route('examsSubmit', $attempt->id));

    $attempt->refresh();

    expect($attempt->score)->toBe(10);
    expect($attempt->finished_at)->not->toBeNull();

    $response->assertRedirect(route('examsResult', $attempt->id, absolute: false));
});

test('participant can not open other participant attempt', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $exam = createExamWithQuestions();

    $attempt = ExamAttempt::query()->create([
        'user_id' => $owner->id,
        'exam_id' => $exam->id,
        'question_order' => $exam->questions()->pluck('id')->all(),
        'started_at' => now()->subMinutes(20),
    ]);

    $this->actingAs($other)
        ->get(route('examsShow', $attempt->id))
        ->assertForbidden();
});

test('participant can view result page', function () {
    $user = User::factory()->create();
    $exam = createExamWithQuestions();

    $attempt = ExamAttempt::query()->create([
        'user_id' => $user->id,
        'exam_id' => $exam->id,
        'score' => 30,
        'question_order' => $exam->questions()->pluck('id')->all(),
        'started_at' => now()->subMinutes(30),
        'finished_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('examsResult', $attempt->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Exam/ResultPage')
            ->where('examTitle', $exam->title)
            ->where('score', 30)
            ->etc(),
        );
});
