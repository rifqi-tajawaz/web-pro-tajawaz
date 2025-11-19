/**
 * Service Worker for Tajawaz Solutions PWA
 * Version: 4.0.0 - Production Ready (Professional Edition)
 *
 * IMPORTANT: This file MUST remain in the root directory (/)
 * Reason: Service Workers can only control pages within their scope.
 *         A SW at root (/) can control the entire site.
 *
 * PWA File Structure:
 * - /sw.js (this file - MUST stay in root)
 * - /assets/pwa/pwa-manager.js (PWA installer & manager)
 * - /assets/pwa/manifest.json (PWA manifest)
 * - /assets/pwa/offline.html (offline fallback page)
 *
 * Caching Strategy:
 * - Precache: Critical offline assets during install
 * - Cache First: Static assets (CSS, JS, Images, Fonts)
 * - Stale-While-Revalidate: HTML pages and dynamic content
 * - Network First: API calls with fallback
 *
 * Features:
 * - Offline support with fallback page
 * - Smart caching with automatic cleanup
 * - Background sync for forms
 * - Push notifications support
 * - Cache versioning and expiration
 * - Skip waiting for instant updates
 * - Production-ready error handling
 */

const CACHE_VERSION = 'v4.0.0';
const CACHE_NAME = `tajawaz-${CACHE_VERSION}`;
const OFFLINE_PAGE = './assets/pwa/offline.html';

// Maximum cache size (in bytes) - 50MB
const MAX_CACHE_SIZE = 50 * 1024 * 1024;

// Cache expiration time (7 days)
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

// Critical assets to precache during install
const PRECACHE_ASSETS = [
  './assets/pwa/offline.html',
  './assets/images/favicon/favicon.ico',
  './assets/images/favicon/favicon.svg',
  './assets/images/favicon/favicon-96x96.png',
  './assets/images/favicon/web-app-manifest-192x192.png',
  './assets/images/favicon/web-app-manifest-512x512.png',
  './assets/images/favicon/apple-touch-icon.png',
];

/**
 * INSTALL EVENT
 * Precache critical assets for offline functionality
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Precache assets with individual error handling
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) => {
            return cache.add(url).catch(() => {
              // Silently fail for individual assets
              console.warn(`[SW] Failed to precache: ${url}`);
              return Promise.resolve();
            });
          })
        );
      })
      .then(() => {
        // Skip waiting - activate new SW immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Install error:', error);
      })
  );
});

/**
 * ACTIVATE EVENT
 * Clean up old caches and take control
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('tajawaz-') && cacheName !== CACHE_NAME) {
              console.log(`[SW] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim(),
    ])
  );
});

/**
 * FETCH EVENT
 * Intercept network requests and apply caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip cross-origin requests (external APIs, CDNs)
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  // Skip admin/edit URLs - always fetch fresh
  if (url.pathname.includes('/admin') || url.pathname.includes('/edit')) {
    event.respondWith(fetch(request));
    return;
  }

  /**
   * STRATEGY 1: API & Dynamic Data - Network First with Cache Fallback
   */
  if (url.pathname.includes('/api/') || url.pathname.includes('/php/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  /**
   * STRATEGY 2: HTML Pages - Stale-While-Revalidate with Offline Fallback
   */
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      staleWhileRevalidate(request).catch(() => {
        return caches.match(OFFLINE_PAGE).then((response) => {
          return response || new Response('Offline', { status: 503 });
        });
      })
    );
    return;
  }

  /**
   * STRATEGY 3: Static Assets - Cache First with Network Fallback
   * CSS, JS, Images, Fonts
   */
  if (
    url.pathname.includes('./assets/') ||
    request.url.match(/\.(css|js|jpg|jpeg|png|svg|webp|gif|woff|woff2|ttf|eot|ico)$/i)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  /**
   * DEFAULT STRATEGY: Stale-While-Revalidate
   */
  event.respondWith(staleWhileRevalidate(request));
});

