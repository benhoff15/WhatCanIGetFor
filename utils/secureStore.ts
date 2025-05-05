import * as SecureStore from "expo-secure-store";

const isWeb = typeof window !== "undefined";

export const saveToken = async (key: string, value: string) => {
  if (isWeb) localStorage.setItem(key, value);
  else await SecureStore.setItemAsync(key, value);
};

export const getToken = async (key: string): Promise<string | null> => {
  if (isWeb) return localStorage.getItem(key);
  else return await SecureStore.getItemAsync(key);
};

export const deleteToken = async (key: string) => {
  if (isWeb) localStorage.removeItem(key);
  else await SecureStore.deleteItemAsync(key);
};
