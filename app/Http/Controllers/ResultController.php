<?php

namespace App\Http\Controllers;

use App\Models\ExamAttempt;
use Inertia\Inertia;
use Inertia\Response;

class ResultController extends Controller
{
    public function show(ExamAttempt $attempt): Response
    {
        abort_unless($attempt->user_id === auth()->id(), 403);

        $attempt->load('exam');

        $answers = $attempt->answers()->with('option')->get();

        $correct = $answers->filter(function ($a) {
            return $a->option->is_correct;
        })->count();

        $wrong = $answers->count() - $correct;

        return Inertia::render('Exam/ResultPage', [
            'examTitle' => $attempt->exam?->title,
            'score' => $attempt->score,
            'correct' => $correct,
            'wrong' => $wrong,
            'total' => $answers->count(),
        ]);
    }
}
