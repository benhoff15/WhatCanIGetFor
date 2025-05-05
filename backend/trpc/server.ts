import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { signupRoute } from './routes/auth/signup';
import { loginRoute } from './routes/auth/login';

const app = new Hono();

app.route('/api/auth/signup', signupRoute);
app.route('/api/auth/login', loginRoute);

serve(app, (info) => {
  console.log(`✅ API running at http://localhost:${info.port}`);
});
