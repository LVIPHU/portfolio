import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Next.js 16: file convention là proxy.ts (thay cho middleware.ts)
export default createMiddleware(routing)

export const config = {
  // Match mọi path trừ /api, /_next, /_vercel và file tĩnh (có dấu chấm)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
