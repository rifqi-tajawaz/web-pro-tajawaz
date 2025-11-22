# 📁 STRUKTUR WEBSITE - Tajawaz Solutions

**Website:** www.tajawaz.my.id  
**Last Updated:** November 22, 2025  
**Total Files:** 178 files

---

## 📊 Overview Statistik

| Kategori | Jumlah | Deskripsi |
|----------|--------|-----------|
| 📄 HTML Files | 24 | Halaman web dan komponen |
| 🎨 CSS Files | 27 | Stylesheet dan tema |
| ⚙️ JavaScript Files | 30 | Script dan interaktivitas |
| 🖼️ Image Files | 74 | Gambar, icon, logo |
| 🔤 Font Files | 16 | Web fonts (FontAwesome) |
| 📦 Data Files | 4 | JSON, XML, sitemap |
| 🔌 API Files | 2 | PHP backend endpoints |
| 📝 Other Files | 1 | robots.txt |
| **TOTAL** | **178** | **files** |

---

## 🌲 Struktur Directory Tree

```
/public/
│
├── 📄 index.html                          # Homepage utama
├── 📄 sw.js                               # Service Worker untuk PWA
├── 📄 manifest.json                       # PWA Manifest
├── 📄 sitemap.xml                         # SEO Sitemap
├── 📄 robots.txt                          # Search engine crawling rules
├── 📄 browserconfig.xml                   # Browser configuration
│
├── 📁 components/                         # Komponen HTML reusable
│   ├── header.html                        # Header/navigation bar
│   ├── footer.html                        # Footer section
│   ├── sidebar.html                       # Sidebar navigation
│   └── search-form.html                   # Search form component
│
├── 📁 pages/                              # Halaman website
│   ├── about.html                         # About page
│   ├── bio-profile.html                   # Bio/profile page
│   ├── blog.html                          # Blog listing
│   ├── case-studies.html                  # Case studies showcase
│   ├── contact.html                       # Contact form page
│   ├── faq.html                           # FAQ page
│   ├── partnership.html                   # Partnership information
│   ├── pricing.html                       # Pricing plans
│   ├── products-digital.html              # Digital products catalog
│   ├── search.html                        # Search results page
│   ├── services.html                      # Services listing
│   ├── single-post.html                   # Blog post detail
│   ├── single-services.html               # Service detail page
│   └── team.html                          # Team members page
│
├── 📁 errors/                             # Error pages
│   ├── 403.html                           # Forbidden error
│   ├── 404.html                           # Not found error
│   ├── 500.html                           # Internal server error
│   └── 503.html                           # Service unavailable
│
├── 📁 pwa/                                # Progressive Web App files
│   ├── pwa-manager.js                     # PWA management script
│   ├── offline.html                       # Offline fallback page
│   ├── screenshot-desktop.jpg             # PWA screenshot (desktop)
│   └── screenshot-mobile.jpg              # PWA screenshot (mobile)
│
├── 📁 api/                                # Backend API endpoints
│   ├── form-process.php                   # Contact form handler
│   └── newsletter-process.php             # Newsletter subscription handler
│
└── 📁 assets/                             # Static assets
    │
    ├── 📁 css/                            # Stylesheets
    │   ├── 📁 main/                       # Custom styles
    │   │   ├── critical-inline.css        # Critical CSS untuk performance
    │   │   ├── products-digital.css       # Products page styles
    │   │   ├── pwa-styles.css             # PWA specific styles
    │   │   └── style.css                  # Main stylesheet (133KB)
    │   │
    │   └── 📁 vendor/                     # Third-party CSS
    │       ├── animate.min.css            # Animation library
    │       ├── bootstrap.min.css          # Bootstrap framework
    │       ├── bootstrap-grid.min.css     # Bootstrap grid system
    │       ├── bootstrap-utilities.min.css # Bootstrap utilities
    │       ├── fontawesome.min.css        # FontAwesome icons
    │       ├── swiper-bundle.min.css      # Swiper slider
    │       ├── odometer-theme-default.css # Counter animation
    │       └── [RTL versions]             # Right-to-left support
    │
    ├── 📁 js/                             # JavaScript files
    │   ├── 📁 main/                       # Custom scripts
    │   │   ├── base-url.js                # Base URL configuration
    │   │   ├── products-catalog.js        # Product catalog logic
    │   │   ├── products-data.js           # Product data management
    │   │   ├── script.js                  # Main application script
    │   │   ├── submit-form.js             # Form submission handler
    │   │   ├── swiper-script.js           # Slider initialization
    │   │   ├── themeswitch.js             # Light/dark theme switcher
    │   │   ├── video-embed.js             # Video embedding
    │   │   ├── video-embedded.js          # Embedded video handler
    │   │   └── whatsapp-contact.js        # WhatsApp integration
    │   │
    │   └── 📁 vendor/                     # Third-party libraries
    │       ├── bootstrap.bundle.min.js    # Bootstrap framework
    │       ├── bootstrap.lightbox.js      # Image lightbox
    │       ├── fslightbox.js              # Fullscreen lightbox
    │       ├── isotope.pkgd.min.js        # Grid layout & filtering
    │       ├── jquery.min.js              # jQuery library
    │       ├── masonry.pkgd.js            # Masonry layout
    │       ├── swiper-bundle.min.js       # Swiper slider
    │       └── [Bootstrap modules]        # Modal, offcanvas, popover
    │
    ├── 📁 images/                         # Image assets
    │   ├── 📁 backgrounds/                # Background images
    │   │   ├── regular-square-grids-4AL3FJ8.png
    │   │   └── regular-square-grids-4AL3FJ8-light.png
    │   │
    │   ├── 📁 favicon/                    # Favicon & PWA icons
    │   │   ├── favicon.ico                # Browser favicon
    │   │   ├── favicon.svg                # SVG favicon
    │   │   ├── apple-touch-icon.png       # iOS icon
    │   │   ├── icon-[sizes].png           # PWA icons (72-384px)
    │   │   └── web-app-manifest-[sizes].png # Manifest icons
    │   │
    │   ├── 📁 icons/                      # UI icons
    │   │   ├── icon-1.png ... icon-12.png # Feature icons
    │   │   └── digital-marketing-icons-*.png
    │   │
    │   ├── 📁 illustrations/              # Vector illustrations
    │   │   ├── cross-out.svg
    │   │   ├── light-mode.svg
    │   │   └── mode-night.svg
    │   │
    │   ├── 📁 logos/                      # Brand logos
    │   │   ├── 📁 brand/                  # Tajawaz logos
    │   │   │   ├── dark-mode.svg          # Logo untuk dark mode (385KB)
    │   │   │   └── light-mode.svg         # Logo untuk light mode (714KB)
    │   │   │
    │   │   └── 📁 partnership/            # Partner/client logos
    │   │       ├── client-1.png
    │   │       ├── client-1-dark.png
    │   │       ├── client-2.png
    │   │       ├── client-2-dark.png
    │   │       └── [more clients...]
    │   │
    │   ├── 📁 placeholders/               # Placeholder images
    │   │   └── dummy-img-[sizes].jpg      # Various sizes
    │   │
    │   ├── 📁 products/                   # Product images
    │   │   └── [product images]
    │   │
    │   ├── 📁 team/                       # Team member photos
    │   │   └── [team photos]
    │   │
    │   └── [Root images]                  # Misc images
    │       ├── Gp-1.png
    │       ├── download.png
    │       └── [dummy images for testing]
    │
    ├── 📁 fonts/                          # Web fonts
    │   ├── fa-brands-400.ttf/woff2        # FontAwesome Brands
    │   ├── fa-regular-400.ttf/woff2       # FontAwesome Regular
    │   ├── fa-solid-900.ttf/woff2         # FontAwesome Solid
    │   ├── fa-v4compatibility.ttf/woff2   # FA v4 compatibility
    │   │
    │   └── 📁 fontawesome/                # FontAwesome package
    │       ├── all.min.css                # All FA styles
    │       ├── brands.css                 # Brand icons
    │       ├── fontawesome.min.css        # Core FA styles
    │       ├── regular.css                # Regular weight
    │       ├── solid.css                  # Solid weight
    │       │
    │       └── 📁 webfonts/               # Font files
    │           └── [Same font files]      # Duplicate for compatibility
    │
    └── 📁 data/                           # Data files
        └── search-index.json              # Search functionality data
```

