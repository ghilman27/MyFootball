import API from './api.js'

// load navigation.html
const loadNav = () => {
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

			const dropdowns = document.querySelectorAll('.dropdown-trigger');
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
							const page = event.target.getAttribute('href').substr(1);
							loadPage(page);
						});
					}
				});
		}
	};
	xhttp.open('GET', './pages/nav.html', true);
	xhttp.send();
}

// load selected page html
const loadPage = (page) => {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4) {
			const content = document.querySelector('#body-content');
			if (this.status === 200) {
				content.innerHTML = xhttp.responseText;
				highlightNav();
				getPage(page);
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

// Highlight selected section on navbar button
const highlightNav = () => {
	let navSection = window.location.hash.substr(1).split('?')[0];
	console.log(navSection)
	navSection = navSection === 'detail' ? 'teams' : navSection;

	const navButtons = document.querySelectorAll('.nav-button');
	navButtons.forEach((button) => {
		navSection === button.getAttribute('href').substr(1)
			? button.classList.add('active')
			: button.classList.remove('active');
	});
}

// Get data and render selected page
const getPage = (page) => {
	switch(page) {
		case 'matches':
			API.getMatches();
			break;
		case 'standings':
			API.getStandings();
			break;
		case 'teams':
			API.getTeamsList();
			break;
		case 'profile':
			API.getTeamsList();
			break;
		case 'detail':
			API.getDetails();
			break;
		default:
			console.log(`This component hasn't implemented api.js`)
	}
}

export { loadNav, loadPage }