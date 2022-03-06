import { VALID_WORD_PATTERN } from "../constants/regex";
import { isWord } from "../services/DictionaryService";

export function validateAndSanitizeWord(word?: unknown): Promise<string | undefined> {
  if (!word || typeof word !== 'string' || word.length < 1 || !word.match(VALID_WORD_PATTERN)) {
    return Promise.resolve(undefined);
  }

  const sanitizedWord: string = word.trim().toLowerCase();

  return isWord(sanitizedWord).then(isWord => {
    if (isWord) {
      return sanitizedWord;
    } else {
      return undefined;
    }
  });
}
