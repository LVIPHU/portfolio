import { describe, expect, it } from 'vitest'
import { postFrontmatterSchema } from './schema'
import { getRelatedPosts } from './blog'

describe('postFrontmatterSchema', () => {
  it('accepts a valid post', () => {
    const parsed = postFrontmatterSchema.safeParse({
      title: 'Hello',
      date: '2026-01-01',
      tags: ['react'],
    })
    expect(parsed.success).toBe(true)
  })

  it('rejects a missing title', () => {
    const parsed = postFrontmatterSchema.safeParse({ date: '2026-01-01' })
    expect(parsed.success).toBe(false)
  })
})

describe('getRelatedPosts', () => {
  it('does not include the current slug', () => {
    const related = getRelatedPosts('hello-world', 'vi', 3)
    expect(related.every((post) => post.slug !== 'hello-world')).toBe(true)
    expect(related.length).toBeLessThanOrEqual(3)
  })
})
