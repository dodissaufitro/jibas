# 📖 MIGRATION GUIDE - Modular Architecture

> **Panduan Migrasi Bertahap ke Arsitektur Modular**

---

## 🎯 Tujuan

Dokumen ini menjelaskan cara **migrasi bertahap** dari struktur existing ke arsitektur modular tanpa mengganggu sistem yang sudah berjalan.

---

## ✅ Struktur Baru yang Sudah Dibuat

### 1. **Folder Structure**

```
app/
├── Base/                           ✅ DONE
│   ├── Controllers/BaseController.php
│   ├── Models/BaseModel.php
│   └── Services/BaseService.php
│
├── Shared/                         ✅ DONE
│   ├── Traits/
│   │   ├── InstitutionScoped.php
│   │   └── HasStatus.php
│   ├── Enums/
│   │   ├── InstitutionType.php
│   │   └── Status.php
│   └── Helpers/
│       └── DateHelper.php
│
├── Core/                           ✅ DONE
│   └── Institution/
│       └── InstitutionService.php
│
├── Modules/                        ✅ DONE
│   ├── Academic/
│   │   ├── Services/NilaiService.php
│   │   ├── Events/NilaiDiinput.php
│   │   └── Routes/academic.php
│   │
│   └── InstitutionSpecific/
│       └── Pesantren/
│           └── Hafalan/
│               ├── Models/HafalanQuran.php
│               ├── Services/HafalanService.php
│               └── Routes/hafalan.php
│
└── Http/
    └── Middleware/
        └── CheckInstitutionType.php  ✅ DONE
```

### 2. **Service Provider**

✅ `app/Providers/ModuleServiceProvider.php` - Auto-load module routes

### 3. **Middleware**

✅ Middleware `institution:{type}` registered in `bootstrap/app.php`

---

## 🚀 Cara Menggunakan Struktur Baru

### 1. **Extend Base Classes**

#### **Controllers:**

```php
<?php

namespace App\Http\Controllers;

use App\Base\Controllers\BaseController;

class NilaiController extends BaseController  // Extend BaseController
{
    public function index()
    {
        $institutionId = $this->getInstitutionId();  // Helper method
        // ...
    }
}
```

#### **Models:**

```php
<?php

namespace App\Models;

use App\Base\Models\BaseModel;

class Nilai extends BaseModel  // Extend BaseModel
{
    protected $fillable = ['institution_id', 'siswa_id', 'nilai'];

    // Auto institution scope available
    // Auto institution_id setup on create
}

// Usage:
Nilai::forInstitution()->get();  // Auto-filtered by auth user's institution
```

#### **Services:**

```php
<?php

namespace App\Modules\Academic\Services;

use App\Base\Services\BaseService;

class NilaiService extends BaseService
{
    public function create(array $data)
    {
        return $this->transaction(function () use ($data) {
            // Auto rollback on error
            $nilai = Nilai::create($data);

            $this->logActivity('create_nilai', 'academic', ['nilai_id' => $nilai->id]);

            return $nilai;
        });
    }
}
```

### 2. **Gunakan Traits**

```php
<?php

namespace App\Models;

use App\Shared\Traits\InstitutionScoped;
use App\Shared\Traits\HasStatus;

class Siswa extends Model
{
    use InstitutionScoped;  // Auto-filter by institution
    use HasStatus;          // has isActive(), activate(), deactivate()
}

// Usage:
$siswa = Siswa::all();  // Auto-filtered by auth user's institution (global scope)
$siswa->activate();     // Set status to 'aktif'
```

### 3. **Gunakan Enums**

```php
<?php

use App\Shared\Enums\InstitutionType;
use App\Shared\Enums\Status;

// In Controller
$types = InstitutionType::values();  // ['pesantren', 'umum', 'madrasah']
$labels = InstitutionType::labels(); // ['Pesantren', 'Sekolah Umum', 'Madrasah']

$type = InstitutionType::PESANTREN;
echo $type->label();  // 'Pesantren'

// Status
$status = Status::AKTIF;
echo $status->color();  // 'green'
```

### 4. **Gunakan Helpers**

```php
<?php

use App\Shared\Helpers\DateHelper;

// Format Indonesian
DateHelper::formatIndonesian('2024-03-13');  // "13 Maret 2024"

// Get academic year
DateHelper::getCurrentAcademicYear();  // "2023/2024"

// Days difference
DateHelper::daysDifference('2024-01-01', '2024-03-13');  // 72
```

### 5. **Middleware untuk Institution-Specific Routes**

```php
<?php

// routes/modules/pesantren.php
Route::middleware(['auth', 'institution:pesantren'])
    ->prefix('pesantren')
    ->name('pesantren.')
    ->group(function () {
        Route::resource('hafalan', HafalanController::class);
    });
```

Middleware ini akan **auto-reject** jika user bukan dari institusi pesantren.

---

## 📋 Strategi Migrasi Bertahap

