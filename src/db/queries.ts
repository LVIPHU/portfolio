import { eq, and } from 'drizzle-orm'
import { db } from './index'
import { statsTable, type StatsType } from './schema'

export async function getBlogStats(type: StatsType, slug: string) {
  const stats = await db
    .select()
    .from(statsTable)
    .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
  if (stats.length) {
    return stats[0]
  }
  const newStats = await db.insert(statsTable).values({ type, slug }).returning()
  return newStats[0]
}

export async function updateBlogStats(type: StatsType, slug: string, updates: { [key: string]: any }) {
  const currentStats = await getBlogStats(type, slug)

  // Safeguard against negative updates
  for (const key in updates) {
    const typedKey = key as keyof typeof currentStats
    const newValue = updates[typedKey]
    const oldValue = currentStats[typedKey]
    if (typeof updates[typedKey] === 'number' && newValue < oldValue) {
      updates[key] = currentStats[typedKey]
    }
  }

  const updatedStats = await db
    .update(statsTable)
    .set(updates)
    .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
    .returning()
  return updatedStats[0]
}
