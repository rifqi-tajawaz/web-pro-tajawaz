/* ================================================================
 * SITE BASE URL DETECTION
 * ================================================================
 * Purpose: Deteksi otomatis base URL untuk dynamic asset loading
 * 
 * Strategy:
 * 1. GitHub Pages Project Site (e.g., /repo-name/) → SITE_BASE_URL = '/repo-name/'
 * 2. Root domain atau Localhost → SITE_BASE_URL = ''
 * 
 * Note: Variable ini untuk assets yang di-inject via JavaScript.
 *       Static HTML tags (link, script, img) gunakan relative paths ("./assets/...")
 * 
 * Dependencies: None
 * ================================================================ */

(function() {
  /**
   * Path Adjustment untuk Nested Directories
   * Purpose: Mengatur base URL berdasarkan lokasi file
   */
  const path = window.location.pathname;
  
  if (path.includes('/errors/')) {
      window.SITE_BASE_URL = '../';
  } else if (path.includes('/pwa/')) {
      window.SITE_BASE_URL = '../../';
  } else {
      window.SITE_BASE_URL = './';
  }
})();
