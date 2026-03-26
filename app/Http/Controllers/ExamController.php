<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Answer;
use App\Models\Exam;
use App\Models\ExamAssignment;
use App\Models\ExamAttempt;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $exams = $user->role === UserRole::Admin
            ? $this->getExamsForAdmin($user)
            : $this->getExamsForParticipant($user);

        return Inertia::render('Exam/Index', [
            'exams' => $exams,
        ]);
    }

    private function getExamsForAdmin(User $user): Collection
    {
        return Exam::query()
            ->withCount('questions')
            ->get()
            ->map(function ($exam) use ($user) {
                $attemptsUsed = ExamAttempt::query()
                    ->where('exam_id', $exam->id)
                    ->where('user_id', $user->id)
                    ->count();

                return [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'duration_minutes' => $exam->duration_minutes,
                    'questions_count' => $exam->questions_count,
                    'max_attempts' => 999,
                    'attempts_used' => $attemptsUsed,
                    'attempts_left' => 999 - $attemptsUsed,
                    'available_from' => null,
                    'available_until' => null,
                    'can_start' => $exam->questions_count > 0,
                ];
            });
    }

    private function getExamsForParticipant(User $user): Collection
    {
        $now = now();

        $assignments = ExamAssignment::query()
            ->with([
                'exam' => fn($query) => $query->withCount('questions'),
            ])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $attemptCounts = ExamAttempt::query()
            ->where('user_id', $user->id)
            ->selectRaw('exam_id, count(*) as attempts_count')
            ->groupBy('exam_id')
            ->pluck('attempts_count', 'exam_id');

        return $assignments->map(function (ExamAssignment $assignment) use ($attemptCounts, $now) {
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
    }

    public function start(Exam $exam): RedirectResponse
    {
        $user = auth()->user();

        return $user->role === UserRole::Admin
            ? $this->startForAdmin($exam, $user)
            : $this->startForParticipant($exam, $user);
    }

    private function startForAdmin(Exam $exam, $user): RedirectResponse
    {
        $activeAttempt = ExamAttempt::query()
            ->where('exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->whereNull('finished_at')
            ->latest()
            ->first();

        if ($activeAttempt) {
            return redirect()->route('examsShow', $activeAttempt->id);
        }

        if ($exam->questions()->count() === 0) {
            return redirect()->route('examsIndex');
        }

        $attempt = ExamAttempt::create([
            'user_id' => $user->id,
            'exam_id' => $exam->id,
            'started_at' => now(),
            'question_order' => $exam->questions()->pluck('id')->shuffle()->values()->all(),
        ]);

        return redirect()->route('examsShow', $attempt->id);
    }

    private function startForParticipant(Exam $exam, $user): RedirectResponse
    {
        $assignment = ExamAssignment::query()
            ->where('exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->first();

        if (! $assignment) {
            return redirect()->route('examsIndex');
        }

        if (! $this->isAssignmentWindowOpen($assignment)) {
            return redirect()->route('examsIndex');
        }

        $activeAttempt = ExamAttempt::query()
            ->where('exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->whereNull('finished_at')
            ->latest()
            ->first();

        if ($activeAttempt) {
            return redirect()->route('examsShow', $activeAttempt->id);
        }

        $attemptsUsed = ExamAttempt::query()
            ->where('exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->count();

        if ($attemptsUsed >= $assignment->max_attempts) {
            return redirect()->route('examsIndex');
        }

        if ($exam->questions()->count() === 0) {
            return redirect()->route('examsIndex');
        }

        $attempt = ExamAttempt::create([
            'user_id' => $user->id,
            'exam_id' => $exam->id,
            'started_at' => now(),
            'question_order' => $exam->questions()->pluck('id')->shuffle()->values()->all(),
        ]);

        return redirect()->route('examsShow', $attempt->id);
    }

    private function isAssignmentWindowOpen(ExamAssignment $assignment): bool
    {
        $now = now();

        return ($assignment->available_from === null || $now->greaterThanOrEqualTo($assignment->available_from))
            && ($assignment->available_until === null || $now->lessThanOrEqualTo($assignment->available_until));
    }

    public function show(ExamAttempt $attempt): Response
    {
        abort_unless($attempt->user_id === auth()->id(), 403);

        $attempt->load(['exam.questions.options', 'answers']);

        $exam = $attempt->exam;
        $order = $attempt->question_order ?? [];

        $questions = $this->formatQuestions($exam->questions, $order);
        $answers = $this->formatAnswers($attempt->answers);

        return Inertia::render('Exam/ExamPage', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'duration_minutes' => $exam->duration_minutes,
                'questions' => $questions,
            ],
            'attemptId' => $attempt->id,
            'answers' => $answers,
            'startedAt' => $attempt->started_at,
        ]);
    }

    private function formatQuestions($questions, array $order): Collection
    {
        return $questions
            ->sortBy(fn($question) => array_search($question->id, $order, true))
            ->values()
            ->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'score' => $question->score,
                    'options' => $question->options->map(fn($option) => [
                        'id' => $option->id,
                        'option_text' => $option->option_text,
                    ])->values(),
                ];
            })
            ->values();
    }

    private function formatAnswers($answers): Collection
    {
        return $answers
            ->mapWithKeys(fn($answer) => [(string) $answer->question_id => $answer->option_id]);
    }

    public function submit(ExamAttempt $attempt): RedirectResponse
    {
        abort_unless($attempt->user_id === auth()->id(), 403);

        if ($attempt->finished_at !== null) {
            return redirect()->route('examsResult', $attempt->id);
        }

        $deadline = $attempt->started_at->addMinutes($attempt->exam->duration_minutes);
        $finishedAt = now()->greaterThan($deadline) ? $deadline : now();

        $score = $this->calculateScore($attempt);

        $attempt->update([
            'score' => $score,
            'finished_at' => $finishedAt,
        ]);

        return redirect()->route('examsResult', $attempt->id);
    }

    private function calculateScore(ExamAttempt $attempt): int
    {
        $answers = Answer::with('option', 'question')
            ->where('attempt_id', $attempt->id)
            ->get();

        $score = 0;

        foreach ($answers as $answer) {
            if ($answer->option->is_correct) {
                $score += $answer->question->score;
            }
        }

        return $score;
    }
}
