import "regenerator-runtime";
import "./css/materialize.min.css";
import "./css/index.css";
import "./js/materialize.min.js";
import './components';

import { loadNav, loadPage } from './js/nav.js'
document.addEventListener('DOMContentLoaded', () => {
	// Activate sidebar nav
	const sidenavs = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenavs);
    
    // Load Navigation (App Shell)
	loadNav();

	// Load Page Content
	let page = window.location.hash.substr(1).split('?')[0]
	if (page === '') page = 'matches';
	loadPage(page);
});

// REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker
			.register('./worker.js')
			.then(function () {
				console.log('Pendaftaran ServiceWorker berhasil');
			})
			.catch(function () {
				console.log('Pendaftaran ServiceWorker gagal');
			});
	});
} else {
	console.log('ServiceWorker belum didukung browser ini');
}