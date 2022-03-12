import { https } from "firebase-functions";

/**
 * Checks to make sure that an object contains a field. Can also check the type of the value in the field. Throws http errors if not.
 * @param object Object to check for the field
 * @param field Field to check for
 * @param type Optionally, the type to make sure the field value is
 * @returns The field value from the object.
 */
export function ensure<T>(object: any, field: string, type?: string): T {
  if (!object || !field) {
    throw new https.HttpsError('invalid-argument', 'Bad params');
  }

  const value: any = object[field];
  if (value === undefined || value === null) {
    throw new https.HttpsError('invalid-argument', `${field} required`);
  }

  if (type && typeof value !== type) {
    throw new https.HttpsError('invalid-argument', `${field} invalid`);
  }

  return value;
}
