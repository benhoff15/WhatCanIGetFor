import { createTRPCRouter } from "./create-context";
import { searchRouter } from "./routes/search/route";
import { userRouter } from "./routes/user"; 
import { contactRouter } from "./routes/contact"; // Added import

export const appRouter = createTRPCRouter({
  search: searchRouter,
  user: userRouter, // Register here
  contact: contactRouter, // Added contact router
});

export type AppRouter = typeof appRouter;