---

## 📄 HTML Files Detail (24 files)

### 🏠 Root Level
- **index.html** - Homepage utama website

### 🧩 Components (4 files)
Komponen reusable yang dimuat secara dinamis via JavaScript:

| File | Purpose | Loaded By |
|------|---------|-----------|
| `components/header.html` | Navigation bar, logo, menu | All pages via script.js |
| `components/footer.html` | Footer section, links, info | All pages via script.js |
| `components/sidebar.html` | Side navigation menu | Pages with sidebar |
| `components/search-form.html` | Search functionality | Pages with search |

### 📑 Pages (14 files)
Halaman konten utama website:

| File | Description |
|------|-------------|
| `pages/about.html` | Tentang perusahaan, visi, misi |
| `pages/bio-profile.html` | Profil biografis |
| `pages/blog.html` | Listing artikel blog |
| `pages/case-studies.html` | Studi kasus dan portfolio |
| `pages/contact.html` | Form kontak dan informasi |
| `pages/faq.html` | Frequently Asked Questions |
| `pages/partnership.html` | Informasi kemitraan |
| `pages/pricing.html` | Paket harga dan layanan |
| `pages/products-digital.html` | Katalog produk digital |
| `pages/search.html` | Halaman hasil pencarian |
| `pages/services.html` | Daftar layanan |
| `pages/single-post.html` | Detail artikel blog |
| `pages/single-services.html` | Detail layanan |
| `pages/team.html` | Tim dan anggota |

