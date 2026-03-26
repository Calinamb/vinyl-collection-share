const CACHE_NAME = "vinyl-share-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/app.html",
  "/register.html",
  "/tos.html",
  "/privacy.html",
  "/offline.html",
  "/app.css",
  "/app.mjs",
  "/manifest.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache each file individually so one failure doesn't break everything
      return Promise.allSettled(
        ASSETS.map(asset => cache.add(asset).catch(err => {
          console.warn("Failed to cache:", asset, err);
        }))
      );
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Network first for API calls
  if (url.pathname.startsWith("/users") || url.pathname.startsWith("/collections")) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache first for static assets
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});