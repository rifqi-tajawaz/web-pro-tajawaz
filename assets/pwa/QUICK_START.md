# PWA Styles - Quick Start Guide
## 5 Menit untuk 100% Design System Consistency

---

## 🚀 TL;DR

```html
<!-- Di <head> HTML Anda -->
<link rel="stylesheet" href="/assets/css/style.css">        <!-- Global design system -->
<link rel="stylesheet" href="/assets/pwa/pwa-styles.css">  <!-- PWA components -->

<!-- PWA components akan otomatis match global design -->
```

**Result**: PWA buttons, cards, dan notifications terlihat 100% native dengan website Anda.

---

## 📋 Checklist Implementasi (5 Menit)

### ✅ Step 1: Link CSS Files (1 menit)

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My PWA</title>
  
  <!-- Global Design System (WAJIB dulu) -->
  <link rel="stylesheet" href="/assets/css/style.css">
  
  <!-- PWA Styles (setelah global) -->
  <link rel="stylesheet" href="/assets/pwa/pwa-styles.css">
</head>
<body>
  <!-- Your content -->
</body>
</html>
```

**Important**: Global `style.css` HARUS diload sebelum `pwa-styles.css` karena PWA styles depend on global CSS variables.

---

### ✅ Step 2: Install Banner (2 menit)

Copy-paste HTML ini ke halaman Anda:

```html
<div class="pwa-install-banner">
  <div class="pwa-install-content">
    <div class="pwa-install-icon">
      <img src="/icon-192.png" alt="App Icon">
    </div>
    <div class="pwa-install-text">
      <strong>Install Aplikasi</strong>
      <p>Install aplikasi ini di home screen untuk akses cepat</p>
    </div>
    <button class="pwa-install-button">
      Install
    </button>
    <button class="pwa-install-close">&times;</button>
  </div>
</div>
```

**JavaScript untuk Show/Hide**:

```javascript
// Tampilkan install banner
document.querySelector('.pwa-install-banner').style.display = 'block';

// Handle install button click
document.querySelector('.pwa-install-button').addEventListener('click', async () => {
  if (window.deferredPrompt) {
    window.deferredPrompt.prompt();
    const { outcome } = await window.deferredPrompt.userChoice;
    console.log('User choice:', outcome);
    window.deferredPrompt = null;
  }
});

// Handle close button
document.querySelector('.pwa-install-close').addEventListener('click', () => {
  document.querySelector('.pwa-install-banner').style.display = 'none';
});
```

---

### ✅ Step 3: Update Toast (1 menit)

```html
<div class="pwa-update-toast" style="display: none;">
  <div class="pwa-update-icon">🔄</div>
  <div class="pwa-update-content">
    <strong>Versi Baru Tersedia</strong>
    <p>Refresh untuk mendapatkan versi terbaru</p>
  </div>
  <button class="pwa-update-button">Refresh</button>
</div>
```

**JavaScript untuk Trigger**:

```javascript
// Ketika service worker menemukan update
navigator.serviceWorker.addEventListener('controllerchange', () => {
  const toast = document.querySelector('.pwa-update-toast');
  toast.style.display = 'flex';
  
  document.querySelector('.pwa-update-button').addEventListener('click', () => {
    window.location.reload();
  });
});
```

---

### ✅ Step 4: Dark/Light Mode Toggle (1 menit)

```javascript
// Toggle theme
function toggleTheme() {
  document.body.classList.toggle('lightmode');
  
  // Save ke localStorage
  const isLight = document.body.classList.contains('lightmode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('lightmode');
  }
});
```

**HTML Toggle Button**:

```html
<button onclick="toggleTheme()">
  Toggle Dark/Light Mode