### ❌ Error Pages (4 files)
Custom error pages untuk UX yang lebih baik:

| File | HTTP Code | Description |
|------|-----------|-------------|
| `errors/403.html` | 403 | Forbidden - Akses ditolak |
| `errors/404.html` | 404 | Not Found - Halaman tidak ditemukan |
| `errors/500.html` | 500 | Internal Server Error |
| `errors/503.html` | 503 | Service Unavailable |

### 📱 PWA (1 file)
- `pwa/offline.html` - Fallback page saat offline

---

## 🎨 CSS Files Detail (27 files)

### Main Styles (4 files)

| File | Size | Description |
|------|------|-------------|
| `style.css` | 133KB | Main stylesheet - semua custom styles |
| `critical-inline.css` | 1.9KB | Critical CSS untuk above-the-fold content |
| `products-digital.css` | 4.6KB | Styles khusus untuk halaman products |
| `pwa-styles.css` | 6.3KB | Styles khusus untuk PWA features |

### Vendor Styles (23 files)

**Bootstrap Framework:**
- `bootstrap.min.css` (232KB) - Full framework
- `bootstrap-grid.min.css` (52KB) - Grid system only
- `bootstrap-utilities.min.css` (85KB) - Utility classes
- `bootstrap-reboot.min.css` (10KB) - CSS reset
- RTL versions untuk right-to-left languages

**FontAwesome Icons:**
- `fontawesome.min.css` (81KB) - Core styles
- `brands.css` (24KB) - Brand icons
- `solid.css` / `regular.css` - Icon weights

**Other Libraries:**
- `animate.min.css` (72KB) - Animation effects
- `swiper-bundle.min.css` (18KB) - Slider/carousel
- `odometer-theme-default.css` (3.6KB) - Counter animations

---

## ⚙️ JavaScript Files Detail (30 files)

### Main Scripts (10 files)

| File | Purpose |
|------|---------|
| `script.js` | Core application logic, component loading, initialization |
| `base-url.js` | Base URL configuration untuk dynamic loading |
| `products-catalog.js` | Product catalog functionality |
| `products-data.js` | Product data management |
| `submit-form.js` | Form submission handler (contact, newsletter) |
| `swiper-script.js` | Slider/carousel initialization |
| `themeswitch.js` | Dark/light theme toggle |
| `video-embed.js` | YouTube video embedding |
| `video-embedded.js` | Embedded video controls |
| `whatsapp-contact.js` | WhatsApp click-to-chat integration |

### Vendor Scripts (20 files)

**jQuery:**
- `jquery.min.js` (86KB) - Full library
- `jquery.slim.min.js` - Slim version (without ajax/effects)

**Bootstrap:**
- `bootstrap.bundle.min.js` (79KB) - Framework + Popper
- Individual modules: `modal.js`, `offcanvas.js`, `popover.js`
- ES module versions: `bootstrap.esm.min.js`

**UI Libraries:**
- `fslightbox.js` - Fullscreen image lightbox
- `bootstrap.lightbox.js` - Bootstrap lightbox
- `swiper-bundle.min.js` (133KB) - Touch slider
- `isotope.pkgd.min.js` (47KB) - Grid filtering/sorting
- `masonry.pkgd.js` (24KB) - Masonry grid layout

