#!/bin/bash

###############################################################################
# JIBAS - Complete Database Setup Script
###############################################################################
# This script will:
# 1. Drop all tables (fresh migration)
# 2. Run all migrations
# 3. Seed all data
#
# USAGE:
#   chmod +x setup-database.sh
#   ./setup-database.sh
#
# IMPORTANT: This will DELETE ALL DATA in the database!
###############################################################################

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  JIBAS Database Setup Script                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Warning
echo -e "${RED}⚠️  WARNING: This will DELETE ALL DATA in your database!${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}Setup cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Starting database setup...${NC}"
echo ""

# Step 1: Clear cache and config
echo -e "${YELLOW}[1/4]${NC} Clearing cache and configuration..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo -e "${GREEN}✓${NC} Cache cleared"
echo ""

# Step 2: Drop all tables and run fresh migrations
echo -e "${YELLOW}[2/4]${NC} Running fresh migrations..."
php artisan migrate:fresh --force
echo -e "${GREEN}✓${NC} Migrations completed"
echo ""

# Step 3: Run all seeders
echo -e "${YELLOW}[3/4]${NC} Seeding database..."
php artisan db:seed --force
echo -e "${GREEN}✓${NC} Database seeded"
echo ""

# Step 4: Optimize application
echo -e "${YELLOW}[4/4]${NC} Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo -e "${GREEN}✓${NC} Application optimized"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              ✅ Database Setup Completed Successfully!          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Your JIBAS application is ready to use!${NC}"
echo ""
echo "Default accounts:"
echo "  • Super Admin: admin@jibas.com / password123"
echo "  • Guru: guru@jibas.com / password123"
echo "  • Guru (Single Class): guru.kelas7a@jibas.com / password123"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to change default passwords in production!${NC}"
echo ""
