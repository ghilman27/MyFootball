/* 
   JAVASCRIPT FILE DEDICATED TO STORE FUNCTIONS THAT ACT AS HELPER
*/

const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const oneDay = 1000 * 60 * 60  * 24;
const today = new Date();
const yesterday = new Date(today.getTime() - oneDay);
const tomorrow = new Date(today.getTime() + oneDay);

const pad = (n) => {
    return n<10 ? '0'+n : n;
}

export const replaceUrl = (url) => {
	if (url) return url.replace(/^http:\/\//i, 'https://');
}

// Helper to format date depending on modifier argument
export const dateFormatter = (dateObject, modifier='default') => {
    if (modifier === 'default') {
        if (dateObject.toLocaleDateString() === today.toLocaleDateString()) return 'Today'
        else if (dateObject.toLocaleDateString() === tomorrow.toLocaleDateString()) return 'Tomorrow'
        else if (dateObject.toLocaleDateString() === yesterday.toLocaleDateString()) return 'Yesterday'
        else return `${day[dateObject.getDay()]}, ${dateObject.getDate()} ${month[dateObject.getMonth()]}`
    }
    else if (modifier === 'dateId') {
        return `${dateObject.getFullYear()}${pad(dateObject.getMonth()+1)}${pad(dateObject.getDate())}`
    }
    else {
        let dateFrom, dateTo;
        if (modifier === 'matchesListAPI') {
            dateFrom = new Date(today.getTime() - 3*oneDay);
            dateTo = new Date(today.getTime() + 4*oneDay);
        }
        if (modifier === 'detailPageAPI') {
            dateFrom = new Date(today.getTime() - 21*oneDay);
            dateTo = new Date(today.getTime() + 14*oneDay);
        }

        const dateFromString = `${dateFrom.getFullYear()}-${pad(dateFrom.getMonth()+1)}-${pad(dateFrom.getDate())}`
        const dateToString = `${dateTo.getFullYear()}-${pad(dateTo.getMonth()+1)}-${pad(dateTo.getDate())}`
        return `dateFrom=${dateFromString}&dateTo=${dateToString}`
    }

}

// Helper to format time
export const timeFormatter = (dateObject) => {
    return dateObject.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    })
}

// Helper function for decoding push notification key
export const urlBase64ToUint8Array = (base64String) => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

// Helper to register service worker
export const registerServiceWorker = () => {
	return navigator.serviceWorker
		.register('worker.js')
		.then(function (registration) {
			console.log('Service worker registration success');
			return registration;
		})
		.catch(function (err) {
			console.error('Service worker registration fail. ', err);
		});
}

// Helper to request permission for push notification 
export const requestPermission = () => {
	if ('Notification' in window) {
		Notification.requestPermission().then((result) => {
			if (result === 'denied') {
				console.log('Notification request denied');
				return;
			} else if (result === 'default') {
				console.error('Notification request not responded');
				return;
			}

			if ('PushManager' in window) {
				navigator.serviceWorker.getRegistration().then((registration) => {
					registration.pushManager
						.subscribe({
							userVisibleOnly: true,
							applicationServerKey: urlBase64ToUint8Array(
								'BCFXKfWcnzCd9I8eq7DVXitPRUMzaRxDXNTzU1_WQf1RUscj_TyBlBBcCSRt3EeHn18lq6zwGRbG2zgSGsppPkU'
							),
						})
						.then((subscribe) => {
							console.log(
								'Push subscribe success with endpoint: ',
								subscribe.endpoint
							);
							console.log(
								'Push subscribe success with p256dh key: ',
								btoa(
									String.fromCharCode.apply(
										null,
										new Uint8Array(subscribe.getKey('p256dh'))
									)
								)
							);
							console.log(
								'Push subscribe success with auth key: ',
								btoa(
									String.fromCharCode.apply(
										null,
										new Uint8Array(subscribe.getKey('auth'))
									)
								)
							);
						})
						.catch((e) => {
							console.error('Cannot push subscribe. ', e.message);
						});
				});
			}
		});
	}
}