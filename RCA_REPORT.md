# Root Cause Analysis: Mobile Layout Right-Side Gap

This report analyzes the CSS causes for the layout issue where the right side of the mobile view appears blocked or has a gap, preventing content from extending to the viewport edge.

## 1. Global Constraints (Findings)
- **`body`**: `overflow-x: hidden` is applied. This is standard to prevent horizontal scrolling but can mask underlying width issues.
- **`.section`**: Has `padding: 80px 16px 80px 16px` in the mobile media query (`max-width: 767px`). This `16px` right padding is the primary "invisible wall" that prevents any child content (like sliders) from touching the screen edge unless negative margins are applied.
- **`.section-partner`**: Has `padding: 0px 20px 0px 20px` in mobile. This is 20px of forced spacing on the right.
- **`.hero-container`**: Max-width is 1280px, but on mobile, it's constrained by the parent `.section` padding.

## 2. Gradient Curtains (Findings)
- **`.swiperPartner-overlay`**: This element has `pointer-events: none` (added in previous fix), so it doesn't block clicks, but it might visual block content if the z-index or opacity is high.
- **`.swiperPartner-layout::before`**: `background-image: radial-gradient(...)`. If this overlays the content, it could be visually perceived as a block.
- **`.card-partner`**: Has `padding: 0px 0px 50px 0px`. The side padding seems to be 0 here, but the parent `.section-partner` adds 20px.

## 3. Flexbox/Grid Gaps (Findings)
- **`.swiperPartner-container`**: Previously had negative margins `0 -100px` on desktop to pull it wider than the container. On mobile, I reset it to `margin: 0` and `width: 100%`.
- **Root Cause:** Since the parent `.section-partner` has `padding-right: 20px`, setting `.swiperPartner-container` to `width: 100%` keeps it *inside* that padding. To stretch edge-to-edge, it **must** have negative margins equal to the parent's padding (e.g., `margin-left: -20px; margin-right: -20px; width: calc(100% + 40px);`).

## 4. Overflow Handling (Findings)
- **`html` & `body`**: `overflow-x: hidden` prevents the scrollbar, which is good, but if the content *should* bleed out, it needs to be wider than 100% of the padded parent.

## Summary of Root Cause
The "invisible wall" is simply the **padding on the container sections** (`.section-partner`, `.section`). The slider content respects this padding and stops 20px (or 16px) short of the edge.

## Recommended Fix
1.  **For Edge-to-Edge Slider:** Apply negative margins to `.swiperPartner-container` in the mobile media query to counteract the parent section's padding.
    - Parent padding: 20px.
    - Fix: `margin-left: -20px; margin-right: -20px; width: calc(100% + 40px);`
2.  **For Social Icons:** Ensure the parent `.footer-contact-container` or `.section-footer` (padding 20px) allows the content to use the full available width, but wrapping is already fixed. The "cut off" issue for icons was likely due to lack of wrapping, which is resolved.

I will apply the negative margin fix to the slider container in the CSS.
