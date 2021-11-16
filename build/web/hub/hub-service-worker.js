var cacheName = "hub-SoSSMS-j68";
var dataCacheName = "hub-SoSSMS-data-j68";
var filesToCache = [
	"./",
	"./hub-manifest.json",
	"./hub-service-worker.js",
	"./hub.js",
//	"./index.html",
    "./log.html",
    "./log.js",
	"../common.js",
	"../images/arrow18.png",
	"../images/SoS-192.png",
	"../images/SoS-512.png",
	"../images/SoS.png",
	"../style.css"
];
self.addEventListener("install", function(e) {
	console.log("hub-SoSSMS ServiceWorker Install");
	self.skipWaiting();  // The promise that skipWaiting() returns can be safely ignored.
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log("hub-SoSSMS ServiceWorker Caching app shell");
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener("activate", function(e) {
	console.log("hub-SoSSMS ServiceWorker Activate");
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName && key !== dataCacheName) {
					console.log("hub-SoSSMS ServiceWorker Removing old cache", key);
					return caches.delete(key);
				}
			}));
		})
	);
  return self.clients.claim();
});
// ex https://developers.google.com/web/fundamentals/primers/service-workers
self.addEventListener("fetch", function(event) {
	event.respondWith(
		caches.match(event.request)
			.then(function(response) {
				if (response) {  // Cache hit - return response
					console.log("service-worker fetch cache hit");
					return response;
				}
				return fetch(event.request);
			}
		)
	);
});