# 📁 STRUCTURE DOCUMENTATION
## Tajawaz Solutions - Enterprise File Organization

**Version:** 2.0.0 (Enterprise Architecture)  
**Last Updated:** 2025-01-20  
**Total Files:** 178+  
**Organization:** Professional, Scalable, Maintainable

---

## 📊 Overview

This document provides comprehensive details about the enterprise-grade file structure of Tajawaz Solutions website.

### Key Improvements

✅ **Enterprise Organization**  
✅ **Clear Separation of Concerns**  
✅ **Scalable Architecture**  
✅ **Professional Standards**  
✅ **Build System Ready**  
✅ **Deployment Optimized**  

---

## 🏗️ Directory Tree

### Complete Structure

```
tajawaz-solutions/
│
├── src/                          ← SOURCE FILES (Development)
│   │
│   ├── pages/                    ← HTML Pages (14 files)
│   │   ├── about.html
│   │   ├── bio-profile.html
│   │   ├── blog.html
│   │   ├── case-studies.html
│   │   ├── contact.html
│   │   ├── faq.html
│   │   ├── partnership.html
│   │   ├── pricing.html
│   │   ├── products-digital.html
│   │   ├── search.html
│   │   ├── services.html
│   │   ├── single-post.html
│   │   ├── single-services.html
│   │   └── team.html
│   │
│   ├── components/               ← Reusable Components (4 files)
│   │   ├── header.html           ← Navigation bar
│   │   ├── footer.html           ← Footer section
│   │   ├── sidebar.html          ← Sidebar menu
│   │   └── search-form.html      ← Search component
│   │
│   ├── templates/                ← Template Partials (Future)
│   │   ├── hero-section.html
│   │   ├── cta-section.html
│   │   └── testimonial-card.html
│   │
│   └── assets/                   ← Source Assets
│       │
│       ├── css/
│       │   ├── main/             ← Custom Styles (4 files)
│       │   │   ├── style.css          (133KB) Main stylesheet
│       │   │   ├── critical-inline.css (1.9KB) Critical CSS
│       │   │   ├── products-digital.css (4.6KB)
│       │   │   └── pwa-styles.css      (6.3KB)
│       │   │
│       │   └── vendor/           ← Third-party CSS (23 files)
│       │       ├── bootstrap.min.css  (232KB)
│       │       ├── animate.min.css    (72KB)
│       │       ├── fontawesome.min.css (81KB)
│       │       ├── swiper-bundle.min.css
│       │       └── ... (more vendor CSS)
│       │
│       ├── js/
│       │   ├── main/             ← Custom Scripts (10 files)
│       │   │   ├── script.js          Main application logic
│       │   │   ├── base-url.js        Base URL config
│       │   │   ├── submit-form.js     Form handling
│       │   │   ├── themeswitch.js     Theme switcher
│       │   │   ├── swiper-script.js   Slider init
│       │   │   ├── video-embed.js     Video handling
│       │   │   ├── whatsapp-contact.js WhatsApp integration
│       │   │   ├── products-catalog.js Product logic
│       │   │   ├── products-data.js   Product data
│       │   │   └── video-embedded.js  Embedded video
│       │   │
│       │   └── vendor/           ← Third-party JS (20 files)
│       │       ├── jquery.min.js      (86KB)
│       │       ├── bootstrap.bundle.min.js (79KB)
│       │       ├── swiper-bundle.min.js (133KB)
│       │       ├── fslightbox.js
│       │       ├── isotope.pkgd.min.js
│       │       └── ... (more vendor JS)
│       │
│       ├── images/               ← Images & Graphics (74 files)
│       │   ├── backgrounds/
│       │   ├── favicon/          ← PWA icons (11 files)
│       │   ├── icons/            ← UI icons (14 files)
│       │   ├── illustrations/    ← SVG graphics
│       │   ├── logos/
│       │   │   ├── brand/        ← Tajawaz logos
│       │   │   └── partnership/  ← Client logos
│       │   ├── placeholders/     ← Dummy images
│       │   ├── products/         ← Product images
│       │   └── team/             ← Team photos
│       │
│       ├── fonts/                ← Web Fonts (16 files)
│       │   ├── fa-brands-400.woff2
│       │   ├── fa-regular-400.woff2
│       │   ├── fa-solid-900.woff2
│       │   └── fontawesome/
│       │
│       └── data/                 ← JSON Data
│           └── search-index.json
│
├── public/                       ← PUBLIC ROOT (Deployment Target)
│   │
│   ├── assets/                   ← Compiled Assets
│   │   ├── css/                  (27 files, ~1.2MB)
│   │   ├── js/                   (30 files, ~800KB)
│   │   ├── images/               (74 files, ~5-10MB)
│   │   ├── fonts/                (16 files, ~1.2MB)
│   │   └── data/                 (1 file)
│   │
│   ├── pages/                    ← HTML Pages
│   │   └── ... (same as src/pages/)
│   │
│   ├── components/               ← Component HTML
│   │   └── ... (same as src/components/)
│   │
│   ├── errors/                   ← Error Pages (4 files)
│   │   ├── 403.html              Forbidden
│   │   ├── 404.html              Not Found
│   │   ├── 500.html              Server Error
│   │   └── 503.html              Service Unavailable
│   │
│   ├── pwa/                      ← PWA Assets
│   │   ├── pwa-manager.js
│   │   ├── offline.html
│   │   ├── screenshot-desktop.jpg
│   │   └── screenshot-mobile.jpg
│   │
│   ├── api/                      ← API Endpoints (symlinks)
│   │   ├── form-process.php
│   │   └── newsletter-process.php
│   │
│   ├── index.html                ← Homepage
│   ├── manifest.json             ← PWA Manifest
│   ├── sw.js                     ← Service Worker
│   ├── sitemap.xml               ← SEO Sitemap
│   ├── robots.txt                ← Crawler Rules
│   ├── browserconfig.xml         ← Browser Config
│   └── build-manifest.json       ← Build Info
│
├── api/                          ← BACKEND API
│   │
│   ├── controllers/              ← API Controllers
│   │   ├── form-process.php      Contact form handler
│   │   └── newsletter-process.php Newsletter handler
│   │
│   ├── middleware/               ← Middleware Functions
│   │   └── csrf.php              CSRF protection
│   │
│   ├── config/                   ← Configuration
│   │   └── config.php            App config
│   │
│   └── utils/                    ← Utility Functions
│       ├── email-sender.php
│       └── validators.php
│
├── config/                       ← CONFIGURATION FILES
│   ├── .htaccess                 Apache configuration
│   ├── nginx.conf                Nginx configuration
│   └── environment.example       Environment template
│
├── docs/                         ← DOCUMENTATION
│   ├── ARCHITECTURE.md           System architecture
│   ├── DEPLOYMENT.md             Deployment guide
│   ├── API.md                    API documentation
│   └── STRUCTURE.md              This file
│
├── scripts/                      ← AUTOMATION SCRIPTS
│   ├── build.sh                  Build automation
│   ├── deploy.sh                 Deployment script
│   ├── optimize.sh               Asset optimization
│   └── validate.sh               Structure validation
│
├── tests/                        ← TESTING (Future)
│   ├── unit/                     Unit tests
│   │   ├── api/
│   │   └── utils/
│   │
│   └── integration/              Integration tests
│       ├── forms/
│       └── workflows/
│
├── .gitignore                    Git ignore rules
├── README.md                     Project overview
└── package.json                  NPM config (if needed)
```

