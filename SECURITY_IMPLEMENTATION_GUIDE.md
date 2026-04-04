# 🚀 QUICK IMPLEMENTATION GUIDE

Panduan implementasi cepat untuk perbaikan keamanan prioritas tinggi.

---

## 1️⃣ ENABLE SECURITY HEADERS

### Step 1: Register Middleware

Edit file **`bootstrap/app.php`**:

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // TAMBAHKAN INI:
        $middleware->web(append: [
            \App\Http\Middleware\SecurityHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

### Step 2: Test

```bash
# Start server
php artisan serve

# Check headers (gunakan browser DevTools atau curl)
curl -I http://localhost:8000
```

**Expected Output:**

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
Content-Security-Policy: default-src 'self'; ...
```

---

## 2️⃣ ENABLE HTTPS ENFORCEMENT (PRODUCTION ONLY)

### Step 1: Register Middleware

Edit file **`bootstrap/app.php`** (sama seperti di atas):

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\ForceHttps::class,        // TAMBAHKAN INI
        \App\Http\Middleware\SecurityHeaders::class,
    ]);
})
```

### Step 2: Update .env untuk Production

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Session Security
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SESSION_ENCRYPT=true
```

### Step 3: Update config/session.php

Tambahkan di array return:

```php
return [
    // ... existing config ...

    'secure' => env('SESSION_SECURE_COOKIE', false),
    'http_only' => env('SESSION_HTTP_ONLY', true),
    'same_site' => env('SESSION_SAME_SITE', 'lax'),
];
```

---

## 3️⃣ IMPLEMENT IDOR PROTECTION

### Step 1: Register Policy

Edit **`app/Providers/AppServiceProvider.php`**:

```php
<?php

namespace App\Providers;

use App\Models\Siswa;
use App\Policies\SiswaPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Register policies
        Gate::policy(Siswa::class, SiswaPolicy::class);
    }
}
```

### Step 2: Update Controller untuk Menggunakan Policy

Edit **`app/Http/Controllers/SiswaController.php`** (contoh):

```php
<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function show($id)
    {
        // ❌ BEFORE (vulnerable to IDOR):
        // $siswa = Siswa::findOrFail($id);

        // ✅ AFTER (secure):
        $siswa = Siswa::where('id', $id)
            ->where('institution_id', auth()->user()->institution_id)
            ->firstOrFail();

        // Authorize using policy
        $this->authorize('view', $siswa);

        return Inertia::render('Siswa/Show', [
            'siswa' => $siswa,
        ]);
    }

    public function update(Request $request, $id)
    {
        $siswa = Siswa::where('id', $id)
            ->where('institution_id', auth()->user()->institution_id)
            ->firstOrFail();

        // Authorize
        $this->authorize('update', $siswa);

        // Validation dan update logic...
        $validated = $request->validated();
        $siswa->update($validated);

        return redirect()->route('siswa.index');
    }

    public function destroy($id)
    {
        $siswa = Siswa::where('id', $id)
            ->where('institution_id', auth()->user()->institution_id)
            ->firstOrFail();

        // Authorize
        $this->authorize('delete', $siswa);

        $siswa->delete();

        return redirect()->route('siswa.index');
    }
}
```

**Atau lebih clean dengan Route Model Binding:**

```php
// routes/web.php
Route::bind('siswa', function ($value) {
    return \App\Models\Siswa::where('id', $value)
        ->where('institution_id', auth()->user()->institution_id)
        ->firstOrFail();
});

// Controller
public function show(Siswa $siswa)  // Laravel auto-binds dengan scoping
{
    $this->authorize('view', $siswa);

    return Inertia::render('Siswa/Show', [
        'siswa' => $siswa,
    ]);
}
```

### Step 3: Apply ke Semua Resource Controllers

Buat policies untuk models lain:

```bash
php artisan make:policy GuruPolicy --model=Guru
php artisan make:policy UserPolicy --model=User
php artisan make:policy NilaiPolicy --model=Nilai
# ... dst
```

Template sama seperti SiswaPolicy.

---

## 4️⃣ ENHANCED LOGGING

### Step 1: Update LoginController

Edit **`app/Http/Controllers/Auth/LoginController.php`** atau authentication logic:

```php
<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

