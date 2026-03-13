<?php

namespace App\Base\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

/**
 * Base Service
 * 
 * All module services should extend this class
 * Provides common business logic patterns
 */
abstract class BaseService
{
    /**
     * Execute operation in transaction
     */
    protected function transaction(callable $callback)
    {
        DB::beginTransaction();

        try {
            $result = $callback();
            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Service Error: ' . $e->getMessage(), [
                'service' => static::class,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Get authenticated user's institution ID
     */
    protected function getInstitutionId(): ?int
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        return $user?->institution_id;
    }

    /**
     * Get authenticated user
     */
    protected function getUser()
    {
        return Auth::user();
    }

    /**
     * Log activity
     */
    protected function logActivity(string $action, string $module, array $data = []): void
    {
        Log::info("Activity: {$action}", [
            'module' => $module,
            'user_id' => Auth::id(),
            'institution_id' => $this->getInstitutionId(),
            'data' => $data,
        ]);
    }
}
