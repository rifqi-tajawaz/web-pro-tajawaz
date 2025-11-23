# Logo Switching - Quick Reference Guide

## 🚀 Quick Start

Logo switching otomatis bekerja di seluruh website Tajawaz Solutions dengan mekanisme yang simple dan efficient.

---

## 💡 How It Works

```
User Toggle Theme → JavaScript Detects → Logo Switches → Smooth Transition
```

**Light Mode** → Shows `dark-mode.svg` (dark logo)  
**Dark Mode** → Shows `light-mode.svg` (light logo)

---

## 📋 Implementation Checklist

### For New Pages:

1. **Add logo-switcher.js BEFORE script.js**
```html
<script src="../assets/js/main/logo-switcher.js"></script>
<script src="../assets/js/main/script.js"></script>
```

2. **Use .site-logo class on all logo images**
```html
<img src="./assets/images/logos/brand/dark-mode.svg" 
     class="site-logo img-fluid" 
     alt="Tajawaz Solutions">
```

3. **Include theme switcher button**
```html
<button id="themeSwitch" class="themeswitch">
  <i id="themeIcon" class="fas fa-moon"></i>
</button>
```

✅ **That's it!** Logo switching akan otomatis bekerja.

---

## 🔧 Key Files

| File | Purpose |
|------|---------|
| `logo-switcher.js` | Core logo switching logic |
| `script.js` | Theme toggle & initialization |
| `style.css` | Transition animations |
| `header.html` | Main navigation logo |
| `footer.html` | Footer logo |
| `sidebar.html` | Mobile menu logo |

---

## 🎨 Logo Files

```
/assets/images/logos/brand/
├── dark-mode.svg  (377KB) → For LIGHT theme
└── light-mode.svg (698KB) → For DARK theme
```

---

## 🧪 Testing

### Manual Test:
1. Open any page
2. Click theme toggle button (moon/sun icon)
3. Verify logo switches smoothly
4. Refresh page → theme should persist
5. Check all pages → logos should sync

### Console Test:
```javascript
// Check if function exists
console.log(typeof updateLogos); // Should output: "function"

// Manually trigger switch
updateLogos(true);  // Switch to light mode logo
updateLogos(false); // Switch to dark mode logo
```

---

## ⚠️ Common Issues

### Logo not switching?
- Check console for errors
- Verify `logo-switcher.js` loaded **before** `script.js`
- Confirm `.site-logo` class exists on `<img>` tag

### Wrong logo showing?
- Clear localStorage: `localStorage.clear()`
- Hard refresh: `Ctrl + Shift + R`
- Check initial logo path is `dark-mode.svg`

### Transition not smooth?
- Verify CSS loaded
- Check for conflicting CSS transitions
- Confirm `.logo-transitioning` class exists in CSS

---

## 📖 Code Examples

### HTML Component
```html
<div class="logo-container">
  <a href="../index.html">
    <img src="./assets/images/logos/brand/dark-mode.svg"
         alt="Tajawaz Solutions"
         class="site-logo img-fluid"
         loading="lazy">
  </a>
</div>
```

### JavaScript Integration
```javascript
// Initialize on page load
const lightMode = localStorage.getItem('lightmode') === 'active';
if (typeof updateLogos === 'function') {
  updateLogos(lightMode);
}

// On theme toggle
function toggleTheme() {
  const isLight = !$('body').hasClass('lightmode');
  $('body').toggleClass('lightmode');
  updateLogos(isLight);
}
```

### CSS Styling
```css
.site-logo {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease;
}

.site-logo.logo-transitioning {
  opacity: 0.7;
  transform: scale(0.98);
}
```

---

## 🎯 Best Practices

✅ **DO:**
- Always use `.site-logo` class
- Load `logo-switcher.js` before `script.js`
- Use relative paths: `./assets/...`
- Test on all pages after changes

❌ **DON'T:**
- Hardcode logo paths in HTML
- Skip `.site-logo` class
- Change script loading order
- Use different logo class names

---

## 📞 Quick Support

**File an issue?** Check the comprehensive guide:  
→ `docs/LOGO_SWITCHING_IMPLEMENTATION.md`

**Need to modify?** Key functions in:  
→ `assets/js/main/logo-switcher.js`

**Want to customize?** Edit transitions in:  
→ `assets/css/main/style.css`

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| Switch Speed | 300ms |
| File Sizes | 377KB + 698KB |
| CSS Classes | 2 (.site-logo, .logo-transitioning) |
| JS Functions | 2 (updateLogos, initLogoOnLoad) |
| Browser Support | All modern browsers |

---

## 🔄 Update Workflow

When adding new pages:

1. Copy script tags from existing page
2. Ensure logo has `.site-logo` class
3. Test theme toggle functionality
4. Verify logo switches correctly

When updating logo design:

1. Replace SVG files in `/assets/images/logos/brand/`
2. Keep filenames: `dark-mode.svg` & `light-mode.svg`
3. Maintain `.site-logo` class on all instances
4. Test across all pages

---

## 🎉 Status

**Implementation:** ✅ Complete  
**Testing:** ✅ Passed  
**Documentation:** ✅ Delivered  
**Production Ready:** ✅ Yes  

---

*For detailed technical documentation, see:*  
`docs/LOGO_SWITCHING_IMPLEMENTATION.md`
