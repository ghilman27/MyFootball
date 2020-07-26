import 'regenerator-runtime';
import { API_BASE_URL } from './js/appconst.js';

const CACHE_NAME = 'MyFootball_build_v1.0';
const urlsToCache = [
	'/',
	'/index.html',
	'/index.js',
	'/manifest.json',

	'/pages/detail.html',
	'/pages/matches.html',
	'/pages/nav.html',
	'/pages/profile.html',
	'/pages/standings.html',
	'/pages/teams.html',

	'/images/account-background.jpg',
	'/images/account-background-dark.jpg',
	'/images/app-logo.webp',
	'/images/apple-touch-icon-180x180.png',
	'/images/favicon.ico',
	'/images/icon192.png',
	'/images/icon512.png',
	'/images/no-image-holder.png',
	'/images/profile-holder.webp',
	'/images/shirt.svg',

	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.url.indexOf(API_BASE_URL) > -1) {
		event.respondWith(
			caches.open(CACHE_NAME).then(async (cache) => {
				const response = await fetch(event.request);
				cache.put(event.request.url, response.clone());
				return response;
			})
		);
	} else {
		event.respondWith(
			caches.match(event.request, { ignoreSearch: true })
				.then(function (response) {
					return response || fetch(event.request);
				})
		);
	}
});

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches
			.keys()
			.then(function (cacheNames) {
				return Promise.all(
					cacheNames.map(function (cacheName) {
						if (cacheName != CACHE_NAME) {
							console.log('ServiceWorker: cache ' + cacheName + ' dihapus');
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => self.clients.claim())
	);
});

self.addEventListener('push', function (event) {
	let body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message no payload';
	}
	const options = {
		body: body,
		icon: 'images/icon192.png',
		badge: 'images/icon192.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
	};
	event.waitUntil(
		self.registration.showNotification('Push Notification', options)
	);
});
