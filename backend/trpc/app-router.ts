import { createTRPCRouter } from "./create-context";
import { searchRouter } from "./routes/search/route";
import { userRouter } from "./routes/user"; 

export const appRouter = createTRPCRouter({
  search: searchRouter,
  user: userRouter, // Register here
});

export type AppRouter = typeof appRouter;