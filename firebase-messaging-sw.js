// firebase-messaging-sw.js — COMBINED: FCM + App Cache
// ⚠️ هذا الملف يحل محل sw.js — لا تحتاج sw.js بعد الآن

importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js');

// ─── Cache (غيّر VERSION كل ما ترفع تحديث جديد) ───
const VERSION = 'v64';   // ← رفّعها عن v50 عشان يُجبر المتصفح يتحدث
const CACHE   = 'nursing-hub-' + VERSION;
const ASSETS  = ['./', './index.html', './manifest.json'];

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
  // لا تتدخل في طلبات الفيديو أو الصوت
  if (
    e.request.destination === 'video' ||
    e.request.destination === 'audio' ||
    /\.(mp4|webm|mov|mp3|wav)$/i.test(e.request.url)
  ) return;

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

// ─── Firebase Cloud Messaging ───
firebase.initializeApp({
  apiKey: "AIzaSyBJGf-9KbQF-aCi3iH9rDxmF4xxgrpc_UI",
  authDomain: "nursing-hub-bb7e9.firebaseapp.com",
  projectId: "nursing-hub-bb7e9",
  storageBucket: "nursing-hub-bb7e9.firebasestorage.app",
  messagingSenderId: "484923512052",
  appId: "1:484923512052:web:738ee4a6762b5895b93aa1"
});

const messaging = firebase.messaging();

// استقبال الإشعارات في الخلفية (التطبيق مغلق أو في الخلفية)
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || '🔔 Nursing Hub';
  const body  = payload.notification?.body  || payload.data?.body  || '';
  const icon  = './icon-192.png';

  self.registration.showNotification(title, {
    body,
    icon,
    badge: icon,
    tag: payload.messageId || 'nursing-hub-notif',
    data: { url: payload.data?.url || '/' },
    vibrate: [200, 100, 200],
  });
});

// الضغط على الإشعار → فتح التطبيق
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
