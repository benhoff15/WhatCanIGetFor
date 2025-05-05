import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const signupRoute = new Hono();
const prisma = new PrismaClient();

signupRoute.post('/', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Missing fields' }, 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return c.json({ error: 'User already exists' }, 409);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed },
    });

    return c.json({ message: 'User created', userId: user.id });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export { signupRoute };
