import generateTemplate from './TeamList.module.html';
import generateLoading from '../loading.module.html';
import generateStyleSheet from './TeamList.module.css';
import generatePageNotAvailable from '../notavailable.module.html';
import { loadPage } from '../../js/nav.js';

class TeamList extends HTMLElement {
    constructor() {
        super();
    }

    renderLoading() {
        this.innerHTML = generateLoading();
    }

    renderPageNotAvailable() {
		this.innerHTML = generatePageNotAvailable();
	}

    render(data) {
        // generate stylesheet and html template
        this.innerHTML = '';
        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = generateStyleSheet();
        this.appendChild(stylesheet);
        this.innerHTML += generateTemplate(data);

        // set each detail button to render team detail
        document.querySelectorAll('.detail-link').forEach((link) => {
            link.addEventListener('click', () => {
                loadPage('detail');
            })
        })
    }

    renderNoFavTeamsAvailable() {
        this.innerHTML = `
            <h6 class="center-align" style="font-style: italic">No teams added to favorites</h6>
        `;
    }
}

customElements.define("team-list", TeamList);