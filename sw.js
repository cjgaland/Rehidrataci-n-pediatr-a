/**
 * Service Worker — Hidratación IV Pediátrica
 *
 * Estrategia: cache-first con fallback a red.
 * Precachea el shell de la app en install.
 *
 * Para publicar una actualización: bump CACHE_VERSION (ej. v1.0.0 → v1.0.1),
 * commit y push. Los dispositivos detectarán la nueva versión y mostrarán
 * el banner "Nueva versión disponible" en la app.
 */

const CACHE_VERSION = 'v1.0.3';
const CACHE_NAME = 'hidrativ-' + CACHE_VERSION;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
];

// === Install: precachea los recursos del shell ===
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => console.warn('[SW] Precache fallido:', err))
  );
});

// === Activate: borra cachés antiguos y toma control ===
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith('hidrativ-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// === Fetch: cache-first, fallback a red, fallback final a index.html ===
//
// IMPORTANTE: sw.js y manifest.webmanifest se sirven SIEMPRE desde red
// (network-only). Si se cachean, el navegador no detecta cambios al hacer
// register('./sw.js') y el banner de actualización nunca se dispara.
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Solo GET y mismo origen
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  const url = new URL(req.url);
  const path = url.pathname;
  const isSWorManifest = /\/sw\.js$/.test(path) || /\/manifest\.webmanifest$/.test(path);

  if (isSWorManifest) {
    // Network-only: nunca cachear, para que las actualizaciones se detecten.
    event.respondWith(fetch(req).catch(() => new Response('', { status: 503, statusText: 'Offline' })));
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((response) => {
        // Cachea la respuesta si es válida
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return response;
      }).catch(() => {
        // Sin red ni cache: si es navegación, devolver index.html
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

// === Mensajes del cliente (skipWaiting para actualización inmediata) ===
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
