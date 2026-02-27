const CACHE_NAME = "snippet-pocket-v3";
const APP_SHELL = [
  "/",
  "/index.html",
  "/mobile-app.html",
  "/mobile-app.css",
  "/mobile-app.js",
  "/manifest.webmanifest",
  "/icons/icon192.png",
  "/icons/icon512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never apply cache strategies to non-GET requests.
  if (request.method !== "GET") {
    return;
  }

  // Do not cache API responses.
  if (url.pathname.startsWith("/.netlify/functions/")) {
    return;
  }

  const isAppShellAsset =
    request.mode === "navigate" ||
    request.destination === "document" ||
    request.destination === "style" ||
    request.destination === "script";

  if (isAppShellAsset) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match("/mobile-app.html");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
