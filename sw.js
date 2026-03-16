const CACHE_NAME = 'bosquecr-v6';

// Recursos externos CDN — estables (URLs versionadas), cache-first
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.9.0/proj4.js'
];

// Recursos locales — se pre-cachean pero se sirven network-first
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './preview_smartphone.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([...LOCAL_ASSETS, ...CDN_ASSETS])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isCDN = CDN_ASSETS.some(a => event.request.url.startsWith(a.split('?')[0]));
  const isLocal = url.origin === self.location.origin;

  if (isCDN) {
    // Cache-first para CDN: estables, no cambian
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return response;
        });
      })
    );
  } else if (isLocal) {
    // Network-first para archivos locales: siempre intenta obtener versión fresca
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request)) // offline: sirve caché
    );
  } else {
    // Cualquier otro recurso: network con fallback a caché
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
