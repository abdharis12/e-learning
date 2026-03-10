<?php

use App\Models\Exam;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin exams index page can be rendered', function () {
    $user = User::factory()->admin()->create();
    $exam = Exam::factory()->create([
        'title' => 'Ujian Logika',
        'duration_minutes' => 90,
    ]);

    $this->actingAs($user)
        ->get(route('adminExamsIndex'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Exams/Index')
            ->has('exams.data', 1)
            ->where('exams.data.0.title', $exam->title)
            ->where('exams.data.0.duration_minutes', 90)
            ->etc(),
        );
});

test('admin exams create page can be rendered', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('adminExamsCreate'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Exams/Create')
            ->etc(),
        );
});

test('admin can store exam', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('adminExamsStore'), [
        'title' => 'Ujian Bahasa Indonesia',
        'duration_minutes' => 75,
    ]);

    $response->assertRedirect(route('adminExamsIndex', absolute: false));

    $this->assertDatabaseHas('exams', [
        'title' => 'Ujian Bahasa Indonesia',
        'duration_minutes' => 75,
    ]);
});

test('admin exams store requires valid input', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)->post(route('adminExamsStore'), [
        'title' => '',
        'duration_minutes' => 0,
    ])->assertSessionHasErrors(['title', 'duration_minutes']);
});
