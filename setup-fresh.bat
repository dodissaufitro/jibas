@echo off
REM ====================================================================
REM Fresh Database Setup - JIBAS
REM ====================================================================
REM Script ini akan:
REM 1. Drop semua tabel
REM 2. Jalankan migration
REM 3. Jalankan seeder
REM
REM PERINGATAN: Semua data akan HILANG!
REM ====================================================================

echo.
echo ========================================
echo   JIBAS - Fresh Database Setup
echo ========================================
echo.
echo PERINGATAN: Script ini akan MENGHAPUS semua data!
echo.
set /p confirm="Apakah Anda yakin? (yes/no): "

if /i not "%confirm%"=="yes" (
    echo.
    echo Setup dibatalkan.
    echo.
    pause
    exit /b
)

echo.
echo [1/3] Dropping all tables...
echo ----------------------------------------
php artisan db:wipe

echo.
echo [2/3] Running migrations...
echo ----------------------------------------
php artisan migrate

echo.
echo [3/3] Seeding database...
echo ----------------------------------------
php artisan db:seed

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Default Login Credentials:
echo.
echo   Super Admin:
echo   Email: admin@jibas.com
echo   Password: password123
echo.
echo   Admin Sekolah:
echo   Email: admin.sekolah@jibas.com
echo   Password: password123
echo.
echo   Guru:
echo   Email: guru@jibas.com
echo   Password: password123
echo.
echo   Siswa:
echo   Email: siswa@jibas.com
echo   Password: password123
echo.
echo ========================================
echo.
pause
