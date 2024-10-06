// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDtewLNsNhuBgE_8yrRMOEBxYRoCJ_mVHQ",
    authDomain: "fizanoorcollection.firebaseapp.com",
    databaseURL: "https://fizanoorcollection-default-rtdb.firebaseio.com",
    projectId: "fizanoorcollection",
    storageBucket: "fizanoorcollection.appspot.com",
    messagingSenderId: "737912997596",
    appId: "1:737912997596:web:1115dd3cbe761d5e8fd619",
    measurementId: "G-Z6ML3WZ43J"
  },
  // url: 'https://fiza-noor-collection.vercel.app/api/',
  url: 'http://localhost:3000/api/',

  cloudinary: {
    cloudName: 'denuodqtw',
    apiKey: '777191772778753',
    apiSecret: 'hsOg-ldjplTC5oOpwT_Pdig1Fgg'
  },
  cloudinaryUrl: "https://api.cloudinary.com/v1_1",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
