import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const loginRoute = new Hono();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

loginRoute.post('/', async (c) => {
  try {
    const { email, password } = await c.req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return c.json({ error: 'Invalid password' }, 401);
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return c.json({ token });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export { loginRoute };
