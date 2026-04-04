@echo off
REM ====================================================================
REM Migrate + Seed (Fresh) - JIBAS
REM ====================================================================
REM Quick command untuk migrate:fresh --seed
REM ====================================================================

echo.
echo ========================================
echo   JIBAS - Migrate Fresh + Seed
echo ========================================
echo.
echo PERINGATAN: Ini akan menghapus semua data!
echo.
set /p confirm="Lanjutkan? (yes/no): "

if /i not "%confirm%"=="yes" (
    echo.
    echo Dibatalkan.
    pause
    exit /b
)

echo.
echo Running: php artisan migrate:fresh --seed
echo.

php artisan migrate:fresh --seed

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
echo Login credentials:
echo   Email: admin@jibas.com
echo   Password: password123
echo.
pause
