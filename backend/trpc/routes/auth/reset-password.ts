import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // For hashing the new password

const resetPasswordRoute = new Hono();
const prisma = new PrismaClient();

resetPasswordRoute.post('/', async (c) => {
  try {
    const { token, password } = await c.req.json();

    if (!token || !password) {
      return c.json({ error: 'Token and new password are required' }, 400);
    }

    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters long' }, 400);
    }

    const tokens = await prisma.passwordResetToken.findMany({
      where: { expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    let validTokenEntry = null;

    for (const entry of tokens) {
      const isMatch = await bcrypt.compare(token, entry.hashedToken);
      if (isMatch) {
        validTokenEntry = entry;
        break;
      }
    }

    if (!validTokenEntry) {
      return c.json({ error: 'Invalid or expired token' }, 400);
    }

    if (new Date() > new Date(validTokenEntry.expiresAt)) {
      await prisma.passwordResetToken.delete({ where: { id: validTokenEntry.id } });
      return c.json({ error: 'Invalid or expired token' }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: validTokenEntry.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: validTokenEntry.id },
    });

    return c.json({ message: 'Password has been reset successfully.' });

  } catch (error: any) {
    console.error('Error resetting password:', error);
    if (error.code === 'P2025') {
        return c.json({ error: 'Invalid token or user not found.' }, 400);
    }
    return c.json({ error: 'An internal error occurred. Please try again later.' }, 500);
  }
});

export { resetPasswordRoute };