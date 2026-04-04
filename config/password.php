<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Password Policy Configuration
    |--------------------------------------------------------------------------
    |
    | Configure password requirements for the application
    |
    */

    'min_length' => env('PASSWORD_MIN_LENGTH', 8),
    'max_length' => env('PASSWORD_MAX_LENGTH', 128),
    'require_uppercase' => env('PASSWORD_REQUIRE_UPPERCASE', true),
    'require_lowercase' => env('PASSWORD_REQUIRE_LOWERCASE', true),
    'require_numbers' => env('PASSWORD_REQUIRE_NUMBERS', true),
    'require_special_chars' => env('PASSWORD_REQUIRE_SPECIAL', true),

    /*
    |--------------------------------------------------------------------------
    | Password Expiration
    |--------------------------------------------------------------------------
    |
    | Days until password expires (set to null to disable)
    |
    */
    'expires_days' => env('PASSWORD_EXPIRES_DAYS', null), // null = never expires

    /*
    |--------------------------------------------------------------------------
    | Password History
    |--------------------------------------------------------------------------
    |
    | Number of previous passwords to prevent reuse
    |
    */
    'prevent_reuse_count' => env('PASSWORD_PREVENT_REUSE', 3),

    /*
    |--------------------------------------------------------------------------
    | Force Password Change
    |--------------------------------------------------------------------------
    |
    | Force users to change password on first login
    |
    */
    'force_change_on_first_login' => env('PASSWORD_FORCE_FIRST_CHANGE', true),

    /*
    |--------------------------------------------------------------------------
    | Password Generation
    |--------------------------------------------------------------------------
    |
    | Configuration for auto-generated passwords
    |
    */
    'auto_generate_length' => 12,
    'use_memorable_passwords' => true, // For students/parents
];
