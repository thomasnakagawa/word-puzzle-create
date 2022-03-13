import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import onProcessGuess from './callables/onProcessGuess';
import onWritePuzzle from "./callables/onWritePuzzle";
import onFetchPuzzlePrompt from "./callables/onFetchPuzzlePrompt";

admin.initializeApp(functions.config().firebase);

export const processGuess = functions.https.onCall(onProcessGuess);
export const writePuzzle = functions.https.onCall(onWritePuzzle);
export const fetchPuzzlePrompt = functions.https.onCall(onFetchPuzzlePrompt);
