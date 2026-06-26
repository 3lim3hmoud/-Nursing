/* Nursing Hub Service Worker
   غيّر رقم VERSION كل ما ترفع تحديث جديد
   مثلاً: v1 → v2 → v3 ...
*/
const VERSION = 'v33';
const CACHE = 'nursing-hub-' + VERSION;

// App shell: الحاجات اللي لازم تتكاش من أول زيارة عشان الموقع يفتح
// أوفلاين بالكامل (بما فيه فيديو الخلفية).
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './bg.mp4'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      // كل asset لوحده عشان فشل واحد (مثلاً أيقونة ناقصة) ما يوقفش التثبيت كله
      Promise.all(
        ASSETS.map(url => cache.add(url).catch(err => console.warn('[sw] could not cache', url, err)))
      )
    )
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
  const req = e.request;
  const isMedia = req.destination === 'video' || req.destination === 'audio'
    || /\.(mp4|webm|mov|mp3|wav)$/i.test(req.url);

  if (isMedia) {
    // الفيديو/الصوت: كاش-أولاً عشان يبان فوراً أوفلاين، مع تحديث الكاش
    // في الخلفية لو فيه نت (في حالة لو الملف اتغيّر يوماً ما).
    e.respondWith(
      caches.match(req).then(cached => {
        const networkFetch = fetch(req)
          .then(res => {
            if (res && res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then(cache => cache.put(req, clone)).catch(() => {});
            }
            return res;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

  // باقي الموقع: نت-أولاً (عشان أي تحديث في المحتوى أو بيانات الطالب
  // يوصل فوراً وهو متصل)، ولو مفيش نت يرجع للكاش.
  e.respondWith(
    fetch(req)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(req, clone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req))
  );
});
