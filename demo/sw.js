// Files to cache
var cacheName = 'HexRoulette-v1';
var contentToCache = [
  '/index.html',
  '/app.js',
  '/style.css',
  '/fonts/alfa.eot',
  '/fonts/alfa.ttf',
  '/fonts/alfa.woff',
  '/favicon.ico',
  '/img/background.png',
  '/img/button-spin.png',
  '/img/roulette-bg.png',
  '/img/roulette-icons.png',
  '/img/roulette-overlay.png',
  '/icons/icon-32.png',
  '/icons/icon-64.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-168.png',
  '/icons/icon-192.png',
  '/icons/icon-256.png',
  '/icons/icon-512.png'
];

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});