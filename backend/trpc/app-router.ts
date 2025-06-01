import { createTRPCRouter } from "./create-context";
import { searchRouter } from "./routes/search/route";
import { userRouter } from "./routes/user"; 
import { contactRouter } from "./routes/contact";

export const appRouter = createTRPCRouter({
  search: searchRouter,
  user: userRouter, // Register here
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;