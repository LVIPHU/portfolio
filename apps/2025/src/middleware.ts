import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Next 15.2 dùng convention middleware.ts; đổi tên proxy.ts ở C7 (D-07)
export default createMiddleware(routing)

export const config = {
  // Match mọi path trừ /api, /_next, /_vercel và file tĩnh (có dấu chấm)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
