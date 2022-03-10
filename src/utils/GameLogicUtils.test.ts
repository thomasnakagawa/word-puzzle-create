import { LetterResult } from '../data/Guess';
import { processGuess } from './GameLogicUtils';

describe('GameLogicUtils', () => {
  describe('processGuess', () => {
    it('returns all green when the guessed word is correct', () => {
      const result = processGuess('word', 'word');
      expect(result).toEqual([
        { result: LetterResult.green, letter: 'w' },
        { result: LetterResult.green, letter: 'o' },
        { result: LetterResult.green, letter: 'r' },
        { result: LetterResult.green, letter: 'd' }
      ]);
    });

    it('returns all grey when the guessed word has no letters matching', () => {
      const result = processGuess('efgh', 'word');
      expect(result).toEqual([
        { result: LetterResult.gray, letter: 'e' },
        { result: LetterResult.gray, letter: 'f' },
        { result: LetterResult.gray, letter: 'g' },
        { result: LetterResult.gray, letter: 'h' }
      ]);
    });

    it('returns a yellow result when a letter is in the solution but in the wrong position', () => {
      const result = processGuess('ewgh', 'word');
      expect(result).toEqual([
        { result: LetterResult.gray, letter: 'e' },
        { result: LetterResult.yellow, letter: 'w' },
        { result: LetterResult.gray, letter: 'g' },
        { result: LetterResult.gray, letter: 'h' }
      ]);
    });

    it('triple letter, mark one as green and two as yellow', () => {
      const result = processGuess('oxxoox', 'oooiii');
      expect(result).toEqual([
        { result: LetterResult.green, letter: 'o' },
        { result: LetterResult.gray, letter: 'x' },
        { result: LetterResult.gray, letter: 'x' },
        { result: LetterResult.yellow, letter: 'o' },
        { result: LetterResult.yellow, letter: 'o' },
        { result: LetterResult.gray, letter: 'x' }
      ]);
    });

    it('correctly marks yellow letter when another same letter is green', () => {
      const result = processGuess('xaxaxx', 'abcabc');
      expect(result).toEqual([
        { result: LetterResult.gray, letter: 'x' },
        { result: LetterResult.yellow, letter: 'a' },
        { result: LetterResult.gray, letter: 'x' },
        { result: LetterResult.green, letter: 'a' },
        { result: LetterResult.gray, letter: 'x' },
        { result: LetterResult.gray, letter: 'x' }
      ]);
    });
  });
});