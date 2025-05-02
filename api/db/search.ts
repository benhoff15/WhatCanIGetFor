import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma.js';

interface Adventure {
  id: string;
  type: string;
  title: string;
  location: string;
  price: number;
  description: string;
  date?: string | null;
  duration?: string | null;
  details: string | string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Respond immediately to OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { budget, adventureType, location } = req.body;

  if (
    typeof budget !== 'number' ||
    typeof adventureType !== 'string' ||
    typeof location !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const results = await prisma.adventure.findMany({
      where: {
        type: {
          equals: adventureType,
          mode: 'insensitive',
        },
        location: {
          contains: location,
          mode: 'insensitive',
        },
        price: {
          lte: budget,
        },
      },
    });

    const transformed = results.map((adv: Adventure) => ({
      ...adv,
      details: typeof adv.details === 'string'
        ? adv.details.split(',').map((d: string) => d.trim()).filter(Boolean)
        : adv.details,
    }));

    res.status(200).json({ success: true, data: transformed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
