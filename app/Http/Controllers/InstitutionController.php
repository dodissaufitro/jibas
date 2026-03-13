<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class InstitutionController extends Controller
{
    /**
     * Get current user's institution settings
     */
    public function getSettings()
    {
        $user = Auth::user();

        if (!$user->institution_id) {
            return response()->json([
                'institution' => null,
                'isConfigured' => false,
            ]);
        }

        $institution = $user->institution;

        return response()->json([
            'institution' => [
                'id' => $institution->id,
                'institutionType' => $institution->type,
                'educationLevel' => $institution->education_level,
                'institutionName' => $institution->name,
                'address' => $institution->address,
                'phone' => $institution->phone,
                'email' => $institution->email,
                'logo' => $institution->logo,
                'website' => $institution->website,
                'npsn' => $institution->npsn,
                'nss' => $institution->nss,
                'vision' => $institution->vision,
                'mission' => $institution->mission,
            ],
            'isConfigured' => true,
        ]);
    }

    /**
     * Create or update institution settings
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'institutionType' => ['required', Rule::in(['pesantren', 'umum', 'madrasah'])],
            'educationLevel' => ['required', 'string', 'max:10'],
            'institutionName' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'npsn' => ['nullable', 'string', 'max:20'],
            'nss' => ['nullable', 'string', 'max:20'],
            'vision' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
        ]);

        $user = Auth::user();

        // Jika user sudah punya institution, update
        if ($user->institution_id) {
            $institution = $user->institution;
            $institution->update([
                'name' => $validated['institutionName'],
                'type' => $validated['institutionType'],
                'education_level' => $validated['educationLevel'],
                'address' => $validated['address'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'website' => $validated['website'] ?? null,
                'npsn' => $validated['npsn'] ?? null,
                'nss' => $validated['nss'] ?? null,
                'vision' => $validated['vision'] ?? null,
                'mission' => $validated['mission'] ?? null,
            ]);
        } else {
            // Jika belum, buat institution baru
            $institution = Institution::create([
                'name' => $validated['institutionName'],
                'type' => $validated['institutionType'],
                'education_level' => $validated['educationLevel'],
                'address' => $validated['address'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'website' => $validated['website'] ?? null,
                'npsn' => $validated['npsn'] ?? null,
                'nss' => $validated['nss'] ?? null,
                'vision' => $validated['vision'] ?? null,
                'mission' => $validated['mission'] ?? null,
            ]);

            // Assign institution ke user
            User::where('id', $user->id)->update(['institution_id' => $institution->id]);
        }

        return response()->json([
            'message' => 'Pengaturan berhasil disimpan',
            'institution' => [
                'id' => $institution->id,
                'institutionType' => $institution->type,
                'educationLevel' => $institution->education_level,
                'institutionName' => $institution->name,
                'address' => $institution->address,
                'phone' => $institution->phone,
                'email' => $institution->email,
                'logo' => $institution->logo,
                'website' => $institution->website,
                'npsn' => $institution->npsn,
                'nss' => $institution->nss,
                'vision' => $institution->vision,
                'mission' => $institution->mission,
            ],
        ]);
    }

    /**
     * Share access to other users (optional feature)
     * Allows adding multiple users to the same institution
     */
    public function shareAccess(Request $request)
    {
        $validated = $request->validate([
            'user_emails' => ['required', 'array'],
            'user_emails.*' => ['required', 'email', 'exists:users,email'],
        ]);

        $currentUser = Auth::user();

        if (!$currentUser->institution_id) {
            return response()->json([
                'message' => 'Anda belum memiliki institusi. Silakan buat institusi terlebih dahulu.',
            ], 400);
        }

        $institutionId = $currentUser->institution_id;

        // Update users dengan institution_id yang sama
        User::whereIn('email', $validated['user_emails'])
            ->update(['institution_id' => $institutionId]);

        return response()->json([
            'message' => 'Akses berhasil dibagikan',
            'shared_with' => count($validated['user_emails']) . ' pengguna',
        ]);
    }
}
