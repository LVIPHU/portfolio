import { describe, expect, it } from 'vitest'
import { statsUpdateBodySchema } from './validators'
import { isSameOrigin } from './origin'
import { NextRequest } from 'next/server'

describe('statsUpdateBodySchema', () => {
  it('rejects absolute view writes', () => {
    const parsed = statsUpdateBodySchema.safeParse({ type: 'blog', slug: 'hello', views: 999 })
    expect(parsed.success).toBe(false)
  })

  it('accepts incrementViews', () => {
    const parsed = statsUpdateBodySchema.safeParse({ type: 'blog', slug: 'hello', incrementViews: true })
    expect(parsed.success).toBe(true)
  })

  it('clamps reaction deltas to 1–5', () => {
    expect(statsUpdateBodySchema.safeParse({ type: 'blog', slug: 'hello', loves: 0 }).success).toBe(false)
    expect(statsUpdateBodySchema.safeParse({ type: 'blog', slug: 'hello', loves: 6 }).success).toBe(false)
    expect(statsUpdateBodySchema.safeParse({ type: 'blog', slug: 'hello', loves: 2 }).success).toBe(true)
  })
})

describe('isSameOrigin', () => {
  it('allows matching Origin host', () => {
    const request = new NextRequest('https://example.com/api/stats', {
      method: 'POST',
      headers: { host: 'example.com', origin: 'https://example.com' },
    })
    expect(isSameOrigin(request)).toBe(true)
  })

  it('rejects a foreign Origin', () => {
    const request = new NextRequest('https://example.com/api/stats', {
      method: 'POST',
      headers: { host: 'example.com', origin: 'https://evil.test' },
    })
    expect(isSameOrigin(request)).toBe(false)
  })
})
