import { router } from "./create-context"; 
import { searchRouter } from "./routes/search/route";

export const appRouter = router({
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
