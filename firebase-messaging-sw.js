// firebase-messaging-sw.js
// Firebase Cloud Messaging Service Worker — handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBJGf-9KbQF-aCi3iH9rDxmF4xxgrpc_UI",
  authDomain: "nursing-hub-bb7e9.firebaseapp.com",
  projectId: "nursing-hub-bb7e9",
  storageBucket: "nursing-hub-bb7e9.firebasestorage.app",
  messagingSenderId: "484923512052",
  appId: "1:484923512052:web:738ee4a6762b5895b93aa1"
});

const messaging = firebase.messaging();

// Handle background messages (app is closed or in background)
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

// Click on notification → open the app
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
