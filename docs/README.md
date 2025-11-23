# Tajawaz Solutions - Production Deployment Guide

## 🚀 Overview

Tajawaz Solutions adalah ekosistem bisnis lengkap Indonesia yang menyediakan mentorship praktis, tools bisnis, peluang kemitraan, dan komunitas entrepreneur.

**Website:** https://www.tajawaz.my.id

---

## 📚 Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Deployment](#deployment)
5. [Security](#security)
6. [PWA Features](#pwa-features)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

---

## 💻 Requirements

### Server Requirements

- **Web Server:** Apache 2.4+ with mod_rewrite enabled
- **PHP:** 7.4+ or 8.0+
- **PHP Extensions:**
  - `json`
  - `session`
  - `filter`
  - `mbstring`
- **HTTPS:** SSL/TLS certificate (required for PWA)
- **Disk Space:** 100MB minimum

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

---

## 📦 Installation

### Step 1: Upload Files

```bash
# Upload all files to your web server
# Ensure proper permissions
chmod 755 /path/to/app
chmod 644 /path/to/app/.htaccess
chmod 644 /path/to/app/index.html
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

**Key settings to configure:**
- `CONTACT_EMAIL`: Your email for receiving contact forms
- `APP_URL`: Your production domain
- `GOOGLE_ANALYTICS_ID`: Your GA tracking ID

### Step 3: Verify Apache Modules

```bash
# Check if mod_rewrite is enabled
apache2ctl -M | grep rewrite

# Enable if not active
a2enmod rewrite
a2enmod headers
a2enmod deflate
a2enmod expires

# Restart Apache
systemctl restart apache2
```

### Step 4: SSL Certificate

```bash
# Using Let's Encrypt (recommended)
sudo certbot --apache -d www.tajawaz.my.id

# Or use your SSL provider's instructions
```

---

## ⚙️ Configuration

### .htaccess Settings

The `.htaccess` file is pre-configured with:

1. **Security Headers**
   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-XSS-Protection
   - HSTS (Strict-Transport-Security)

2. **Clean URLs**
   - Removes `.html` extensions
   - SEO-friendly URLs

3. **Performance**
   - GZIP compression
   - Browser caching
   - Asset expiration

4. **Error Pages**
   - Custom 403, 404, 500, 503 pages

### PHP Configuration

Recommended `php.ini` settings:

```ini
error_reporting = E_ALL
display_errors = Off
log_errors = On
error_log = /var/log/php/errors.log

session.cookie_httponly = 1
session.use_only_cookies = 1
session.cookie_samesite = "Strict"
session.cookie_secure = 1

upload_max_filesize = 10M
post_max_size = 10M
memory_limit = 128M
max_execution_time = 30
```

---

## 🚀 Deployment

### Production Checklist

- [x] Remove all `console.log` statements
- [x] Set `DEBUG_MODE=false` in `.env`
- [x] Configure SMTP for emails
- [x] Test all forms (contact, newsletter)
- [x] Verify SSL certificate
- [x] Test PWA installation
- [x] Verify all internal links
- [x] Test error pages (403, 404, 500)
- [x] Configure backup system
- [x] Set up monitoring

### Deployment Steps

1. **Upload Files**
   ```bash
   rsync -avz --exclude '.git' ./ user@server:/var/www/html/
   ```

2. **Set Permissions**
   ```bash
   sudo chown -R www-data:www-data /var/www/html
   sudo find /var/www/html -type d -exec chmod 755 {} \;
   sudo find /var/www/html -type f -exec chmod 644 {} \;
   ```

3. **Configure Virtual Host**
   ```apache
   <VirtualHost *:80>
       ServerName www.tajawaz.my.id
       DocumentRoot /var/www/html
       
       <Directory /var/www/html>
           Options -Indexes +FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
       
       ErrorLog ${APACHE_LOG_DIR}/tajawaz-error.log
       CustomLog ${APACHE_LOG_DIR}/tajawaz-access.log combined
   </VirtualHost>
   ```

4. **Test Configuration**
   ```bash
   sudo apache2ctl configtest
   sudo systemctl reload apache2
   ```

---

## 🔒 Security

### Implemented Security Features

1. **Input Validation & Sanitization**
   - All form inputs sanitized using `FILTER_SANITIZE_SPECIAL_CHARS`
   - Email validation with `FILTER_VALIDATE_EMAIL`
   - XSS protection via htmlspecialchars

2. **CSRF Protection**
   - Token-based CSRF protection for all forms
   - Session-based token validation

3. **SQL Injection Prevention**
   - Prepared statements (PDO) ready for database operations
   - No direct SQL concatenation

4. **Session Security**
   - HttpOnly cookies
   - Secure flag (HTTPS)
   - SameSite=Strict

5. **Security Headers**
   - CSP (Content Security Policy)
   - HSTS (HTTP Strict Transport Security)
   - X-Frame-Options: SAMEORIGIN
   - X-XSS-Protection: 1; mode=block
   - X-Content-Type-Options: nosniff

### Security Best Practices

```bash
# Disable directory listing
Options -Indexes

# Protect sensitive files
<FilesMatch "\.(env|log|bak|old)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Hide PHP version
Header unset X-Powered-By
```

---

## 📱 PWA Features

### Installation

The PWA is installable on:
- Desktop (Chrome, Edge, Safari)
- Mobile (Android, iOS)

**Install Prompt:**
- Automatic prompt after 3 seconds
- Dismissible for 7 days
- Manual installation via browser menu

### Offline Capability

**Cached Assets:**
- All HTML pages
- CSS stylesheets
- JavaScript files
- Essential images
- Favicons

**Caching Strategy:**
- HTML: Network First
- Assets: Stale-While-Revalidate
- API calls: Network Only

### Service Worker

**Version:** v4.3.2

**Features:**
- Automatic cache cleanup on update
- Background sync support
- Update notifications
- Network status detection

**Manual Cache Clear:**
```javascript
// In browser console
window.pwaManager.clearAllCaches()
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Clean URLs Not Working

**Symptom:** `/pages/about` returns 404

**Solution:**
```bash
# Enable mod_rewrite
sudo a2enmod rewrite

# Check AllowOverride in Apache config
# Should be "AllowOverride All"

# Restart Apache
sudo systemctl restart apache2
```

#### 2. HTTPS Redirect Loop

**Symptom:** Infinite redirect on HTTPS

**Solution:**
Comment out HTTPS redirect in `.htaccess` if behind a proxy:
```apache
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

#### 3. Form Submissions Failing

**Symptom:** Contact form returns CSRF error

**Solution:**
```bash
# Check session directory permissions
ls -la /var/lib/php/sessions
sudo chmod 1733 /var/lib/php/sessions

# Verify session in php.ini
grep session.save_path /etc/php/*/apache2/php.ini
```

#### 4. PWA Not Installing

**Symptom:** No install prompt appears

**Solution:**
- Verify HTTPS is active
- Check `manifest.json` is accessible
- Verify service worker registration in DevTools
- Clear browser cache

#### 5. Email Not Sending

**Symptom:** Forms submit but no email received

**Solution:**
```bash
# Test PHP mail function
php -r "mail('test@example.com', 'Test', 'Body');"

# Check mail logs
sudo tail -f /var/log/mail.log

# Configure SMTP in api/form-process.php
```

---

## 🛠️ Maintenance

### Regular Tasks

#### Daily
- Monitor error logs
- Check form submissions
- Verify website accessibility

#### Weekly
- Review security headers
- Check SSL certificate expiry
- Test backup restoration

#### Monthly
- Update dependencies
- Review analytics
- Security audit

### Backup Procedure

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backups/tajawaz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup files
tar -czf $BACKUP_DIR/files-$DATE.tar.gz /var/www/html

# Backup database (if applicable)
# mysqldump -u user -p tajawaz_db > $BACKUP_DIR/db-$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

### Update Procedure

1. **Create Backup**
   ```bash
   ./backup.sh
   ```

2. **Pull Latest Changes**
   ```bash
   git pull origin main
   ```

3. **Clear Cache**
   ```bash
   # Update service worker version in sw.js
   # Increment CACHE_VERSION
   ```

4. **Test Changes**
   ```bash
   # Test on staging first
   # Verify all functionality
   ```

5. **Deploy to Production**
   ```bash
   rsync -avz ./ user@server:/var/www/html/
   ```

---

## 📊 Performance Optimization

### Current Optimizations

1. **GZIP Compression** - Enabled for all text resources
2. **Browser Caching** - 1 year for static assets
3. **Image Optimization** - Lazy loading implemented
4. **Minification** - CSS/JS minified (use build tools)
5. **CDN** - Consider CloudFlare for global distribution

### Lighthouse Targets

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+
- PWA: 100

---

## 📞 Support

**Website:** https://www.tajawaz.my.id

**Email:** hello@markoagency.com

**Documentation:** This README.md

---

## 📝 License

© 2025 Tajawaz Solutions. All rights reserved.

---

**Last Updated:** 2025-01-20

**Version:** 1.0.0 (Production Ready)
