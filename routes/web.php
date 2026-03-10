<?php

use App\Http\Controllers\AdminQuestionController;
use App\Http\Controllers\AdminExamAssignmentController;
use App\Http\Controllers\AdminExamController;
use App\Http\Controllers\AdminResultController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ParticipantResultController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::middleware('role:admin,peserta')->group(function () {
        Route::get('/exams', [ExamController::class, 'index'])->name('examsIndex');

        Route::post('/exams/{exam}/start', [ExamController::class, 'start'])->name('examsStart');

        Route::get('/attempts/{attempt}', [ExamController::class, 'show'])->name('examsShow');

        Route::post('/answers', [AnswerController::class, 'store'])->name('answersStore');

        Route::post('/attempts/{attempt}/submit', [ExamController::class, 'submit'])->name('examsSubmit');

        Route::get('/attempts/{attempt}/result', [ResultController::class, 'show'])->name('examsResult');

        Route::get('/peserta/results', [ParticipantResultController::class, 'index'])
            ->name('participantResultsIndex');
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/exams', [AdminExamController::class, 'index'])->name('adminExamsIndex');

        Route::get('/admin/exams/create', [AdminExamController::class, 'create'])->name('adminExamsCreate');

        Route::post('/admin/exams', [AdminExamController::class, 'store'])->name('adminExamsStore');

        Route::get('/admin/exams/{exam}/assignments', [AdminExamAssignmentController::class, 'index'])
            ->name('adminExamAssignmentsIndex');

        Route::post('/admin/exams/{exam}/assignments', [AdminExamAssignmentController::class, 'store'])
            ->name('adminExamAssignmentsStore');

        Route::get('/admin/results', [AdminResultController::class, 'index'])->name('adminResultsIndex');

        Route::post('/admin/questions/import', [AdminQuestionController::class, 'import'])
            ->name('questions.import');

        Route::resource('admin/questions', AdminQuestionController::class);
    });
});

require __DIR__ . '/settings.php';
