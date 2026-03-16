<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @method bool hasRole(string|array $role)
 * @method bool hasPermission(string $permission)
 * @method bool hasAnyPermission(array $permissions)
 * @method bool hasAllPermissions(array $permissions)
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'institution_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the institution that the user belongs to
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Get the guru profile associated with the user
     */
    public function guru()
    {
        return $this->hasOne(Guru::class);
    }

    /**
     * Get the siswa profile associated with the user
     */
    public function siswa()
    {
        return $this->hasOne(Siswa::class);
    }

    /**
     * Get the roles that belong to the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    /**
     * Get all permissions for the user through roles.
     */
    public function permissions()
    {
        return $this->hasManyThrough(
            Permission::class,
            Role::class,
            'id',
            'id',
            'id',
            'id'
        )->join('user_roles', 'roles.id', '=', 'user_roles.role_id')
            ->join('role_permission', 'roles.id', '=', 'role_permission.role_id')
            ->where('user_roles.user_id', $this->id);
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole($role): bool
    {
        if (is_string($role)) {
            return $this->roles->contains('name', $role);
        }
        return (bool) $role->intersect($this->roles)->count();
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission($permission): bool
    {
        foreach ($this->roles as $role) {
            if ($role->permissions->contains('name', $permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if user has any of the given permissions.
     */
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if user has all of the given permissions.
     */
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get the kelas_id of the siswa profile
     */
    public function getKelasId(): ?int
    {
        if ($this->hasRole('siswa') && $this->siswa) {
            return $this->siswa->kelas_id;
        }
        return null;
    }

    /**
     * Check if user is in a specific kelas
     */
    public function isInKelas(int $kelasId): bool
    {
        return $this->getKelasId() === $kelasId;
    }

    /**
     * Check if user can access a kelas
     */
    public function canAccessKelas(int $kelasId): bool
    {
        // Super admin, admin, and guru can access all kelas
        if ($this->hasRole(['super_admin', 'admin', 'guru'])) {
            return true;
        }

        // Siswa can only access their own kelas
        if ($this->hasRole('siswa')) {
            return $this->isInKelas($kelasId);
        }

        return false;
    }

    /**
     * Check if user is a classmate of another user
     */
    public function isClassmateOf(User $user): bool
    {
        if (!$this->hasRole('siswa') || !$user->hasRole('siswa')) {
            return false;
        }

        $thisKelasId = $this->getKelasId();
        $otherKelasId = $user->getKelasId();

        return $thisKelasId && $otherKelasId && $thisKelasId === $otherKelasId;
    }
}
