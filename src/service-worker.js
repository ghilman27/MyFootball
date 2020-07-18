const CACHE_NAME = 'kdramav11';
var urlsToCache = [
	'/',
	'/nav.html',
	'/index.html',
	'/icon512.png',
	'/icon192.png',
	'/manifest.json',

	'/pages/home.html',
	'/pages/article.html',
	'/pages/ost.html',
	'/pages/drama.html',
	'/pages/supportus.html',

	'/css/materialize.min.css',
	'/css/index.css',

	'/js/materialize.min.js',
	'/js/nav.js',
	'/js/data.js',

	'/component/article-page.js',
	'/component/drama-page.js',
	'/component/home-page.js',
	'/component/ost-page.js',
	'/component/supportus-page.js',

	'/fonts/ShadowsIntoLight-Regular.ttf',

	'/images/facebook.svg',
	'/images/instagram.svg',
	'/images/twitter.svg',
	'/images/youtube.svg',
	'/images/logo.svg',

	'/images/article_images/8sweetcouple.webp',
	'/images/article_images/news2.webp',
	'/images/article_images/news3.webp',
	'/images/article_images/news4.webp',
	'/images/article_images/news5.webp',
	'/images/article_images/news6.webp',

	'/images/banner_images/hospital_playlist_banner_16x9.png',
	'/images/banner_images/hotel_del_luna_banner_16x9.png',
	'/images/banner_images/reply-1988_banner_16x9.jpg',
	'/images/banner_images/sky_castle_banner_16x9.jpg',

	'/images/ost_images/crash-landing-on-you-ost-part.11.jpg',
	'/images/ost_images/hotel-del-luna-ost-part.3.jpg',
	'/images/ost_images/itaewon-class-ost-part.2.jpg',
	'/images/ost_images/memories-of-the-alhambra-ost-part.3.jpg',
	'/images/ost_images/moon-lovers-scarlet-heart-ryeo-ost-part.5.jpg',

	'/images/drama_images/backstreet-rookie.jpg',
	'/images/drama_images/dinner-mate.jpg',
	'/images/drama_images/eccentric-chef-moon.jpg',
	'/images/drama_images/fix-you.jpg',
	'/images/drama_images/hi-bye-mama.jpg',
	'/images/drama_images/hospital-playlist.jpg',
	'/images/drama_images/into-the-ring.jpg',
	'/images/drama_images/itaewon-class.jpg',
	'/images/drama_images/its-okay-to-not-be-okay.jpg',
	'/images/drama_images/kingmaker.jpg',
	'/images/drama_images/men-are-men.jpg',
	'/images/drama_images/my-unfamiliar-family.jpg',
	'/images/drama_images/onceagain.jpg',
	'/images/drama_images/sweet-munchies.jpg',
	'/images/drama_images/thegooddetective.jpg',
	'/images/drama_images/theking.jpg',
	'/images/drama_images/the-world-of-the-married.jpg',
	'/images/drama_images/wasitlove.jpg',

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

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches
			.match(event.request, { cacheName: CACHE_NAME })
			.then(function (response) {
				if (response) {
					console.log('ServiceWorker: Gunakan aset dari cache: ', response.url);
					return response;
				}

				console.log(
					'ServiceWorker: Memuat aset dari server: ',
					event.request.url
				);
				return fetch(event.request);
			})
	);
});

self.addEventListener('activate', function (event) {
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
	);
});
