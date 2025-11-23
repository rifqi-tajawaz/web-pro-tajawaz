/* ================================================================
 * DYNAMIC LOGO SWITCHER
 * Auto-switches logo based on theme (dark/light mode)
 * ================================================================ */

/**
 * Updates all logo instances based on current theme
 * @param {boolean} isLightMode - true if light mode is active
 */
function updateLogos(isLightMode) {
  const logos = document.querySelectorAll('.site-logo');

  if (logos.length === 0) {
    console.warn('No logos found with class .site-logo');
    return;
  }

  // Determine which logo to use
  // Light mode (light background) = use dark logo
  // Dark mode (dark background) = use light logo
  const logoFileName = isLightMode ? 'dark-mode.svg' : 'light-mode.svg';

  logos.forEach((logo) => {
    const currentSrc = logo.getAttribute('src');

    // Always use absolute path from root for consistency
    const newSrc = `./assets/images/logos/brand/${logoFileName}`;

    // Only update if the src actually changed (avoid unnecessary reloads)
    if (currentSrc !== newSrc) {
      // Add transition class for smooth switching
      logo.classList.add('logo-transitioning');

      // Update the src
      logo.setAttribute('src', newSrc);

      // Remove transition class after animation completes
      setTimeout(() => {
        logo.classList.remove('logo-transitioning');
      }, 300);
    }
  });
}

/**
 * Initializes logo on page load based on saved theme preference
 */
function initLogoOnLoad() {
  const isLightMode = localStorage.getItem('lightmode') === 'active';
  updateLogos(isLightMode);
}

// Export functions for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { updateLogos, initLogoOnLoad };
}
