import { eq, sql } from 'drizzle-orm';
import { db } from '@/database/drizzle';
import { profilesTable } from '@/database/schema';

export async function findByUsername(username: string) {
  const result = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.username, username))
    .limit(1);

  const record = result[0];

  return record || null;
}

export async function incrementVisits(username: string) {
  const [updated] = await db
    .update(profilesTable)
    .set({ isActive: true, visits: sql`${profilesTable.visits} + 1` })
    .where(eq(profilesTable.username, username))
    .returning();

  if (!updated) throw new Error(`Profile with username ${username} not found`);

  return updated.visits;
}

export async function incrementOrCreateVisit(username: string) {
  const profile = await findByUsername(username);

  if (!profile) {
    await db.insert(profilesTable).values({ username, visits: 1 }).returning();

    return 1;
  } else {
    const visits = await incrementVisits(username);

    return visits;
  }
}

export async function markInactive(username: string) {
  const profile = await findByUsername(username);

  if (!profile) return;

  await db
    .update(profilesTable)
    .set({ isActive: false })
    .where(eq(profilesTable.username, username));
}
