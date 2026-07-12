import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Convention Next 16: proxy.ts (khớp 2026)
export default createMiddleware(routing)

export const config = {
  // Match mọi path trừ /api, /_next, /_vercel và file tĩnh (có dấu chấm)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
