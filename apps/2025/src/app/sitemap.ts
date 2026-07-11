import type { MetadataRoute } from 'next'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { getAllPosts } from '@/utils/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = SITE_METADATA.siteUrl
  // Union 2 locale, dedupe theo path — tập URL /blog/<slug> giữ nguyên như hệ cũ (D-05)
  const seen = new Set<string>()
  const blogRoutes = [...getAllPosts('vi'), ...getAllPosts('en')]
    .filter((p) => (seen.has(p.path) ? false : (seen.add(p.path), true)))
    .map(({ path, lastmod, date }) => ({
      url: `${siteUrl}/${path}`,
      lastModified: lastmod || date,
    }))

  const routes = ['', 'about', 'blog', 'contact', 'photos', 'projects', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
