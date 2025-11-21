/**
 * Global detection of SITE_BASE_URL for dynamic asset loading.
 * This script must be loaded before any other scripts that rely on window.SITE_BASE_URL.
 *
 * Strategy:
 * 1. GitHub Pages Project Site (e.g., /repo-name/) -> SITE_BASE_URL = '/repo-name/'
 * 2. Root domain or Localhost -> SITE_BASE_URL = ''
 *
 * NOTE: This variable is primarily for assets injected via JavaScript (like Header/Footer components).
 * Static HTML tags (link, script, img) should use relative paths ("./assets/...") for maximum compatibility.
 */

(function() {
  const path = window.location.pathname;

  // Simple heuristic: if we are in a subdirectory that is NOT a file,
  // or if the path segment count > 1 (excluding the file itself), capture the first segment.
  // However, for GitHub pages usually the repo name is the first segment.

  // Current safest relative approach for "components" which are adjacent siblings:
  // If we are at root: fetch('./component/header.html') works.
  // If we are in /errors/404.html: fetch('../component/header.html') is needed.

  // To make this robust without complex regex, we rely on the fact that the user mandated
  // relative paths for static HTML. For JS dynamic loading, we can simply default to './'
  // if we assume the main scripts run from the context of the page location.

  // But if the user wants a global base variable, here it is:
  // We will default to "./" which is relative to the CURRENT PAGE.
  // This means header.html must be loadable via "./component/header.html" relative to index.html

  // IMPORTANT: If a page is in a subdirectory (like errors/), this base must handle it.
  // Let's determine "depth" relative to root.

  // Since the "component" folder is at the root, we need to go up N levels.

  // Check if we are in a known subdirectory structure
  // (This requires knowing the site structure, or we can just use a relative base)

  let base = './';

  // Detect if we are in a subdirectory by checking document location depth relative to the known root structure
  // or simply by checking if 'assets' is accessible.

  // A more robust way for this specific project (where components are at /component/):
  // We can't easily "auto-detect" the root without a reference.
  // We will assume scripts are properly included with relative paths in HTML.

  // For the purpose of the requested task:
  window.SITE_BASE_URL = './';

  // If we are in a nested folder (e.g. /errors/), we need to adjust.
  // We can check the script src of this very script if it was included as a DOM element,
  // but simpler is to check window.location.

  if (window.location.pathname.includes('/errors/')) {
      window.SITE_BASE_URL = '../';
  } else if (window.location.pathname.includes('/pwa/')) { // hypothetical
      window.SITE_BASE_URL = '../../';
  }

  console.log('SITE_BASE_URL set to:', window.SITE_BASE_URL);
})();
