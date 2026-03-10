<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Exam;
use App\Models\ExamAssignment;
use App\Models\ExamAttempt;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function index(): Response
    {
        $assignments = ExamAssignment::query()
            ->with([
                'exam' => fn ($query) => $query->withCount('questions'),
            ])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        $attemptCounts = ExamAttempt::query()
            ->where('user_id', auth()->id())
            ->selectRaw('exam_id, count(*) as attempts_count')
            ->groupBy('exam_id')
            ->pluck('attempts_count', 'exam_id');

        $now = now();

        $exams = $assignments->map(function (ExamAssignment $assignment) use ($attemptCounts, $now) {
            $attemptsUsed = (int) ($attemptCounts[$assignment->exam_id] ?? 0);
            $attemptsLeft = max(0, $assignment->max_attempts - $attemptsUsed);

            $windowOpen = (
                ($assignment->available_from === null || $now->greaterThanOrEqualTo($assignment->available_from))
                && ($assignment->available_until === null || $now->lessThanOrEqualTo($assignment->available_until))
            );

            return [
                'id' => $assignment->exam->id,
                'title' => $assignment->exam->title,
                'duration_minutes' => $assignment->exam->duration_minutes,
                'questions_count' => $assignment->exam->questions_count,
                'max_attempts' => $assignment->max_attempts,
                'attempts_used' => $attemptsUsed,
                'attempts_left' => $attemptsLeft,
                'available_from' => $assignment->available_from,
                'available_until' => $assignment->available_until,
                'can_start' => $windowOpen && $attemptsLeft > 0 && $assignment->exam->questions_count > 0,
            ];
        })->values();

        return Inertia::render('Exam/Index', [
            'exams' => $exams,
        ]);
    }

    public function start(Exam $exam): RedirectResponse
    {
        $assignment = ExamAssignment::query()
            ->where('exam_id', $exam->id)
            ->where('user_id', auth()->id())
            ->first();

        if (! $assignment) {
            return redirect()->route('examsIndex');
        }

        if (
            ($assignment->available_from !== null && now()->lt($assignment->available_from))
            || ($assignment->available_until !== null && now()->gt($assignment->available_until))
        ) {
            return redirect()->route('examsIndex');
        }

        $activeAttempt = ExamAttempt::query()
            ->where('exam_id', $exam->id)
            ->where('user_id', auth()->id())
            ->whereNull('finished_at')
            ->latest()
            ->first();

        if ($activeAttempt) {
            return redirect()->route('examsShow', $activeAttempt->id);
        }

        $attemptsUsed = ExamAttempt::query()
            ->where('exam_id', $exam->id)
            ->where('user_id', auth()->id())
            ->count();

        if ($attemptsUsed >= $assignment->max_attempts) {
            return redirect()->route('examsIndex');
        }

        $questionIds = $exam->questions()->pluck('id');

        if ($questionIds->isEmpty()) {
            return redirect()->route('examsIndex');
        }

        $attempt = ExamAttempt::create([
            'user_id' => auth()->id(),
            'exam_id' => $exam->id,
            'started_at' => now(),
            'question_order' => $questionIds->shuffle()->values()->all(),
        ]);

        return redirect()->route('examsShow', $attempt->id);
    }

    public function show(ExamAttempt $attempt): Response
    {
        abort_unless($attempt->user_id === auth()->id(), 403);

        $attempt->load(['exam.questions.options', 'answers']);

        $exam = $attempt->exam;
        $order = $attempt->question_order ?? [];

        $questions = $exam->questions
            ->sortBy(fn ($question) => array_search($question->id, $order, true))
            ->values()
            ->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'score' => $question->score,
                    'options' => $question->options->map(fn ($option) => [
                        'id' => $option->id,
                        'option_text' => $option->option_text,
                    ])->values(),
                ];
            })
            ->values();

        $answers = $attempt->answers
            ->mapWithKeys(fn ($answer) => [(string) $answer->question_id => $answer->option_id]);

        return Inertia::render('Exam/ExamPage', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'duration_minutes' => $exam->duration_minutes,
                'questions' => $questions,
            ],
            'attemptId' => $attempt->id,
            'answers' => $answers,
        ]);
    }

    public function submit(ExamAttempt $attempt): RedirectResponse
    {
        abort_unless($attempt->user_id === auth()->id(), 403);

        if ($attempt->finished_at !== null) {
            return redirect()->route('examsResult', $attempt->id);
        }

        $answers = Answer::with('option', 'question')
            ->where('attempt_id', $attempt->id)
            ->get();

        $score = 0;

        foreach ($answers as $answer) {
            if ($answer->option->is_correct) {
                $score += $answer->question->score;
            }
        }

        $attempt->update([
            'score' => $score,
            'finished_at' => now(),
        ]);

        return redirect()->route('examsResult', $attempt->id);
    }
}
