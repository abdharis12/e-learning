<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreParticipantDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cv' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'ijazah' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'foto' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
            'sertifikat' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
            'ktp' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'portfolio' => ['nullable', 'url'],
        ];
    }

    public function messages(): array
    {
        return [
            'cv.mimes' => 'File CV harus berformat PDF.',
            'cv.max' => 'Ukuran file CV maksimal 5MB.',
            'ijazah.mimes' => 'File ijazah harus berformat PDF.',
            'ijazah.max' => 'Ukuran file ijazah maksimal 5MB.',
            'foto.mimes' => 'File foto harus berformat JPG, JPEG, PNG, atau PDF.',
            'foto.max' => 'Ukuran file foto maksimal 2MB.',
            'sertifikat.mimes' => 'File sertifikat harus berformat PDF.',
            'sertifikat.max' => 'Ukuran file sertifikat maksimal 5MB.',
            'ktp.mimes' => 'File KTP harus berformat JPG, JPEG, PNG, atau PDF.',
            'ktp.max' => 'Ukuran file KTP maksimal 5MB.',
            'portfolio.url' => 'Link portfolio harus berupa URL yang valid.',
        ];
    }
}
