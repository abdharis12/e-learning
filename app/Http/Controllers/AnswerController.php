<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnswerRequest;
use App\Models\Answer;
use App\Models\ExamAttempt;
use Illuminate\Http\RedirectResponse;

class AnswerController extends Controller
{
    public function store(StoreAnswerRequest $request): RedirectResponse
    {
        $attempt = ExamAttempt::query()->findOrFail($request->integer('attempt_id'));

        abort_unless($attempt->user_id === auth()->id(), 403);
        abort_if($attempt->finished_at !== null, 403);

        Answer::updateOrCreate(
            [
                'attempt_id' => $attempt->id,
                'question_id' => $request->integer('question_id'),
            ],
            [
                'option_id' => $request->integer('option_id'),
            ],
        );

        return back();
    }
}
