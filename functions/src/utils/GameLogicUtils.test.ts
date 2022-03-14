import { LetterResult } from '../data/LetterResult';
import { processGuess } from './GameLogicUtils';

describe('GameLogicUtils', () => {
  describe('processGuess', () => {
    it('returns all green when the guessed word is correct', () => {
      const result = processGuess('word', 'word');
      expect(result).toEqual([
        LetterResult.green,
        LetterResult.green,
        LetterResult.green,
        LetterResult.green
      ]);
    });

    it('returns all grey when the guessed word has no letters matching', () => {
      const result = processGuess('efgh', 'word');
      expect(result).toEqual([
        LetterResult.gray,
        LetterResult.gray,
        LetterResult.gray,
        LetterResult.gray
      ]);
    });

    it('returns a yellow result when a letter is in the solution but in the wrong position', () => {
      const result = processGuess('ewgh', 'word');
      expect(result).toEqual([
        LetterResult.gray,
        LetterResult.yellow,
        LetterResult.gray,
        LetterResult.gray,
      ]);
    });

    it('triple letter, mark one as green and two as yellow', () => {
      const result = processGuess('oxxoox', 'oooiii');
      expect(result).toEqual([
        LetterResult.green,
        LetterResult.gray,
        LetterResult.gray,
        LetterResult.yellow,
        LetterResult.yellow,
        LetterResult.gray,
      ]);
    });

    it('corretly marks yellow letter when another same letter is green', () => {
      const result = processGuess('xaxaxx', 'abcabc');
      expect(result).toEqual([
        LetterResult.gray,
        LetterResult.yellow,
        LetterResult.gray,
        LetterResult.green,
        LetterResult.gray,
        LetterResult.gray
      ]);
    });
  });
});