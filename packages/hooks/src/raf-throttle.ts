'use client'

import { useEffect, useRef } from 'react'

type AnyFn = (...args: never[]) => void

/**
 * Gộp các lần gọi trong cùng một frame (scroll/resize/pointer).
 * Trả về hàm hủy — gọi trong cleanup của effect.
 */
export function rafThrottle<T extends AnyFn>(fn: T): T & { cancel: () => void } {
  let frame: number | null = null
  let latest: Parameters<T> | null = null

  const wrapped = ((...args: Parameters<T>) => {
    latest = args
    if (frame !== null) return
    frame = requestAnimationFrame(() => {
      frame = null
      const queued = latest
      latest = null
      if (queued) fn(...queued)
    })
  }) as T & { cancel: () => void }

  wrapped.cancel = () => {
    if (frame === null) return
    cancelAnimationFrame(frame)
    frame = null
    latest = null
  }

  return wrapped
}

export function useRafThrottle<T extends AnyFn>(fn: T): T {
  const fnRef = useRef(fn)
  fnRef.current = fn
  const throttledRef = useRef<ReturnType<typeof rafThrottle<T>> | null>(null)

  if (!throttledRef.current) {
    throttledRef.current = rafThrottle(((...args: Parameters<T>) => fnRef.current(...args)) as T)
  }

  useEffect(() => () => throttledRef.current?.cancel(), [])

  return throttledRef.current as unknown as T
}