### PWA Scripts (2 files)
- `sw.js` (7.8KB) - Service Worker untuk offline caching
- `pwa/pwa-manager.js` (16.7KB) - PWA lifecycle management

---

## 🖼️ Image Files Detail (74 files)

### Categories:

| Category | Count | Purpose |
|----------|-------|---------|
| **Backgrounds** | 2 | Grid patterns untuk background |
| **Favicon/Icons** | 11 | Browser icons & PWA icons (berbagai ukuran) |
| **UI Icons** | 14 | Feature icons untuk UI |
| **Illustrations** | 3 | SVG illustrations (theme switcher, etc) |
| **Logos** | 14 | Brand logos (light/dark) + partner logos |
| **Placeholders** | 17 | Dummy images untuk testing/development |
| **Products** | Variable | Product showcase images |
| **Team** | Variable | Team member photos |
| **Other** | 13+ | Misc images |

### Icon Sizes untuk PWA:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

---

## 🔤 Font Files Detail (16 files)

**FontAwesome 6.x** - Complete icon font package

| Font Type | Format | Size | Description |
|-----------|--------|------|-------------|
| Brands | TTF | 211KB | Brand logos (Facebook, Twitter, etc) |
| Brands | WOFF2 | 119KB | Optimized for web |
| Regular | TTF | 68KB | Regular weight icons |
| Regular | WOFF2 | 25KB | Optimized |
| Solid | TTF | 426KB | Solid weight icons |
| Solid | WOFF2 | 158KB | Optimized |
| v4 Compatibility | TTF/WOFF2 | 11KB/5KB | Backward compatibility |

**Note:** Font files duplicated di `/assets/fonts/` dan `/assets/fonts/fontawesome/webfonts/` untuk compatibility.

---

## 📦 Data & Configuration Files

### JSON Files
- **manifest.json** - PWA manifest (app name, icons, theme)
- **search-index.json** - Search functionality index data

### XML Files
- **sitemap.xml** - SEO sitemap untuk search engines
- **browserconfig.xml** - Microsoft browser tile configuration

### Text Files
- **robots.txt** - Search engine crawling rules

---

## 🔌 API Endpoints (2 files)

| File | Method | Purpose |
|------|--------|---------|
| `api/form-process.php` | POST | Process contact form submissions |
| `api/newsletter-process.php` | POST | Handle newsletter subscriptions |

---

## 📱 Progressive Web App (PWA)

### PWA Assets:
✅ **manifest.json** - App configuration  
✅ **sw.js** - Service Worker (cache strategy, offline support)  
✅ **pwa-manager.js** - Install prompts, update notifications  
✅ **offline.html** - Offline fallback page  
✅ **Icons** - Multiple sizes (72px to 512px)  
✅ **Screenshots** - Desktop & mobile previews  

### PWA Features:
- ✅ Installable sebagai app
- ✅ Offline functionality
- ✅ Background sync ready
- ✅ Push notifications support
- ✅ Cache management
- ✅ Update notifications

---

## 🔧 Technical Architecture

### Frontend Stack:
- **HTML5** - Semantic markup
- **CSS3** - Modern styling
- **JavaScript (ES6+)** - Interactive features
- **Bootstrap 5** - UI framework
- **jQuery** - DOM manipulation
- **FontAwesome 6** - Icon library

### Features Implemented:
✅ **Responsive Design** - Mobile-first approach  
✅ **Dark/Light Theme** - User preference with localStorage  
✅ **PWA Support** - Installable, offline-capable  
✅ **Dynamic Components** - Modular architecture  
✅ **Image Optimization** - Multiple formats & sizes  
✅ **SEO Ready** - Sitemap, meta tags, semantic HTML  
✅ **Performance** - Minified assets, critical CSS  
✅ **Accessibility** - Semantic HTML, ARIA labels  

### Loading Strategy:
1. **Critical CSS** inline untuk fast first paint
2. **Component Loading** via fetch API (async)
3. **Lazy Loading** untuk images
4. **Service Worker** untuk caching & offline

---

## 📊 File Size Summary

### Total Size Breakdown:

