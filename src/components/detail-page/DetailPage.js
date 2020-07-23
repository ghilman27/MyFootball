import generateTemplate from './DetailPage.module.html';
import generateLoading from '../loading.module.html';
import generateStyleSheet from './DetailPage.module.css';
import { dateFormatter, timeFormatter } from '../../js/helper.js';

const today = new Date();

class DetailPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // this.reqData().then((data) => this.render(data));
        this.innerHTML = generateLoading();
    }

    // async reqData() {
    //     const url = new URL(`${window.location.origin}/${window.location.hash.substr(1)}`)
    //     const teamId = url.searchParams.get('teamId');

    //     const urlTeam = `https://api.football-data.org/v2/teams/${teamId}`;
    //     const urlMatches = `https://api.football-data.org/v2/teams/${teamId}/matches?${dateFormatter(today, 'detailPageAPI')}`;
    //     const options = {
    //         headers: {"X-Auth-Token": "330e8f2f61804a439958e9cccbf1f0e8"}
    //     }
    //     const responseTeam = await fetch(urlTeam, options);
    //     const responseMatches = await fetch(urlMatches, options);
    //     const team = await responseTeam.json();
    //     const { matches } = (await responseMatches.json());
    //     matches.forEach((match) => {
    //         match.isFinished = match.status === 'FINISHED' ? true : false
    //         match.isOnGoing  = match.status === 'IN_PLAY' || match.status ==='PAUSED' ? true : false
    //         match.isUpcoming = match.status === 'SCHEDULED' ? true : false
    //         match.time = timeFormatter(new Date(match.utcDate))
    //         match.date = dateFormatter(new Date(match.utcDate))
    //         match.isHome = match.homeTeam.id == teamId ? true : false
    //         match.isAway = match.awayTeam.id == teamId ? true : false
    //         match.isWin = (match.isHome && match.score.winner === "HOME_TEAM") || (match.isAway && match.score.winner === "AWAY_TEAM");
    //         match.isLose = (match.isHome && match.score.winner === "AWAY_TEAM") || (match.isAway && match.score.winner === "HOME_TEAM");
    //         match.isDraw = match.score.winner === "DRAW"
    //     })

    //     return {...team, matches}
    // }

    render (data) {
        this.innerHTML = '';
        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = generateStyleSheet();
        this.appendChild(stylesheet)

        this.innerHTML += generateTemplate(data);
        const tab = document.querySelector('detail-page .tabs');
        M.Tabs.init(tab, {
            swipeable: true,
        })

        document.querySelectorAll('.team-name').forEach((elm) => $clamp(elm, {clamp: 2}))
        
        // fix swipeable collapsible tabs bug, unable to set width higher than 400px
        const fixBugs = () => {
            document.querySelector('detail-page .tabs-content.carousel.carousel-slider').style.height = 5*window.innerHeight + "px";
        }
        const resize = () => {
            clearTimeout(window.resizeId)
            window.resizeId = setTimeout(fixBugs, 200)
        }
        window.addEventListener('resize', resize)
        fixBugs()
    }
}

customElements.define("detail-page", DetailPage);