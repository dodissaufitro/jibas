<?php

namespace App\Shared\Helpers;

use Illuminate\Support\Str;

class PasswordHelper
{
    /**
     * Generate a secure random password
     *
     * @param int $length
     * @return string
     */
    public static function generate(int $length = 12): string
    {
        $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $lowercase = 'abcdefghijklmnopqrstuvwxyz';
        $numbers = '0123456789';
        $special = '!@#$%^&*';

        $password = '';
        $password .= $uppercase[random_int(0, strlen($uppercase) - 1)];
        $password .= $lowercase[random_int(0, strlen($lowercase) - 1)];
        $password .= $numbers[random_int(0, strlen($numbers) - 1)];
        $password .= $special[random_int(0, strlen($special) - 1)];

        $allChars = $uppercase . $lowercase . $numbers . $special;
        for ($i = 4; $i < $length; $i++) {
            $password .= $allChars[random_int(0, strlen($allChars) - 1)];
        }

        return str_shuffle($password);
    }

    /**
     * Generate a memorable password (for student/parent portal)
     * Format: Word-Number-Special-Word (e.g., Biru@2024Harimau)
     *
     * @return string
     */
    public static function generateMemorable(): string
    {
        $adjectives = [
            'Biru',
            'Merah',
            'Hijau',
            'Kuning',
            'Hitam',
            'Putih',
            'Cepat',
            'Kuat',
            'Pintar',
            'Berani',
            'Ceria',
            'Rajin'
        ];

        $nouns = [
            'Garuda',
            'Harimau',
            'Singa',
            'Naga',
            'Elang',
            'Paus',
            'Pohon',
            'Bintang',
            'Bulan',
            'Matahari',
            'Pelangi',
            'Awan'
        ];

        $special = ['!', '@', '#', '$', '%', '&', '*'];

        $adjective = $adjectives[array_rand($adjectives)];
        $noun = $nouns[array_rand($nouns)];
        $number = random_int(1000, 9999);
        $specialChar = $special[array_rand($special)];

        return "{$adjective}{$specialChar}{$number}{$noun}";
    }

    /**
     * Validate password strength
     *
     * @param string $password
     * @return array [bool $isValid, array $errors]
     */
    public static function validate(string $password): array
    {
        $errors = [];

        if (strlen($password) < 8) {
            $errors[] = 'Password minimal 8 karakter';
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Password harus mengandung minimal 1 huruf besar';
        }

        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'Password harus mengandung minimal 1 huruf kecil';
        }

        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = 'Password harus mengandung minimal 1 angka';
        }

        if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
            $errors[] = 'Password harus mengandung minimal 1 karakter spesial';
        }

        return [
            'isValid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Check if password is commonly used (weak)
     *
     * @param string $password
     * @return bool
     */
    public static function isCommonPassword(string $password): bool
    {
        $commonPasswords = [
            'password',
            'password123',
            '12345678',
            'qwerty',
            'abc123',
            'monkey',
            '1234567',
            'letmein',
            'trustno1',
            'dragon',
            'baseball',
            'iloveyou',
            'master',
            'sunshine',
            'ashley',
            'admin',
            'admin123',
            'root',
            'toor',
            'pass',
            'test',
            'guest',
            'welcome',
            '123456',
            '123456789',
            'password1'
        ];

        return in_array(strtolower($password), $commonPasswords);
    }
}
