<?php

namespace App\Shared\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * Trait to help prevent N+1 queries by auto-loading relationships
 * 
 * Usage: Add to model and define $autoLoadRelations property
 */
trait PrevendsN1Queries
{
    /**
     * Boot the trait
     */
    protected static function bootPrevendsN1Queries(): void
    {
        static::addGlobalScope('auto_load_relations', function (Builder $builder) {
            if (property_exists(static::class, 'autoLoadRelations')) {
                $relations = static::$autoLoadRelations ?? [];
                if (!empty($relations)) {
                    $builder->with($relations);
                }
            }
        });
    }

    /**
     * Helper to load common relations for index/listing pages
     */
    public function scopeWithCommonRelations(Builder $query): Builder
    {
        if (method_exists($this, 'getCommonRelations')) {
            return $query->with($this->getCommonRelations());
        }

        return $query;
    }

    /**
     * Helper to load all relations for detail pages
     */
    public function scopeWithDetailRelations(Builder $query): Builder
    {
        if (method_exists($this, 'getDetailRelations')) {
            return $query->with($this->getDetailRelations());
        }

        return $query;
    }

    /**
     * Load relations with counts
     */
    public function scopeWithCounts(Builder $query, array $relations): Builder
    {
        return $query->withCount($relations);
    }
}
