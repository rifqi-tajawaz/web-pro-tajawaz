/**
 * Service Worker for Tajawaz Solutions PWA
 * Version: 4.2.0 - Production Ready (Professional Edition)
 *
 * Strategies:
 * - HTML Navigation: Network First (Fresh content always, fallback to offline)
 * - Assets (CSS, JS, Images): Stale-While-Revalidate (Speed + Updates)
 * - 3rd Party (Analytics, CDN): Network Only (Browser handles it, SW ignores)
 *
 * IMPORTANT: This file MUST remain in the root directory (/)
 */

const CACHE_VERSION = 'v4.2.0';
const CACHE_NAME = `tajawaz-${CACHE_VERSION}`;
const OFFLINE_PAGE = './assets/pwa/offline.html';

// Critical assets to precache during install
const PRECACHE_ASSETS = [
  './assets/pwa/offline.html',
  './assets/css/style.css',
  './assets/js/script.js',
  './assets/js/base-url.js',
  './assets/images/favicon/favicon.ico',
  './assets/images/favicon/favicon.svg',
  './assets/images/favicon/favicon-96x96.png',
  './assets/images/favicon/icon-72x72.png',
  './assets/images/favicon/icon-128x128.png',
  './assets/images/favicon/icon-144x144.png',
  './assets/images/favicon/icon-152x152.png',
  './assets/images/favicon/web-app-manifest-192x192.png',
  './assets/images/favicon/icon-384x384.png',
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
        // Precache assets with Promise.allSettled for safety
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

  // 1. Non-HTTP(s) -> Ignore
  if (!url.protocol.startsWith('http')) return;

  // 2. Cross-Origin / 3rd Party -> Network Only (Ignore)
  // Crucial fix: Do NOT call respondWith(). Let browser handle it naturally.
  // This prevents SW errors if external resources are blocked or fail.
  if (url.origin !== self.location.origin) {
    return;
  }

  // 3. Admin/Edit paths -> Network Only
  if (url.pathname.includes('/admin') || url.pathname.includes('/edit')) {
    return;
  }

  /**
   * STRATEGY A: HTML Pages -> Network First
   */
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirstHTML(request));
    return;
  }

  /**
   * STRATEGY B: Static Assets -> Stale-While-Revalidate
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
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

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
      // Silent fail for SWR
    });

  return cachedResponse || fetchPromise;
}
