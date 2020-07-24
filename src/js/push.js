const webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BCFXKfWcnzCd9I8eq7DVXitPRUMzaRxDXNTzU1_WQf1RUscj_TyBlBBcCSRt3EeHn18lq6zwGRbG2zgSGsppPkU",
   "privateKey": "Xa-5M0HrcbLHZQx7WytcIjhBQQWw7ljI-xyIsyV6YMk"
};
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

// change this everytime you load the web
const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/f1DN5jpDjAY:APA91bEMyznaHMMzTECQuN3jcG92hmMqBdK-jLqlmvrqeb_4GqiHgN4i8vf1UyKHBdWjbcEPiWYD2O9ptYwfXJAi7yLvbKuCgYid29s5Y2dQwHn1BxYddTDfo9ZwjEB5E_wW9IDCrmOX",
   "keys": {
       "p256dh": "BJ3yd14pp9wgXcN314hOxC3Tr4YGlpBoIB+KpjbGEYTvkPCv/fMR7fQ15Hs2D5k2Bl+nI5W1xC6BzAzfD9nccIs=",
       "auth": "xx/Pq9vAUs9UWSA8JeroNQ=="
   }
};
const payload = 'Thanks for accepting notifications. Stay tuned for your favorite clubs!';
 
const options = {
   gcmAPIKey: '963457113337',
   TTL: 60,
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);
