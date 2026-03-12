<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('participant can store uploaded document and portfolio link', function () {
    Storage::fake('public');

    $participant = User::factory()->create();
    $cvFile = UploadedFile::fake()->create('cv.pdf', 120, 'application/pdf');

    $this->actingAs($participant)
        ->post(route('participantStore'), [
            'cv' => $cvFile,
            'portfolio' => 'https://github.com/example/portfolio',
        ])
        ->assertRedirect(route('participantIndex', absolute: false));

    $this->assertDatabaseHas('participant_documents', [
        'user_id' => $participant->id,
        'document_type' => 'cv',
        'original_name' => 'cv.pdf',
    ]);

    $this->assertDatabaseHas('participant_documents', [
        'user_id' => $participant->id,
        'document_type' => 'portfolio',
        'link' => 'https://github.com/example/portfolio',
    ]);

    $storedDocument = $participant->documents()->where('document_type', 'cv')->first();

    expect($storedDocument)->not->toBeNull();
    Storage::disk('public')->assertExists($storedDocument->file_path);
});

test('participant index shows current participant documents after store', function () {
    $participant = User::factory()->create();

    $this->actingAs($participant)
        ->post(route('participantStore'), [
            'portfolio' => 'https://example.com/my-portfolio',
        ])
        ->assertRedirect(route('participantIndex', absolute: false));

    $response = $this->actingAs($participant)->get(route('participantIndex'));

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('Participant/Index')
            ->has('participants', 1)
            ->where('participants.0.id', $participant->id)
            ->has('participants.0.documents', 1)
    );
});

test('re-uploading a document deletes old storage file and replaces it with a new one', function () {
    Storage::fake('public');

    $participant = User::factory()->create();

    $this->actingAs($participant)
        ->post(route('participantStore'), [
            'cv' => UploadedFile::fake()->create('old-cv.pdf', 100, 'application/pdf'),
        ])
        ->assertRedirect(route('participantIndex', absolute: false));

    $oldPath = $participant->documents()->where('document_type', 'cv')->value('file_path');
    Storage::disk('public')->assertExists($oldPath);

    $this->actingAs($participant)
        ->post(route('participantStore'), [
            'cv' => UploadedFile::fake()->create('new-cv.pdf', 120, 'application/pdf'),
        ])
        ->assertRedirect(route('participantIndex', absolute: false));

    $newPath = $participant->fresh()->documents()->where('document_type', 'cv')->value('file_path');

    expect($newPath)->not->toBe($oldPath);
    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($newPath);

    $this->assertDatabaseHas('participant_documents', [
        'user_id' => $participant->id,
        'document_type' => 'cv',
        'original_name' => 'new-cv.pdf',
    ]);
});

test('destroy deletes participant documents from database and storage', function () {
    Storage::fake('public');

    $participant = User::factory()->create();

    $this->actingAs($participant)
        ->post(route('participantStore'), [
            'cv' => UploadedFile::fake()->create('cv.pdf', 110, 'application/pdf'),
            'ktp' => UploadedFile::fake()->create('ktp.png', 200, 'image/png'),
        ])
        ->assertRedirect(route('participantIndex', absolute: false));

    $storedPaths = $participant->documents()->pluck('file_path')->filter()->values();

    $this->actingAs($participant)
        ->delete(route('participantDocumentDestroy', $participant->id))
        ->assertRedirect();

    foreach ($storedPaths as $path) {
        Storage::disk('public')->assertMissing($path);
    }

    $this->assertDatabaseMissing('participant_documents', [
        'user_id' => $participant->id,
    ]);
});
