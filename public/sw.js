const CACHE_NAME = 'MorfoSintaxe-v3';

const ARQUIVOS_PARA_CACHE = [
  '/',
  '/offline.html',
  '/css/styles.css',
  '/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_PARA_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(
        chaves
          .filter((chave) => chave !== CACHE_NAME)
          .map((chave) => caches.delete(chave))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((r) => r || caches.match('/offline.html'))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cacheado) => {
      return (
        cacheado ||
        fetch(request).then((resposta) => {
          const copia = resposta.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          return resposta;
        })
      );
    })
  );
});
