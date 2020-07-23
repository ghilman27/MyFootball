import generateTemplate from './DetailPage.module.html';
import generateLoading from '../loading.module.html';
import generateStyleSheet from './DetailPage.module.css';
import DB from '../../js/db.js'

const today = new Date();

class DetailPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = generateLoading();
    }

    render (data) {
        console.log('DetailPage rendered!')
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

        const favButton = document.querySelector('#favorite-button');
        const notSavedIcon = `<i class="material-icons">favorite_border</i>`;
        const savedIcon = `<i class="material-icons pink-text text-lighten-1">favorite</i>`;

        DB.getFavouriteTeam(data.id).then((isSaved) => {
            isSaved 
            ? favButton.innerHTML = savedIcon
            : favButton.innerHTML = notSavedIcon;
        })

        favButton.addEventListener('click', () => {
            DB.getFavouriteTeam(data.id).then((isSaved) => {
                if (isSaved) {
                    DB.removeFavouriteTeam(data.id);
                    favButton.innerHTML = notSavedIcon;
                } else {
                    DB.saveFavouriteTeam(data)
                    favButton.innerHTML = savedIcon;
                }
            })

        })
    }
}

customElements.define("detail-page", DetailPage);