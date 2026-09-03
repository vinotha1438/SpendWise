const CACHE_NAME = "spendwise-shell-v1";

const APP_SHELL = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache API requests — this is a finance app, data must
  // always be fresh from the server, never served stale.
  const isApiRequest =
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/expenses") ||
    url.pathname.startsWith("/income") ||
    url.pathname.startsWith("/accounts") ||
    url.pathname.startsWith("/goals") ||
    url.pathname.startsWith("/categories") ||
    url.pathname.startsWith("/recurring-expenses") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/register") ||
    url.pathname.startsWith("/profile") ||
    url.origin !== self.location.origin;

  if (isApiRequest) {
    return;
  }

  // Page navigations: try the network first (so users always get
  // the latest app), fall back to the cached shell only if offline.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/");
      })
    );

    return;
  }

  // Static assets (JS/CSS/images): cache-first for speed, network
  // fallback if not yet cached.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
      );
    })
  );
});