// Dalam method login atau authenticate
public function authenticate(Request $request)
{
    $credentials = $request->only('email', 'password');

    if (Auth::attempt($credentials)) {
        // Success
        $request->session()->regenerate();

        // Log successful login
        Log::info('Successful login', [
            'user_id' => Auth::id(),
            'email' => Auth::user()->email,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Update last login
        Auth::user()->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        return redirect()->intended(route('dashboard'));
    }

    // Failed
    Log::warning('Failed login attempt', [
        'email' => $request->email,
        'ip' => $request->ip(),
        'user_agent' => $request->userAgent(),
        'timestamp' => now(),
    ]);

    // Increment rate limiter
    RateLimiter::hit($this->throttleKey($request));

    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ]);
}
```

### Step 2: Update CheckPermission Middleware

Edit **`app/Http/Middleware/CheckPermission.php`**:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!$request->user()) {
            return redirect()->route('custom.login.show');
        }

        if ($request->user()->hasRole('super_admin')) {
            return $next($request);
        }

        if (!$request->user()->hasPermission($permission)) {
            // LOG UNAUTHORIZED ACCESS
            Log::warning('Unauthorized access attempt', [
                'user_id' => $request->user()->id,
                'user_email' => $request->user()->email,
                'permission_required' => $permission,
                'route' => $request->path(),
                'method' => $request->method(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}
```

---

## 5️⃣ DEPENDENCY AUDIT

### Run Security Audit

```bash
# PHP dependencies
composer audit

# Fix if possible
composer update

# JavaScript dependencies
npm audit

# Auto-fix non-breaking changes
npm audit fix

# For breaking changes (manual review needed)
npm audit fix --force
```

### Add to CI/CD Pipeline

**`.github/workflows/security.yml`** (jika menggunakan GitHub Actions):

```yaml
name: Security Audit

on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main, develop]
    schedule:
        - cron: "0 0 * * 0" # Weekly on Sunday

jobs:
    security:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v3

            - name: Setup PHP
              uses: shivammathur/setup-php@v2
              with:
                  php-version: "8.3"

            - name: Install Composer dependencies
              run: composer install --prefer-dist --no-progress

            - name: Run Composer Audit
              run: composer audit

            - name: Setup Node
              uses: actions/setup-node@v3
              with:
                  node-version: "20"

            - name: Install NPM dependencies
              run: npm ci

            - name: Run NPM Audit
              run: npm audit --audit-level=moderate
```

---

## 6️⃣ STATIC ANALYSIS TOOLS

### Install PHPStan

```bash
composer require --dev phpstan/phpstan
```

**`phpstan.neon`**:

```neon
parameters:
    level: 5
    paths:
        - app
    excludePaths:
        - app/Console/Kernel.php
    checkMissingIterableValueType: false
```

**Run:**

```bash
./vendor/bin/phpstan analyse
```

### Install Laravel Enlightn (Security Scanner)

```bash
composer require --dev enlightn/enlightn
php artisan enlightn
```

Akan menghasilkan security report otomatis.

---

## 7️⃣ PRODUCTION DEPLOYMENT CHECKLIST

### Pre-Deployment

```bash
# 1. Update .env
cp .env.example .env.production
# Edit .env.production dengan values production

# 2. Clear and cache config
php artisan config:clear
php artisan config:cache

# 3. Clear and cache routes
php artisan route:clear
php artisan route:cache

# 4. Clear and cache views
php artisan view:clear
php artisan view:cache

# 5. Optimize autoloader
composer install --optimize-autoloader --no-dev

# 6. Run migrations (with backup!)
php artisan migrate --force

# 7. Run tests
php artisan test

# 8. Security audit
composer audit
npm audit

# 9. Static analysis
./vendor/bin/phpstan analyse
```

### Post-Deployment

