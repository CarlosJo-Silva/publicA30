const dishCache = "cache-v1";
const assets = [
    "/projectA30/",
    "index.html",
    "stylesheets/main.css",
    "js/ctrl/ctrl.js",
    "js/wrk/wrk.js",
    "resources/android-chrome-192x192.png",
    "resources/android-chrome-512x512.png",
    "resources/apple-touch-icon.png",
    "resources/favicon-16x16.png",
    "resources/favicon-32x32.png",
    "resources/mstile-150x150.png",
    "resources/safari-pinned-tab.svg",
    "favicon.ico",
    "serviceWorker.js",
    "https://code.jquery.com/jquery-3.6.4.min.js",
];
self.addEventListener('install', function(event) {
    console.log("wrk ok installer");
    event.waitUntil(
        caches.open(dishCache).then(function(cache) {
            return cache.addAll(assets);
        })
    );
});
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;

            }
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(function(response) {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                var responseToCache = response.clone();

                caches.open(dishCache).then(function(cache) {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});
self.addEventListener('activate', function(event) {
    var cacheWhitelist = [dishCache];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    console.log(cacheWhitelist);
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});