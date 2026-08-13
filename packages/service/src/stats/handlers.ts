import type { NextRequest } from 'next/server'
import { createDb } from '../db'
import { getBlogStats, updateBlogStats } from './queries'
import { statsQuerySchema, statsUpdateBodySchema } from './validators'

export type CreateStatsHandlersOptions = {
  databaseUrl?: string
}

export function createStatsHandlers({ databaseUrl }: CreateStatsHandlersOptions) {
  const db = createDb(databaseUrl)

  async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const parsed = statsQuerySchema.safeParse({
      type: searchParams.get('type'),
      slug: searchParams.get('slug'),
    })
    if (!parsed.success) {
      return Response.json({ message: 'Missing or invalid `type` or `slug` parameter!' }, { status: 400 })
    }
    const data = await getBlogStats(db, parsed.data.type, parsed.data.slug)
    return Response.json(data)
  }

  async function POST(request: NextRequest) {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json({ message: 'Invalid JSON body!' }, { status: 400 })
    }

    const parsed = statsUpdateBodySchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ message: 'Missing or invalid `type` or `slug` parameter!' }, { status: 400 })
    }

    const { type, slug, ...updates } = parsed.data
    const updatedStats = await updateBlogStats(db, type, slug, updates)
    return Response.json(updatedStats)
  }

  return { GET, POST }
}
