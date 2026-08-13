import createIntlMiddleware from '@portfolio/i18n/middleware'

export default createIntlMiddleware

// Matcher phải là object literal tại đây — Next parse tĩnh lúc build (không import từ package).
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
