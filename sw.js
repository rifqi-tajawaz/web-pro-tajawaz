/* ================================================================
 * SERVICE WORKER - TAJAWAZ SOLUTIONS PWA
 * ================================================================
 * Version: 4.3.0 - Production Ready
 * 
 * Purpose: Progressive Web App service worker untuk offline capability
 * 
 * Caching Strategies:
 * - HTML Navigation: Network First (fresh content prioritized)
 * - Assets (CSS, JS, Images): Stale-While-Revalidate
 * - 3rd Party (Analytics, CDN): Network Only
 * 
 * IMPORTANT: File ini HARUS di root directory (/)
 * ================================================================ */

const CACHE_VERSION = 'v4.3.0';
const CACHE_NAME = `tajawaz-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/pwa/offline.html';

/* ================================================================
 * PRECACHE ASSETS
 * ================================================================ */

const PRECACHE_ASSETS = [
  '/pwa/offline.html',
  '/assets/css/main/style.css',
  '/assets/js/main/script.js',
  '/assets/js/main/base-url.js',
  '/assets/images/favicon/favicon.ico',
  '/assets/images/favicon/favicon.svg',
  '/assets/images/favicon/favicon-96x96.png',
  '/assets/images/favicon/icon-72x72.png',
  '/assets/images/favicon/icon-128x128.png',
  '/assets/images/favicon/icon-144x144.png',
  '/assets/images/favicon/icon-152x152.png',
  '/assets/images/favicon/web-app-manifest-192x192.png',
  '/assets/images/favicon/icon-384x384.png',
  '/assets/images/favicon/web-app-manifest-512x512.png',
  '/index.html',
  '/pages/about.html',
  '/pages/services.html',
  '/pages/contact.html',
  '/pages/bio-profile.html',
  '/pages/products-digital.html'
];

/* ================================================================
 * INSTALL EVENT
 * ================================================================
 * Purpose: Precache critical assets saat SW pertama kali install
 * ================================================================ */

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) => {
            return cache.add(url).catch((err) => {
              console.warn(`[SW] Failed to precache: ${url}`, err);
              return Promise.resolve();
            });
          })
        );
      })
      .then(async () => {
        const cache = await caches.open(CACHE_NAME);
        const offlinePage = await cache.match(OFFLINE_PAGE);
        if (!offlinePage) {
          console.error('[SW] CRITICAL: Offline page not cached!');
        } else {
          console.log('[SW] ✓ Offline page successfully cached');
        }
        return self.skipWaiting();
      })
  );
});

/* ================================================================
 * ACTIVATE EVENT
 * ================================================================
 * Purpose: Cleanup old caches dan activate new service worker
 * ================================================================ */

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('tajawaz-') && cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim(),
    ])
  );
});

/* ================================================================
 * FETCH EVENT
 * ================================================================
 * Purpose: Intercept network requests dan apply caching strategies
 * ================================================================ */

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!url.protocol.startsWith('http')) return;

  /**
   * Cross-Origin Resources
   * Purpose: Let browser handle 3rd party resources naturally
   */
  if (url.origin !== self.location.origin) {
    return;
  }

  /**
   * Admin/Edit Paths
   * Purpose: Always fetch fresh untuk admin interfaces
   */
  if (url.pathname.includes('/admin') || url.pathname.includes('/edit')) {
    return;
  }

  /**
   * Strategy A: HTML Pages - Network First
   * Purpose: Prioritas content terbaru, fallback ke cache
   */
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirstHTML(request));
    return;
  }

  /**
   * Strategy B: Static Assets - Stale-While-Revalidate
   * Purpose: Speed + background updates
   */
  if (
    url.pathname.includes('assets/') ||
    request.url.match(/\.(css|js|jpg|jpeg|png|svg|webp|gif|woff|woff2|ttf|eot|ico|json)$/i)
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

/* ================================================================
 * CACHING STRATEGIES
 * ================================================================ */

/**
 * Network First Strategy
 * 
 * Purpose: Fetch dari network dulu, fallback ke cache jika offline
 * Use Case: HTML pages yang butuh content terbaru
 */
async function networkFirstHTML(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    console.log('[SW] Network failed. Serving offline page...');
    const cache = await caches.open(CACHE_NAME);
    let offlineResponse = await cache.match(OFFLINE_PAGE);

    if (!offlineResponse) {
      const altOfflineResponse = await cache.match('/pwa/offline.html');
      if (altOfflineResponse) offlineResponse = altOfflineResponse;
    }

    if (offlineResponse) {
      console.log('[SW] Served offline page from cache.');
      return offlineResponse;
    } else {
      console.warn('[SW] Offline page not found in cache.');
      return new Response('Offline', { status: 503 });
    }
  }
}

/**
 * Stale-While-Revalidate Strategy
 * 
 * Purpose: Return cached content immediately, update cache di background
 * Use Case: Static assets yang jarang berubah
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
    .catch((err) => {
      // Silent fail untuk SWR strategy
    });

  return cachedResponse || fetchPromise;
}

/* ================================================================
 * PUSH NOTIFICATION SUPPORT
 * ================================================================
 * Purpose: Placeholder untuk future implementation
 * ================================================================ */

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Tajawaz Solutions',
    icon: './assets/images/favicon/web-app-manifest-192x192.png',
    badge: './assets/images/favicon/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Tajawaz Solutions', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
