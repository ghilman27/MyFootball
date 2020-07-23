import { API_HEADERS, API_BASE_URL, LEAGUE_ID_LIST } from './appconst.js';
import { dateFormatter, timeFormatter } from './helper.js';
import savedTeams from './savedTeams.js';

class API {
    static getFromCache (path, handleData, handleReject) {
        if ('caches' in window) {
            caches.match(path).then((response) => {
                if (response) {
                    response.json()
                        .then(handleData)
                        .then(() => console.log('Data loaded from cache storage'));
                } else {
                    console.log('No caches found');
                    // handleReject ? handleReject() : ''
                }
            });
        } else {
            console.log('Cache is not supported by the browser');
        }
    }

    static getFromAPI (url, handleData, handleReject) {
        fetch(url, API_HEADERS)
            .then((response) => {
                // if (response.ok) {
                    return response.json();
                // } else {
                //     throw new Error('Something went wrong in the API, try to refresh the page');
                // }
            })
            .then(handleData)
            .then(() => console.log('Data loaded from the API'))
            .catch((error) => {
                console.log(error)
                // handleReject ? handleReject() : ''
            })
    }

	static getMatches() {
        const url = `${API_BASE_URL}/matches/?competitions=${Object.keys(LEAGUE_ID_LIST).join()}&${dateFormatter(new Date(), 'matchesListAPI')}`;

        const renderMatchesList = (data) => {
            const { matches } = data;

            const processedMatches = matches.reduce((result, match) => {

                const dateId = dateFormatter(new Date(match.utcDate), 'dateId');
                const leagueId = match.competition.id;
                const matchId = match.id;
    
                const matchDetail = {
                    time: timeFormatter(new Date(match.utcDate)),
                    isFinished: match.status === 'FINISHED' ? true : false,
                    isOnGoing: match.status === 'IN_PLAY' || match.status ==='PAUSED' ? true : false,
                    isUpcoming: match.status === 'SCHEDULED' ? true : false,
                    homeTeam: match.homeTeam.name,
                    homeId: match.homeTeam.id,
                    homeScore: match.score.fullTime.homeTeam,
                    awayTeam: match.awayTeam.name,
                    awayId: match.awayTeam.id,
                    awayScore: match.score.fullTime.awayTeam,
                    isHomeWin: (match.score.winner && match.score.winner === 'HOME_TEAM') ? true : false,
                    isAwayWin: (match.score.winner && match.score.winner === 'AWAY_TEAM') ? true : false,
                }
    
                const leagueDetail = {
                    name: match.competition.name, 
                    flagUrl: match.competition.area.ensignUrl,
                    matches: {},
                }
    
                const dateDetail = {
                    date: dateFormatter(new Date(match.utcDate)),
                    leagues: {},
                }
    
                const date = result[dateId] = result[dateId] || dateDetail
                const league = date.leagues[`league${leagueId}`] = date.leagues[`league${leagueId}`] || leagueDetail
                const matchList = league.matches[`match${matchId}`] = league.matches[`match${matchId}`] || matchDetail
    
                return result
            }, {})

            document.querySelector('matches-list').render(processedMatches);
        }

        API.getFromCache(url, renderMatchesList);
        API.getFromAPI(url, renderMatchesList, () => alert('You are offline'));
    }

    static getStandings() {
        const standingTable = document.querySelector('standing-table');
        const renderStandingTable = (data) => {
            const { standings: [standingsTotal, ...theRest] } = data;
            const { table } = standingsTotal;
            standingTable.render(table);
        }
        API.activateLeagueSelector('standings', standingTable, renderStandingTable);
    }

    static getTeamsList() {
        const teamList = document.querySelector('team-list');
        const page = window.location.hash.substr(1);

        const renderTeamList = (data) => {
            const { teams } = data;
            teamList.render(teams);
        }

        if (page === 'teams') {
            API.activateLeagueSelector('teams', teamList, renderTeamList);
        }

        if (page === 'profile') {
            Promise.resolve(savedTeams).then((data) => teamList.render(data));
            teamList.renderLoading();
        }
    }

    static getDetails() {        
        let team;
        const detailPage = document.querySelector('detail-page');
        const url = new URL(`${window.location.origin}/${window.location.hash.substr(1)}`)
        const teamId = url.searchParams.get('teamId');
        const urlTeam = `${API_BASE_URL}/teams/${teamId}`;
        const urlMatches = `${API_BASE_URL}/teams/${teamId}/matches?${dateFormatter(new Date(), 'detailPageAPI')}`;

        const getMatchesCache = (teamData) => {
            team = teamData;
            API.getFromCache(urlMatches, renderDetailPage);
        }
        const getMatchesAPI = (teamData) => {
            team = teamData;
            API.getFromAPI(urlMatches, renderDetailPage, () => alert('You are offline'));
        }

        API.getFromCache(urlTeam, getMatchesCache);
        API.getFromAPI(urlTeam, getMatchesAPI, () => alert('You are offline'));

        const renderDetailPage = (matchesData) => {
            const { matches } = matchesData;
            matches.forEach((match) => {
                match.isFinished = match.status === 'FINISHED' ? true : false
                match.isOnGoing  = match.status === 'IN_PLAY' || match.status ==='PAUSED' ? true : false
                match.isUpcoming = match.status === 'SCHEDULED' ? true : false
                match.time = timeFormatter(new Date(match.utcDate))
                match.date = dateFormatter(new Date(match.utcDate))
                match.isHome = match.homeTeam.id == teamId ? true : false
                match.isAway = match.awayTeam.id == teamId ? true : false
                match.isWin = (match.isHome && match.score.winner === "HOME_TEAM") || (match.isAway && match.score.winner === "AWAY_TEAM");
                match.isLose = (match.isHome && match.score.winner === "AWAY_TEAM") || (match.isAway && match.score.winner === "HOME_TEAM");
                match.isDraw = match.score.winner === "DRAW"
            })

            detailPage.render({...team, matches})
        }
    }

    static activateLeagueSelector (resource, component, renderOnSelect) {
        const leagueSelector = document.querySelector('league-selector select');

        leagueSelector.addEventListener('change', (event) => {
            const url = `${API_BASE_URL}/competitions/${event.target.value}/${resource}`
            API.getFromCache(url, renderOnSelect);
            API.getFromAPI(url, renderOnSelect, () => alert('You are offline'));
            component.renderLoading();
        });
    }
}

export default API