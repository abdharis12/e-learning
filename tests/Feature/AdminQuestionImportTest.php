<?php

use App\Models\Exam;
use App\Models\Option;
use App\Models\Question;
use App\Models\User;
use Illuminate\Http\UploadedFile;

test('admin can import questions from csv', function () {
    $admin = User::factory()->admin()->create();

    $csvContent = implode("\n", [
        'exam_title,question_text,score,option_1,option_2,option_3,option_4,correct_option',
        'Ujian Matematika,2+2=?,10,4,3,2,1,A',
        'Ujian Matematika,3+5=?,20,6,7,8,9,3',
    ]);

    $file = UploadedFile::fake()->createWithContent(
        'questions.csv',
        $csvContent,
    );

    $response = $this->actingAs($admin)
        ->post(route('questions.import'), [
            'import_file' => $file,
        ]);

    $response->assertRedirect(route('questions.index', absolute: false));

    $exam = Exam::query()->where('title', 'Ujian Matematika')->first();

    expect($exam)->not->toBeNull();

    $questions = Question::query()->where('exam_id', $exam->id)->get();
    expect($questions)->toHaveCount(2);

    $firstQuestion = Question::query()
        ->where('question_text', '2+2=?')
        ->first();

    expect($firstQuestion)->not->toBeNull();
    expect(Option::query()->where('question_id', $firstQuestion->id)->count())
        ->toBe(4);

    $correctOption = Option::query()
        ->where('question_id', $firstQuestion->id)
        ->where('is_correct', true)
        ->first();

    expect($correctOption->option_text)->toBe('4');
});

test('peserta can not import questions', function () {
    $peserta = User::factory()->create();

    $csvContent = implode("\n", [
        'exam_title,question_text,score,option_1,option_2,option_3,option_4,correct_option',
        'Ujian Matematika,2+2=?,10,4,3,2,1,A',
    ]);

    $file = UploadedFile::fake()->createWithContent(
        'questions.csv',
        $csvContent,
    );

    $this->actingAs($peserta)
        ->post(route('questions.import'), [
            'import_file' => $file,
        ])->assertForbidden();
});

test('admin can import semicolon csv with bom', function () {
    $admin = User::factory()->admin()->create();

    $csvContent = implode("\n", [
        "\xEF\xBB\xBFexam_title;question_text;score;option_1;option_2;option_3;option_4;correct_option",
        'Ujian Pemrograman;Tag HTML untuk hyperlink adalah...;10;A. <link>;B. <a>;C. <href>;D. <url>;B',
    ]);

    $file = UploadedFile::fake()->createWithContent(
        'book1.csv',
        $csvContent,
    );

    $this->actingAs($admin)
        ->post(route('questions.import'), [
            'import_file' => $file,
        ])->assertRedirect(route('questions.index', absolute: false));

    $question = Question::query()
        ->where('question_text', 'Tag HTML untuk hyperlink adalah...')
        ->first();

    expect($question)->not->toBeNull();
    expect($question->exam->title)->toBe('Ujian Pemrograman');
});
