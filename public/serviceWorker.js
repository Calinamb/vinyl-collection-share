const CACHE_NAME = "vinyl-share-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/app.html",
  "/register.html",
  "/tos.html",
  "/privacy.html",
  "/app.css",
  "/app.mjs",
  "/login.mjs",
  "/register.mjs",
  "/modules/fetchManager.mjs",
  "/modules/http.mjs",
  "/modules/i18n.mjs",
  "/offline.html",
  "/controllers/collectionsViewController.mjs",
  "/controllers/usersViewController.mjs",
  "/manifest.json",
  "/server/index.mjs",
  "server/routes/usersRoutes.mjs",
  "server/routes/collectionsRoutes.mjs",
  "server/i18n.mjs"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
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
      fetch(e.request).catch(() =>
        caches.match(e.request)
      )
    );
    return;
  }

  // Cache first for everything else (static assets)
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});