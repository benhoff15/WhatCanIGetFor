import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./app-router";
import { createContext } from "./create-context";
import { prisma } from "@/lib/prisma";
import { signupRoute } from "./routes/auth/signup";
import { loginRoute } from "./routes/auth/login";
import { requestPasswordResetRoute } from './routes/auth/request-password-reset';
import { resetPasswordRoute } from './routes/auth/reset-password';

const app = new Hono();

app.use("*", cors());

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

app.get("/adventure/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const adventure = await prisma.adventure.findUnique({
      where: { id },
    });

    if (!adventure) {
      return c.json({ error: "Adventure not found" }, 404);
    }

    const parsed = {
      ...adventure,
      details: typeof adventure.details === "string"
        ? adventure.details.split(",").map(d => d.trim())
        : adventure.details,
    };

    return c.json({ adventure: parsed });
  } catch (err) {
    return c.json({ error: "Failed to fetch adventure" }, 500);
  }
});


app.route("/api/auth/signup", signupRoute);
app.route("/api/auth/login", loginRoute);
app.route("/api/auth/request-password-reset", requestPasswordResetRoute);
app.route("/api/auth/reset-password", resetPasswordRoute);

serve({
  fetch: app.fetch,
  port: 8080,
}, () => {
  console.log("🚀 Server ready at http://localhost:8080");
});
