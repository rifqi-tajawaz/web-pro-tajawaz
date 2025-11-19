/**
 * PWA Manager - Professional Edition
 * Version: 3.0.0
 * 
 * Comprehensive PWA management system with:
 * - Service Worker registration & lifecycle management
 * - Install prompt with smart timing
 * - Update notifications & reload management
 * - Offline/online status detection
 * - Cache management interface
 * - Push notification support
 * - Background sync support
 * - Analytics integration ready
 * - Professional UI/UX with animations
 * 
 * @author Tajawaz Solutions
 * @license MIT
 */

class PWAManager {
  constructor(options = {}) {
    // Configuration
    this.config = {
      swPath: options.swPath || '/sw.js',
      scope: options.scope || '/',
      updateInterval: options.updateInterval || 60000, // 1 minute
      installPromptDelay: options.installPromptDelay || 3000, // 3 seconds
      installDismissExpiry: options.installDismissExpiry || 7, // 7 days
      enableAnalytics: options.enableAnalytics || false,
      enableNotifications: options.enableNotifications || true,
      enableBackgroundSync: options.enableBackgroundSync || true,
      debug: options.debug || false,
      ...options,
    };

    // State
    this.state = {
      deferredPrompt: null,
      isInstalled: false,
      isOnline: navigator.onLine,
      registration: null,
      updateAvailable: false,
      cacheStatus: null,
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize PWA Manager
   */
  init() {
    this.log('Initializing PWA Manager...');

    // Load PWA styles
    this.loadPWAStyles();

    // Check if already installed
    this.checkInstallStatus();

    // Register service worker
    this.registerServiceWorker();

    // Setup install prompt
    this.setupInstallPrompt();

    // Setup update detection
    this.setupUpdateDetection();

    // Setup online/offline detection
    this.setupNetworkDetection();

    // Setup install listener
    this.setupInstallListener();

    // Setup visibility change handler
    this.setupVisibilityHandler();

    this.log('PWA Manager initialized successfully');
  }

  /**
   * Check if app is already installed
   */
  checkInstallStatus() {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      this.state.isInstalled = true;
      this.log('App is running in standalone mode');
    }
  }

  /**
   * Register Service Worker
   */
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      this.log('Service Workers not supported', 'warn');
      return;
    }

