<?php

namespace App\Shared\Enums;

/**
 * Institution Type Enum
 */
enum InstitutionType: string
{
    case PESANTREN = 'pesantren';
    case UMUM = 'umum';
    case MADRASAH = 'madrasah';

    /**
     * Get label
     */
    public function label(): string
    {
        return match ($this) {
            self::PESANTREN => 'Pesantren',
            self::UMUM => 'Sekolah Umum',
            self::MADRASAH => 'Madrasah',
        };
    }

    /**
     * Get all values
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all labels
     */
    public static function labels(): array
    {
        return array_map(fn($case) => $case->label(), self::cases());
    }
}
