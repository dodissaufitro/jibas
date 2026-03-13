# 🚀 QUICK REFERENCE - Modular Architecture

> **Cheat Sheet untuk Development dengan Struktur Modular**

---

## 📂 File Locations

### Controllers

```
app/Modules/{Module}/Controllers/{Name}Controller.php
```

### Models

```
app/Modules/{Module}/Models/{Name}.php
```

### Services

```
app/Modules/{Module}/Services/{Name}Service.php
```

### Routes

```
app/Modules/{Module}/Routes/{module}.php
```

### Institution-Specific

```
app/Modules/InstitutionSpecific/{Type}/{Feature}/
```

---

## 🎯 Common Patterns

### 1. Create Controller

```php
<?php

namespace App\Modules\ModuleName\Controllers;

use App\Base\Controllers\BaseController;

class MyController extends BaseController
{
    public function index()
    {
        $institutionId = $this->getInstitutionId();
        // Your code
    }
}
```

### 2. Create Model

```php
<?php

namespace App\Modules\ModuleName\Models;

use App\Base\Models\BaseModel;
use App\Shared\Traits\InstitutionScoped;

class MyModel extends BaseModel
{
    use InstitutionScoped;

    protected $fillable = ['institution_id', 'field1', 'field2'];
}
```

### 3. Create Service

```php
<?php

namespace App\Modules\ModuleName\Services;

use App\Base\Services\BaseService;

class MyService extends BaseService
{
    public function create(array $data)
    {
        return $this->transaction(function () use ($data) {
            $item = MyModel::create($data);
            $this->logActivity('create', 'module', ['id' => $item->id]);
            return $item;
        });
    }
}
```

### 4. Create Routes

```php
<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('module')->name('module.')->group(function () {
    Route::resource('items', ItemController::class);
});
```

### 5. Register Routes

```php
// app/Providers/ModuleServiceProvider.php
protected array $moduleRoutes = [
    'module' => 'app/Modules/ModuleName/Routes/module.php',
];
```

---

## 🛡️ Institution-Specific Routes

```php
Route::middleware(['auth', 'institution:pesantren'])
    ->prefix('pesantren')
    ->name('pesantren.')
    ->group(function () {
        Route::get('/hafalan', [HafalanController::class, 'index']);
    });
```

**Types:** `pesantren`, `umum`, `madrasah`

---

## 🔧 Helper Methods

### In Controllers (extends BaseController)

```php
$this->getInstitutionId()           // Get auth user's institution_id
$this->isInstitutionType('pesantren') // Check institution type
$this->getPerPage()                  // Get pagination per_page
$this->successResponse('Message')    // Success redirect
$this->errorResponse('Message')      // Error redirect
```

### In Models (extends BaseModel)

```php
Model::forInstitution($id)  // Scope to specific institution
Model::active()             // Scope active records
$model->formatted_date      // Get formatted created_at
```

### In Services (extends BaseService)

```php
$this->transaction(function () { }) // Execute in transaction
$this->getInstitutionId()           // Get auth user's institution_id
$this->getUser()                    // Get auth user
$this->logActivity('action', 'module', []) // Log activity
```

---

## 📦 Traits

### InstitutionScoped

```php
use App\Shared\Traits\InstitutionScoped;

class Model extends Model
{
    use InstitutionScoped;  // Auto-filter by institution
}

// All queries auto-filtered
Model::all();  // Only auth user's institution
```

### HasStatus

```php
use App\Shared\Traits\HasStatus;

class Model extends Model
{
    use HasStatus;
}

$model->isActive()    // Check if active
$model->activate()    // Set status to 'aktif'
$model->deactivate()  // Set status to 'nonaktif'

Model::active()       // Scope active records
Model::inactive()     // Scope inactive records
```

---

## 🎨 Enums

### InstitutionType

```php
use App\Shared\Enums\InstitutionType;

InstitutionType::PESANTREN->label()  // "Pesantren"
InstitutionType::UMUM->label()       // "Sekolah Umum"
InstitutionType::MADRASAH->label()   // "Madrasah"

InstitutionType::values()  // ['pesantren', 'umum', 'madrasah']
InstitutionType::labels()  // ['Pesantren', 'Sekolah Umum', 'Madrasah']
```

