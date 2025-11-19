# 🎨 Tajawaz Solutions Design System

## 📋 Table of Contents
1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Border Radius](#border-radius)
5. [Shadows](#shadows)
6. [Animations](#animations)
7. [Usage Examples](#usage-examples)

---

## 🎨 Colors

### Primary Colors
```css
--primary: #D1D1D1        /* Dark mode text */
--secondary: #040404       /* Dark mode background */
--text-color: #8B8B8B      /* Body text color */
--text-color-2: #040404    /* Alternative text */
```

### Light Mode Colors
```css
.lightmode {
  --primary: #1F1F1F
  --secondary: #fbfaff
  --text-color: #4A4A4A
}
```

### Accent Colors
```css
--accent-color: #5e2ced    /* Primary purple accent */
--accent-color-2: #FFFFFF  /* White accent */
--accent-color-3: #1F1F1F  /* Dark gray accent */
--accent-color-4: #0E0E0E  /* Darker gray accent */
--accent-color-5: #0404047D /* Semi-transparent dark */
--accent-color-6: #C82AEF85 /* Purple with transparency */
```

### Functional Colors
```css
--star-color: #EFBC2A     /* Rating stars */
--error-color: #6332ed    /* Error states */
```

---

## ✍️ Typography

### Font Family
```css
--global-font: "Plus Jakarta Sans", sans-serif
```

### Font Weights
```css
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
--font-weight-black: 900
```

### Font Sizes
| Variable | Size | Usage |
|----------|------|-------|
| `--font-size-xs` | 12px | Small labels, captions |
| `--font-size-sm` | 14px | Secondary text |
| `--font-size-base` | 16px | Body text (default) |
| `--font-size-lg` | 18px | Emphasized body text |
| `--font-size-xl` | 20px | Small headings |
| `--font-size-2xl` | 22px | Card titles |
| `--font-size-3xl` | 24px | H5 |
| `--font-size-5xl` | 28px | H4 |
| `--font-size-11xl` | 46px | H3 |
| `--font-size-14xl` | 64px | H2 |
| `--font-size-15xl` | 100px | H1 |

### Line Heights
```css
--line-height-ultra-tight: 0.9em
--line-height-tight: 1em
--line-height-snug: 1.2em
--line-height-normal: 1.3em    /* Default for headings */
--line-height-relaxed: 1.4em
--line-height-loose: 1.5em     /* Body text */
--line-height-extra-loose: 1.6em
```

---

## 📏 Spacing Scale

Based on 4px increment system (rem units for scalability):

| Variable | Value | Pixels | Usage |
|----------|-------|--------|-------|
| `--spacing-0` | 0 | 0px | Reset spacing |
| `--spacing-1` | 0.25rem | 4px | Micro spacing |
| `--spacing-2` | 0.5rem | 8px | Tight spacing |
| `--spacing-3` | 0.75rem | 12px | Small gaps |
| `--spacing-4` | 1rem | 16px | Default spacing |
| `--spacing-5` | 1.25rem | 20px | Medium spacing |
| `--spacing-6` | 1.5rem | 24px | Cards, containers |
| `--spacing-7` | 1.75rem | 28px | Section spacing |
| `--spacing-8` | 2rem | 32px | Large spacing |
| `--spacing-10` | 2.5rem | 40px | Extra large |
| `--spacing-12` | 3rem | 48px | Section padding |
| `--spacing-16` | 4rem | 64px | Hero sections |
| `--spacing-20` | 5rem | 80px | Major sections |
| `--spacing-24` | 6rem | 96px | Page sections |

### Spacing Utility Classes
```css
/* Flex Gap */
.gspace-0 { gap: 0px }
.gspace-1 { gap: 10px }
.gspace-2 { gap: 20px }
.gspace-3 { gap: 30px }
.gspace-4 { gap: 40px }
.gspace-5 { gap: 50px }

/* Column Gap */
.gspace-x-0 to .gspace-x-5

/* Row Gap */
.gspace-y-0 to .gspace-y-5
```

---

## 🔲 Border Radius

| Variable | Value | Usage |
|----------|-------|-------|
| `--radius-none` | 0 | Sharp corners |
| `--radius-sm` | 8px | Small elements |
| `--radius-md` | 12px | Medium elements |
| `--radius-lg` | 20px | Cards, containers |
| `--radius-xl` | 25px | **Default global radius** |
| `--radius-2xl` | 30px | Large containers |
| `--radius-full` | 50px | Pills, rounded buttons |

### Default
```css
--global-border-radius: 25px 25px 25px 25px
```

---

## 🌑 Shadows

| Variable | Effect | Usage |
|----------|--------|-------|
| `--shadow-sm` | Subtle lift | Hover states |
| `--shadow-md` | Moderate depth | Cards at rest |
| `--shadow-lg` | Strong elevation | Active/hover cards |
| `--shadow-xl` | Maximum depth | Modals, dropdowns |
| `--shadow-focus` | Ring outline | Focus states |
| `--shadow-button` | Button depth | Badges, CTAs |

### Legacy Shadows (Still available)
```css
--box-shadow-top-left
--box-shadow-bottom-right
--box-shadow-top-left-wide
--box-shadow-bottom-right-wide
```

---

## ⚡ Animations

```css
--animation-fast: 0.75s     /* Quick transitions */
--animation-normal: 1.25s   /* Standard animations */
--animation-slow: 2s        /* Slow, dramatic effects */
```

### Usage
```css
transition: all var(--animation-fast) ease;
animation: fadeIn var(--animation-normal) ease-out;
```

---

## 💡 Usage Examples

### 1. Card Component
```css
.card {
  background: var(--accent-color-4);
  border: 2px solid var(--accent-color-3);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  transition: all var(--animation-fast) ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}
```

### 2. Button Component
```css
.btn-primary {
  padding: var(--spacing-3) var(--spacing-6);
  background: var(--accent-color);
  color: var(--accent-color-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  transition: all var(--animation-fast) ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### 3. Input Field
```css
.input {
  padding: var(--spacing-3) var(--spacing-5);
  background: var(--secondary);
  border: 2px solid var(--accent-color-3);
  border-radius: var(--radius-full);
  color: var(--primary);
  font-size: var(--font-size-base);
}

.input:focus {
  border-color: var(--accent-color);
  box-shadow: var(--shadow-focus);
}
```

### 4. Grid Layout
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-5);
}
```

### 5. Typography
```css
.heading-primary {
  font-size: var(--font-size-14xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-snug);
  color: var(--primary);
}

.body-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-loose);
  color: var(--text-color);
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Tablet - max-width: 991px */
@media (max-width: 991px) {
  /* Reduce spacing by 25% */
}

/* Mobile - max-width: 767px */
@media (max-width: 767px) {
  /* Reduce spacing by 50% */
  /* Stack elements vertically */
}

/* Small Mobile - max-width: 575px */
@media (max-width: 575px) {
  /* Minimal spacing */
  /* Single column layout */
}
```

---

## ✅ Best Practices

### DO ✅
- Always use CSS variables for colors, spacing, and typography
- Use rem units for scalability (except for borders)
- Follow the spacing scale (multiples of 4px)
- Use semantic variable names
- Maintain consistency across all components

### DON'T ❌
- Hardcode color values (#5e2ced) → Use var(--accent-color)
- Use arbitrary spacing (1.3rem) → Use var(--spacing-5)
- Mix px and rem inconsistently
- Create custom shadows → Use existing shadow variables
- Override global styles without good reason

---

## 🔄 Updates & Maintenance

**Last Updated:** November 2025  
**Version:** 2.0 - Enhanced with Spacing & Shadow System

### Changelog
- ✅ Added spacing scale variables (--spacing-0 to --spacing-24)
- ✅ Added border radius variables (--radius-sm to --radius-full)
- ✅ Enhanced shadow system (--shadow-sm to --shadow-xl)
- ✅ Refactored products-digital.css to use design system
- ✅ Improved consistency across all components

---

## 🚀 Quick Reference

**Most Common Variables:**
```css
/* Spacing */
padding: var(--spacing-6);
gap: var(--spacing-4);
margin-bottom: var(--spacing-8);

/* Colors */
background: var(--accent-color);
color: var(--primary);
border-color: var(--accent-color-3);

/* Typography */
font-size: var(--font-size-base);
font-weight: var(--font-weight-semibold);
line-height: var(--line-height-loose);

/* Effects */
border-radius: var(--radius-lg);
box-shadow: var(--shadow-md);
transition: all var(--animation-fast) ease;
```

---

**For questions or suggestions, contact the development team.**
