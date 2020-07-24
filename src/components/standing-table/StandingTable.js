import generateTemplate from './StandingTable.module.html';
import generateLoading from '../loading.module.html';
import generateStyleSheet from './StandingTable.module.css';
import { loadPage } from '../../js/nav.js';

class StandingTable extends HTMLElement {
    constructor() {
        super();
    }

    renderLoading() {
        this.innerHTML = generateLoading();
    }

    render(data) {
        // generate stylesheet and html template
        this.innerHTML = '';
        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = generateStyleSheet();
        this.appendChild(stylesheet);
        this.innerHTML += generateTemplate(data);

        // set each row to link to team detail page when clicked
        document.querySelectorAll('.detail-link').forEach((link) => {
            link.addEventListener('click', () => {
                window.location.href = link.dataset.href;
                loadPage('detail');
            })
        })
    }
}

customElements.define("standing-table", StandingTable);