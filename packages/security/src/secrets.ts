import { decryptString, encryptString } from "./encryption.js";

const store = new Map<string, string>();

export async function setSecret(key: string, value: string, encryptionKey: string) {
  store.set(key, encryptString(value, encryptionKey));
}

export async function getSecret(key: string, encryptionKey: string) {
  const value = store.get(key);
  return value ? decryptString(value, encryptionKey) : null;
}
