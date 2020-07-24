/* 
   JAVASCRIPT FILE DEDICATED TO HANDLE DATA TRANSACTION TO DATABASE
*/

import idb from './idb.js';

const CURRENT_VERSION = 1;
const DB = {
	openDB: () => {
		idb.open('myfootball', CURRENT_VERSION, (upgradeDb) => {
			const teamObjectStore = upgradeDb.createObjectStore('teams', {
				keyPath: 'id',
			});
			teamObjectStore.createIndex('name', 'name', { unique: false });
		})
	},
	saveFavouriteTeam: (team) => {
		idb.open('myfootball', CURRENT_VERSION)
			.then((db) => {
				const tx = db.transaction('teams', 'readwrite');
				const store = tx.objectStore('teams');
				store.add(team);
				return tx.complete;
			})
			.then(() => {
				// console.log('Team is saved as favorite');
			});
	},
	removeFavouriteTeam: (id) => {
		idb.open('myfootball', CURRENT_VERSION)
			.then((db) => {
				const tx = db.transaction('teams', 'readwrite');
				const store = tx.objectStore('teams');
				store.delete(id);
				return tx.complete;
			})
			.then(() => {
				// console.log('Team is deleted from favorites');
			});
	},
	getAllFavouriteTeams: () => {
		return new Promise((resolve, reject) => {
			idb.open('myfootball', CURRENT_VERSION)
				.then((db) => {
					const tx = db.transaction('teams', 'readonly');
					const store = tx.objectStore('teams');
					return store.getAll();
				})
				.then((teams) => {
					resolve(teams);
				});
		});
	},
	getFavouriteTeam: (id) => {
		return new Promise(function (resolve, reject) {
			idb.open('myfootball', CURRENT_VERSION)
				.then((db) => {
					const tx = db.transaction('teams', 'readonly');
					const store = tx.objectStore('teams');
					return store.get(id);
				})
				.then((team) => {
					resolve(team);
				});
		});
	},
}

export default DB;