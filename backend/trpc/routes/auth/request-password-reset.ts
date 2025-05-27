import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
// import { sendPasswordResetEmail } from '@/utils/mailer'; 

const requestPasswordResetRoute = new Hono();
const prisma = new PrismaClient();

const TOKEN_EXPIRY_DURATION = 60 * 60 * 1000;

requestPasswordResetRoute.post('/', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`Password reset requested for non-existent user: ${email}`);
      return c.json({ message: 'If your email is registered, you will receive a password reset link.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + TOKEN_EXPIRY_DURATION);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        hashedToken: await bcrypt.hash(resetToken, 10),
        expiresAt: tokenExpiry,
      },
    });

    const resetLink = `http://localhost:8081/auth/reset-password?token=${resetToken}`; // Adjust frontend URL as needed
    console.log(`Password reset link for ${email}: ${resetLink}`); 
    // await sendPasswordResetEmail(user.email, resetLink); // Example of actual email sending

    return c.json({ message: 'If your email is registered, you will receive a password reset link.' });

  } catch (error) {
    console.error('Error requesting password reset:', error);
    return c.json({ error: 'An internal error occurred. Please try again later.' }, 500);
  }
});

export { requestPasswordResetRoute };