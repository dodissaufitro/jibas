## 🔐 Automated Backup System

### Setup Complete

Sistem backup otomatis telah diimplementasikan dengan commands berikut:

### Commands

```bash
# Backup database
php artisan backup:database --compress --keep-days=30

# Backup files (uploads, configs)
php artisan backup:files --keep-days=30

# Backup files with vendor directory
php artisan backup:files --keep-days=30 --include-vendor
```

### Scheduled Backups (Setup di Kernel.php)

Tambahkan ke `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule): void
{
    // Daily database backup at 2 AM
    $schedule->command('backup:database --compress --keep-days=30')
             ->dailyAt('02:00')
             ->onFailure(function () {
                 // Send notification on failure
             });

    // Weekly files backup on Sunday at 3 AM
    $schedule->command('backup:files --keep-days=30')
             ->weekly()
             ->sundays()
             ->at('03:00')
             ->onFailure(function () {
                 // Send notification on failure
             });
}
```

### Backup Locations

- Database backups: `storage/app/backups/database/`
- Files backups: `storage/app/backups/files/`

### Automatic Cleanup

Backups older than specified `--keep-days` (default: 30) are automatically deleted.

### Features

✅ Database backup with mysqldump
✅ Compression support
✅ Files backup (uploads, configs)
✅ Automatic old backup cleanup
✅ Activity logging
✅ Configurable retention period

### Restore Instructions

**Restore Database:**

```bash
# Extract if compressed
unzip backup_jibas_2026-04-04_02-00-00.sql.zip

# Restore
mysql -u username -p database_name < backup_jibas_2026-04-04_02-00-00.sql
```

**Restore Files:**

```bash
# Extract zip to project root
unzip backup_files_2026-04-04_03-00-00.zip -d /path/to/project
```

### Cloud Backup (Optional)

Untuk backup ke cloud storage (AWS S3, Google Cloud, etc), tambahkan:

```php
// After creating backup
Storage::cloud()->put(
    'backups/' . $filename,
    file_get_contents($filepath)
);
```

### Monitoring

Semua backup events dicatat di activity_logs dengan severity info/critical untuk monitoring.
