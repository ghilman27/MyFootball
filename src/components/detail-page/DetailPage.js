import generateTemplate from './DetailPage.module.html';
import generateLoading from '../loading.module.html';
import generateStyleSheet from './DetailPage.module.css';
import DB from '../../js/db.js'
import { loadNav } from '../../js/nav.js'

class DetailPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = generateLoading();
    }

    render (data) {
        // generate stylesheet
        this.innerHTML = '';
        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = generateStyleSheet();
        this.appendChild(stylesheet)

        // generate HTML template
        this.innerHTML += generateTemplate(data);

        // initialize tabs
        const tab = document.querySelector('detail-page .tabs');
        M.Tabs.init(tab, {
            swipeable: true,
        })

        // limit truncation of team name to 2 lines
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

        // ------- ACTIVATE ADD TO FAVORITES BUTTON -------
        const favButton = document.querySelector('#favorite-button');
        const notSavedIcon = `<i class="material-icons">favorite_border</i>`;
        const savedIcon = `<i class="material-icons pink-text text-lighten-1">favorite</i>`;

        // set initial state (saved or not)
        DB.getFavouriteTeam(data.id).then((isSaved) => {
            isSaved 
            ? favButton.innerHTML = savedIcon
            : favButton.innerHTML = notSavedIcon;
        })

        // set event when the button is clicked (for both state)
        favButton.addEventListener('click', () => {
            DB.getFavouriteTeam(data.id).then((isSaved) => {

                // if it's saved before
                if (isSaved) {
                    // remove from DB and inform user
                    DB.removeFavouriteTeam(data.id);
                    favButton.innerHTML = notSavedIcon;
                    M.toast({html: `${data.name} is removed from favorites`})

                    // remove navigation shortcut
                    const navButton = document.getElementById(`nav-team-${data.id}`)
                    navButton.parentNode.removeChild(navButton);

                } else {
                    // save to DB and inform user
                    DB.saveFavouriteTeam(data)
                    favButton.innerHTML = savedIcon;
                    M.toast({html: `${data.name} is added to favorites`})

                    // reload nav to add navigation shortcut
                    loadNav()
                }
            })

        })
    }
}

customElements.define("detail-page", DetailPage);