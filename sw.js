// sw.js (Service Worker)

const CACHE_NAME = 'mood-log-v1';

// List of files to cache upon installation
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './app.js',
  './data.js',
  './navigation.js',
  './logger.js',
  './history.js',
  './chart.js',
  './crisis.js',
  './export.js',
  './images/icon-192.png',
  './images/icon-512.png',
  // Note: External CDNs (Chart.js, jsPDF) are typically not cached here
];

// --- INSTALL EVENT ---
self.addEventListener('install', (event) => {
  // Install the files listed in urlsToCache
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache, pre-caching all assets.');
      return cache.addAll(urlsToCache);
    }),
  );
});

// --- FETCH EVENT (Serving cached assets) ---
self.addEventListener('fetch', (event) => {
  // Strategy: Cache-First (for application shell assets)
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached asset if found
      if (response) {
        return response;
      }
      // Otherwise, fetch from the network
      return fetch(event.request);
    }),
  );
});

// --- ACTIVATE EVENT (Cleaning up old caches) ---
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Delete old, unused caches
          }
        }),
      );
    }),
  );
});
