<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Rate Limiting Configuration
    |--------------------------------------------------------------------------
    |
    | Configure rate limits for different parts of the application
    |
    */

    'login' => [
        'max_attempts' => env('RATE_LIMIT_LOGIN_ATTEMPTS', 5),
        'decay_minutes' => env('RATE_LIMIT_LOGIN_DECAY', 15),
    ],

    'api' => [
        'max_requests' => env('RATE_LIMIT_API_REQUESTS', 60),
        'per_minutes' => env('RATE_LIMIT_API_MINUTES', 1),
    ],

    'strict_api' => [
        'max_requests' => env('RATE_LIMIT_STRICT_API_REQUESTS', 30),
        'per_minutes' => env('RATE_LIMIT_STRICT_API_MINUTES', 1),
    ],
];