### **Phase 1: Setup Foundation** ✅ DONE

- [x] Create folder structure
- [x] Create base classes
- [x] Create shared utilities
- [x] Register middleware
- [x] Register service provider

### **Phase 2: Migrate Existing Code** (Optional - Gradual)

**Prinsip:** **_Tidak perlu migrate semua sekaligus!_**

#### **Opsi A: Dual Structure** (Recommended untuk transisi)

Biarkan struktur lama tetap berjalan, gunakan struktur baru untuk modul baru:

```
app/
├── Http/Controllers/          ← OLD (keep as is)
│   ├── SiswaController.php
│   └── GuruController.php
│
├── Models/                    ← OLD (keep as is)
│   ├── Siswa.php
│   └── Guru.php
│
└── Modules/                   ← NEW (for new modules)
    └── Academic/
        └── Services/NilaiService.php
```

**Keuntungan:**

- ✅ Zero downtime
- ✅ No breaking changes
- ✅ Migrate gradually when touching code
- ✅ New features use new structure

#### **Opsi B: Gradual Migration** (Jika ingin migrate existing)

Migrate satu modul at a time:

**Step 1: Move Models**

```bash
# Create module model directory
mkdir -p app/Modules/Academic/Models

# Move model
mv app/Models/Nilai.php app/Modules/Academic/Models/

# Update namespace
# namespace App\Models; → namespace App\Modules\Academic\Models;

# Update imports in other files
# use App\Models\Nilai; → use App\Modules\Academic\Models\Nilai;
```

**Step 2: Create Service Layer**

```bash
# Create service
touch app/Modules/Academic/Services/NilaiService.php

# Move business logic from controller to service
```

**Step 3: Update Controller**

```php
// Old (Fat Controller)
class NilaiController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $nilai = Nilai::create($request->all());
            // ... complex logic
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
        }
    }
}

// New (Slim Controller with Service)
class NilaiController extends BaseController
{
    public function __construct(
        private NilaiService $nilaiService
    ) {}

    public function store(Request $request)
    {
        $nilai = $this->nilaiService->create($request->validated());
        return $this->successResponse('Nilai berhasil ditambahkan');
    }
}
```

**Step 4: Update Routes**

```php
// OLD: routes/web.php (keep as is for now)

// NEW: Create routes/modules/academic.php
Route::middleware(['auth'])->prefix('academic')->group(function () {
    Route::resource('nilai', NilaiController::class);
});

// Enable in ModuleServiceProvider.php
protected array $moduleRoutes = [
    'academic' => 'app/Modules/Academic/Routes/academic.php',
];
```

---

## 🎯 Rekomendasi Prioritas Migrasi

### **Priority 1: New Modules** ✅

Gunakan struktur baru untuk **modul baru**:

1. ✅ Hafalan Quran (Pesantren) - **Sudah ada contoh**
2. 🆕 Penilaian & Rapor
3. 🆕 Jadwal Pelajaran
4. 🆕 Komunikasi Orang Tua
5. 🆕 Ekstrakurikuler (School)
6. 🆕 BTQ (Madrasah)

### **Priority 2: Enhance Existing** (When Touching Code)

Ketika **update/fix** modul existing, pindahkan ke struktur baru:

1. ⚠️ Siswa → `app/Modules/Academic/Models/Siswa.php`
2. ⚠️ Guru → `app/Modules/Academic/Models/Guru.php`
3. ⚠️ Pembayaran → `app/Modules/Finance/Models/Pembayaran.php`

### **Priority 3: Full Migration** (Optional - Long Term)

Jika ingin clean up sepenuhnya (tidak wajib):

1. Move all models to modules
2. Create services for all
3. Refactor all controllers
4. Remove old structure

---

## 🔧 Tools untuk Automasi (Optional)

### Script untuk Auto-Update Namespace

```php
// scripts/update-namespace.php
<?php

$oldNamespace = 'App\\Models\\';
$newNamespace = 'App\\Modules\\Academic\\Models\\';

$files = glob('app/Http/Controllers/*.php');

foreach ($files as $file) {
    $content = file_get_contents($file);
    $content = str_replace($oldNamespace, $newNamespace, $content);
    file_put_contents($file, $content);
    echo "Updated: $file\n";
}
```

```bash
php scripts/update-namespace.php
```

---

## 📊 Checklist Migrasi per Modul

