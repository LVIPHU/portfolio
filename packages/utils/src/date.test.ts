import { describe, expect, it } from 'vitest'
import { cn } from './cn'
import { sortByDateDesc } from './date'
import { omit } from './object'

describe('sortByDateDesc', () => {
  it('does not mutate the input array', () => {
    const input = [{ date: '2024-01-01' }, { date: '2025-01-01' }]
    const snapshot = [...input]
    const sorted = sortByDateDesc(input)
    expect(input).toEqual(snapshot)
    expect(sorted.map((item) => item.date)).toEqual(['2025-01-01', '2024-01-01'])
    expect(sorted).not.toBe(input)
  })
})

describe('cn', () => {
  it('merges tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})

describe('omit', () => {
  it('returns a new object without the listed keys', () => {
    const input = { a: 1, b: 2, c: 3 }
    expect(omit(input, ['b'])).toEqual({ a: 1, c: 3 })
    expect(input).toEqual({ a: 1, b: 2, c: 3 })
  })
})
