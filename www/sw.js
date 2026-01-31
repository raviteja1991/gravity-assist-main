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
  './icons/icon-16.svg',
  './icons/icon-32.svg',
  './icons/icon-96.svg',
  './icons/icon-120.svg',
  './icons/icon-144.svg',
  './icons/icon-152.svg',
  './icons/icon-167.svg',
  './icons/icon-180.svg',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/screenshot-540x720.svg',
  './icons/screenshot-1280x720.svg'
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
  event.respondWith((async () => {
    try {
      const cached = await caches.match(event.request);
      if (cached) return cached;

      const networkResponse = await fetch(event.request);
      // Only cache successful GET responses
      if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
        const responseClone = networkResponse.clone();
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, responseClone);
      }
      return networkResponse;
    } catch (err) {
      // If image request, return a tiny inline SVG placeholder
      if (event.request.destination === 'image') {
        const placeholder = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="100%" height="100%" fill="#111" />
  <circle cx="128" cy="128" r="48" fill="#222" stroke="#fff" stroke-opacity="0.06" />
</svg>`;
        return new Response(placeholder, { headers: { 'Content-Type': 'image/svg+xml' } });
      }
      // Otherwise fall back to the cached index (app shell)
      const cacheFallback = await caches.match('./index.html');
      return cacheFallback;
    }
  })());
});
