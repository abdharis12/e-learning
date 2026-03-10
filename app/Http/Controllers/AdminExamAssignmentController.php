<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\StoreExamAssignmentRequest;
use App\Models\Exam;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminExamAssignmentController extends Controller
{
    public function index(Exam $exam): Response
    {
        $pesertaUsers = User::query()
            ->where('role', UserRole::Peserta->value)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        $assignments = $exam->assignments()
            ->with('user:id,name,email')
            ->orderBy('user_id')
            ->get()
            ->map(function ($assignment) {
                return [
                    'id' => $assignment->id,
                    'user_id' => $assignment->user_id,
                    'max_attempts' => $assignment->max_attempts,
                    'available_from' => $assignment->available_from?->format('Y-m-d\TH:i'),
                    'available_until' => $assignment->available_until?->format('Y-m-d\TH:i'),
                    'user' => $assignment->user,
                ];
            });

        return Inertia::render('Admin/Exams/Assignments', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'duration_minutes' => $exam->duration_minutes,
            ],
            'pesertaUsers' => $pesertaUsers,
            'assignments' => $assignments,
        ]);
    }

    public function store(StoreExamAssignmentRequest $request, Exam $exam): RedirectResponse
    {
        $validatedAssignments = collect($request->validated('assignments'));

        foreach ($validatedAssignments as $assignment) {
            if (
                ! empty($assignment['available_from']) &&
                ! empty($assignment['available_until']) &&
                Carbon::parse($assignment['available_until'])->lt(Carbon::parse($assignment['available_from']))
            ) {
                return back()->withErrors([
                    'assignments' => 'Waktu selesai harus sesudah waktu mulai.',
                ]);
            }
        }

        $assignedUserIds = $validatedAssignments->pluck('user_id')->all();

        $exam->assignments()->whereNotIn('user_id', $assignedUserIds)->delete();

        foreach ($validatedAssignments as $assignment) {
            $exam->assignments()->updateOrCreate(
                ['user_id' => $assignment['user_id']],
                [
                    'max_attempts' => $assignment['max_attempts'],
                    'available_from' => $assignment['available_from'] ?: null,
                    'available_until' => $assignment['available_until'] ?: null,
                ],
            );
        }

        return redirect()->route('adminExamAssignmentsIndex', $exam->id);
    }
}
