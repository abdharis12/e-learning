<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\StoreParticipantDocumentRequest;
use App\Models\ParticipantDocument;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantDocumentController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === UserRole::Admin) {

            $participants = User::with('documents')
                ->where('role', UserRole::Peserta->value)
                ->latest()
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'documents' => $user->documents,
                    ];
                });
        } else {

            $participants = User::with('documents')
                ->where('id', $user->id)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'documents' => $user->documents,
                    ];
                });
        }

        return Inertia::render('Participant/Index', [
            'participants' => $participants,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Participant/Create');
    }

    public function store(StoreParticipantDocumentRequest $request): RedirectResponse
    {
        $userId = auth()->id();
        $documents = ['cv', 'ijazah', 'foto', 'sertifikat', 'ktp'];

        foreach ($documents as $doc) {
            if ($request->hasFile($doc)) {
                $existingDocument = ParticipantDocument::query()
                    ->where('user_id', $userId)
                    ->where('document_type', $doc)
                    ->first();

                if ($existingDocument?->file_path) {
                    Storage::disk('public')->delete($existingDocument->file_path);
                }

                $file = $request->file($doc);
                $path = $file->store('participant-documents', 'public');

                ParticipantDocument::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'document_type' => $doc,
                    ],
                    [
                        'file_path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'file_size' => $file->getSize(),
                    ]
                );
            }
        }

        if ($request->filled('portfolio')) {
            ParticipantDocument::updateOrCreate(
                [
                    'user_id' => $userId,
                    'document_type' => 'portfolio',
                ],
                [
                    'link' => $request->string('portfolio')->value(),
                ]
            );
        }

        return to_route('participantIndex')
            ->with('success', 'Dokumen berhasil disimpan');
    }

    public function show($userId)
    {
        $user = auth()->user();

        // Jika bukan admin dan bukan miliknya → forbidden
        if ($user->role !== UserRole::Admin && $user->id != $userId) {
            abort(403);
        }

        $documents = ParticipantDocument::with('user')
            ->where('user_id', $userId)
            ->get();

        return Inertia::render('Participant/Show', [
            'documents' => $documents,
        ]);
    }

    public function update(Request $request, ParticipantDocument $document): RedirectResponse
    {
        abort_if($document->user_id !== auth()->id(), 403);

        $request->validate([
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'link' => 'nullable|url',
        ]);

        if ($request->hasFile('file')) {

            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }

            $file = $request->file('file');

            $path = $file->store('participant-documents', 'public');

            $document->update([
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
            ]);
        }

        if ($request->link) {
            $document->update([
                'link' => $request->link,
            ]);
        }

        return back()->with('success', 'Dokumen berhasil diperbarui');
    }

    public function destroy($userId): RedirectResponse
    {
        $user = auth()->user();

        // hanya admin atau pemilik dokumen
        if ($user->role !== UserRole::Admin && $user->id !== (int) $userId) {
            abort(403);
        }

        $documents = ParticipantDocument::where('user_id', $userId)->get();

        foreach ($documents as $doc) {

            if ($doc->file_path) {
                Storage::disk('public')->delete($doc->file_path);
            }

            $doc->delete();
        }

        return back()->with('success', 'Semua dokumen peserta berhasil dihapus');
    }
}
