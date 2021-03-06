/* 
   JAVASCRIPT FILE DEDICATED TO HANDLE DATA REQUEST FOR RENDERING COMPONENTS
   CONTAINS API CLASS THAT CAN BE IMPORTED ANYWHERE TO HANDLE DATA REQUEST
*/

import { API_HEADERS, API_BASE_URL, LEAGUE_ID_LIST } from './appconst.js';
import { dateFormatter, timeFormatter, replaceUrl } from './helper.js';
import DB from './db.js';

class API {
	/* FUNCTION TO HANDLE CACHE REQUEST */
	static getFromCache(path) {
		return new Promise((resolve, reject) => {
			if ('caches' in window) {
				caches.match(path).then((response) => {
					if (response) {
						response.json().then((data) => {
							resolve(data);
							// console.log('Data is loaded from cache')
						});
					} else {
						reject('No caches found');

					}
				});
			} else {
				reject('Cache is not supported by the browser');
			}
		});
	}

	/* FUNCTION TO HANDLE API REQUEST TO THE INTERNET */
	static async getFromAPI(url) {
		try {
			const response = await fetch(url, API_HEADERS);
			const data = await response.json();
			// console.log('Data is loaded from API');
			return data;
		} catch (error) {
			throw new Error(error);
		}
	}

	/* FUNCTION TO HANDLE DATA TO RENDER MatchesList COMPONENT in matches.html*/
	static getMatches() {
		const url = `${API_BASE_URL}/matches/?competitions=${Object.keys(LEAGUE_ID_LIST).join()}&${dateFormatter(new Date(), 'matchesListAPI')}`;
		const matchesList = document.querySelector('matches-list');
		const renderMatches = (data) => {
			const { matches } = data;
			const processedData = this.processMatchesData(matches);
			matchesList.render(processedData);
		};
		API.getFromCache(url)
			.then(renderMatches)
			.catch(() => {
				!window.navigator.onLine ? matchesList.renderPageNotAvailable() : ''
			});
		API.getFromAPI(url).then(renderMatches);
	}

	/* FUNCTION TO HANDLE DATA TO RENDER StandingTable COMPONENT in standings.html*/
	static getStandings() {
		const standingTable = document.querySelector('standing-table');
		const renderStandingTable = (data) => {
			const { standings: [standingsTotal, ...theRest], } = data;
			const { table } = standingsTotal;
			table.forEach((row) => {
				row.team.crestUrl = replaceUrl(row.team.crestUrl);
			});
			standingTable.render(table);
		};
		API.activateLeagueSelector('standings', standingTable, renderStandingTable);
	}

	/* FUNCTION TO HANDLE DATA TO RENDER TeamList COMPONENT in teams.html and profile.html*/
	static getTeamsList() {
		const teamList = document.querySelector('team-list');

		// get the name of the page which render this components
		const page = window.location.hash.substr(1);

		const renderTeamList = (data) => {
			const { teams } = data;
			teams.forEach((team) => {
				team.crestUrl = replaceUrl(team.crestUrl);
			});
			teamList.render(teams);
		};

		if (page === 'teams') {
			// render by first activating the league selector
			this.activateLeagueSelector('teams', teamList, renderTeamList);
		}

		if (page === 'profile') {
			// display all saved teams in the profile page
			DB.getAllFavouriteTeams().then((data) => {
				data.length !== 0
				? teamList.render(data)
				: teamList.renderNoFavTeamsAvailable()
			});
			teamList.renderLoading();
		}
	}

	/* FUNCTION TO HANDLE DATA TO RENDER DetailPage COMPONENT in detail.html*/
	static getDetails() {
		// set all constant needed
		const detailPage = document.querySelector('detail-page');
		const windowUrl = new URL(
			`${window.location.origin}/${window.location.hash.substr(1)}`
		);
		const teamId = parseInt(windowUrl.searchParams.get('teamId'));
		const urlTeam = `${API_BASE_URL}/teams/${teamId}`;
		const urlMatches = `${API_BASE_URL}/teams/${teamId}/matches?${dateFormatter(new Date(), 'detailPageAPI')}`;

		const cacheRequests = [API.getFromCache(urlTeam), API.getFromCache(urlMatches)];
		const apiRequests = [API.getFromAPI(urlTeam), API.getFromAPI(urlMatches)];
		const handleRender = (data) => {
			const [team, otherData] = data;
			const {matches} = otherData;
			const processedData = this.processDetailsData(team, matches, teamId);
			detailPage.render(processedData);
		}

		// load then render from DB if it's a favorite team (to prevent cache expiration if offline as well)
		DB.getFavouriteTeam(teamId).then((data) => {
			if (data) detailPage.render(data);
		});

		// load also from cache and internet asynchronously then render
		Promise.all(cacheRequests)
			.then(handleRender)
			.catch(() => {
				!window.navigator.onLine ? detailPage.renderPageNotAvailable() : ''
			})

		Promise.all(apiRequests)
			.then(handleRender)
	}