    try {
      this.state.registration = await navigator.serviceWorker.register(this.config.swPath, {
        scope: this.config.scope,
      });

      this.log('Service Worker registered successfully');

      // Setup periodic update checks
      this.setupPeriodicUpdates();

      // Setup message channel
      this.setupMessageChannel();

      // Get cache status
      this.getCacheStatus();
    } catch (error) {
      this.log(`Service Worker registration failed: ${error}`, 'error');
    }
  }

  /**
   * Setup periodic update checks
   */
  setupPeriodicUpdates() {
    if (!this.state.registration) return;

    setInterval(() => {
      this.state.registration.update();
      this.log('Checking for updates...');
    }, this.config.updateInterval);
  }

  /**
   * Setup message channel for SW communication
   */
  setupMessageChannel() {
    if (!navigator.serviceWorker.controller) return;

    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      if (event.data.type === 'CACHE_STATUS') {
        this.state.cacheStatus = event.data.payload;
        this.log('Cache status received:', this.state.cacheStatus);
      }
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_STATUS' },
      [messageChannel.port2]
    );
  }

  /**
   * Get cache status from service worker
   */
  async getCacheStatus() {
    if (!this.state.registration) return;

    try {
      const cacheNames = await caches.keys();
      const cacheDetails = [];

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheDetails.push({
          name: cacheName,
          items: keys.length,
        });
      }

      this.state.cacheStatus = cacheDetails;
      this.log('Cache status:', cacheDetails);
    } catch (error) {
      this.log(`Failed to get cache status: ${error}`, 'error');
    }
  }

  /**
   * Setup install prompt
   */
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.state.deferredPrompt = e;
      this.log('Install prompt captured');

      // Show install button after delay
      setTimeout(() => {
        this.showInstallBanner();
      }, this.config.installPromptDelay);
    });
  }

  /**
   * Show install banner
   */
  showInstallBanner() {
    // Don't show if already installed
    if (this.state.isInstalled) return;

    // Check if user dismissed before and it's not expired
    const dismissedUntil = localStorage.getItem('pwa-install-dismissed-until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
      this.log('Install banner dismissed by user');
      return;
    }

    // Create banner if not exists
    let banner = document.getElementById('pwa-install-banner');
    if (banner) return;

    banner = this.createInstallBanner();
    document.body.appendChild(banner);
    this.log('Install banner shown');
  }

  /**
   * Create install banner HTML
   */
  createInstallBanner() {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-install-banner">
        <div class="pwa-install-content">
          <div class="pwa-install-icon">
            <img src="/assets/images/favicon/favicon-96x96.png" alt="Tajawaz" width="40" height="40">
          </div>
          <div class="pwa-install-text">
            <strong>Install Tajawaz Solutions</strong>
            <p>Akses lebih cepat dan dapat digunakan offline</p>
          </div>
          <button class="pwa-install-button" id="pwa-install-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Install
          </button>
          <button class="pwa-install-close" id="pwa-install-close">
            ✕
          </button>
        </div>
      </div>
    `;

    // Setup event listeners
    setTimeout(() => {
      document.getElementById('pwa-install-btn')?.addEventListener('click', () => {
        this.promptInstall();
      });

      document.getElementById('pwa-install-close')?.addEventListener('click', () => {
        this.dismissInstallBanner();
      });
    }, 100);

    return banner;
  }

  /**
   * Load PWA styles
   */
  loadPWAStyles() {
    if (!document.getElementById('pwa-styles-link')) {
      const link = document.createElement('link');
      link.id = 'pwa-styles-link';
      link.rel = 'stylesheet';
      link.href = '/assets/pwa/pwa-styles.css';
      document.head.appendChild(link);
      this.log('PWA styles loaded');
    }
  }

  /**
   * Prompt install
   */
  async promptInstall() {
    if (!this.state.deferredPrompt) {
      this.log('No install prompt available', 'warn');
      return;
    }

    try {
      // Show install prompt
      this.state.deferredPrompt.prompt();

      // Wait for user response
      const { outcome } = await this.state.deferredPrompt.userChoice;
      this.log(`Install prompt outcome: ${outcome}`);

      if (this.config.enableAnalytics) {
        this.trackEvent('pwa_install_prompt', { outcome });
      }

      // Clear deferred prompt
      this.state.deferredPrompt = null;

      // Remove banner
      document.getElementById('pwa-install-banner')?.remove();
    } catch (error) {
      this.log(`Install prompt error: ${error}`, 'error');
    }
  }

  /**
   * Dismiss install banner
   */
  dismissInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.style.animation = 'pwa-slide-down 0.4s ease-out forwards';
      setTimeout(() => banner.remove(), 400);
    }

    // Remember dismissal
    const dismissedUntil = Date.now() + this.config.installDismissExpiry * 24 * 60 * 60 * 1000;
    localStorage.setItem('pwa-install-dismissed-until', dismissedUntil.toString());

    if (this.config.enableAnalytics) {
      this.trackEvent('pwa_install_dismissed');
    }
  }

  /**
   * Setup install listener
   */
  setupInstallListener() {
    window.addEventListener('appinstalled', () => {
      this.state.isInstalled = true;
      this.log('App installed successfully');

      // Clear dismiss flag
      localStorage.removeItem('pwa-install-dismissed-until');

      // Remove banner
      document.getElementById('pwa-install-banner')?.remove();

      // Show success message
      this.showSuccessMessage();

      if (this.config.enableAnalytics) {
        this.trackEvent('pwa_installed');
      }
    });
  }

  /**
   * Show success message
   */
  showSuccessMessage() {
    const message = document.createElement('div');
    message.id = 'pwa-success-notification';
    message.innerHTML = `
      <div class="pwa-success-toast">
        <div class="pwa-success-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M8 12.5L10.5 15L16 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="pwa-success-content">
          <strong>Berhasil Diinstall! 🎉</strong>
          <p>Aplikasi Tajawaz Solutions sudah siap digunakan</p>
        </div>
        <button class="pwa-success-close" onclick="this.closest('#pwa-success-notification').remove()">✕</button>
      </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.querySelector('.pwa-success-toast').style.animation = 'pwa-fade-out 0.4s forwards';
      setTimeout(() => message.remove(), 400);
    }, 6000);
  }

  /**
   * Setup update detection
   */
  setupUpdateDetection() {
    if (!this.state.registration) return;

    this.state.registration.addEventListener('updatefound', () => {
      const newWorker = this.state.registration.installing;
      this.log('Update found, installing...');

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.state.updateAvailable = true;
          this.showUpdateNotification();
          this.log('Update available');
        }
      });
    });

    // Handle controller change
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  /**
   * Show update notification
   */
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.innerHTML = `
      <div class="pwa-update-toast">
        <div class="pwa-update-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/>
          </svg>
        </div>
        <div class="pwa-update-content">
          <strong>Update Tersedia! 🚀</strong>
          <p>Versi baru dengan fitur dan perbaikan terbaru</p>
        </div>
        <button class="pwa-update-button" onclick="window.location.reload()">
          Update Sekarang
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    if (this.config.enableAnalytics) {
      this.trackEvent('pwa_update_available');
    }
  }

  /**
   * Setup network detection
   */
  setupNetworkDetection() {
    window.addEventListener('online', () => {
      this.state.isOnline = true;
      this.showNetworkStatus('online');
      this.log('Network: Online');

      if (this.config.enableAnalytics) {
        this.trackEvent('network_online');
      }
    });

    window.addEventListener('offline', () => {
      this.state.isOnline = false;
      this.showNetworkStatus('offline');
      this.log('Network: Offline');

      if (this.config.enableAnalytics) {
        this.trackEvent('network_offline');
      }
    });
  }

  /**
   * Show network status
   */
  showNetworkStatus(status) {
    const existing = document.getElementById('pwa-network-status');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.id = 'pwa-network-status';
    
    const isOnline = status === 'online';
    const statusClass = isOnline ? 'online' : 'offline';
    const icon = isOnline ? '✓' : '✕';
    const message = isOnline ? 'Koneksi kembali' : 'Tidak ada koneksi';

    notification.innerHTML = `
      <div class="pwa-network-status ${statusClass}">
        <span style="font-size: 18px;">${icon}</span>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'pwa-fade-out 0.3s ease-out forwards';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Setup visibility change handler
   */
  setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.state.registration) {
        this.state.registration.update();
        this.log('Checking for updates (visibility change)...');
      }
    });
  }

  /**
   * Clear all caches
   */
  async clearAllCaches() {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      this.log('All caches cleared');

      if (this.config.enableAnalytics) {
        this.trackEvent('pwa_cache_cleared');
      }
    } catch (error) {
      this.log(`Failed to clear caches: ${error}`, 'error');
    }
  }

  /**
   * Get install status
   */
  getStatus() {
    return {
      isInstalled: this.state.isInstalled,
      canPrompt: this.state.deferredPrompt !== null,
      isOnline: this.state.isOnline,
      updateAvailable: this.state.updateAvailable,
      cacheStatus: this.state.cacheStatus,
      registration: this.state.registration !== null,
    };
  }

  /**
   * Track analytics event
   */
  trackEvent(eventName, data = {}) {
    if (!this.config.enableAnalytics) return;

    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }

    // Custom analytics
    if (this.config.onEvent) {
      this.config.onEvent(eventName, data);
    }
  }

  /**
   * Logger
   */
  log(message, level = 'info') {
    if (!this.config.debug && level === 'info') return;

    const prefix = '[PWA Manager]';
    const styles = {
      info: 'color: #5f2ded',
      warn: 'color: #f59e0b',
      error: 'color: #ef4444',
    };

    console.log(`%c${prefix} ${message}`, styles[level] || styles.info);
  }
}

// Initialize PWA Manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager({
      debug: false, // Set to true for debugging
      enableAnalytics: true,
      enableNotifications: true,
      enableBackgroundSync: true,
    });
  });
} else {
  window.pwaManager = new PWAManager({
    debug: false,
    enableAnalytics: true,
    enableNotifications: true,
    enableBackgroundSync: true,
  });
}

// Export for manual use
window.PWAManager = PWAManager;
