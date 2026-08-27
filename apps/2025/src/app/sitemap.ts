import type { MetadataRoute } from 'next'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { getAllPosts } from '@/utils/content'

function localizedEntries(siteUrl: string, path: string, lastModified: string): MetadataRoute.Sitemap {
  const suffix = path ? `/${path}` : ''
  const viUrl = `${siteUrl}${suffix}`
  const enUrl = `${siteUrl}/en${suffix}`
  const languages = { vi: viUrl, en: enUrl, 'x-default': viUrl }
  return [
    { url: viUrl, lastModified, alternates: { languages } },
    { url: enUrl, lastModified, alternates: { languages } },
  ]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = SITE_METADATA.siteUrl ?? ''
  const lastModified = new Date().toISOString().split('T')[0] ?? new Date().toISOString()

  const staticPaths = ['', 'about', 'blog', 'contact', 'photos', 'projects', 'tags', 'privacy']
  const staticRoutes = staticPaths.flatMap((path) => localizedEntries(siteUrl, path, lastModified))

  const seen = new Map<string, string>()
  for (const post of [...getAllPosts('vi'), ...getAllPosts('en')]) {
    if (!seen.has(post.path)) seen.set(post.path, post.lastmod || post.date)
  }
  const blogRoutes = [...seen.entries()].flatMap(([path, date]) => localizedEntries(siteUrl, path, date))

  return [...staticRoutes, ...blogRoutes]
}
