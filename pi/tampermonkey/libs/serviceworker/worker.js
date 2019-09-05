/*
adding to cahce

 this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/sw-test/',
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/',
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/myLittleVader.jpg',
        '/sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});
intercept http
 */

/**@type {import('./event-map').ServiceWorkerType} */
// @ts-ignore
var serviceWorker = self;

serviceWorker.addEventListener('install', (event) => {
    //console.log('install');
});
serviceWorker.addEventListener('message', () => {
    serviceWorker.registration.showNotification('test', {
        silent: true,
        actions: [{
            title: 'test1',
            action: 'test'
        }, {
            action: 'test',
            title: 'test2'
        }]
    });
    console.log('note');
});
addEventListener('push', () => {
    if(!Notification || Notification.permission !== 'granted') {
        return;
    }
    serviceWorker.registration.showNotification('push Notification', { body: 'push' });
});
serviceWorker.addEventListener('notificationclick', (event) => {
    var messageId = event.notification.data;

    event.notification.close();
    switch(event.action) {
        case 'test':
            console.log('test');
            break;
        default:
            return;
    }
}, false);
serviceWorker.addEventListener('fetch', (event) => {
    if(event.request && event.request.url.endsWith('/sidebar')) {
        // event.respondWith(new Response('hallo'));
        console.log('intercepted Event', event);
    }

    /* event.respondWith(
         new Response('<p>Hallo from freundlichen Service-Worker!</p>', {
             headers: { 'Content-Type': 'text/html' }
         })
     );*/
});