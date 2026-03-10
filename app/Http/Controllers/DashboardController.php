<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Exam;
use App\Models\ExamAssignment;
use App\Models\ExamAttempt;
use App\Models\Question;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = auth()->user();

        if ($user->role === UserRole::Admin) {
            return $this->adminDashboard();
        }

        return $this->participantDashboard($user->id);
    }

    private function adminDashboard(): Response
    {
        $summary = [
            'totalPeserta' => User::query()->where('role', UserRole::Peserta->value)->count(),
            'totalUjian' => Exam::query()->count(),
            'totalSoal' => Question::query()->count(),
            'totalAttemptSelesai' => ExamAttempt::query()->whereNotNull('finished_at')->count(),
        ];

        $examDistribution = ExamAttempt::query()
            ->selectRaw('exam_id, count(*) as total_attempts')
            ->whereNotNull('finished_at')
            ->groupBy('exam_id')
            ->with('exam:id,title')
            ->orderByDesc('total_attempts')
            ->limit(6)
            ->get()
            ->map(fn ($item) => [
                'label' => $item->exam?->title ?? 'Ujian',
                'value' => (int) $item->total_attempts,
            ])
            ->values();

        $dailyTrend = collect(range(6, 0))
            ->map(function ($dayOffset) {
                $date = Carbon::today()->subDays($dayOffset);

                $attempts = ExamAttempt::query()
                    ->whereDate('finished_at', $date)
                    ->whereNotNull('finished_at');

                return [
                    'label' => $date->format('d M'),
                    'attempts' => $attempts->count(),
                    'avg_score' => round((float) ($attempts->avg('score') ?? 0), 1),
                ];
            })
            ->values();

        return Inertia::render('dashboard', [
            'role' => UserRole::Admin->value,
            'summary' => $summary,
            'examDistribution' => $examDistribution,
            'dailyTrend' => $dailyTrend,
        ]);
    }

    private function participantDashboard(int $userId): Response
    {
        $completedAttempts = ExamAttempt::query()
            ->where('user_id', $userId)
            ->whereNotNull('finished_at');

        $assignments = ExamAssignment::query()
            ->where('user_id', $userId)
            ->get(['exam_id', 'max_attempts']);

        $attemptCounts = ExamAttempt::query()
            ->where('user_id', $userId)
            ->selectRaw('exam_id, count(*) as total_attempts')
            ->groupBy('exam_id')
            ->pluck('total_attempts', 'exam_id');

        $remainingAttempts = $assignments
            ->sum(fn ($assignment) => max(0, $assignment->max_attempts - ((int) ($attemptCounts[$assignment->exam_id] ?? 0))));

        $summary = [
            'totalPenugasan' => $assignments->count(),
            'attemptSelesai' => $completedAttempts->count(),
            'rataRataNilai' => round((float) ($completedAttempts->avg('score') ?? 0), 1),
            'sisaAttempt' => $remainingAttempts,
        ];

        $dailyTrend = collect(range(6, 0))
            ->map(function ($dayOffset) use ($userId) {
                $date = Carbon::today()->subDays($dayOffset);

                $attempts = ExamAttempt::query()
                    ->where('user_id', $userId)
                    ->whereDate('finished_at', $date)
                    ->whereNotNull('finished_at');

                return [
                    'label' => $date->format('d M'),
                    'attempts' => $attempts->count(),
                    'avg_score' => round((float) ($attempts->avg('score') ?? 0), 1),
                ];
            })
            ->values();

        $latestResults = ExamAttempt::query()
            ->with('exam:id,title')
            ->where('user_id', $userId)
            ->whereNotNull('finished_at')
            ->latest('finished_at')
            ->limit(5)
            ->get()
            ->map(fn ($item) => [
                'exam_title' => $item->exam?->title ?? 'Ujian',
                'score' => $item->score ?? 0,
                'finished_at' => $item->finished_at?->format('Y-m-d H:i'),
            ])
            ->values();

        return Inertia::render('dashboard', [
            'role' => UserRole::Peserta->value,
            'summary' => $summary,
            'dailyTrend' => $dailyTrend,
            'latestResults' => $latestResults,
        ]);
    }
}
