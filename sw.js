/* Nursing Hub Service Worker
   غيّر رقم VERSION كل ما ترفع تحديث جديد
   مثلاً: v1 → v2 → v3 ...
*/
const VERSION = 'v23';
const CACHE = 'nursing-hub-' + VERSION;

const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // لا تتدخل في طلبات الفيديو أو الصوت — سيبها تروح للنت مباشرة بدون كاش
  if (e.request.destination === 'video' || e.request.destination === 'audio' || /\.(mp4|webm|mov|mp3|wav)$/i.test(e.request.url)) {
    return; // لا respondWith = المتصفح يتعامل مع الطلب بشكل طبيعي
  }

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

