<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'description',
    ];

    /**
     * Get the users that belong to the role.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles');
    }

    /**
     * Get the permissions that belong to the role.
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    /**
     * Check if role has a specific permission.
     */
    public function hasPermission($permission): bool
    {
        if (is_string($permission)) {
            return $this->permissions->contains('name', $permission);
        }
        return (bool) $permission->intersect($this->permissions)->count();
    }

    /**
     * Give permission to role.
     */
    public function givePermissionTo($permission)
    {
        return $this->permissions()->syncWithoutDetaching($permission);
    }

    /**
     * Revoke permission from role.
     */
    public function revokePermissionTo($permission)
    {
        return $this->permissions()->detach($permission);
    }
}
