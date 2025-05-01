import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import Constants from "expo-constants";

const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const expoUrl = Constants?.expoConfig?.extra?.RORK_API_BASE_URL;
  if (expoUrl) return expoUrl;

  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL)
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  if (typeof window !== "undefined") return "";

  throw new Error("No base url found. Set RORK_API_BASE_URL in app.json extra.");
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});

export default trpc;
