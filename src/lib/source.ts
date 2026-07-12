import { getRedis } from '@/database/redis';
import { incrementOrCreateVisit, markInactive } from './profile';

const SOURCE_CACHE_PREFIX = 'source-availability';
const SOURCE_CACHE_HIT_TTL_SECONDS = 60 * 30;
const SOURCE_CACHE_MISS_TTL_SECONDS = 60 * 5;

type CachedSourceBranch = 'main' | 'master' | 'missing';

function getSourceUrl(username: string, branch: string) {
  return `https://raw.githubusercontent.com/${username}/.opn/refs/heads/${branch}/bio.json`;
}

function getSourceCacheKey(username: string) {
  return `${SOURCE_CACHE_PREFIX}:${username}`;
}

async function fetchSource(username: string, branch: string) {
  const url = getSourceUrl(username, branch);
  const res = await fetch(url);

  return { status: res.status, url };
}

async function readCachedBranch(username: string) {
  const redis = getRedis();

  if (!redis) {
    return null;
  }

  try {
    const branch = await redis.get<CachedSourceBranch>(
      getSourceCacheKey(username),
    );

    if (branch === 'main' || branch === 'master' || branch === 'missing') {
      return branch;
    }
  } catch (error) {
    console.error('Failed to read source availability cache', error);
  }

  return null;
}

async function writeCachedBranch(username: string, branch: CachedSourceBranch) {
  const redis = getRedis();

  if (!redis) {
    return;
  }

  const ttlSeconds =
    branch === 'missing'
      ? SOURCE_CACHE_MISS_TTL_SECONDS
      : SOURCE_CACHE_HIT_TTL_SECONDS;

  try {
    await redis.set(getSourceCacheKey(username), branch, { ex: ttlSeconds });
  } catch (error) {
    console.error('Failed to write source availability cache', error);
  }
}

export async function getSource(username: string) {
  const cachedBranch = await readCachedBranch(username);

  if (cachedBranch === 'main' || cachedBranch === 'master') {
    const visits = await incrementOrCreateVisit(username);

    return { url: getSourceUrl(username, cachedBranch), visits };
  }

  if (cachedBranch === 'missing') {
    return null;
  }

  const main = await fetchSource(username, 'main');

  if (main.status === 200 || main.status === 429) {
    await writeCachedBranch(username, 'main');

    const visits = await incrementOrCreateVisit(username);

    return { url: main.url, visits };
  }

  const master = await fetchSource(username, 'master');

  if (master.status === 200 || master.status === 429) {
    await writeCachedBranch(username, 'master');

    const visits = await incrementOrCreateVisit(username);

    return { url: master.url, visits };
  }

  if (main.status === 404 && master.status === 404) {
    await markInactive(username);
    await writeCachedBranch(username, 'missing');

    return null;
  }
}
