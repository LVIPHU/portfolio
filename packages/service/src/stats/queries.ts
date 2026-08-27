import { and, eq, inArray, sql } from 'drizzle-orm'
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

async function ensureRow(db: Database, type: StatsType, slug: string): Promise<void> {
  // Hai GET song song từng cùng insert → unique PK fail → soft-fail zeros.
  // onConflictDoNothing + re-select: hàng luôn tồn tại nếu DB sống.
  await db.insert(statsTable).values({ type, slug }).onConflictDoNothing()
}

export async function getBlogStats(db: Database | null, type: StatsType, slug: string): Promise<SelectStats> {
  if (!db) return emptyStats(type, slug)

  try {
    await ensureRow(db, type, slug)
    const stats = await db
      .select()
      .from(statsTable)
      .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
    return stats[0] ?? emptyStats(type, slug)
  } catch (e) {
    console.warn('[stats] getBlogStats failed:', e instanceof Error ? e.message : e)
    return emptyStats(type, slug)
  }
}

export async function getBlogStatsList(db: Database | null, type: StatsType, slugs: string[]): Promise<SelectStats[]> {
  if (!db || slugs.length === 0) return slugs.map((slug) => emptyStats(type, slug))

  try {
    const rows = await db
      .select()
      .from(statsTable)
      .where(and(eq(statsTable.type, type), inArray(statsTable.slug, slugs)))
    const bySlug = new Map(rows.map((row) => [row.slug, row]))
    return slugs.map((slug) => bySlug.get(slug) ?? emptyStats(type, slug))
  } catch (e) {
    console.warn('[stats] getBlogStatsList failed:', e instanceof Error ? e.message : e)
    return slugs.map((slug) => emptyStats(type, slug))
  }
}

/**
 * +1 lượt xem NGAY TRONG SQL (`views = views + 1`).
 *
 * Không nhận số từ client: hook useBlogStats tắt hết revalidate (revalidateIfStale/OnFocus/
 * OnReconnect = false) nên lần mount thứ hai trong cùng phiên đọc lại số cũ trong cache — client
 * gửi đúng con số server đang giữ, clamp ở updateBlogStats thấy "không lớn hơn" nên bỏ qua, lượt
 * xem mất trắng. Tăng ở SQL cũng dẹp luôn lost-update khi hai người đọc cùng lúc.
 */
export async function incrementBlogViews(db: Database | null, type: StatsType, slug: string): Promise<SelectStats> {
  if (!db) return emptyStats(type, slug)

  try {
    await ensureRow(db, type, slug)
    const updated = await db
      .update(statsTable)
      .set({ views: sql`${statsTable.views} + 1` })
      .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
      .returning()
    return updated[0] ?? emptyStats(type, slug)
  } catch (e) {
    console.warn('[stats] incrementBlogViews failed:', e instanceof Error ? e.message : e)
    return emptyStats(type, slug)
  }
}

const REACTION_COLUMNS = ['loves', 'applauses', 'ideas', 'bullseyes'] as const
type ReactionKey = (typeof REACTION_COLUMNS)[number]

export async function incrementBlogReactions(
  db: Database | null,
  type: StatsType,
  slug: string,
  deltas: Partial<Record<ReactionKey, number>>
): Promise<SelectStats> {
  if (!db) return emptyStats(type, slug)

  const set: Partial<Record<ReactionKey, ReturnType<typeof sql>>> = {}
  for (const key of REACTION_COLUMNS) {
    const delta = deltas[key]
    if (typeof delta !== 'number') continue
    set[key] = sql`${statsTable[key]} + ${delta}`
  }
  if (Object.keys(set).length === 0) return getBlogStats(db, type, slug)

  try {
    await ensureRow(db, type, slug)
    const updated = await db
      .update(statsTable)
      .set(set)
      .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
      .returning()
    return updated[0] ?? emptyStats(type, slug)
  } catch (e) {
    console.warn('[stats] incrementBlogReactions failed:', e instanceof Error ? e.message : e)
    return emptyStats(type, slug)
  }
}
