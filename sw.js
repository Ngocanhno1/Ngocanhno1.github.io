/* Service Worker v2026-11-26 — Network-First & Tự động xả sạch cache cũ */
const CACHE_NAME = "ngocanh-v20261126-clean";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Luôn lấy bản mới nhất từ GitHub Pages trước để TV & điện thoại cập nhật ngay lập tức
  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then((res) => res)
      .catch(() => caches.match(event.request))
  );
});