```bash
# 1. Verify HTTPS
curl -I https://yourdomain.com

# 2. Check security headers
curl -I https://yourdomain.com | grep -E "X-Content-Type-Options|X-Frame-Options|X-XSS-Protection"

# 3. Test SSL
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com

# 4. Monitor logs
tail -f storage/logs/laravel.log

# 5. Setup monitoring (optional)
# - Sentry
# - New Relic
# - Bugsnag
```

---

## 📊 TESTING SECURITY FIXES

### Test 1: Security Headers

```bash
curl -I http://localhost:8000 | grep -E "X-Content-Type-Options|X-Frame-Options|Content-Security-Policy"
```

**Expected:** Headers present

### Test 2: HTTPS Redirect (Production)

```bash
curl -I http://yourdomain.com
```

**Expected:** 301 redirect to HTTPS

### Test 3: IDOR Protection

**Scenario:**

1. Login sebagai User A (institution_id = 1)
2. Try to access siswa dari institution_id = 2
3. Should get 404 atau 403

```php
// Test case
public function test_user_cannot_access_siswa_from_other_institution()
{
    $userA = User::factory()->create(['institution_id' => 1]);
    $siswaB = Siswa::factory()->create(['institution_id' => 2]);

    $this->actingAs($userA)
        ->get(route('siswa.show', $siswaB->id))
        ->assertStatus(404);  // or 403
}
```

### Test 4: Authorization

```php
public function test_unauthorized_user_cannot_delete_siswa()
{
    $user = User::factory()->create();
    $siswa = Siswa::factory()->create(['institution_id' => $user->institution_id]);

    // User without permission
    $this->actingAs($user)
        ->delete(route('siswa.destroy', $siswa->id))
        ->assertStatus(403);
}
```

---

## 🆘 TROUBLESHOOTING

### Issue: CSP Blocking Resources

**Symptom:** Console errors about blocked resources

**Solution:** Update CSP in SecurityHeaders.php:

```php
// Allow inline styles for Vue/React
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

// Allow external fonts
"font-src 'self' data: https://fonts.gstatic.com",

// Allow images from CDN
"img-src 'self' data: https: https://cdn.yourdomain.com",
```

### Issue: HTTPS Redirect Loop

**Symptom:** Infinite redirect di production

**Solution:** Configure trusted proxies

```php
// config/trustedproxy.php
protected $proxies = '*';
```

### Issue: Session Encryption Error

**Symptom:** "The payload is invalid" error

**Solution:**

```bash
# Regenerate app key
php artisan key:generate

# Clear sessions
php artisan session:flush
```

---

## ✅ VERIFICATION CHECKLIST

Setelah implementasi, verify dengan checklist ini:

```markdown
- [ ] SecurityHeaders middleware terdaftar dan aktif
- [ ] ForceHttps middleware aktif di production
- [ ] SiswaPolicy terdaftar dan digunakan di controller
- [ ] Semua resource controllers menggunakan authorization
- [ ] Failed login attempts ter-log
- [ ] Unauthorized access ter-log
- [ ] .env production sudah diupdate (DEBUG=false, HTTPS settings)
- [ ] Session security enabled (encrypt, secure, http_only)
- [ ] composer audit passed
- [ ] npm audit passed
- [ ] PHPStan level 5 passed (atau minimal level 3)
- [ ] All tests passing
- [ ] Security headers visible di browser DevTools
- [ ] HTTPS redirect working di production
- [ ] IDOR test case passing
```

---

## 📞 NEED HELP?

Jika ada error atau butuh bantuan:

1. Check Laravel logs: `storage/logs/laravel.log`
2. Check web server logs (Nginx/Apache)
3. Enable debug log level temporarily: `LOG_LEVEL=debug`
4. Test dengan `php artisan tinker` untuk isolate issues

**Common Commands:**

```bash
# Clear all caches
php artisan optimize:clear

# View routes
php artisan route:list

# View config
php artisan config:show

# Test middleware
php artisan route:list --middleware=SecurityHeaders
```

---

✅ **Implementation Time Estimate:**

- Security Headers: 15 minutes
- HTTPS Enforcement: 30 minutes
- IDOR Protection (1 model): 30 minutes
- Enhanced Logging: 45 minutes
- Testing: 1 hour

**Total: ~3-4 hours untuk critical fixes**
