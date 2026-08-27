import Script from 'next/script'

/** Umami Cloud — không có website id thì không render (soft-fail như DATABASE_URL). */
export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  if (!websiteId) return null
  return <Script src='https://cloud.umami.is/script.js' data-website-id={websiteId} strategy='afterInteractive' />
}