</button>
```

**Result**: PWA components otomatis berubah warna saat theme di-toggle. Zero additional PWA-specific code needed.

---

## 🎨 Styling Reference (Copas-able)

### PWA Button (Match Global .btn.btn-accent)

```css
.my-pwa-button {
  background: var(--pwa-accent);              /* #5e2ced */
  color: var(--pwa-accent-2);                 /* #ffffff or #000000 */
  border: none;
  padding: var(--pwa-space-sm) var(--pwa-space-2xl);
  border-radius: var(--pwa-radius-full);      /* 50px fully rounded */
  font-family: var(--pwa-font-family);        /* Plus Jakarta Sans */
  font-size: var(--pwa-font-size-base);       /* 16px */
  font-weight: var(--pwa-font-weight-semibold); /* 600 */
  cursor: pointer;
  transition: all var(--pwa-transition-base);
  box-shadow: var(--pwa-shadow-sm);
}

.my-pwa-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--pwa-shadow-md);
}
```

### PWA Card (Match Global .card)

```css
.my-pwa-card {
  background: var(--pwa-gradient-bg);         /* Radial gradient */
  border: 1px solid var(--pwa-accent-3);      /* #1f1f1f or #e3caff */
  border-radius: var(--pwa-radius-xl);        /* 25px */
  padding: var(--pwa-space-lg) var(--pwa-space-xl);
  box-shadow: var(--pwa-shadow-top-left);     /* Accent glow */
  color: var(--pwa-primary);                  /* #d1d1d1 or #1f1f1f */
}

.my-pwa-card:hover {
  box-shadow: var(--pwa-shadow-bottom-right);
}
```

### PWA Text (Match Global Typography)

```css
.my-pwa-heading {
  font-family: var(--pwa-font-family);        /* Plus Jakarta Sans */
  font-size: var(--pwa-font-size-lg);         /* 18px */
  font-weight: var(--pwa-font-weight-bold);   /* 700 */
  color: var(--pwa-primary);
  line-height: var(--pwa-line-height-snug);   /* 1.2em */
}

.my-pwa-paragraph {
  font-family: var(--pwa-font-family);
  font-size: var(--pwa-font-size-base);       /* 16px */
  font-weight: var(--pwa-font-weight-medium); /* 500 */
  color: var(--pwa-text-color);               /* #8b8b8b or #4a4a4a */
  line-height: var(--pwa-line-height-relaxed); /* 1.4em */
}
```

---

## 🧪 Testing (2 Menit)

### Visual Match Test:

1. **Open DevTools** → Elements
2. **Inspect PWA button** → Computed styles:
   - `background-color`: rgb(94, 44, 237) ✅ (same as global .btn.btn-accent)
   - `border-radius`: 50px ✅ (same as global button)
   - `font-family`: "Plus Jakarta Sans" ✅ (same as global)
   
3. **Toggle Light Mode**:
   ```javascript
   document.body.classList.add('lightmode');
   ```
   - PWA button text color should change automatically ✅
   - PWA card background should change automatically ✅

### Responsive Test:

1. **Open DevTools** → Toggle device toolbar
2. **Resize viewport**: 375px → 768px → 1920px
3. **Verify**: Border radius stays 25px for cards, 50px for buttons ✅

---

## 🔧 Common Customizations

### Ganti Warna Accent Brand:

**Edit**: `/assets/css/style.css`
```css
:root {
  --accent-color: #7c3aed; /* Dari #5e2ced ke purple lebih gelap */
}
```

**Result**: PWA buttons, links, dan highlights otomatis berubah ke #7c3aed. Zero PWA code changes.

### Ganti Font:

**Edit**: `/assets/css/style.css`
```css
:root {
  --global-font: 'Inter', sans-serif; /* Dari Plus Jakarta Sans ke Inter */
}
```

**Result**: Semua PWA text otomatis menggunakan Inter. Zero PWA code changes.

### Ganti Border Radius Style:

**Edit**: `/assets/css/style.css`
```css
:root {
  --global-border-radius: 20px; /* Dari 25px ke 20px untuk less rounded */
  --radius-xl: 20px;
}
```

**Result**: PWA cards otomatis lebih square. Zero PWA code changes.

---

## ⚠️ Common Mistakes & Fixes

### ❌ Mistake 1: Load Order Wrong

```html
<!-- ❌ WRONG: PWA loaded before global -->
<link rel="stylesheet" href="/assets/pwa/pwa-styles.css">
<link rel="stylesheet" href="/assets/css/style.css">
```

**Result**: PWA components tidak dapat akses global CSS variables.

**✅ FIX**:
```html
<!-- ✅ CORRECT: Global first, PWA second -->
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="stylesheet" href="/assets/pwa/pwa-styles.css">
```

---

### ❌ Mistake 2: Hardcode Colors in PWA HTML

```html
<!-- ❌ WRONG: Inline style dengan hardcoded color -->
<button style="background: #5e2ced; color: white;">
  Install
