<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';

    protected $fillable = [
        'user_id',
        'action',
        'severity',
        'model',
        'model_id',
        'module',
        'description',
        'old_values',
        'new_values',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Log an activity with comprehensive data
     *
     * @param string $action Action type (create, update, delete, etc)
     * @param mixed $model The model instance
     * @param string $description Human-readable description
     * @param array $oldValues Old values (for updates)
     * @param array $newValues New values
     * @param string $severity Severity level: info, warning, critical
     * @param array $metadata Additional metadata
     * @return void
     */
    public static function log(
        string $action,
        $model,
        string $description = '',
        array $oldValues = [],
        array $newValues = [],
        string $severity = 'info',
        array $metadata = []
    ): void {
        static::create([
            'user_id'     => Auth::id(),
            'action'      => $action,
            'severity'    => $severity,
            'model'       => is_object($model) ? get_class($model) : $model,
            'model_id'    => is_object($model) ? ($model->id ?? null) : null,
            'module'      => static::extractModuleName($model),
            'description' => $description,
            'old_values'  => !empty($oldValues) ? $oldValues : null,
            'new_values'  => !empty($newValues) ? $newValues : null,
            'metadata'    => !empty($metadata) ? $metadata : null,
            'ip_address'  => Request::ip(),
            'user_agent'  => Request::userAgent(),
        ]);
    }

    /**
     * Log info level activity
     */
    public static function info(string $action, $model, string $description, array $metadata = []): void
    {
        static::log($action, $model, $description, [], [], 'info', $metadata);
    }

    /**
     * Log warning level activity
     */
    public static function warning(string $action, $model, string $description, array $metadata = []): void
    {
        static::log($action, $model, $description, [], [], 'warning', $metadata);
    }

    /**
     * Log critical level activity
     */
    public static function critical(string $action, $model, string $description, array $metadata = []): void
    {
        static::log($action, $model, $description, [], [], 'critical', $metadata);
    }

    /**
     * Log data access
     */
    public static function logAccess($model, string $description = ''): void
    {
        static::log('view', $model, $description ?: 'Data diakses', [], [], 'info');
    }

    /**
     * Log data export
     */
    public static function logExport(string $module, string $description, array $metadata = []): void
    {
        static::log('export', $module, $description, [], [], 'info', $metadata);
    }

    /**
     * Log data import
     */
    public static function logImport(string $module, string $description, array $metadata = []): void
    {
        static::log('import', $module, $description, [], [], 'info', $metadata);
    }

    /**
     * Log authentication events
     */
    public static function logAuth(string $action, string $description, array $metadata = []): void
    {
        $severity = in_array($action, ['login_failed', 'logout_forced', 'account_locked']) ? 'warning' : 'info';

        static::create([
            'user_id'     => Auth::id(),
            'action'      => $action,
            'severity'    => $severity,
            'model'       => 'Authentication',
            'module'      => 'auth',
            'description' => $description,
            'metadata'    => !empty($metadata) ? $metadata : null,
            'ip_address'  => Request::ip(),
            'user_agent'  => Request::userAgent(),
        ]);
    }

    /**
     * Log security events (suspicious activities)
     */
    public static function logSecurity(string $action, string $description, array $metadata = []): void
    {
        static::create([
            'user_id'     => Auth::id(),
            'action'      => $action,
            'severity'    => 'critical',
            'model'       => 'Security',
            'module'      => 'security',
            'description' => $description,
            'metadata'    => !empty($metadata) ? $metadata : null,
            'ip_address'  => Request::ip(),
            'user_agent'  => Request::userAgent(),
        ]);
    }

    /**
     * Extract module name from model class
     */
    protected static function extractModuleName($model): ?string
    {
        if (!is_object($model)) {
            return null;
        }

        $className = class_basename($model);

        // Map class names to modules
        $moduleMap = [
            'Siswa' => 'akademik',
            'Guru' => 'akademik',
            'Kelas' => 'akademik',
            'MataPelajaran' => 'akademik',
            'Nilai' => 'akademik',
            'JadwalPelajaran' => 'akademik',
            'PresensiSiswa' => 'presensi',
            'PresensiGuru' => 'presensi',
            'Tagihan' => 'keuangan',
            'Pembayaran' => 'keuangan',
            'PpdbPendaftaran' => 'ppdb',
            'User' => 'user_management',
            'Institution' => 'institution',
        ];

        return $moduleMap[$className] ?? strtolower($className);
    }

    /**
     * Get activity logs for a specific user
     */
    public static function forUser(int $userId, int $limit = 50)
    {
        return static::where('user_id', $userId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get activity logs for a specific model
     */
    public static function forModel($model, int $limit = 50)
    {
        return static::where('model', is_object($model) ? get_class($model) : $model)
            ->when(is_object($model) && isset($model->id), function ($q) use ($model) {
                $q->where('model_id', $model->id);
            })
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get security alerts (critical severity)
     */
    public static function getSecurityAlerts(int $days = 7)
    {
        return static::where('severity', 'critical')
            ->where('created_at', '>=', now()->subDays($days))
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
