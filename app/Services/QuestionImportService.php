<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Option;
use App\Models\Question;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class QuestionImportService
{
    private const REQUIRED_HEADERS = [
        'exam_title',
        'question_text',
        'score',
        'option_1',
        'option_2',
        'option_3',
        'option_4',
        'correct_option',
    ];

    public function importCsv(string $path): int
    {
        $handle = fopen($path, 'r');

        if (! $handle) {
            throw new RuntimeException('File tidak dapat dibaca.');
        }

        $delimiter = $this->detectDelimiter($handle);

        $headerRow = fgetcsv($handle, 0, $delimiter);

        if (! $headerRow) {
            fclose($handle);
            throw new RuntimeException('File CSV kosong.');
        }

        $headers = collect($headerRow)
            ->map(fn ($header) => $this->normalizeHeader((string) $header))
            ->values();

        foreach (self::REQUIRED_HEADERS as $requiredHeader) {
            if (! $headers->contains($requiredHeader)) {
                fclose($handle);
                throw new RuntimeException("Kolom {$requiredHeader} tidak ditemukan.");
            }
        }

        $rows = [];
        $lineNumber = 1;

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $lineNumber++;

            $isEmpty = collect($row)->every(
                fn ($value) => trim((string) $value) === '',
            );

            if ($isEmpty) {
                continue;
            }

            $mappedRow = $headers->combine($row);

            if (! $mappedRow) {
                fclose($handle);
                throw new RuntimeException("Baris {$lineNumber} tidak valid.");
            }

            $rows[] = [
                'line' => $lineNumber,
                'exam_title' => trim((string) $mappedRow['exam_title']),
                'question_text' => trim((string) $mappedRow['question_text']),
                'score' => (int) trim((string) $mappedRow['score']),
                'options' => [
                    trim((string) $mappedRow['option_1']),
                    trim((string) $mappedRow['option_2']),
                    trim((string) $mappedRow['option_3']),
                    trim((string) $mappedRow['option_4']),
                ],
                'correct_option' => strtoupper(trim((string) $mappedRow['correct_option'])),
            ];
        }

        fclose($handle);

        if (count($rows) < 1) {
            throw new RuntimeException('Tidak ada data pertanyaan yang bisa diimpor.');
        }

        DB::transaction(function () use ($rows): void {
            foreach ($rows as $row) {
                $this->validateRow($row);

                $exam = Exam::query()->firstOrCreate(
                    ['title' => $row['exam_title']],
                    ['duration_minutes' => 60],
                );

                $question = Question::query()->create([
                    'exam_id' => $exam->id,
                    'question_text' => $row['question_text'],
                    'score' => max(1, $row['score']),
                ]);

                $correctIndex = $this->resolveCorrectIndex($row['correct_option']);

                foreach ($row['options'] as $index => $optionText) {
                    Option::query()->create([
                        'question_id' => $question->id,
                        'option_text' => $optionText,
                        'is_correct' => $index === $correctIndex,
                    ]);
                }
            }
        });

        return count($rows);
    }

    private function detectDelimiter($handle): string
    {
        $firstLine = fgets($handle);

        if ($firstLine === false) {
            return ',';
        }

        $commaCount = substr_count($firstLine, ',');
        $semicolonCount = substr_count($firstLine, ';');

        rewind($handle);

        return $semicolonCount > $commaCount ? ';' : ',';
    }

    private function normalizeHeader(string $header): string
    {
        $normalized = trim($header);

        // Remove UTF-8 BOM if present on first column header.
        $normalized = ltrim($normalized, "\xEF\xBB\xBF");

        return strtolower($normalized);
    }

    private function resolveCorrectIndex(string $correctOption): int
    {
        if (in_array($correctOption, ['A', 'B', 'C', 'D'], true)) {
            return array_search($correctOption, ['A', 'B', 'C', 'D'], true);
        }

        if (in_array($correctOption, ['1', '2', '3', '4'], true)) {
            return ((int) $correctOption) - 1;
        }

        throw new RuntimeException('Nilai correct_option harus A/B/C/D atau 1/2/3/4.');
    }

    /**
     * @param array{
     *   line:int,
     *   exam_title:string,
     *   question_text:string,
     *   score:int,
     *   options:array<int,string>,
     *   correct_option:string
     * } $row
     */
    private function validateRow(array $row): void
    {
        if ($row['exam_title'] === '') {
            throw new RuntimeException("Baris {$row['line']}: exam_title wajib diisi.");
        }

        if ($row['question_text'] === '') {
            throw new RuntimeException("Baris {$row['line']}: question_text wajib diisi.");
        }

        if ($row['score'] < 1) {
            throw new RuntimeException("Baris {$row['line']}: score minimal 1.");
        }

        foreach ($row['options'] as $index => $optionText) {
            if ($optionText === '') {
                $optionNumber = $index + 1;
                throw new RuntimeException("Baris {$row['line']}: option_{$optionNumber} wajib diisi.");
            }
        }

        if ($row['correct_option'] === '') {
            throw new RuntimeException("Baris {$row['line']}: correct_option wajib diisi.");
        }
    }
}
