/* 
   JAVASCRIPT FILE DEDICATED TO HANDLE NAVIGATION BETWEEN PAGES 
   MAIN FUNCTION: TO TOGGLE BETWEEN PAGES AND LOAD IT'S STATIC CONTENT
   THE DYNAMIC CONTENT (DATA) WILL BE HANDLED TO API.JS
*/

import API from './api.js'
import DB from './db.js'

// Function to load navigation (app shell)
const loadNav = () => {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status !== 200) return;

			// Render all navigation menu
			document.querySelectorAll('.topnav, .sidenav').forEach((elm) => {
				elm.innerHTML = xhttp.responseText;
			});

			// Remove unused elements (hidden elements) on both top and side navigation
			document.querySelectorAll('.topnav .hide-on-large-only, .sidenav .hide-on-med-and-down')
				.forEach((elm) => {
					elm.remove();
				})

			// Activate Sidebar Navigation
			const sidenavs = document.querySelectorAll('.sidenav');
			M.Sidenav.init(sidenavs);

			// Activate Dropdown Navigation
			const dropdowns = document.querySelectorAll('.dropdown-trigger');
			M.Dropdown.init(dropdowns, {
				coverTrigger: false,
				constrainWidth: true,
				alignment: 'right',
			})

			// Activate Collapsibles Navigation (Saved Teams Shortcut)
			const collapsibles = document.querySelectorAll('.collapsible');
			M.Collapsible.init(collapsibles);

			// Render the Content of Collapsibles Navigation if Saved Teams Exist in DB
			DB.getAllFavouriteTeams().then((data) => {
				if (data) {
					const favTeams = document.getElementById('nav-teams');
					data.forEach((team) => {
						favTeams.innerHTML += `
							<li id="nav-team-${team.id}">
								<a href="#detail?teamId=${team.id}" style="display: flex; align-items: center;">
									<img src=${team.crestUrl} style="width: 24px; height: 24px; margin-right:32px;">${team.name}
								</a>
							</li>
						`;
					})
					favTeams.querySelectorAll('a').forEach((btn) => {
						btn.addEventListener('click', () => {
							const sidenav = document.querySelector('.sidenav');
							M.Sidenav.getInstance(sidenav).close();
							loadPage('detail');
						})
					})
				}
			})
			
			// Register click event for navigation buttons
			document
				.querySelectorAll('.sidenav a, .topnav a')
				.forEach((elm) => {
					if (!elm.classList.contains('dropdown-trigger')) {
						elm.addEventListener('click', (event) => {
							// Close sidenav when a button is clicked
							const sidenav = document.querySelector('.sidenav');
							M.Sidenav.getInstance(sidenav).close();

							// Then load the page static content
							const page = event.target.getAttribute('href').substr(1).split('?')[0];
							loadPage(page);
						});
					}
				});
			
			highlightNav();
		}
	};
	xhttp.open('GET', './pages/nav.html', true);
	xhttp.send();
}

// Function to load static content of the page
const loadPage = (page) => {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4) {
			const content = document.querySelector('#body-content');
			if (this.status === 200) {
				// render the content
				content.innerHTML = xhttp.responseText;
				// highlight the page in the navbar
				highlightNav();
				// get the data to render the page dynamic content
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

// Function to highlight selected navigation button
const highlightNav = () => {
	let navSection = window.location.hash.substr(1).split('?')[0];
	navSection = !navSection ? 'matches' : navSection;
	navSection = navSection === 'detail' ? 'teams' : navSection;

	const navButtons = document.querySelectorAll('.nav-button');
	navButtons.forEach((button) => {
		navSection === button.getAttribute('href').substr(1)
			? button.classList.add('active')
			: button.classList.remove('active');
	});
}

// Function to get the dynamic data to render the page
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
			console.log(`This component hasn't implemented api.js`);
	}
}

export { loadNav, loadPage, highlightNav };