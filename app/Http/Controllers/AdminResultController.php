<?php

namespace App\Http\Controllers;

use App\Models\ExamAttempt;
use Inertia\Inertia;
use Inertia\Response;

class AdminResultController extends Controller
{
    public function index(): Response
    {
        $results = ExamAttempt::query()
            ->with(['user:id,name', 'exam:id,title'])
            ->whereNotNull('finished_at')
            ->orderByDesc('score')
            ->orderBy('finished_at')
            ->paginate(10);

        return Inertia::render('Admin/Results/Index', [
            'results' => $results,
        ]);
    }
}
