let CACHE_NAME = 'gravity-assist-cache-v6';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './config.json',
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
  event.waitUntil((async () => {
    try {
      // attempt to derive cache name from runtime config
      try {
        const r = await fetch('config.json', { cache: 'no-store' });
        if (r.ok) {
          const cfg = await r.json();
          if (cfg.cacheName) {
            CACHE_NAME = cfg.cacheName;
          } else if (cfg.app && cfg.app.version) {
            CACHE_NAME = 'gravity-assist-cache-' + cfg.app.version;
          }
        }
      } catch (e) {}

      const cache = await caches.open(CACHE_NAME);
      console.log('Cache opened', CACHE_NAME);
      await cache.addAll(urlsToCache);
    } catch (error) {
      console.error('Cache installation failed:', error);
    }
  })());
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

const OFFLINE_URL = './index.html';
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Navigation requests (SPA) - network-first with cache fallback
  if (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept') && req.headers.get('accept').includes('text/html'))) {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(req);
        // update cache with latest index page
        const cache = await caches.open(CACHE_NAME);
        cache.put(OFFLINE_URL, (await fetch(OFFLINE_URL)).clone()).catch(() => {});
        return networkResponse;
      } catch (err) {
        const cached = await caches.match(OFFLINE_URL);
        return cached || new Response('<h1>Offline</h1>', { status: 503, headers: { 'Content-Type': 'text/html' } });
      }
    })());
    return;
  }

  // For other assets: try cache first, then network, with image placeholder fallback
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const networkResponse = await fetch(req);
      if (networkResponse && networkResponse.status === 200 && req.method === 'GET') {
        const clone = networkResponse.clone();
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, clone).catch(() => {});
      }
      return networkResponse;
    } catch (err) {
      if (req.destination === 'image') {
        const placeholder = `<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">\n  <rect width="100%" height="100%" fill="#111" />\n  <circle cx="128" cy="128" r="48" fill="#222" stroke="#fff" stroke-opacity="0.06" />\n</svg>`;
        return new Response(placeholder, { headers: { 'Content-Type': 'image/svg+xml' } });
      }
      return caches.match(OFFLINE_URL);
    }
  })());
});
