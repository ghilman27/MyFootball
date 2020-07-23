import generateTemplate from './TeamList.module.html';
import generateLoading from '../loading.module.html';
import generateStyleSheet from './TeamList.module.css';
import { loadPage } from '../../js/nav.js';

class TeamList extends HTMLElement {
    constructor() {
        super();
    }

    renderLoading() {
        this.innerHTML = generateLoading();
    }

    render(data) {
        this.innerHTML = '';
        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = generateStyleSheet();
        this.appendChild(stylesheet);

        this.innerHTML += generateTemplate(data);
        document.querySelectorAll('.detail-link').forEach((link) => {
            link.addEventListener('click', () => {
                this.loadTeamDetail();
            })
        })
    }

    loadTeamDetail() {
        loadPage('detail', 'teams');
    }

}

customElements.define("team-list", TeamList);