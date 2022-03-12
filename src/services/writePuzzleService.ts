import { httpsCallable } from "firebase/functions";
import { ICompletePuzzle } from "../data/PuzzleTypes";
import { cloudFunctions } from "../db/Firebase";

export interface IRequestData {
  puzzle: ICompletePuzzle;
}

export interface IResponseData {
  puzzleId: string;
}

export const writePuzzle: (data: IRequestData) => Promise<IResponseData> = (data) => {
  return httpsCallable(cloudFunctions, 'writePuzzle').call(data).then(value => value.data) as Promise<IResponseData>;
}
