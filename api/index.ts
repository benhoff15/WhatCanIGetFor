import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '../backend/trpc/app-router';
import { createContext } from '../backend/trpc/create-context';

// Create the app
const app = new Hono();

// Allow CORS
app.use('*', cors());

// tRPC API route
app.use(
  '/trpc/*',
  trpcServer({
    endpoint: '/api/trpc', // optional
    router: appRouter,
    createContext,
  })
);

// Health check route
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'API is running' });
});

// Export the Hono app — Vercel will run this as a serverless function
export default app;
