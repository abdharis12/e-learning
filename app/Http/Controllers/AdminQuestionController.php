<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportQuestionsRequest;
use App\Models\Exam;
use App\Models\Option;
use App\Models\Question;
use Illuminate\Http\Request;
use App\Services\QuestionImportService;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class AdminQuestionController extends Controller
{
    public function __construct(private QuestionImportService $questionImportService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $questions = Question::with('exam')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Questions/Index', [
            'questions' => $questions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $exams = Exam::pluck('title', 'id');

        return Inertia::render('Admin/Questions/Create', [
            'exams' => $exams
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $question = Question::create([
            'exam_id' => $request->exam_id,
            'question_text' => $request->question_text
        ]);

        foreach ($request->options as $opt) {

            Option::create([
                'question_id' => $question->id,
                'option_text' => $opt['text'],
                'is_correct' => $opt['correct']
            ]);
        }

        return redirect()->route('questions.index');
    }

    public function import(ImportQuestionsRequest $request): RedirectResponse
    {
        try {
            $totalImported = $this->questionImportService->importCsv(
                $request->file('import_file')->getRealPath(),
            );

            return redirect()
                ->route('questions.index')
                ->with('success', "{$totalImported} soal berhasil diimpor.");
        } catch (\RuntimeException $exception) {
            return back()->withErrors([
                'import_file' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
