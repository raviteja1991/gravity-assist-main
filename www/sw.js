const CACHE_NAME = 'gravity-assist-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/spawn.js',
  './js/draw.js',
  './js/update.js',
  './js/collisions.js',
  './js/main.js',
  './js/version.js',
  './icon-16.png',
  './icon-32.png',
  './icon-96.png',
  './icon-120.png',
  './icon-144.png',
  './icon-152.png',
  './icon-167.png',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        // Fall back to network request
        return fetch(event.request).then((response) => {
          // Cache successful network responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        return caches.match('./index.html');
      })
  );
});
