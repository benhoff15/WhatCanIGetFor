import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '../backend/trpc/app-router';
import { createContext } from '../backend/trpc/create-context';
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

// ✅ Required for Edge Function support
export const GET = handle(app);
export const POST = handle(app);
