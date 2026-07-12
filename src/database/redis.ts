import { getSecret } from 'astro:env/server';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

export function getRedis() {
  if (redis) {
    return redis;
  }

  const url = getSecret('UPSTASH_REDIS_REST_URL');
  const token = getSecret('UPSTASH_REDIS_REST_TOKEN');

  if (!url || !token) {
    return null;
  }

  redis = new Redis({ token, url });

  return redis;
}
