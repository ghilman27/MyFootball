import generateTemplate from './MatchesList.module.html';
import generateLoading from '../loading.module.html';
import generateStyleSheet from './MatchesList.module.css';
import { dateFormatter } from '../../js/helper.js';
import '../../js/clamp.min.js';

const today = new Date();

class MatchesList extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		// render loading when first connected to the dom
		this.renderLoading();
	}

	renderLoading() {
		this.innerHTML = generateLoading();
	}

	render(data) {
		// generate stylesheet
		this.innerHTML = '';
		const stylesheet = document.createElement('style');
		stylesheet.innerHTML = generateStyleSheet();
		this.appendChild(stylesheet);

		// generate template
		this.innerHTML += generateTemplate({ data });

		// tabs initialization
		const tab = document.querySelector('matches-list .tabs');
		M.Tabs.init(tab, {
			swipeable: true,

			// scroll to the position of the clicked tab when it's out of scrollable view
			onShow: () => {
				const halfScrollableWidth = tab.offsetWidth / 2;
				const scrollXPosition = tab.scrollLeft;
				const activeTab = document.querySelector('matches-list .tab .active');
				const activeTabWidth = activeTab.offsetWidth;
				const activeTabPosition = activeTab.offsetLeft;
				if (
					activeTabPosition - scrollXPosition > halfScrollableWidth ||
					scrollXPosition + activeTabPosition > activeTabPosition
				) {
					tab.scrollTo({
						top: 0,
						left: activeTab.offsetLeft - halfScrollableWidth + activeTabWidth / 2,
						behavior: 'smooth',
					});
				}
			},
		});

		// select today's matches as default
		M.Tabs.getInstance(tab).select(dateFormatter(today, 'dateId'));

		// collapsibles initialization
		const collapsibles = document.querySelectorAll('matches-list .collapsible');
		M.Collapsible.init(collapsibles, {
			accordion: false,
		});

		// make all collapsibles open as default
		collapsibles.forEach((collapsible) => {
			const instance = M.Collapsible.getInstance(collapsible);
			instance.open();
		});

		// clamp the team name to only 2 lines
		document
			.querySelectorAll('.team-name')
			.forEach((elm) => $clamp(elm, { clamp: 2 }));

		// fix swipeable collapsible tabs bug, unable to set width higher than 400px
		// reference: https://github.com/Dogfalo/materialize/issues/4159#issuecomment-283793244
		// Here I set the height to 3 window height, to contain more matches
		const fixBugs = () => {
			document.querySelector(
				'matches-list .tabs-content.carousel.carousel-slider'
			).style.height = 3 * window.innerHeight + 'px';
		};
		const resize = () => {
			clearTimeout(window.resizeId);
			window.resizeId = setTimeout(fixBugs, 200);
		};
		window.addEventListener('resize', resize);
		fixBugs();
	}
}

customElements.define('matches-list', MatchesList);
