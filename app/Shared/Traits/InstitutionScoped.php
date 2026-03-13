<?php

namespace App\Shared\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

/**
 * Institution Scoped Trait
 * 
 * Use this trait for models that belong to an institution
 */
trait InstitutionScoped
{
    /**
     * Boot the trait
     */
    protected static function bootInstitutionScoped()
    {
        static::addGlobalScope('institution', function (Builder $builder) {
            if (Auth::check()) {
                /** @var \App\Models\User $user */
                $user = Auth::user();
                if ($user->institution_id) {
                    $builder->where('institution_id', $user->institution_id);
                }
            }
        });

        static::creating(function ($model) {
            if (!$model->institution_id && Auth::check()) {
                /** @var \App\Models\User $user */
                $user = Auth::user();
                $model->institution_id = $user->institution_id;
            }
        });
    }
}
