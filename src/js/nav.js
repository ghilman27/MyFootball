document.addEventListener('DOMContentLoaded', () => {
	// Activate sidebar nav
	const sidenavs = document.querySelectorAll('.sidenav');
	M.Sidenav.init(sidenavs);
	loadNav();

	function loadNav() {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status !== 200) return;

				// Muat daftar tautan menu
				document.querySelectorAll('.topnav, .sidenav').forEach((elm) => {
					elm.innerHTML = xhttp.responseText;
				});

				// remove unused elements (hidden elements) on both side
				document.querySelectorAll('.topnav .hide-on-large-only, .sidenav .hide-on-med-and-down').forEach((elm) => {
					elm.remove();
				})

				dropdowns = document.querySelectorAll('.dropdown-trigger');
				M.Dropdown.init(dropdowns, {
					coverTrigger: false,
					constrainWidth: true,
					alignment: 'right',
				})

				var collapsibles = document.querySelectorAll('.collapsible');
				M.Collapsible.init(collapsibles);


				// Daftarkan event listener untuk setiap tautan menu
				document
					.querySelectorAll('.sidenav a, .topnav a')
					.forEach((elm) => {
						if (!elm.classList.contains('dropdown-trigger')) {
							elm.addEventListener('click', (event) => {
								// Tutup sidenav
								const sidenav = document.querySelector('.sidenav');
								M.Sidenav.getInstance(sidenav).close();
	
								// Muat konten halaman yang dipanggil
								page = event.target.getAttribute('href').substr(1);
								loadPage(page);
							});
						}
					});
			}
		};
		xhttp.open('GET', './pages/nav.html', true);
		xhttp.send();
	}

	// Load page content
	let page = window.location.hash.substr(1);
	if (page === '') page = 'home';
	loadPage(page);

	function loadPage(page) {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState === 4) {
				const content = document.querySelector('#body-content');
				if (this.status === 200) {
					content.innerHTML = xhttp.responseText;
					highlightCurrentPage(page);
				} else if (this.status === 404) {
					content.innerHTML = '<p>Halaman tidak ditemukan.</p>';
				} else {
					content.innerHTML = '<p>Ups.. halaman tidak dapat diakses.</p>';
				}
			}
		};
		xhttp.open('GET', `pages/${page}.html`, true);
		xhttp.send();
	}

	// Highlight current page on navbar button
	function highlightCurrentPage(page) {
		navButtons = document.querySelectorAll('.nav-button');
		navButtons.forEach((button) => {
			page === button.getAttribute('href').substr(1)
				? button.classList.add('active')
				: button.classList.remove('active');
		});
	}
});
