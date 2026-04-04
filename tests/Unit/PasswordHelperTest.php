<?php

namespace Tests\Unit;

use App\Shared\Helpers\PasswordHelper;
use PHPUnit\Framework\TestCase;

class PasswordHelperTest extends TestCase
{
    public function test_generate_creates_password_with_correct_length(): void
    {
        $password = PasswordHelper::generate(12);

        $this->assertEquals(12, strlen($password));
    }

    public function test_generate_creates_password_with_mixed_characters(): void
    {
        $password = PasswordHelper::generate(12);

        // Should have at least one uppercase
        $this->assertMatchesRegularExpression('/[A-Z]/', $password);

        // Should have at least one lowercase
        $this->assertMatchesRegularExpression('/[a-z]/', $password);

        // Should have at least one number
        $this->assertMatchesRegularExpression('/[0-9]/', $password);

        // Should have at least one special char
        $this->assertMatchesRegularExpression('/[!@#$%^&*]/', $password);
    }

    public function test_generate_memorable_creates_valid_format(): void
    {
        $password = PasswordHelper::generateMemorable();

        // Should not be empty
        $this->assertNotEmpty($password);

        // Should contain numbers
        $this->assertMatchesRegularExpression('/[0-9]/', $password);
    }

    public function test_validate_rejects_short_passwords(): void
    {
        $result = PasswordHelper::validate('short');

        $this->assertFalse($result['isValid']);
        $this->assertContains('Password minimal 8 karakter', $result['errors']);
    }

    public function test_validate_rejects_password_without_uppercase(): void
    {
        $result = PasswordHelper::validate('password123!');

        $this->assertFalse($result['isValid']);
        $this->assertContains('Password harus mengandung minimal 1 huruf besar', $result['errors']);
    }

    public function test_validate_accepts_strong_password(): void
    {
        $result = PasswordHelper::validate('StrongP@ss123');

        $this->assertTrue($result['isValid']);
        $this->assertEmpty($result['errors']);
    }

    public function test_is_common_password_detects_weak_passwords(): void
    {
        $this->assertTrue(PasswordHelper::isCommonPassword('password'));
        $this->assertTrue(PasswordHelper::isCommonPassword('123456'));
        $this->assertTrue(PasswordHelper::isCommonPassword('admin'));
        $this->assertFalse(PasswordHelper::isCommonPassword('MySecureP@ss2024'));
    }
}
