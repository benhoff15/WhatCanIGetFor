import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type UserPayload = {
  userId: string;
  email: string;
};

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const authHeader = opts.req.headers.get("authorization");
  console.log("🔒 Received Authorization header:", authHeader);

  let user: UserPayload | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      user = jwt.verify(token, JWT_SECRET) as UserPayload;
      console.log("✅ Verified user from token:", user);
    } catch (err) {
      console.warn("❌ Invalid JWT:", err);
    }
  }

  return {
    req: opts.req,
    user,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error("Unauthorized");
  }
  return next({ ctx });
});
