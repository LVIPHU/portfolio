import type { NextRequest } from 'next/server'

/** POST stats chỉ nhận request cùng host — chống ghi counter từ origin lạ. */
export function isSameOrigin(request: NextRequest): boolean {
  const host = request.headers.get('host')
  if (!host) return false

  const origin = request.headers.get('origin')
  if (origin) {
    try {
      return new URL(origin).host === host
    } catch {
      return false
    }
  }

  const referer = request.headers.get('referer')
  if (!referer) return false
  try {
    return new URL(referer).host === host
  } catch {
    return false
  }
}
