import { createTRPCRouter } from "./create-context";
import { searchRouter } from "./routes/search/route";

export const appRouter = createTRPCRouter({
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
