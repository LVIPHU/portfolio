import * as React from 'react'

// Shim next/link — thẻ <a> thuần, giữ href/className/children.
const Link = React.forwardRef<HTMLAnchorElement, any>(function Link(
  { href, prefetch, replace, scroll, shallow, locale, legacyBehavior, ...rest },
  ref
) {
  const h = typeof href === 'object' && href !== null ? ((href as any).pathname ?? '#') : href
  return <a ref={ref} href={h ?? '#'} {...rest} />
})

export default Link
