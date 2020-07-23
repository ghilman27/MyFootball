const webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BCFXKfWcnzCd9I8eq7DVXitPRUMzaRxDXNTzU1_WQf1RUscj_TyBlBBcCSRt3EeHn18lq6zwGRbG2zgSGsppPkU",
   "privateKey": "Xa-5M0HrcbLHZQx7WytcIjhBQQWw7ljI-xyIsyV6YMk"
};
 
console.log('blok1')
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/fFmO8EvHe5E:APA91bEwK0eLk55FoKPVm_5GYj8imt_T0Ie6aCz8rpdtrrzK7IFDaeWpjvF8KcQdFifauB0Anss5RvOjAuoR6FQ4HEI1asIea7SKIM4gqP3KXX56i4AUV3mwaIOh1cxaXkNYoSvNAoHk",
   "keys": {
       "p256dh": "BL/WXfYlDDiLshaZNaa3OlQk2QT8wv1Pl7OOH/U9FNBQz09G4ZblVGZ4umLVhmW+P52oFGMQAOfeaFMkxCgRuHI=",
       "auth": "arxwIAec+0PmqACwx4TOOQ=="
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
