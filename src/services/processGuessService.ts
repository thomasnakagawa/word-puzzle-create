import { httpsCallable } from "firebase/functions";
import { LetterResult } from "../data/Guess";
import { cloudFunctions } from "../db/Firebase";

export interface IRequestData {
  puzzleId?: string;
  guess?: string;
}

export interface IResponseData {
  results?: LetterResult[];
  guessWord: string;
  isNotWord?: true;
}

export const processGuess: (data: IRequestData) => Promise<IResponseData> = (data) => {
  return httpsCallable(cloudFunctions, 'processGuess').call(data).then(value => value.data) as Promise<IResponseData>;
}
