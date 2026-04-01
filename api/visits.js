import { Redis } from '@upstash/redis';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  try {
    const redis = Redis.fromEnv();
    const count = await redis.incr('portfolio:site_visits');

    res.status(200).json({ value: count });
  } catch (e) {
    console.error('[api/visits]', e);
    res.status(500).json({ error: 'counter_unavailable' });
  }
}
