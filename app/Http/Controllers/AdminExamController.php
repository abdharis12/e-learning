<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExamRequest;
use App\Models\Exam;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminExamController extends Controller
{
    public function index(): Response
    {
        $exams = Exam::query()
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Exams/Index', [
            'exams' => $exams,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Exams/Create');
    }

    public function store(StoreExamRequest $request): RedirectResponse
    {
        Exam::query()->create($request->validated());

        return redirect()->route('adminExamsIndex');
    }
}
