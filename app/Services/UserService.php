<?php

namespace App\Services;

use App\Models\User;
use App\Shared\Helpers\PasswordHelper;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserService
{
    /**
     * Create a new user with secure password
     *
     * @param array $data
     * @param string|null $customPassword
     * @return array [User $user, string $plainPassword]
     */
    public function createUser(array $data, ?string $customPassword = null): array
    {
        // Generate secure password if not provided
        if ($customPassword) {
            $plainPassword = $customPassword;
        } else {
            $plainPassword = config('password.use_memorable_passwords')
                ? PasswordHelper::generateMemorable()
                : PasswordHelper::generate(config('password.auto_generate_length'));
        }

        // Validate password strength
        $validation = PasswordHelper::validate($plainPassword);
        if (!$validation['isValid']) {
            throw new \InvalidArgumentException('Password tidak memenuhi kriteria: ' . implode(', ', $validation['errors']));
        }

        // Check if password is commonly used
        if (PasswordHelper::isCommonPassword($plainPassword)) {
            throw new \InvalidArgumentException('Password terlalu umum, silakan gunakan password yang lebih kuat');
        }

        $user = DB::transaction(function () use ($data, $plainPassword) {
            $user = User::create([
                ...$data,
                'password' => Hash::make($plainPassword),
                'password_changed_at' => now(),
                'force_password_change' => config('password.force_change_on_first_login'),
            ]);

            // Store password in history
            $this->addPasswordToHistory($user, Hash::make($plainPassword));

            return $user;
        });

        return [
            'user' => $user,
            'plainPassword' => $plainPassword
        ];
    }

    /**
     * Update user password
     *
     * @param User $user
     * @param string $newPassword
     * @param bool $forceChange
     * @return bool
     */
    public function updatePassword(User $user, string $newPassword, bool $forceChange = false): bool
    {
        // Validate password strength
        $validation = PasswordHelper::validate($newPassword);
        if (!$validation['isValid']) {
            throw new \InvalidArgumentException('Password tidak memenuhi kriteria: ' . implode(', ', $validation['errors']));
        }

        // Check if password is commonly used
        if (PasswordHelper::isCommonPassword($newPassword)) {
            throw new \InvalidArgumentException('Password terlalu umum, silakan gunakan password yang lebih kuat');
        }

        // Check password history
        if ($this->isPasswordPreviouslyUsed($user, $newPassword)) {
            throw new \InvalidArgumentException(
                'Password telah digunakan sebelumnya. Silakan gunakan password yang berbeda.'
            );
        }

        $hashedPassword = Hash::make($newPassword);

        $user->update([
            'password' => $hashedPassword,
            'password_changed_at' => now(),
            'force_password_change' => $forceChange,
        ]);

        // Add to password history
        $this->addPasswordToHistory($user, $hashedPassword);

        return true;
    }

    /**
     * Reset user password to auto-generated one
     *
     * @param User $user
     * @return string The new plain password
     */
    public function resetPassword(User $user): string
    {
        $plainPassword = config('password.use_memorable_passwords')
            ? PasswordHelper::generateMemorable()
            : PasswordHelper::generate(config('password.auto_generate_length'));

        $user->update([
            'password' => Hash::make($plainPassword),
            'password_changed_at' => now(),
            'force_password_change' => true,
        ]);

        return $plainPassword;
    }

    /**
     * Record login activity
     *
     * @param User $user
     * @param string $ip
     * @return void
     */
    public function recordLogin(User $user, string $ip): void
    {
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
        ]);
    }

    /**
     * Add password to history
     *
     * @param User $user
     * @param string $hashedPassword
     * @return void
     */
    protected function addPasswordToHistory(User $user, string $hashedPassword): void
    {
        $history = $user->password_history ? json_decode($user->password_history, true) : [];

        // Add new password to history
        array_unshift($history, [
            'hash' => $hashedPassword,
            'changed_at' => now()->toDateTimeString(),
        ]);

        // Keep only the configured number of passwords
        $keepCount = config('password.prevent_reuse_count', 3);
        $history = array_slice($history, 0, $keepCount);

        $user->update([
            'password_history' => json_encode($history),
        ]);
    }

    /**
     * Check if password was previously used
     *
     * @param User $user
     * @param string $plainPassword
     * @return bool
     */
    protected function isPasswordPreviouslyUsed(User $user, string $plainPassword): bool
    {
        if (!$user->password_history) {
            return false;
        }

        $history = json_decode($user->password_history, true);

        foreach ($history as $entry) {
            if (Hash::check($plainPassword, $entry['hash'])) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if password has expired
     *
     * @param User $user
     * @return bool
     */
    public function isPasswordExpired(User $user): bool
    {
        $expiresDays = config('password.expires_days');

        if (!$expiresDays || !$user->password_changed_at) {
            return false;
        }

        return $user->password_changed_at->addDays($expiresDays)->isPast();
    }
}
