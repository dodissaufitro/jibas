<?php

namespace App\Core\Institution;

use App\Models\Institution;
use Illuminate\Support\Facades\Cache;

/**
 * Institution Service
 * 
 * Core service for institution management
 */
class InstitutionService
{
    /**
     * Get institution settings for user
     */
    public function getSettings(int $userId): ?array
    {
        return Cache::remember("institution_settings_{$userId}", 3600, function () use ($userId) {
            $user = \App\Models\User::with('institution')->find($userId);

            if (!$user || !$user->institution) {
                return null;
            }

            return [
                'id' => $user->institution->id,
                'type' => $user->institution->type,
                'education_level' => $user->institution->education_level,
                'name' => $user->institution->name,
                'address' => $user->institution->address,
                'phone' => $user->institution->phone,
                'email' => $user->institution->email,
                'website' => $user->institution->website,
                'npsn' => $user->institution->npsn,
                'nss' => $user->institution->nss,
                'logo' => $user->institution->logo,
            ];
        });
    }

    /**
     * Update institution settings
     */
    public function updateSettings(int $userId, array $data): Institution
    {
        $user = \App\Models\User::find($userId);

        if (!$user->institution_id) {
            // Create new institution
            $institution = Institution::create($data);
            $user->update(['institution_id' => $institution->id]);
        } else {
            // Update existing
            $institution = Institution::find($user->institution_id);
            $institution->update($data);
        }

        // Clear cache
        Cache::forget("institution_settings_{$userId}");

        return $institution;
    }

    /**
     * Share institution access with another user
     */
    public function shareAccess(int $institutionId, int $targetUserId): void
    {
        $targetUser = \App\Models\User::find($targetUserId);
        $targetUser->update(['institution_id' => $institutionId]);

        Cache::forget("institution_settings_{$targetUserId}");
    }

    /**
     * Check if institution is configured
     */
    public function isConfigured(int $userId): bool
    {
        $settings = $this->getSettings($userId);
        return $settings !== null;
    }

    /**
     * Get institution type for user
     */
    public function getType(int $userId): ?string
    {
        $settings = $this->getSettings($userId);
        return $settings['type'] ?? null;
    }
}
