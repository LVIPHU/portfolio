import { and, eq } from 'drizzle-orm'
import type { Database } from '../db'
import { statsTable, type SelectStats, type StatsType } from '../db/schema'

export function emptyStats(type: StatsType, slug: string): SelectStats {
  return {
    type,
    slug,
    views: 0,
    loves: 0,
    applauses: 0,
    ideas: 0,
    bullseyes: 0,
  }
}

export async function getBlogStats(db: Database | null, type: StatsType, slug: string): Promise<SelectStats> {
  if (!db) return emptyStats(type, slug)

  try {
    const stats = await db
      .select()
      .from(statsTable)
      .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
    if (stats.length) {
      return stats[0]
    }
    const newStats = await db.insert(statsTable).values({ type, slug }).returning()
    return newStats[0] ?? emptyStats(type, slug)
  } catch (e) {
    console.warn('[stats] getBlogStats failed:', e instanceof Error ? e.message : e)
    return emptyStats(type, slug)
  }
}

export async function updateBlogStats(
  db: Database | null,
  type: StatsType,
  slug: string,
  updates: Partial<Pick<SelectStats, 'views' | 'loves' | 'applauses' | 'ideas' | 'bullseyes'>>
): Promise<SelectStats> {
  if (!db) return emptyStats(type, slug)

  try {
    const currentStats = await getBlogStats(db, type, slug)
    const safeUpdates = { ...updates }

    for (const key of Object.keys(safeUpdates) as (keyof typeof safeUpdates)[]) {
      const newValue = safeUpdates[key]
      const oldValue = currentStats[key]
      if (typeof newValue === 'number' && typeof oldValue === 'number' && newValue < oldValue) {
        safeUpdates[key] = oldValue
      }
    }

    const updatedStats = await db
      .update(statsTable)
      .set(safeUpdates)
      .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
      .returning()
    return updatedStats[0] ?? emptyStats(type, slug)
  } catch (e) {
    console.warn('[stats] updateBlogStats failed:', e instanceof Error ? e.message : e)
    return emptyStats(type, slug)
  }
}