---

## 📊 File Statistics

### Overall Numbers

```yaml
Total Files: 178+
Total Size: ~8-14MB
HTML Files: 24
CSS Files: 27
JavaScript Files: 30
Images: 74
Fonts: 16
Config Files: 7
```

### Size Breakdown

| Category | Files | Size | Percentage |
|----------|-------|------|------------|
| Images | 74 | ~5-10MB | 50-70% |
| CSS | 27 | ~1.2MB | 10-15% |
| JavaScript | 30 | ~800KB | 8-12% |
| Fonts | 16 | ~1.2MB | 10-15% |
| HTML | 24 | ~500KB | 5-8% |
| Other | 7 | ~50KB | <1% |

---

## 🛠️ Key Directories Explained

### 1. `src/` - Source Files

**Purpose:** Development source files  
**Modified:** During development  
**Version Control:** Yes  

**Key Points:**
- All development happens here
- Human-readable, unminified code
- Organized by file type and purpose
- Never deployed directly

### 2. `public/` - Public Root

**Purpose:** Deployment target / Build output  
**Modified:** By build process  
**Version Control:** Optional (build artifacts)

**Key Points:**
- Web server document root
- Contains compiled/optimized assets
- Ready for deployment
- May include build manifest

### 3. `api/` - Backend API

**Purpose:** Server-side logic  
**Modified:** During backend development  
**Version Control:** Yes  

**Key Points:**
- Separated from frontend
- Follows MVC-like pattern
- Includes middleware & utilities
- Security-focused

