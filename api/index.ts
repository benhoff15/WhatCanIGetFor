// api/index.ts
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Dynamically import Hono modules
  const { Hono } = await import('hono');
  const { cors } = await import('hono/cors');
  const { trpcServer } = await import('@hono/trpc-server');
  
  // Import your router and context
  const { appRouter } = await import('../backend/trpc/app-router.js');
  const { createContext } = await import('../backend/trpc/create-context.js');
  
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
  
  return app.fetch(request);
}