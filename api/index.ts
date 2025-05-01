export const config = {
  runtime: 'edge',
};

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '../backend/trpc/app-router';
import { createContext } from '../backend/trpc/create-context';
import { handle } from 'hono/vercel';

const app = new Hono();

// Enable CORS for all routes
app.use('*', cors());

// Attach tRPC router to /trpc/*
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
  })
);

// Basic route for health check
app.get('/', (c) => c.json({ status: 'ok', message: 'API is running' }));

// Export GET and POST handlers for Vercel
export const GET = handle(app);
export const POST = handle(app);