const cache: Map<string, boolean> = new Map();

export function isWord(word: string): Promise<boolean> {
  const cacheValue: boolean | undefined = cache.get(word);
  if (cacheValue !== undefined) {
    return Promise.resolve(cacheValue);
  }

  if (typeof word !== 'string' || word.length < 1) {
    return Promise.resolve(false);
  }
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => {
      if (res.status === 200) {
        cache.set(word, true);
        return true;
      } 
      if (res.status === 404) {
        cache.set(word, false);
        return false;
      }
      throw new Error('Unknown response');
    });
}
