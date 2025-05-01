import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '../backend/trpc/app-router.js';
import { createContext } from '../backend/trpc/create-context.js';
import { handle } from 'hono/vercel';

const app = new Hono();

app.use('*', cors());

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
  })
);

app.get('/', (c) => c.json({ status: 'ok', message: 'API is running' }));

// Export default handler for Edge Functions
export default handle(app);