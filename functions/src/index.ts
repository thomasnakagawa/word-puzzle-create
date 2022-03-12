import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import onProcessGuess from './callables/onProcessGuess';
import onWritePuzzle from "./callables/onWritePuzzle";

admin.initializeApp(functions.config().firebase);

export const processGuess = functions.https.onCall(onProcessGuess);
export const writePuzzle = functions.https.onCall(onWritePuzzle);
