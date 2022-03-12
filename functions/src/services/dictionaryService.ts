import fetch from 'node-fetch';

export function isWord(word: string): Promise<boolean> {
  if (typeof word !== 'string' || word.length < 1) {
    return Promise.resolve(false);
  }

  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => {
      if (res.status === 200) {
        return true;
      } 
      if (res.status === 404) {
        return false;
      }
      throw new Error('Unknown response');
    });
}
