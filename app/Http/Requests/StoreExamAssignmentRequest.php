<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExamAssignmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'assignments' => ['required', 'array'],
            'assignments.*.user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role', UserRole::Peserta->value)),
            ],
            'assignments.*.max_attempts' => ['required', 'integer', 'min:1', 'max:20'],
            'assignments.*.available_from' => ['nullable', 'date'],
            'assignments.*.available_until' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'assignments.required' => 'Data assignment wajib dikirim.',
            'assignments.array' => 'Format assignment tidak valid.',
            'assignments.*.user_id.required' => 'Peserta wajib dipilih.',
            'assignments.*.user_id.exists' => 'Peserta tidak ditemukan.',
            'assignments.*.max_attempts.required' => 'Maksimal percobaan wajib diisi.',
            'assignments.*.max_attempts.integer' => 'Maksimal percobaan harus angka.',
            'assignments.*.max_attempts.min' => 'Maksimal percobaan minimal 1 kali.',
            'assignments.*.max_attempts.max' => 'Maksimal percobaan maksimal 20 kali.',
            'assignments.*.available_from.date' => 'Format waktu mulai tidak valid.',
            'assignments.*.available_until.date' => 'Format waktu selesai tidak valid.',
        ];
    }
}
