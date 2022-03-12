import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import onProcessGuess from './callables/onProcessGuess';

admin.initializeApp(functions.config().firebase);

export const processGuess = functions.https.onCall(onProcessGuess);
// export const fetchPuzzle = functions.https.onCall(onFetchPuzzle);
// export const writePuzzle = functions.https.onCall(onWritePuzzle);
