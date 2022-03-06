export const enum LetterResult {
  gray,
  yellow,
  green
}

export interface IGuessCell {
  letter: string;
  result: LetterResult;
};

export type Guess = IGuessCell[];
