import createIntlMiddleware from '@portfolio/i18n/middleware'

export default createIntlMiddleware

// Matcher phải là object literal tại đây — Next parse tĩnh lúc build (không import từ package).
// icon / apple-icon / opengraph-image nằm NGOÀI [locale] (file metadata Next) nhưng không
// có dấu chấm nên lookahead `.*\..*` không bắt — middleware rewrite /icon → /vi/icon → 404.
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|icon(?:/|$)|apple-icon(?:/|$)|opengraph-image(?:/|$)|.*\\..*).*)',
}
