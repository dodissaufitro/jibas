# Test Coverage Guide

## Running Tests

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/SiswaManagementTest.php

# Run with coverage (requires Xdebug)
php artisan test --coverage

# Run specific test method
php artisan test --filter test_siswa_can_be_created

# Run only unit tests
php artisan test --testsuite=Unit

# Run only feature tests
php artisan test --testsuite=Feature
```

## Test Structure

### Unit Tests

- **PasswordHelperTest**: Test password generation and validation
- **UserServiceTest**: Test user management service layer

### Feature Tests

- **AuthenticationTest**: Test login, logout, rate limiting
- **SiswaManagementTest**: Test CRUD operations for Siswa

## Writing New Tests

### Feature Test Template

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class YourFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_your_feature(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get('/your-route');

        $response->assertStatus(200);
        // Add more assertions
    }
}
```

### Unit Test Template

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class YourUnitTest extends TestCase
{
    public function test_your_unit(): void
    {
        $result = yourFunction();

        $this->assertEquals('expected', $result);
    }
}
```

## Coverage Goals

- **Critical Features**: 100% coverage
    - Authentication
    - Password Management
    - User Creation
    - Security Features

- **Business Logic**: 80% coverage
    - Service Layer
    - Controllers
    - Models

- **Overall Target**: 70% coverage

## CI/CD Integration

Add to GitHub Actions (`.github/workflows/tests.yml`):

```yaml
name: Tests

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v2

            - name: Setup PHP
              uses: shivammathur/setup-php@v2
              with:
                  php-version: "8.2"

            - name: Install Dependencies
              run: composer install

            - name: Run Tests
              run: php artisan test
```

## Best Practices

1. **Use RefreshDatabase** for feature tests
2. **Mock external dependencies** (APIs, payments, etc)
3. **Test edge cases** (validation, errors, etc)
4. **Keep tests independent** (no test should depend on another)
5. **Use factories** for test data
6. **Clear test names** (test_what_is_being_tested)
7. **One assertion per test** (when practical)
8. **Test the happy path and error paths**

## Next Steps

1. Add more feature tests for:
    - Guru Management
    - Presensi
    - Tagihan & Pembayaran
    - PPDB
    - Ujian

2. Add integration tests for:
    - API endpoints
    - File uploads
    - Payment gateway
    - Notifications

3. Add E2E tests using Laravel Dusk
