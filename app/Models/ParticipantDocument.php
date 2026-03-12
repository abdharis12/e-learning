<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParticipantDocument extends Model
{
    protected $fillable = [
        'user_id',
        'document_type',
        'file_path',
        'original_name',
        'file_size',
        'link',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
