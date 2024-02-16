importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDtewLNsNhuBgE_8yrRMOEBxYRoCJ_mVHQ",
  authDomain: "fizanoorcollection.firebaseapp.com",
  databaseURL: "https://fizanoorcollection-default-rtdb.firebaseio.com",
  projectId: "fizanoorcollection",
  storageBucket: "fizanoorcollection.appspot.com",
  messagingSenderId: "737912997596",
  appId: "1:737912997596:web:1115dd3cbe761d5e8fd619",
  measurementId: "G-Z6ML3WZ43J"
});
var messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
});
