import Constants from "expo-constants";

const getBaseUrl = () => {
  const expoUrl = Constants?.expoConfig?.extra?.RORK_API_BASE_URL;

  if (expoUrl) return expoUrl;
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  if (typeof window !== "undefined") {
    return "";
  }

  throw new Error("No base url found. Set RORK_API_BASE_URL in app.json extra.");
};
