import { httpsCallable } from "firebase/functions";
import { IObfucscatedPuzzle } from "../data/PuzzleTypes";
import { cloudFunctions } from "../db/Firebase";

export interface IRequestData {
  puzzleId: string;
}

export interface IResponseData {
  puzzle: IObfucscatedPuzzle;
}

export const fetchPuzzlePrompt: (data: IRequestData) => Promise<IResponseData> = (data) => {
  return httpsCallable(cloudFunctions, 'fetchPuzzlePrompt')(data).then(value => value.data) as Promise<IResponseData>;
}
