// ALAV COMEX — Service Worker
// Cachea el "shell" de la app (HTML/manifest/íconos) para que abra rápido y offline.
// Los datos (Supabase) NUNCA se cachean: siempre van directo a la red.

const CACHE_NAME = 'alav-comex-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

// Instalación: precachear el shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activación: borrar caches viejos de versiones anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: nunca tocar llamadas a Supabase (siempre red, siempre en vivo)
function isSupabaseRequest(url) {
  return url.hostname.endsWith('.supabase.co');
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Solo manejamos GET del mismo origen; todo lo demás (Supabase, POST, etc.) pasa directo
  if (event.request.method !== 'GET' || isSupabaseRequest(url)) {
    return;
  }

  // Navegación / HTML: network-first, con fallback a cache si no hay conexión
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Estáticos propios (íconos, manifest): cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return res;
        });
      })
    );
  }
});
