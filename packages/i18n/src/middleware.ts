import createMiddleware from 'next-intl/middleware'
import { routing } from './routing'

/** Middleware next-intl đã bind `routing`. Matcher phải khai báo literal trong app `proxy.ts`
 *  (Next static-parse `export const config` — không nhận giá trị import). */
export default createMiddleware(routing)

/** Chỉ để tham chiếu / test — app không được `export const config = proxyConfig`. */
export const PROXY_MATCHER =
  '/((?!api|trpc|_next|_vercel|icon(?:/|$)|apple-icon(?:/|$)|opengraph-image(?:/|$)|.*\\..*).*)'
