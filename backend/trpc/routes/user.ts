import { createTRPCRouter, protectedProcedure } from "../create-context";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user; // contains userId and email from JWT
  }),
});