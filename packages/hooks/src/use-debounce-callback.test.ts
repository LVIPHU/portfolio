/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDebounceCallback } from './use-debounce-callback'

describe('useDebounceCallback', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('cancels the pending call on unmount (single instance)', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const { result, unmount } = renderHook(() => useDebounceCallback(spy, 200))

    result.current()
    expect(result.current.isPending()).toBe(true)

    unmount()
    vi.advanceTimersByTime(500)
    expect(spy).not.toHaveBeenCalled()
  })
})