	/* HELPER FUNCTION TO ACTIVATE LeagueSelector
       resourceName: resource that needed from API (matches or teams)
       component: component to be render by selecting league on LeagueSelector
       renderOnSelect: handler to render the component when league is selected
    */
	static activateLeagueSelector(resourceName, component, renderOnSelect) {
		const leagueSelector = document.querySelector('league-selector select');

		leagueSelector.addEventListener('change', (event) => {
			const compId = event.target.value;
			const url = `${API_BASE_URL}/competitions/${compId}/${resourceName}`;
			API.getFromCache(url)
				.then(renderOnSelect)
				.catch(() => {
					!window.navigator.onLine ? component.renderPageNotAvailable() : ''
				});
			API.getFromAPI(url).then(renderOnSelect);
			component.renderLoading();
		});
	}

	/* HELPER FUNCTION TO PROCESS DATA OF MATCHES SCHEDULE SO IT CAN BE RENDERED IN MatchesList COMPONENT*/
	static processMatchesData(matches) {
		return matches.reduce((result, match) => {
			const dateId = dateFormatter(new Date(match.utcDate), 'dateId');
			const leagueId = match.competition.id;
			const matchId = match.id;
			const matchDetail = {
				time: timeFormatter(new Date(match.utcDate)),
				isFinished: match.status === 'FINISHED' ? true : false,
				isOnGoing: match.status === 'IN_PLAY' || match.status === 'PAUSED' ? true : false,
				isUpcoming: match.status === 'SCHEDULED' ? true : false,
				homeTeam: match.homeTeam.name,
				homeId: match.homeTeam.id,
				homeScore: match.score.fullTime.homeTeam,
				awayTeam: match.awayTeam.name,
				awayId: match.awayTeam.id,
				awayScore: match.score.fullTime.awayTeam,
				isHomeWin: match.score.winner && match.score.winner === 'HOME_TEAM' ? true : false,
				isAwayWin: match.score.winner && match.score.winner === 'AWAY_TEAM' ? true : false,
			};
			const leagueDetail = {
				name: match.competition.name,
				flagUrl: replaceUrl(match.competition.area.ensignUrl),
				matches: {},
			};
			const dateDetail = {
				date: dateFormatter(new Date(match.utcDate)),
				leagues: {},
			};
			const date = (result[dateId] = result[dateId] || dateDetail);
			const league = (date.leagues[`league${leagueId}`] = date.leagues[`league${leagueId}`] || leagueDetail);
			const matchList = (league.matches[`match${matchId}`] = league.matches[`match${matchId}`] || matchDetail);
			return result;
		}, {});
	}

	/* HELPER FUNCTION TO PROCESS DATA OF MATCHES SCHEDULE SO IT CAN BE RENDERED IN DetailPage COMPONENT*/
	static processDetailsData(team, matches, teamId) {
		matches.forEach((match) => {
			match.isFinished = match.status === 'FINISHED' ? true : false;
			match.isOnGoing = match.status === 'IN_PLAY' || match.status === 'PAUSED' ? true : false;
			match.isUpcoming = match.status === 'SCHEDULED' ? true : false;
			match.time = timeFormatter(new Date(match.utcDate));
			match.date = dateFormatter(new Date(match.utcDate));
			match.isHome = match.homeTeam.id === teamId ? true : false;
			match.isAway = match.awayTeam.id === teamId ? true : false;
			match.isWin =
				(match.isHome && match.score.winner === 'HOME_TEAM') ||
				(match.isAway && match.score.winner === 'AWAY_TEAM');
			match.isLose =
				(match.isHome && match.score.winner === 'AWAY_TEAM') ||
				(match.isAway && match.score.winner === 'HOME_TEAM');
			match.isDraw = match.score.winner === 'DRAW';
		});
		team.crestUrl = replaceUrl(team.crestUrl);
		return { ...team, matches };
	}
}

export default API;
