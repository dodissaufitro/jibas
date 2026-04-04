#!/bin/bash
# ====================================================================
# Fresh Database Setup - JIBAS
# ====================================================================
# Script ini akan:
# 1. Drop semua tabel
# 2. Jalankan migration
# 3. Jalankan seeder
#
# PERINGATAN: Semua data akan HILANG!
# ====================================================================

echo ""
echo "========================================"
echo "  JIBAS - Fresh Database Setup"
echo "========================================"
echo ""
echo "PERINGATAN: Script ini akan MENGHAPUS semua data!"
echo ""
read -p "Apakah Anda yakin? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo ""
    echo "Setup dibatalkan."
    echo ""
    exit 1
fi

echo ""
echo "[1/3] Dropping all tables..."
echo "----------------------------------------"
php artisan db:wipe

echo ""
echo "[2/3] Running migrations..."
echo "----------------------------------------"
php artisan migrate

echo ""
echo "[3/3] Seeding database..."
echo "----------------------------------------"
php artisan db:seed

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Default Login Credentials:"
echo ""
echo "  Super Admin:"
echo "  Email: admin@jibas.com"
echo "  Password: password123"
echo ""
echo "  Admin Sekolah:"
echo "  Email: admin.sekolah@jibas.com"
echo "  Password: password123"
echo ""
echo "  Guru:"
echo "  Email: guru@jibas.com"
echo "  Password: password123"
echo ""
echo "  Siswa:"
echo "  Email: siswa@jibas.com"
echo "  Password: password123"
echo ""
echo "========================================"
echo ""
