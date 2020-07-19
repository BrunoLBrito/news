'use strict';

const cacheName = 'alternative-v1';
const filesToCache = [
    './',
    './index.js',
    './index.html',
    './fallback.json',
    './images/fetch-dog.jpg'
];



self.addEventListener('install', (e) => {
    console.log('Service Worker instalado com sucesso');
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                cache.addAll(filesToCache);
                console.log('Arquivos cacheado');
            })
    );
})

self.addEventListener('activate', e => {
    e.waitUntil(self.clients.claim());
})

self.addEventListener('fetch', e => {
    let request = e.request;
    let url = new URL(request.url);

    if(url.origin === location.origin){
        e.respondWith(cacheFirst(request));
    } else {
        e.respondWith(networkFirst(request));
    }
})

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const dynamicCache = await caches.open('alternative-dynamic');
  try {
    const networkResponse = await fetch(request);
    dynamicCache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cachedResponse = await dynamicCache.match(request);
    return cachedResponse || await caches.match('./fallback.json');
  }
}