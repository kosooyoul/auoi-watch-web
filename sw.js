// Service Worker for Ring Time Clock PWA
// Version 1.13.0

const CACHE_NAME = 'ring-clock-v1.13.0';
const RUNTIME_CACHE = 'ring-clock-runtime';

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/js/constants.js',
  '/js/utils.js',
  '/js/theme.js',
  '/js/clock.js',
  '/js/fullscreen.js',
  '/js/pwa.js',
  '/js/alarm.js',
  '/js/world-clock.js',
  '/js/stopwatch.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        // Cache each asset individually to avoid failing if some are missing
        return Promise.allSettled(
          STATIC_ASSETS.map((url) => {
            return cache.add(url).catch((err) => {
              console.warn(`[Service Worker] Failed to cache ${url}:`, err);
            });
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Static assets cached');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old caches (different versions)
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first strategy for HTML (always get fresh content)
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-first strategy for other assets (CSS, JS, images)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone and cache the response
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          });
      })
  );
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Background sync (for future use - alarms, timers)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);

  if (event.tag === 'sync-alarms') {
    // Future: sync alarm data
  }
});

// Push notification (for future use - alarms)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Ring Time Clock notification',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: data.tag || 'ring-clock-notification',
      requireInteraction: true
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Ring Clock', options)
    );
  }
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
