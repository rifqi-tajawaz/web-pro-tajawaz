/**
 * PWA Manager - Production Edition
 * Version: 3.1.0
 * 
 * Comprehensive PWA management system
 * 
 * @author Tajawaz Solutions
 * @license MIT
 */

class PWAManager {
  constructor(options = {}) {
    this.config = {
      swPath: options.swPath || 'sw.js',
      scope: options.scope || './',
      updateInterval: options.updateInterval || 60000,
      installPromptDelay: options.installPromptDelay || 3000,
      installDismissExpiry: options.installDismissExpiry || 7,
      enableAnalytics: options.enableAnalytics || false,
      enableNotifications: options.enableNotifications || true,
      enableBackgroundSync: options.enableBackgroundSync || true,
      debug: options.debug || false,
      ...options,
    };

    this.state = {
      deferredPrompt: null,
      isInstalled: false,
      isOnline: navigator.onLine,
      registration: null,
      updateAvailable: false,
      cacheStatus: null,
    };

    this.init();
  }

  init() {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      return;
    }

    this.checkInstallStatus();
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupUpdateDetection();
    this.setupNetworkDetection();
    this.setupInstallListener();
    this.setupVisibilityHandler();
  }

  checkInstallStatus() {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      this.state.isInstalled = true;
    }
  }

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    try {
      this.state.registration = await navigator.serviceWorker.register(this.config.swPath, {
        scope: this.config.scope,
      });

      this.setupPeriodicUpdates();
      this.setupMessageChannel();
      this.getCacheStatus();
    } catch (error) {
    }
  }

  setupPeriodicUpdates() {
    if (!this.state.registration) return;

    setInterval(() => {
      this.state.registration.update();
    }, this.config.updateInterval);
  }

  setupMessageChannel() {
    if (!navigator.serviceWorker.controller) return;

    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      if (event.data.type === 'CACHE_STATUS') {
        this.state.cacheStatus = event.data.payload;
      }
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_STATUS' },
      [messageChannel.port2]
    );
  }

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
    } catch (error) {
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.state.deferredPrompt = e;

      setTimeout(() => {
        this.showInstallBanner();
      }, this.config.installPromptDelay);
    });
  }

  showInstallBanner() {
    if (this.state.isInstalled) return;

    const dismissedUntil = localStorage.getItem('pwa-install-dismissed-until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
      return;
    }

    let banner = document.getElementById('pwa-install-banner');
    if (banner) return;

    banner = this.createInstallBanner();
    document.body.appendChild(banner);
  }

  createInstallBanner() {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';

    banner.innerHTML = `
      <div class="pwa-install-banner">
        <div class="pwa-install-content">
          <div class="pwa-install-icon">
            <img src="../assets/images/favicon/favicon-96x96.png" alt="Tajawaz" width="40" height="40">
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

  async promptInstall() {
    if (!this.state.deferredPrompt) {
      return;
    }

    try {
      this.state.deferredPrompt.prompt();

      const { outcome } = await this.state.deferredPrompt.userChoice;

      if (this.config.enableAnalytics) {
        this.trackEvent('pwa_install_prompt', { outcome });
      }

      this.state.deferredPrompt = null;

      document.getElementById('pwa-install-banner')?.remove();
    } catch (error) {
    }
  }

  dismissInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.style.animation = 'pwa-slide-down 0.4s ease-out forwards';
      setTimeout(() => banner.remove(), 400);
    }

    const dismissedUntil = Date.now() + this.config.installDismissExpiry * 24 * 60 * 60 * 1000;
    localStorage.setItem('pwa-install-dismissed-until', dismissedUntil.toString());

    if (this.config.enableAnalytics) {
      this.trackEvent('pwa_install_dismissed');
    }
  }

  setupInstallListener() {
    window.addEventListener('appinstalled', () => {
      this.state.isInstalled = true;

      localStorage.removeItem('pwa-install-dismissed-until');

      document.getElementById('pwa-install-banner')?.remove();

      this.showSuccessMessage();

      if (this.config.enableAnalytics) {
        this.trackEvent('pwa_installed');
      }
    });
  }

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
      const toast = message.querySelector('.pwa-success-toast');
      if (toast) {
        toast.style.animation = 'pwa-fade-out 0.4s forwards';
        setTimeout(() => message.remove(), 400);
      }
    }, 6000);
  }

  setupUpdateDetection() {
    if (!this.state.registration) return;

    this.state.registration.addEventListener('updatefound', () => {
      const newWorker = this.state.registration.installing;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.state.updateAvailable = true;
          this.showUpdateNotification();
        }
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

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

  setupNetworkDetection() {
    window.addEventListener('online', () => {
      this.state.isOnline = true;
      this.showNetworkStatus('online');

      if (this.config.enableAnalytics) {
        this.trackEvent('network_online');
      }
    });

    window.addEventListener('offline', () => {
      this.state.isOnline = false;
      this.showNetworkStatus('offline');

      if (this.config.enableAnalytics) {
        this.trackEvent('network_offline');
      }
    });
  }

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

  setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.state.registration) {
        this.state.registration.update();
      }
    });
  }

  async clearAllCaches() {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      if (this.config.enableAnalytics) {
        this.trackEvent('pwa_cache_cleared');
      }
    } catch (error) {
    }
  }

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

  trackEvent(eventName, data = {}) {
    if (!this.config.enableAnalytics) return;

    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }

    if (this.config.onEvent) {
      this.config.onEvent(eventName, data);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager({
      debug: false,
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

window.PWAManager = PWAManager;
