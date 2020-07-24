import generateTemplate from './LeagueSelector.module.html';
import generateStyleSheet from './LeagueSelector.module.css';
import {LEAGUE_ID_LIST} from '../../js/appconst.js';

class LeagueSelector extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = generateStyleSheet();
        this.appendChild(stylesheet);
        this.innerHTML += generateTemplate(LEAGUE_ID_LIST);
        
        const select = document.querySelector('select');
        M.FormSelect.init(select);

    }
}

customElements.define("league-selector", LeagueSelector);