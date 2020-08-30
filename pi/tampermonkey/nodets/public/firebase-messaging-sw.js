// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.17.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.17.2/firebase-messaging.js');

var firebaseConfig = {
    apiKey: 'AIzaSyBBrBhwjzP0PiXIYIcVWgQz3zLBbmsuO7U',
    authDomain: 'privateproject-jonny.firebaseapp.com',
    databaseURL: 'https://privateproject-jonny.firebaseio.com',
    projectId: 'privateproject-jonny',
    storageBucket: 'privateproject-jonny.appspot.com',
    messagingSenderId: '90777757347',
    appId: '1:90777757347:web:a1fe4b223a627e505f4116',
    measurementId: 'G-700ZKPN3GH'
};
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
/*
messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
});*/

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});