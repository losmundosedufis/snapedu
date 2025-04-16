const CACHE_NAME = 'stopmotion-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/src/main.js',
  '/src/player.js',
  '/src/onionSkin.js',
  '/src/gridOverlay.js',
  '/src/camera.js',
  '/src/storage.js',
  '/src/keyboardShortcuts.js',
  // engade aquí outros ficheiros clave se é necesario
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});