import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// Create the tRPC context (e.g., for request metadata, DB, auth)
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    req: opts.req,
    // Add more context if needed
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
