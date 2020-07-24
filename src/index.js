import 'regenerator-runtime';
import './css/materialize.min.css';
import './css/index.css';
import './js/materialize.min.js';
import DB from './js/db.js';
import './components';
import { loadNav, loadPage } from './js/nav.js';
import { registerServiceWorker, requestPermission } from './js/helper.js';

// Initiate DB
DB.openDB();

document.addEventListener('DOMContentLoaded', () => {
	// Load Navigation (App Shell)
	loadNav();

	// Load Initial Page Content
	let page = window.location.hash.substr(1).split('?')[0];
	if (page === '') page = 'matches';
	loadPage(page);

	// Add toast notification if losing connection
	window.addEventListener('offline', (event) => {
		M.toast({html: `You've lost connection!`})
	});
	window.addEventListener('online', (event) => {
		M.toast({html: `You've reconnected to the network`})
	});
});

// Checking service worker availibility then register SW and request Push Notif Permission
if (!('serviceWorker' in navigator)) {
	console.log('Service worker is not supported');
} else {
	registerServiceWorker();
	requestPermission();
}