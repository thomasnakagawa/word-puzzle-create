import { firestore }from "firebase-admin";
import { https } from "firebase-functions";

export function fetchDocument(path: string): Promise<Object> {
  return firestore().doc(path).get()
    .catch(e => {
      throw new https.HttpsError('internal', 'error');
    })
    .then(doc => {
      const data: unknown = doc.data();
      if (!doc.exists || !data || typeof data !== 'object') {
        throw new https.HttpsError('not-found', 'Not found');
      }
      return data;
    })
}

export function writeDocument(collection: string, data: object): Promise<string> {
  return firestore().collection(collection).add(data)
    .catch(e => {
      throw new https.HttpsError('internal', 'error');
    })
    .then(result => {
      return result.id;
    })
}
