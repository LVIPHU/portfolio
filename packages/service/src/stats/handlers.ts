import type { NextRequest } from 'next/server'
import { createDb } from '../db'
import { getBlogStats, getBlogStatsList, incrementBlogReactions, incrementBlogViews } from './queries'
import { isSameOrigin } from './origin'
import { statsListQuerySchema, statsQuerySchema, statsUpdateBodySchema } from './validators'

export type CreateStatsHandlersOptions = {
  databaseUrl?: string
}

export function createStatsHandlers({ databaseUrl }: CreateStatsHandlersOptions) {
  const db = createDb(databaseUrl)

  async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const slugsRaw = searchParams.get('slugs')
    if (slugsRaw) {
      const parsed = statsListQuerySchema.safeParse({
        type: searchParams.get('type'),
        slugs: slugsRaw,
      })
      if (!parsed.success) {
        return Response.json({ message: 'Missing or invalid `type` or `slugs` parameter!' }, { status: 400 })
      }
      const data = await getBlogStatsList(db, parsed.data.type, parsed.data.slugs)
      return Response.json(data)
    }

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
    if (!isSameOrigin(request)) {
      return Response.json({ message: 'Forbidden' }, { status: 403 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json({ message: 'Invalid JSON body!' }, { status: 400 })
    }

    const parsed = statsUpdateBodySchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ message: 'Missing or invalid increment payload!' }, { status: 400 })
    }

    const { type, slug, incrementViews, loves, applauses, ideas, bullseyes } = parsed.data
    let stats = incrementViews ? await incrementBlogViews(db, type, slug) : await getBlogStats(db, type, slug)

    const reactions = { loves, applauses, ideas, bullseyes }
    const hasReaction = loves || applauses || ideas || bullseyes
    if (hasReaction) {
      stats = await incrementBlogReactions(db, type, slug, reactions)
    }

    return Response.json(stats)
  }

  return { GET, POST }
}