</button>
```

**Result**: Button tidak mengikuti theme switching, stuck di satu warna.

**✅ FIX**:
```html
<!-- ✅ CORRECT: Use CSS class yang sudah ada -->
<button class="pwa-install-button">
  Install
</button>
```

---

### ❌ Mistake 3: Override Border Radius di Media Query

```css
/* ❌ WRONG: Override radius di mobile */
@media (max-width: 768px) {
  .pwa-install-button {
    border-radius: 15px; /* Breaks consistency */
  }
}
```

**Result**: Mobile button terlihat berbeda dengan desktop, tidak konsisten.

**✅ FIX**:
```css
/* ✅ CORRECT: Hanya sizing yang berubah, bukan shape */
@media (max-width: 768px) {
  .pwa-install-button {
    padding: var(--pwa-space-sm) var(--pwa-space-xl);
    font-size: var(--pwa-font-size-sm);
    /* border-radius tetap var(--pwa-radius-full) */
  }
}
```

---

## 📊 Before vs After

### Before (Hardcoded PWA Styles):

```css
/* ❌ Old approach */
.pwa-button {
  background: #5e2ced;           /* Hardcoded */
  color: #ffffff;                /* Hardcoded */
  border-radius: 25px;           /* Hardcoded */
  font-family: sans-serif;       /* Generic */
}
```

**Problems**:
- Tidak match global button style
- Tidak support dark/light mode auto-switching
- Jika brand color berubah, harus manual update PWA files

---

### After (Variable-based PWA Styles):

```css
/* ✅ New approach */
.pwa-button {
  background: var(--pwa-accent);         /* From global --accent-color */
  color: var(--pwa-accent-2);            /* Auto light/dark */
  border-radius: var(--pwa-radius-full); /* From global --radius-full */
  font-family: var(--pwa-font-family);   /* From global --global-font */
}
```

**Benefits**:
- ✅ 100% match global button style
- ✅ Auto dark/light mode switching
- ✅ Update global colors → PWA otomatis ikut

---

## 🎓 Next Steps

- **Full Documentation**: Baca `README.md` untuk detail lengkap
- **Version History**: Lihat `CHANGELOG.md` untuk migration guide
- **Component Reference**: PWA component library di `pwa-styles.css` (dengan comments)
- **Design Tokens**: Semua variables di `_pwa-theme.css`

---

## 🆘 Need Help?

### Quick Debugging:

**Q**: PWA colors tidak berubah saat toggle light mode?  
**A**: Check load order CSS files. Global `style.css` harus sebelum `pwa-styles.css`.

**Q**: Font tidak Plus Jakarta Sans?  
**A**: Check apakah `style.css` sudah loaded. Inspect element → Computed → font-family.

**Q**: Border radius tidak 25px?  
**A**: Check apakah ada CSS yang override. Search for hardcoded `border-radius:` values.

---

## ✨ Summary

**One-liner Implementation**:
```html
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="stylesheet" href="/assets/pwa/pwa-styles.css">
```

**Result**: 100% consistent PWA components with zero maintenance overhead.

**Time to implement**: 5 minutes  
**Time saved per design update**: Hours (no more manual PWA syncing)

---

**Version**: 4.0.0 - Perfect Global Alignment  
**Last Updated**: 2025-01-XX