### Status

```php
use App\Shared\Enums\Status;

Status::AKTIF->label()      // "Aktif"
Status::AKTIF->color()      // "green"
Status::PENDING->color()    // "yellow"
Status::REJECTED->color()   // "red"
```

---

## 🕐 Helpers

### DateHelper

```php
use App\Shared\Helpers\DateHelper;

DateHelper::formatIndonesian('2024-03-13')  // "13 Maret 2024"
DateHelper::getCurrentAcademicYear()        // "2023/2024"
DateHelper::daysDifference($date1, $date2)  // Integer (days)
```

---

## 🧪 Testing

### Run Autoload

```bash
composer dump-autoload
```

### Check Routes

```bash
php artisan route:list
php artisan route:list | grep academic
php artisan route:list | grep institution
```

### Run Tests

```bash
php artisan test
php artisan test --filter=ModuleTest
```

### Tinker

```bash
php artisan tinker
```

```php
// In tinker
use App\Shared\Enums\InstitutionType;
InstitutionType::PESANTREN->label();
```

---

## 📝 Checklist - New Module

```markdown
- [ ] Create folder structure
- [ ] Create Models (extend BaseModel)
- [ ] Create Services (extend BaseService)
- [ ] Create Controllers (extend BaseController)
- [ ] Create Routes file
- [ ] Register in ModuleServiceProvider
- [ ] Add middleware if needed
- [ ] composer dump-autoload
- [ ] Test endpoints
- [ ] Update documentation
```

---

## 🚨 Common Mistakes

### ❌ Forgot to extend Base classes

```php
// BAD
class MyController extends Controller { }

// GOOD
class MyController extends BaseController { }
```

### ❌ Forgot InstitutionScoped trait

```php
// BAD - Manual filtering
Model::where('institution_id', auth()->user()->institution_id)->get();

// GOOD - Auto-filtered
use App\Shared\Traits\InstitutionScoped;
Model::all();
```

### ❌ Forgot to register routes

```php
// Don't forget to add in ModuleServiceProvider.php:
protected array $moduleRoutes = [
    'your_module' => 'app/Modules/YourModule/Routes/yourmodule.php',
];
```

### ❌ Magic strings instead of Enums

```php
// BAD
if ($institution->type === 'pesantren') { }

// GOOD
use App\Shared\Enums\InstitutionType;
if ($institution->type === InstitutionType::PESANTREN->value) { }
```

---

## 📚 Documentation Links

- [ARCHITECTURE_GUIDE.md](cci:1:file:///c:/laragon/www/jibas/ARCHITECTURE_GUIDE.md:0:0-0:0) - Complete architecture
- [EXAMPLE_MODULE_IMPLEMENTATION.md](cci:1:file:///c:/laragon/www/jibas/EXAMPLE_MODULE_IMPLEMENTATION.md:0:0-0:0) - Step-by-step tutorial
- [MIGRATION_GUIDE.md](cci:1:file:///c:/laragon/www/jibas/MIGRATION_GUIDE.md:0:0-0:0) - Migration strategy
- [MODULAR_ARCHITECTURE_COMPLETE.md](cci:1:file:///c:/laragon/www/jibas/MODULAR_ARCHITECTURE_COMPLETE.md:0:0-0:0) - Implementation summary

---

## 💡 Pro Tips

1. **Always extend Base classes** - Don't reinvent the wheel
2. **Use Traits for common behavior** - InstitutionScoped, HasStatus
3. **Service layer for business logic** - Keep controllers slim
4. **Use Enums instead of strings** - Type-safe and maintainable
5. **Test in isolation** - Each module should work independently
6. **Document as you go** - Future you will thank you
7. **Use transaction()** - Auto-rollback on errors
8. **Log activities** - Built-in logging in BaseService

---

**Quick Start:** Copy patterns from `app/Modules/Academic/` or `app/Modules/InstitutionSpecific/Pesantren/Hafalan/`

**Last Updated:** 13 March 2024
