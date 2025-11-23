/* ================================================================
 * SERVICE WORKER - TAJAWAZ SOLUTIONS PWA
 * ================================================================
 * Version: 4.3.1 - Production Ready
 * 
 * Purpose: Progressive Web App service worker for offline capability
 * 
 * Caching Strategies:
 * - HTML Navigation: Network First (fresh content prioritized)
 * - Assets (CSS, JS, Images): Stale-While-Revalidate
 * - 3rd Party (Analytics, CDN): Network Only
 * ================================================================ */

const CACHE_VERSION = 'v4.3.1';
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
  '/assets/js/main/submit-form.js',
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
  '/',
  '/index.html', // Keep this for fallback
  '/pages/about',
  '/pages/services',
  '/pages/contact',
  '/pages/bio-profile',
  '/pages/products-digital'
];

/* ================================================================
 * INSTALL EVENT
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
        }
        return self.skipWaiting();
      })
  );
});

/* ================================================================
 * ACTIVATE EVENT
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
 * ================================================================ */

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!url.protocol.startsWith('http')) return;

  // Cross-Origin Resources
  if (url.origin !== self.location.origin) return;

  // API Calls - Network Only (never cache POSTs or API)
  if (url.pathname.includes('/api/') || request.method !== 'GET') {
    return;
  }

  // Admin/Edit Paths
  if (url.pathname.includes('/admin') || url.pathname.includes('/edit')) return;

  // Strategy A: HTML Pages - Network First
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirstHTML(request));
    return;
  }

  // Strategy B: Static Assets - Stale-While-Revalidate
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

    // Try to find if we have the .html version cached if the clean URL is missing
    const url = new URL(request.url);
    if (!url.pathname.endsWith('.html')) {
         const htmlPath = url.pathname + '.html';
         const cachedHtml = await caches.match(htmlPath);
         if (cachedHtml) return cachedHtml;
    }

    console.log('[SW] Network failed. Serving offline page...');
    const cache = await caches.open(CACHE_NAME);
    let offlineResponse = await cache.match(OFFLINE_PAGE);

    if (offlineResponse) {
      return offlineResponse;
    } else {
      return new Response('Offline', { status: 503 });
    }
  }
}

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
    .catch((err) => { });

  return cachedResponse || fetchPromise;
}
