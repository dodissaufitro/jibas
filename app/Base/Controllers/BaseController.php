<?php

namespace App\Base\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

/**
 * Base Controller
 * 
 * All module controllers should extend this class
 * Provides common functionality for all controllers
 */
abstract class BaseController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Get the authenticated user's institution ID
     */
    protected function getInstitutionId(): ?int
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        return $user?->institution_id;
    }

    /**
     * Check if user belongs to specific institution type
     */
    protected function isInstitutionType(string $type): bool
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        return $user?->institution?->type === $type;
    }

    /**
     * Get per page for pagination
     */
    protected function getPerPage(): int
    {
        return request()->input('per_page', 15);
    }

    /**
     * Success response helper
     */
    protected function successResponse(string $message, mixed $data = null)
    {
        return redirect()->back()->with('success', $message);
    }

    /**
     * Error response helper
     */
    protected function errorResponse(string $message)
    {
        return redirect()->back()->with('error', $message);
    }
}
