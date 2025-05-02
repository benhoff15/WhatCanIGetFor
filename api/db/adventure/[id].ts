import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../../lib/prisma.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // ✅ Add this line

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid ID' });
  }

  try {
    const adventure = await prisma.adventure.findUnique({ where: { id } });

    if (!adventure) {
      return res.status(404).json({ error: 'Adventure not found' });
    }

    return res.status(200).json({ success: true, adventure });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
