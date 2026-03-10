<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamAssignment extends Model
{
    /** @use HasFactory<\Database\Factories\ExamAssignmentFactory> */
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'user_id',
        'max_attempts',
        'available_from',
        'available_until',
    ];

    protected function casts(): array
    {
        return [
            'max_attempts' => 'integer',
            'available_from' => 'datetime',
            'available_until' => 'datetime',
        ];
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
