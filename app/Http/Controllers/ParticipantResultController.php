<?php

namespace App\Http\Controllers;

use App\Models\ExamAttempt;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantResultController extends Controller
{
    public function index(): Response
    {
        $results = ExamAttempt::query()
            ->with('exam:id,title')
            ->where('user_id', auth()->id())
            ->whereNotNull('finished_at')
            ->latest('finished_at')
            ->paginate(10);

        return Inertia::render('Exam/MyResults', [
            'results' => $results,
        ]);
    }
}
