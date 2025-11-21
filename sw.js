/**
 * Service Worker for Tajawaz Solutions PWA
 * Version: 4.1.1 - Production Ready (Professional Edition)
 *
 * Strategies:
 * - HTML Navigation: Network First (Fresh content always, fallback to offline)
 * - Assets (CSS, JS, Images): Stale-While-Revalidate (Speed + Updates)
 *
 * IMPORTANT: This file MUST remain in the root directory (/)
 */

const CACHE_VERSION = 'v4.1.1';
const CACHE_NAME = `tajawaz-${CACHE_VERSION}`;
const OFFLINE_PAGE = './assets/pwa/offline.html';

// Maximum cache size (in bytes) - 100MB
const MAX_CACHE_SIZE = 100 * 1024 * 1024;

// Cache expiration time (7 days)
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

// Critical assets to precache during install
const PRECACHE_ASSETS = [
  './assets/pwa/offline.html',
  './assets/css/style.css',
  './assets/pwa/_pwa-theme.css',
  './assets/pwa/pwa-styles.css',
  './assets/js/script.js',
  './assets/js/base-url.js',
  './assets/images/favicon/favicon.ico',
  './assets/images/favicon/favicon.svg',
  './assets/images/favicon/favicon-96x96.png',
  './assets/images/favicon/web-app-manifest-192x192.png',
  './assets/images/favicon/web-app-manifest-512x512.png',
  './index.html',
  './about.html',
  './service.html',
  './contact.html',
  './bio-profile.html',
  './products-digital.html',
  './errors/403.html',
  './errors/404.html',
  './errors/500.html',
  './errors/503.html'
];

/**
 * INSTALL EVENT
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Precache assets
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) => {
            return cache.add(url).catch((err) => {
              console.warn(`[SW] Failed to precache: ${url}`, err);
              return Promise.resolve();
            });
          })
        );
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

/**
 * ACTIVATE EVENT
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
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

/**
 * FETCH EVENT
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Skip cross-origin requests (external APIs, CDNs)
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  // Admin/Edit paths - Always Network Only
  if (url.pathname.includes('/admin') || url.pathname.includes('/edit')) {
    event.respondWith(fetch(request));
    return;
  }

  /**
   * STRATEGY 1: HTML Pages -> Network First (with Offline Fallback)
   */
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirstHTML(request));
    return;
  }

  /**
   * STRATEGY 2: Static Assets -> Stale-While-Revalidate
   * CSS, JS, Images, Fonts
   */
  if (
    url.pathname.includes('assets/') ||
    request.url.match(/\.(css|js|jpg|jpeg|png|svg|webp|gif|woff|woff2|ttf|eot|ico|json)$/i)
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default: Stale-While-Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

/**
 * Network First Strategy for HTML
 */
async function networkFirstHTML(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      // Use event.waitUntil equivalent if accessible, or just fire and forget carefully
      // Since we are in async function called by respondWith, we can just put it.
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // No cache, show offline page
    const cache = await caches.open(CACHE_NAME);
    const offlineResponse = await cache.match(OFFLINE_PAGE);
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

/**
 * Stale-While-Revalidate Strategy for Assets
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
      // Network failed - silent fail for SWR
    });

  return cachedResponse || fetchPromise;
}