/**
 * Cache First Strategy
 * Try cache first, fallback to network, then cache the result
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Check if cached response is expired
    const cachedDate = new Date(cachedResponse.headers.get('date')).getTime();
    const now = Date.now();

    if (now - cachedDate < CACHE_EXPIRATION) {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, return cached version even if expired
    return cachedResponse || new Response('Network error', { status: 503 });
  }
}

/**
 * Stale-While-Revalidate Strategy
 * Return cached version immediately while fetching fresh version in background
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  return cachedResponse || fetchPromise.then((response) => {
    if (response) {
      return response;
    }
    throw new Error('No cached response and network failed');
  });
}

/**
 * Network First Strategy
 * Try network first, fallback to cache
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response(
      JSON.stringify({
        error: 'Network request failed',
        offline: true,
        message: 'Anda sedang offline. Koneksi diperlukan untuk fitur ini.',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * BACKGROUND SYNC
 * Sync form submissions when connection is restored
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

/**
 * Sync pending form submissions
 */
async function syncForms() {
  try {
    const cache = await caches.open('form-submissions');
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        const response = await cache.match(request);
        const data = await response.json();

        await fetch(request, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        });

        await cache.delete(request);
      } catch (error) {
        // Keep in cache for next sync attempt
      }
    }
  } catch (error) {
    throw error;
  }
}

/**
 * PUSH NOTIFICATIONS
 * Handle incoming push messages
 */
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Notifikasi baru dari Tajawaz Solutions',
    icon: './assets/images/favicon/web-app-manifest-192x192.png',
    badge: './assets/images/favicon/favicon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Lihat',
        icon: './assets/images/favicon/favicon-96x96.png',
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: './assets/images/favicon/favicon-96x96.png',
      },
    ],
    tag: 'tajawaz-notification',
    requireInteraction: false,
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification('Tajawaz Solutions', options));
});

/**
 * NOTIFICATION CLICK
 * Handle notification interactions
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/').catch(() => {
        // Failed to open window
      })
    );
  }
});

/**
 * MESSAGE HANDLER
 * Communication with main thread
 */
self.addEventListener('message', (event) => {
  // Skip waiting - activate new SW immediately
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Cache specific URLs on demand
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.payload);
      })
    );
  }

  // Clear all caches
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      })
    );
  }

  // Get cache status
  if (event.data.type === 'GET_CACHE_STATUS') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map(async (cacheName) => {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            return { name: cacheName, items: keys.length };
          })
        ).then((cacheStats) => {
          event.ports[0].postMessage({ type: 'CACHE_STATUS', payload: cacheStats });
        });
      })
    );
  }
});

/**
 * PERIODIC BACKGROUND SYNC
 * Sync data periodically in the background
 */
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

/**
 * Sync content periodically
 */
async function syncContent() {
  try {
    // Sync logic here
    const cache = await caches.open(CACHE_NAME);
    // Update cached pages in background
  } catch (error) {
    // Handle error
  }
}

/**
 * Cache Size Management
 * Clean up old cache entries if size exceeds limit
 */
async function manageCacheSize() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();

  let totalSize = 0;
  const entries = [];

  for (const request of keys) {
    const response = await cache.match(request);
    const blob = await response.blob();
    const size = blob.size;
    const date = new Date(response.headers.get('date')).getTime();

    totalSize += size;
    entries.push({ request, size, date });
  }

  if (totalSize > MAX_CACHE_SIZE) {
    // Sort by date (oldest first)
    entries.sort((a, b) => a.date - b.date);

    // Delete oldest entries until under limit
    let currentSize = totalSize;
    for (const entry of entries) {
      if (currentSize <= MAX_CACHE_SIZE) break;
      await cache.delete(entry.request);
      currentSize -= entry.size;
    }
  }
}

// Run cache management on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(manageCacheSize());
});
