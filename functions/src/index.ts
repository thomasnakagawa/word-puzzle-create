import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// The Firebase Admin SDK to access Firestore.



admin.initializeApp(functions.config().firebase);

export const addMessage = functions.https.onRequest((request, response) => {
  functions.logger.info("HELLO", request.query);
  response.json({ yourResult: 'Hello world!' });
  response.statusCode = 200;
});


export const processGuess = functions.https.onCall((data) => {
  functions.logger.info('HI');
  functions.logger.info(JSON.stringify(data));
  return { hmm: 'heya' };
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