```markdown
## Migrasi Modul: [Nama Modul]

### Phase 1: Structure

- [ ] Create folder `app/Modules/{Module}/`
- [ ] Create Models, Services, Controllers, Routes directories

### Phase 2: Models

- [ ] Move/Create models
- [ ] Extend BaseModel
- [ ] Add InstitutionScoped trait
- [ ] Update relationships

### Phase 3: Services

- [ ] Create Service classes
- [ ] Move business logic from controllers
- [ ] Extend BaseService
- [ ] Add transaction handling

### Phase 4: Controllers

- [ ] Refactor controllers (slim)
- [ ] Inject services via constructor
- [ ] Extend BaseController
- [ ] Use helper methods

### Phase 5: Routes

- [ ] Create module route file
- [ ] Group routes properly
- [ ] Add middleware
- [ ] Register in ModuleServiceProvider

### Phase 6: Testing

- [ ] Test all endpoints
- [ ] Verify institution filtering
- [ ] Check permissions
- [ ] No breaking changes

### Phase 7: Documentation

- [ ] Update API docs
- [ ] Update user guide
- [ ] Add code comments
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Namespace Not Found

**Error:**

```
Class 'App\Modules\Academic\Models\Nilai' not found
```

**Solution:**

```bash
composer dump-autoload
```

### Issue 2: Models Not Auto-Scoped to Institution

**Solution:**

Add trait to model:

```php
use App\Shared\Traits\InstitutionScoped;

class YourModel extends Model
{
    use InstitutionScoped;
}
```

### Issue 3: Routes Not Loading

**Solution:**

Check `ModuleServiceProvider.php`:

```php
protected array $moduleRoutes = [
    'your_module' => 'app/Modules/YourModule/Routes/yourmodule.php',
];
```

Verify file exists and provider is registered in `bootstrap/providers.php`.

### Issue 4: Middleware Not Working

**Solution:**

Check `bootstrap/app.php`:

```php
$middleware->alias([
    'institution' => \App\Http\Middleware\CheckInstitutionType::class,
]);
```

---

## 💡 Best Practices

### 1. **One Module at a Time**

Don't try to migrate everything at once. Focus on one module per sprint.

### 2. **Test After Each Step**

Run tests after moving each model/controller.

### 3. **Keep Old Code Until Verified**

Don't delete old code until new structure is fully tested and deployed.

### 4. **Document Changes**

Update team documentation after each migration.

### 5. **Use Feature Flags**

Consider using feature flags to toggle between old/new structure:

```php
if (config('features.use_modular_structure')) {
    return app(NilaiService::class)->create($data);
} else {
    // Old code
}
```

---

## 📝 Example: Complete Module Migration

### Before (Old Structure)

```
app/
├── Models/Nilai.php
└── Http/Controllers/NilaiController.php

routes/web.php
```

### After (New Structure)

```
app/
└── Modules/
    └── Academic/
        ├── Models/Nilai.php
        ├── Services/NilaiService.php
        ├── Controllers/NilaiController.php
        ├── Requests/StoreNilaiRequest.php
        ├── Resources/NilaiResource.php
        └── Routes/academic.php
```

### Commands Run

```bash
# 1. Create directories
mkdir -p app/Modules/Academic/{Models,Services,Controllers,Requests,Resources,Routes}

# 2. Move model
mv app/Models/Nilai.php app/Modules/Academic/Models/

# 3. Update namespace in Nilai.php
# From: namespace App\Models;
# To:   namespace App\Modules\Academic\Models;

# 4. Create service
touch app/Modules/Academic/Services/NilaiService.php

# 5. Create route file
touch app/Modules/Academic/Routes/academic.php

# 6. Reload autoload
composer dump-autoload

# 7. Test
php artisan test --filter=NilaiTest
```

---

## ✅ Summary

| Aspect      | Old Structure           | New Structure                       | Status        |
| ----------- | ----------------------- | ----------------------------------- | ------------- |
| Controllers | `app/Http/Controllers/` | `app/Modules/{Module}/Controllers/` | ✅ Both work  |
| Models      | `app/Models/`           | `app/Modules/{Module}/Models/`      | ✅ Both work  |
| Services    | No service layer        | `app/Modules/{Module}/Services/`    | ✅ New only   |
| Routes      | `routes/web.php`        | `app/Modules/{Module}/Routes/`      | ✅ Both work  |
| Middleware  | Inline                  | `CheckInstitutionType`              | ✅ Registered |
| Traits      | No shared traits        | `app/Shared/Traits/`                | ✅ Available  |
| Enums       | No enums                | `app/Shared/Enums/`                 | ✅ Available  |

---

## 🎯 Next Steps

1. **✅ Struktur sudah siap** - Gunakan untuk modul baru
2. **📝 Buat modul baru** - Ikuti template yang sudah ada
3. **🔄 Migrate gradually** - Pindahkan modul lama saat ada update
4. **🧪 Test thoroughly** - Pastikan no breaking changes
5. **📖 Update docs** - Keep documentation current

---

**Catatan:** Tidak ada pressure untuk migrate semua sekaligus! Gunakan struktur baru untuk fitur baru, dan migrate existing code secara bertahap ketika ada opportunity (bug fix, enhancement, dll).

---

## 📞 Support

Jika ada pertanyaan tentang migrasi:

1. Check ARCHITECTURE_GUIDE.md untuk best practices
2. Check EXAMPLE_MODULE_IMPLEMENTATION.md untuk contoh lengkap
3. Review existing modular code di `app/Modules/`

**Happy Coding! 🚀**
