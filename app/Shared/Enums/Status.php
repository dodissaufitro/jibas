<?php

namespace App\Shared\Enums;

/**
 * Status Enum
 */
enum Status: string
{
    case AKTIF = 'aktif';
    case NONAKTIF = 'nonaktif';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    /**
     * Get label
     */
    public function label(): string
    {
        return match ($this) {
            self::AKTIF => 'Aktif',
            self::NONAKTIF => 'Non-Aktif',
            self::PENDING => 'Menunggu',
            self::APPROVED => 'Disetujui',
            self::REJECTED => 'Ditolak',
        };
    }

    /**
     * Get color for badge
     */
    public function color(): string
    {
        return match ($this) {
            self::AKTIF, self::APPROVED => 'green',
            self::NONAKTIF, self::REJECTED => 'red',
            self::PENDING => 'yellow',
        };
    }
}
