# JIBAS Deployment Checklist

Checklist lengkap untuk deployment JIBAS ke production server.

---

## 📋 Pre-Deployment Checklist

### 1. Server Requirements

- [ ] PHP 8.1 or higher
- [ ] MySQL 5.7+ atau MariaDB 10.3+
- [ ] Composer installed
- [ ] Node.js & NPM installed
- [ ] Apache/Nginx web server
- [ ] SSL Certificate (recommended)

### 2. Server Configuration

- [ ] Domain/subdomain configured
- [ ] DNS records pointing to server
- [ ] Firewall configured (ports 80, 443)
- [ ] SSH access configured

---

## 🚀 Deployment Steps

### Step 1: Upload Files to Server

```bash
# Via Git (Recommended)
cd /var/www/
git clone <repository-url> jibas
cd jibas

# Via FTP/SFTP
# Upload all files except:
# - node_modules/
# - vendor/
# - .env (create new on server)
```

### Step 2: Set Directory Permissions

```bash
# Set owner
sudo chown -R www-data:www-data /var/www/jibas

# Set permissions
sudo find /var/www/jibas -type f -exec chmod 644 {} \;
sudo find /var/www/jibas -type d -exec chmod 755 {} \;

# Set writable directories
sudo chmod -R 775 /var/www/jibas/storage
sudo chmod -R 775 /var/www/jibas/bootstrap/cache

# Make scripts executable
chmod +x /var/www/jibas/setup-database.sh
```

### Step 3: Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Edit .env file
nano .env
```

#### Required .env Configuration:

```env
# Application
APP_NAME="JIBAS"
APP_ENV=production
APP_KEY=                    # Will generate in next step
APP_DEBUG=false             # IMPORTANT: Set to false!
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_password

# Mail (Configure if needed)
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

# Session & Cache
SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

### Step 4: Install Dependencies

```bash
# Composer (production mode)
composer install --no-dev --optimize-autoloader

# NPM
npm install --production
npm run build
```

### Step 5: Generate Application Key

```bash
php artisan key:generate
```

### Step 6: Setup Database

```bash
# Method 1: Using custom command (Recommended)
php artisan jibas:setup --fresh

# Method 2: Using bash script
./setup-database.sh

# Method 3: Manual
php artisan migrate --force
php artisan db:seed --force
```

### Step 7: Optimize Application

```bash
# Clear and cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize composer autoloader
composer dump-autoload --optimize
```

### Step 8: Configure Web Server

#### For Apache:

```bash
# Create virtual host
sudo nano /etc/apache2/sites-available/jibas.conf
```

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    DocumentRoot /var/www/jibas/public

    <Directory /var/www/jibas/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/jibas-error.log
    CustomLog ${APACHE_LOG_DIR}/jibas-access.log combined
</VirtualHost>
```

```bash
# Enable site and rewrite module
sudo a2ensite jibas.conf
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### For Nginx:

```bash
# Create site configuration
sudo nano /etc/nginx/sites-available/jibas
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/jibas/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/jibas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Setup SSL Certificate (Recommended)

```bash
# Using Let's Encrypt (Free)
sudo apt install certbot python3-certbot-apache  # For Apache
# OR
sudo apt install certbot python3-certbot-nginx   # For Nginx

# Generate certificate
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com  # Apache
# OR
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com   # Nginx

# Auto-renewal is enabled by default
# Test renewal:
sudo certbot renew --dry-run
```

### Step 10: Setup Task Scheduler (Optional)

If you're using Laravel scheduler:

```bash
# Edit crontab
crontab -e

# Add this line:
* * * * * cd /var/www/jibas && php artisan schedule:run >> /dev/null 2>&1
```

### Step 11: Setup Queue Worker (Optional)

If you're using queues:

```bash
# Install supervisor
sudo apt install supervisor

