<?php

namespace App\Http\Controllers;

use App\Models\ExamAttempt;
use Inertia\Inertia;
use Inertia\Response;

class AdminExamMonitorController extends Controller
{
    public function index(): Response
    {
        $attempts = ExamAttempt::query()
            ->with([
                'user:id,name',
                'exam:id,title,duration_minutes',
                'answers'
            ])
            ->latest('started_at')
            ->get()
            ->map(function ($attempt) {

                $answered = $attempt->answers->count();
                $total = $attempt->exam->questions()->count();

                $deadline = $attempt->started_at
                    ->addMinutes($attempt->exam->duration_minutes);

                return [
                    'id' => $attempt->id,
                    'user' => $attempt->user->name,
                    'exam' => $attempt->exam->title,
                    'started_at' => $attempt->started_at,
                    'finished_at' => $attempt->finished_at,
                    'answered' => $answered,
                    'total' => $total,
                    'remaining_seconds' => max(0, now()->diffInSeconds($deadline, false)),
                    'status' => $attempt->finished_at
                        ? 'finished'
                        : 'running',
                ];
            });

        return Inertia::render('Admin/ExamMonitor/Index', [
            'attempts' => $attempts
        ]);
    }
}
