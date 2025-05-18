import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import Constants from "expo-constants";
import { getToken } from "@/utils/secureStore";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const expoUrl = Constants?.expoConfig?.extra?.RORK_API_BASE_URL;
  if (expoUrl) return expoUrl;

  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL)
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  if (typeof window !== "undefined") return "";

  return "http://localhost:8080";
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/trpc`,
      transformer: superjson,
      fetch: async (input, init) => {
        const token = await getToken("authToken");
        console.log("🔑 token in fetch:", token);
        return fetch(input, {
          ...init,
          headers: {
            ...init?.headers,
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
      },
    }),
  ],
});