| Category | Count | Approx Size |
|----------|-------|-------------|
| HTML | 24 | ~500KB |
| CSS | 27 | ~1.2MB |
| JavaScript | 30 | ~800KB |
| Images | 74 | ~5-10MB |
| Fonts | 16 | ~1.2MB |
| Data/Other | 7 | ~50KB |
| **TOTAL** | **178** | **~8-14MB** |

### Optimization Notes:
✅ Minified CSS/JS files  
✅ WOFF2 fonts (best compression)  
✅ SVG untuk logos (scalable)  
✅ Multiple image sizes untuk responsive  
✅ Gzip/Brotli compression ready  

---

## 🎯 Key Technical Features

### 1. Component-Based Architecture
```javascript
// Dynamic component loading via script.js
const baseUrl = window.SITE_BASE_URL || './';

const components = [
  { id: '#header', url: 'components/header.html' },
  { id: '#footer', url: 'components/footer.html' },
  { id: '#sidebar', url: 'components/sidebar.html' }
];

// Components loaded relative to baseUrl
fetch(`${baseUrl}${comp.url}`)
```

**⚠️ IMPORTANT PATH CONVENTION:**
- **Root level** (`index.html`): Uses `SITE_BASE_URL = './'` (default)
- **Pages subfolder** (`pages/*.html`): Must set `SITE_BASE_URL = '../'`
- All pages in `pages/` directory include this configuration:
  ```html
  <script>
    window.SITE_BASE_URL = '../';
  </script>
  ```
  This ensures header, footer, and all assets load correctly from the subfolder.

### 2. Theme Switcher
- Supports light/dark mode
- Saves preference in localStorage
- Updates logo & illustrations accordingly

### 3. Progressive Web App
- Service Worker caching strategy
- Offline fallback
- Install prompts
- Update notifications

### 4. SEO Optimization
- Semantic HTML5 markup
- XML sitemap
- Meta tags (Open Graph, Twitter Cards)
- Structured data (JSON-LD)
- robots.txt configuration

### 5. Performance
- Critical CSS inline
- Lazy loading images
- Minified assets
- Font loading optimization
- Service Worker caching

---

## 🔗 Internal Link Structure

### Navigation Flow:
```
Homepage (index.html)
├── Pages
│   ├── About
│   ├── Services
│   │   └── Single Service
│   ├── Products Digital
│   ├── Case Studies
│   ├── Blog
│   │   └── Single Post
│   ├── Team
│   ├── Pricing
│   ├── Partnership
│   ├── FAQ
│   ├── Contact
│   └── Search
│
├── Components (All Pages)
│   ├── Header (Navigation)
│   ├── Footer (Links, Info)
│   └── Sidebar (Mobile/Tablet)
│
└── Error Pages (As Needed)
    ├── 403 - Forbidden
    ├── 404 - Not Found
    ├── 500 - Server Error
    └── 503 - Unavailable
```

---

## ✅ Link Integrity Status

**Audit Date:** November 22, 2025  
**Status:** ✅ **100% CLEAN - ZERO BROKEN LINKS**

- **916 links checked**
- **0 broken links**
- **All resources accessible**
- **All navigation functional**

Detailed audit reports:
- `LINK_AUDIT_REPORT.md` - Comprehensive report
- `AUDIT_SUMMARY.txt` - Statistics summary
- `audit_report.json` - Machine-readable data

---

## 🚀 Deployment Ready

Website is fully validated and production-ready:

✅ All files present and accessible  
✅ No broken links or missing resources  
✅ PWA compliant  
✅ SEO optimized  
✅ Mobile responsive  
✅ Cross-browser compatible  
✅ Performance optimized  

---

## 📝 Maintenance Notes

### Regular Updates Needed:
- **Images:** Update team photos, product images
- **Content:** Blog posts, case studies
- **Data:** search-index.json for new content
- **Partners:** Add/update client logos

### Files to NOT Modify:
- Vendor CSS/JS (use CDN or update entire package)
- Font files (update FontAwesome as package)
- Core framework files (Bootstrap, jQuery)

### Files to Customize:
- `assets/css/main/style.css` - Custom styles
- `assets/js/main/script.js` - Custom functionality
- HTML pages - Content updates
- Images - Branding & content

---

**Documentation Generated:** November 22, 2025  
**By:** Emergen.sh E1 Agent  
**Version:** 1.0  

---

*Struktur ini menggambarkan website Tajawaz Solutions yang professional, well-organized, dan production-ready dengan 178 files yang semuanya terverifikasi tanpa broken links.*
