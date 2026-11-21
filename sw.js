const CACHE_NAME = 'MorfoSintaxe-v3';

const ARQUIVOS_PARA_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/styles.css',
  '/js/app.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 1. INSTALL: guarda os arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_PARA_CACHE))
  );
  self.skipWaiting(); // ativa a nova versão sem esperar
});

// 2. ACTIVATE: apaga caches de versões antigas
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

// 3. FETCH: estratégia de cache
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Só trata GET
  if (request.method !== 'GET') return;

  // Navegação (páginas HTML): rede primeiro, fallback para cache/offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((r) => r || caches.match('/offline.html'))
      )
    );
    return;
  }

  // Demais arquivos (CSS, JS, imagens): cache primeiro
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