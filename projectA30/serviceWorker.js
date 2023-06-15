/*
Author : Carlos Silva
Version : 1.0
Date : 16.06.2023
Purpose : Project A30's service worker
 */
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
/**
 * Event listener for the 'install' event.
 * It caches the specified assets when the service worker is installed.
 */
self.addEventListener('install', event =>  {
    console.log("Service worker installed.");
    event.waitUntil(
        caches.open(dishCache).then(cache => {
            return cache.addAll(assets);
        })
    );
});
/**
 * Event listener for the 'fetch' event.
 * It intercepts fetch requests and serves cached responses if available,
 * otherwise, it fetches the request and caches the response.
 */
self.addEventListener('fetch',  event =>  {
    event.respondWith(
        caches.match(event.request).then( response => {
            if (response) {
                return response;

            }
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest).then( response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                var responseToCache = response.clone();

                caches.open(dishCache).then( cache => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        })
    );
});
/**
 * Event listener for the 'activate' event.
 * It removes outdated caches and keeps the specified cache intact.
 */
self.addEventListener('activate',  event =>  {
    console.log("Service worker activated.");
    var cacheWhitelist = [dishCache];
    event.waitUntil(
        caches.keys().then( cacheNames=> {
            return Promise.all(
                cacheNames.map( cacheName => {
                    console.log(cacheWhitelist);
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});