# Create supervisor config
sudo nano /etc/supervisor/conf.d/jibas-worker.conf
```

```ini
[program:jibas-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/jibas/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/jibas/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
# Update supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start jibas-worker:*
```

---

## ✅ Post-Deployment Verification

### 1. Check Website Access

- [ ] Visit https://yourdomain.com
- [ ] Homepage loads correctly
- [ ] No error messages visible
- [ ] Assets (CSS/JS) loading properly

### 2. Test Login

- [ ] Login with super admin: admin@jibas.com / password123
- [ ] Dashboard loads correctly
- [ ] Can access all menu items
- [ ] **CHANGE DEFAULT PASSWORD IMMEDIATELY!**

### 3. Test Core Features

- [ ] Create new user
- [ ] Add guru data
- [ ] Add siswa data
- [ ] Test presensi feature
- [ ] Test other modules

### 4. Check Logs

```bash
# View Laravel logs
tail -f /var/www/jibas/storage/logs/laravel.log

# View web server logs
tail -f /var/log/apache2/jibas-error.log  # Apache
tail -f /var/log/nginx/error.log          # Nginx
```

### 5. Performance Check

- [ ] Page load time < 3 seconds
- [ ] No 500 errors
- [ ] No console errors
- [ ] Images loading properly

---

## 🔐 Security Checklist

### Essential Security Steps

- [ ] **Change all default passwords**
- [ ] APP_DEBUG=false in .env
- [ ] Strong APP_KEY generated
- [ ] Database user has limited permissions
- [ ] SSL certificate installed and working
- [ ] Remove .git directory from public access
- [ ] Disable directory listing
- [ ] Configure firewall (UFW/firewalld)
- [ ] Set up regular backups
- [ ] Keep system packages updated

### Additional Security (Recommended)

```bash
# Remove .git from public access (if using git)
sudo rm -rf /var/www/jibas/.git  # After deployment

# Or protect it via .htaccess (Apache):
# Add to public/.htaccess:
```

```apache
<DirectoryMatch "^/.*/\.git/">
    Require all denied
</DirectoryMatch>
```

### File Permissions Security

```bash
# Ensure proper permissions
sudo chown -R www-data:www-data /var/www/jibas
sudo chmod -R 755 /var/www/jibas
sudo chmod -R 775 /var/www/jibas/storage
sudo chmod -R 775 /var/www/jibas/bootstrap/cache
sudo chmod 644 /var/www/jibas/.env
```

---

## 💾 Backup Strategy

### Database Backup

```bash
# Manual backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backup (add to crontab)
0 2 * * * mysqldump -u username -p'password' database_name | gzip > /backups/jibas_$(date +\%Y\%m\%d).sql.gz
```

### File Backup

```bash
# Backup entire application
tar -czf jibas_backup_$(date +%Y%m%d).tar.gz /var/www/jibas

# Backup only storage & .env
tar -czf jibas_data_$(date +%Y%m%d).tar.gz /var/www/jibas/storage /var/www/jibas/.env
```

---

## 🔄 Update Deployment

When deploying updates:

```bash
# 1. Backup first!
mysqldump -u username -p database_name > backup_before_update.sql

# 2. Pull latest code (if using git)
cd /var/www/jibas
git pull origin main

# 3. Update dependencies
composer install --no-dev --optimize-autoloader
npm install --production
npm run build

# 4. Run migrations (if any)
php artisan migrate --force

# 5. Clear and cache
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Restart services if needed
sudo systemctl restart apache2  # or nginx
sudo supervisorctl restart jibas-worker:*  # if using queue
```

---

## 🐛 Troubleshooting Common Issues

### 500 Internal Server Error

```bash
# Check logs
tail -f storage/logs/laravel.log

# Common fixes:
chmod -R 775 storage bootstrap/cache
php artisan cache:clear
composer dump-autoload
```

### Database Connection Error

```bash
# Check credentials in .env
# Test connection
php artisan tinker
>>> DB::connection()->getPdo();
```

### Permission Denied Errors

```bash
sudo chown -R www-data:www-data /var/www/jibas
chmod -R 775 storage bootstrap/cache
```

### Assets Not Loading (404)

```bash
# Rebuild assets
npm run build

# Check public directory permissions
ls -la public/

# Verify web server document root
```

---

## 📞 Support & Resources

- Documentation: DATABASE_SETUP.md
- Quick Reference: SETUP_QUICK_REF.txt
- Laravel Docs: https://laravel.com/docs
- Inertia.js Docs: https://inertiajs.com

---

**Last Updated:** March 15, 2026
**Version:** 1.0

✅ **Deployment Complete!**

**Next Steps:**

1. Change all default passwords
2. Configure email settings
3. Setup regular backups
4. Monitor logs regularly
5. Test all features thoroughly

Good luck! 🚀
