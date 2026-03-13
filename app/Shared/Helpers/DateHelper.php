<?php

namespace App\Shared\Helpers;

/**
 * Date Helper Functions
 */
class DateHelper
{
    /**
     * Format date to Indonesian format
     */
    public static function formatIndonesian($date): ?string
    {
        if (!$date) return null;

        $months = [
            1 => 'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        ];

        $date = date_create($date);
        $day = date_format($date, 'd');
        $month = $months[(int)date_format($date, 'm')];
        $year = date_format($date, 'Y');

        return "{$day} {$month} {$year}";
    }

    /**
     * Get academic year
     */
    public static function getCurrentAcademicYear(): string
    {
        $currentMonth = date('m');
        $currentYear = date('Y');

        if ($currentMonth >= 7) {
            return $currentYear . '/' . ($currentYear + 1);
        }

        return ($currentYear - 1) . '/' . $currentYear;
    }

    /**
     * Get days difference
     */
    public static function daysDifference($date1, $date2): int
    {
        $datetime1 = date_create($date1);
        $datetime2 = date_create($date2);
        $interval = date_diff($datetime1, $datetime2);

        return $interval->days;
    }
}
