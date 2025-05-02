import { Context } from 'hono';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';


export const signupHandler = async (c: Context) => {
    try {
      const { email, password } = await c.req.json();
  
      if (!email || !password) {
        return c.json({ error: 'Email and password are required.' }, 400);
      }
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return c.json({ error: 'User already exists.' }, 409);
      }
  
      const hashedPassword = await hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
  
      return c.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (err) {
      console.error('Signup error:', err);
      return c.json({ error: 'Internal server error' }, 500);
    }
  };
  