### 4. `config/` - Configuration

**Purpose:** Server & app configuration  
**Modified:** During setup/deployment  
**Version Control:** Yes (excluding secrets)

**Key Points:**
- Server configurations (.htaccess, nginx.conf)
- Environment templates
- Deployment settings

### 5. `docs/` - Documentation

**Purpose:** Project documentation  
**Modified:** As project evolves  
**Version Control:** Yes  

**Key Points:**
- Architecture documentation
- API specifications
- Deployment guides
- Structure overview

### 6. `scripts/` - Automation

**Purpose:** Build & deployment automation  
**Modified:** When workflow changes  
**Version Control:** Yes  

**Key Points:**
- Build automation (build.sh)
- Deployment scripts (deploy.sh)
- Optimization tools (optimize.sh)
- Validation checks (validate.sh)

### 7. `tests/` - Testing

**Purpose:** Automated testing (Future)  
**Modified:** When adding tests  
**Version Control:** Yes  

**Key Points:**
- Unit tests for API
- Integration tests for workflows
- Test fixtures & mocks
- Testing utilities

---

## 🔄 File Flow

### Development to Production

```
1. DEVELOPMENT
   │
   ├─> Edit: src/assets/css/main/style.css
   ├─> Edit: src/pages/about.html
   └─> Edit: api/controllers/form-process.php
   │
   v
2. BUILD PROCESS
   │
   ├─> Copy: src/assets/* → public/assets/*
   ├─> Copy: src/pages/* → public/pages/*
   ├─> Optimize: Images, CSS, JS
   └─> Validate: Structure & files
   │
   v
3. DEPLOYMENT
   │
   ├─> Package: public/ directory
   ├─> Backup: Current production
   ├─> Upload: Via rsync/FTP
   └─> Verify: Health checks
   │
   v
4. PRODUCTION
   └─> Live: https://www.tajawaz.my.id/
```

---

## 📝 Naming Conventions

### Files

```yaml
HTML: lowercase-with-dashes.html
CSS: lowercase-with-dashes.css
JavaScript: lowercase-with-dashes.js
PHP: lowercase-with-dashes.php
Images: descriptive-name-WIDTHxHEIGHT.ext
Fonts: font-name-weight.woff2
```

### Directories

```yaml
Root: lowercase-plural (pages, components)
Nested: lowercase-singular or plural as appropriate
Private: prefix with underscore (_private)
```

### IDs & Classes

```yaml
CSS Classes: kebab-case (btn-primary)
IDs: camelCase or kebab-case
Data attributes: data-kebab-case
```

---

## 🔒 File Permissions

### Recommended Permissions

```bash
# Directories
find /var/www/html -type d -exec chmod 755 {} \;

# Files
find /var/www/html -type f -exec chmod 644 {} \;

# Scripts (executable)
chmod +x scripts/*.sh

# Config files (read-only)
chmod 444 config/environment.example
```

### Security Considerations

```bash
# Protect sensitive files
chmod 600 config/.env

# Restrict API access
chmod 755 api/
chmod 644 api/**/*.php

# Prevent directory listing
Options -Indexes  # In .htaccess
```

---

## 📦 Archive Structure

After restructure, the old structure is preserved:

```
/app/
├── 1/                  ← Original structure (archived)
├── src/                ← New source directory
├── public/             ← New public directory
├── api/                ← New API directory
├── config/             ← New config directory
├── docs/               ← New documentation
├── scripts/            ← New automation scripts
└── tests/              ← New testing directory
```

---

## 🔍 Path References

### Updated Path Conventions

**Root Level Files (index.html):**
```html
<!-- Assets -->
<link href="./assets/css/main/style.css">
<script src="./assets/js/main/script.js"></script>

<!-- Components -->
<!-- Loaded via JavaScript with base URL -->
```

**Pages Subfolder (pages/*.html):**
```html
<!-- Set base URL -->
<script>
    window.SITE_BASE_URL = '../';
</script>

<!-- Assets -->
<link href="../assets/css/main/style.css">
<script src="../assets/js/main/script.js"></script>
```

**API Calls:**
```javascript
// Always use absolute or root-relative paths
fetch('/api/form-process.php', {
    method: 'POST',
    body: formData
});
```

---

## 📚 Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [API.md](./API.md) - API documentation
- [README.md](../README.md) - Project overview

---

**Last Updated:** 2025-01-20  
**Version:** 2.0.0  
**Status:** ✓ Enterprise Ready
