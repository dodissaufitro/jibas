<?php

namespace App\Shared\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    /**
     * Boot the trait
     */
    protected static function bootLogsActivity(): void
    {
        // Log when model is created
        static::created(function ($model) {
            if (static::shouldLogCreation()) {
                ActivityLog::log(
                    'create',
                    $model,
                    static::getCreationMessage($model),
                    [],
                    $model->toArray(),
                    'info'
                );
            }
        });

        // Log when model is updated
        static::updated(function ($model) {
            if (static::shouldLogUpdate()) {
                $changes = $model->getChanges();
                $original = array_intersect_key($model->getOriginal(), $changes);

                // Only log if there are actual changes
                if (!empty($changes)) {
                    ActivityLog::log(
                        'update',
                        $model,
                        static::getUpdateMessage($model, $changes),
                        $original,
                        $changes,
                        'info'
                    );
                }
            }
        });

        // Log when model is deleted
        static::deleted(function ($model) {
            if (static::shouldLogDeletion()) {
                ActivityLog::log(
                    'delete',
                    $model,
                    static::getDeletionMessage($model),
                    $model->toArray(),
                    [],
                    'warning'
                );
            }
        });
    }

    /**
     * Determine if creation should be logged
     */
    protected static function shouldLogCreation(): bool
    {
        return true;
    }

    /**
     * Determine if update should be logged
     */
    protected static function shouldLogUpdate(): bool
    {
        return true;
    }

    /**
     * Determine if deletion should be logged
     */
    protected static function shouldLogDeletion(): bool
    {
        return true;
    }

    /**
     * Get creation log message
     */
    protected static function getCreationMessage($model): string
    {
        $modelName = class_basename($model);
        $identifier = method_exists($model, 'getLogIdentifier')
            ? $model->getLogIdentifier()
            : ($model->name ?? $model->id ?? 'Unknown');

        return "{$modelName} '{$identifier}' dibuat";
    }

    /**
     * Get update log message
     */
    protected static function getUpdateMessage($model, array $changes): string
    {
        $modelName = class_basename($model);
        $identifier = method_exists($model, 'getLogIdentifier')
            ? $model->getLogIdentifier()
            : ($model->name ?? $model->id ?? 'Unknown');

        $fieldNames = implode(', ', array_keys($changes));

        return "{$modelName} '{$identifier}' diupdate (Fields: {$fieldNames})";
    }

    /**
     * Get deletion log message
     */
    protected static function getDeletionMessage($model): string
    {
        $modelName = class_basename($model);
        $identifier = method_exists($model, 'getLogIdentifier')
            ? $model->getLogIdentifier()
            : ($model->name ?? $model->id ?? 'Unknown');

        return "{$modelName} '{$identifier}' dihapus";
    }

    /**
     * Get identifier for logging (can be overridden in models)
     */
    public function getLogIdentifier(): string
    {
        return $this->name ?? $this->nama_lengkap ?? $this->email ?? $this->id ?? 'Unknown';
    }

    /**
     * Get activity logs for this model instance
     */
    public function activityLogs(int $limit = 50)
    {
        return ActivityLog::forModel($this, $limit);
    }
}
