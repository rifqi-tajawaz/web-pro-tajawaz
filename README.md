# Tajawaz Solutions - Deployment Guide

This repository contains the production-ready source code for **Tajawaz Solutions**.

## 1. Server Requirements

To host this project, you need a web server that supports:
-   **Apache 2.4+** (for `.htaccess` rules) or Nginx (requires conversion of rules).
-   **PHP 7.4+** (for contact form, newsletter, and security headers).
-   **HTTPS** (Required for PWA Service Worker).

### Recommended `php.ini` Settings
```ini
display_errors = Off
log_errors = On
error_reporting = E_ALL
memory_limit = 128M
session.cookie_secure = 1
session.cookie_httponly = 1
session.cookie_samesite = Strict
```

## 2. Installation Steps

1.  **Upload Files:** Upload all files from the root directory to your `public_html` or web root.
2.  **Environment Configuration:**
    -   The project uses `api/config.php` for security settings.
    -   Update `api/form-process.php` with the actual email address where you want to receive inquiries.
3.  **Permissions:**
    -   Ensure `api/` directory is executable.
    -   Ensure log files (if any) are writable by the web server.

## 3. Configuration Details

### Clean URLs
The project is configured to use Clean URLs (e.g., `/about` instead of `/about.html`). This is handled by the `.htaccess` file.

### Security
-   **CSRF Protection:** Implemented in `api/csrf.php` and `api/config.php`.
-   **Headers:** Security headers (CSP, HSTS, X-Frame-Options) are enforced via `.htaccess` and PHP.
-   **Input Validation:** All forms use strict server-side validation.

### PWA (Progressive Web App)
-   **Service Worker:** Located at `/sw.js`. It caches critical assets and HTML pages for offline access.
-   **Manifest:** `/manifest.json` defines the app's appearance and behavior.
-   **Icons:** Located in `assets/images/favicon/`.

## 4. Maintenance

-   **Sitemap:** The sitemap is located at `/sitemap.xml`. Update it if you add new pages.
-   **Robots:** `/robots.txt` controls crawler access.

## 5. Troubleshooting

-   **404 on Inner Pages:** Ensure `mod_rewrite` is enabled on your Apache server.
-   **Form Not Sending:** Check your server's `mail()` function configuration or SMTP settings.
-   **PWA Not Installing:** Ensure the site is served over HTTPS.

## 6. Directory Structure
```
/
├── api/                # PHP Backend (Forms, CSRF)
├── assets/             # Static Assets (CSS, JS, Images)
├── components/         # HTML Partials (Header, Footer)
├── pages/              # HTML Pages
├── pwa/                # PWA Specifics (Offline page)
├── errors/             # Custom Error Pages
├── .htaccess           # Apache Config
├── sw.js               # Service Worker
└── index.html          # Homepage
```

---
*Generated for Tajawaz Solutions Production Deployment*
