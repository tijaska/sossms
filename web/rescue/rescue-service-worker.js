var cacheName = "rescue-SoSSMS-j68";
var dataCacheName = "rescue-SoSSMS-j68";
var filesToCache = [
	"./",
	"./rescue-manifest.json",
	"./rescue-service-worker.js",
//	"./index.html",
	"./rescue.js",
	"../common.js",
	"../images/SoS.png",
	"../images/SoS-192.png",
	"../images/SoS-512.png",
	"../images/arrow18.png",
	"../style.css"
];

self.addEventListener("install", function(e) {
	console.log("rescue-SoSSMS ServiceWorker Install");
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log("rescue-SoSSMS ServiceWorker Caching app shell");
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener("activate", function(e) {
	console.log("rescue-SoSSMS ServiceWorker Activate");
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName && key !== dataCacheName) {
					console.log("rescue-SoSSMS ServiceWorker Removing old cache", key);
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