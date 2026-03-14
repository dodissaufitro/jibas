@echo off
REM ###########################################################################
REM JIBAS - Complete Database Setup Script (Windows)
REM ###########################################################################
REM This script will:
REM 1. Drop all tables (fresh migration)
REM 2. Run all migrations
REM 3. Seed all data
REM
REM USAGE:
REM   Double-click this file or run: setup-database.bat
REM
REM IMPORTANT: This will DELETE ALL DATA in the database!
REM ###########################################################################

color 0A
cls

echo.
echo ========================================================================
echo                   JIBAS Database Setup Script
echo ========================================================================
echo.

color 0C
echo WARNING: This will DELETE ALL DATA in your database!
color 0A
echo.

set /p confirm="Are you sure you want to continue? (yes/no): "

if /i NOT "%confirm%"=="yes" (
    echo.
    echo Setup cancelled.
    pause
    exit /b 0
)

echo.
echo Starting database setup...
echo.

REM Step 1: Clear cache and config
echo [1/4] Clearing cache and configuration...
call php artisan cache:clear
call php artisan config:clear
call php artisan route:clear
call php artisan view:clear
echo [DONE] Cache cleared
echo.

REM Step 2: Drop all tables and run fresh migrations
echo [2/4] Running fresh migrations...
call php artisan migrate:fresh
if errorlevel 1 (
    color 0C
    echo.
    echo ERROR: Migration failed!
    echo.
    pause
    exit /b 1
)
echo [DONE] Migrations completed
echo.

REM Step 3: Run all seeders
echo [3/4] Seeding database...
call php artisan db:seed
if errorlevel 1 (
    color 0C
    echo.
    echo ERROR: Seeding failed!
    echo.
    pause
    exit /b 1
)
echo [DONE] Database seeded
echo.

REM Step 4: Optimize application
echo [4/4] Optimizing application...
call php artisan config:cache
call php artisan route:cache
call php artisan view:cache
echo [DONE] Application optimized
echo.

echo ========================================================================
echo            Database Setup Completed Successfully!
echo ========================================================================
echo.
echo Your JIBAS application is ready to use!
echo.
echo Default accounts:
echo   * Super Admin: admin@jibas.com / password123
echo   * Guru: guru@jibas.com / password123
echo   * Guru (Single Class): guru.kelas7a@jibas.com / password123
echo.
echo WARNING: Don't forget to change default passwords in production!
echo.

pause
