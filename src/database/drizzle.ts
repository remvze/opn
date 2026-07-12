import { getSecret } from 'astro:env/server';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(getSecret('DATABASE_URL')!);

export const db = drizzle({ client: sql });
