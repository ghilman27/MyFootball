import "regenerator-runtime";
import { API_BASE_URL } from './js/appconst.js';

const CACHE_NAME = 'MyFootball_build_v1.1';
var urlsToCache = [
	'/',
	'/index.html',
	'/index.js',
	// '/icon512.png',
	// '/icon192.png',
	// '/manifest.json',

	'/pages/detail.html',
	'/pages/matches.html',
	'/pages/nav.html',
	'/pages/profile.html',
	'/pages/standings.html',
	'/pages/teams.html',

	'/images/account-background.jpg',
	'/images/app-logo.webp',
	'/images/no-image-holder.png',
	'/images/profile-holder.webp',
	'/images/shirt.svg',

	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
];

self.addEventListener('install', function (event) {
	// console.log(`install event fires!:`)
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('fetch', (event) => {
	// console.log(`fetch event fires! ${event.request.url}`)
	// const API_BASE_URL = "http://api.football-data.org/v2";
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
			caches.match(event.request, { ignoreSearch: true }).then(function(response) {
				return response || fetch (event.request);
			})
		)
	}
});

self.addEventListener('activate', function (event) {
	// console.log('active event fires!');
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
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
