@echo off
REM ====================================================================
REM Seed Only - JIBAS
REM ====================================================================
REM Jalankan seeder saja tanpa migration
REM ====================================================================

echo.
echo ========================================
echo   JIBAS - Database Seeding Only
echo ========================================
echo.

php artisan db:seed

echo.
echo ========================================
echo   Seeding Complete!
echo ========================================
echo.
pause
