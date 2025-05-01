import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '../backend/trpc/app-router';
import { createContext } from '../backend/trpc/create-context';
import { handle } from 'hono/vercel'; // ✅ <-- this is the key

const app = new Hono();

// Enable CORS
app.use('*', cors());

// Setup tRPC
app.use(
  '/trpc/*',
  trpcServer({
    endpoint: '/api/trpc',
    router: appRouter,
    createContext,
  })
);

// Health check
app.get('/', (c) => c.json({ status: 'ok', message: 'API is running' }));

// ✅ Export Vercel-compatible handler
export const GET = handle(app);
export const POST = handle(app);
