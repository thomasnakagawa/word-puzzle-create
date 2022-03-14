export const enum LetterResult {
  gray = 'gray',
  yellow = 'yellow',
  green = 'green'
}

export interface IGuessCell {
  letter: string;
  result: LetterResult;
};

export type Guess = IGuessCell[];
