import type { MetadataRoute } from 'next'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_METADATA.siteUrl}/sitemap.xml`,
    host: SITE_METADATA.siteUrl,
  }
}
