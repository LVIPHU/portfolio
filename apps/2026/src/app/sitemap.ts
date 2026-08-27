import type { MetadataRoute } from 'next'
import { getAllPosts, getAllProjectSlugs, getAllTags } from '@portfolio/content'
import { absoluteUrl } from '@/utils/seo'

const staticPaths = ['/', '/about', '/projects', '/resume', '/gallery', '/blog', '/tags', '/contact', '/privacy']

function entry(path: string, lastModified?: string | Date): MetadataRoute.Sitemap[number] {
  const vi = absoluteUrl('vi', path)
  const en = absoluteUrl('en', path)
  return {
    url: vi,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    alternates: { languages: { vi, en, 'x-default': vi } },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = [...getAllPosts('vi'), ...getAllPosts('en')]
  const seen = new Set<string>()
  const blog = posts.flatMap((p) => {
    if (seen.has(p.slug)) return []
    seen.add(p.slug)
    return [entry(`/blog/${p.slug}`, p.lastmod ?? p.date)]
  })

  const tags = new Set([...getAllTags('vi').map((t) => t.tag), ...getAllTags('en').map((t) => t.tag)])
  const tagEntries = [...tags].map((tag) => entry(`/tags/${tag}`))

  const projects = getAllProjectSlugs().map((slug) => entry(`/projects/${slug}`))

  return [...staticPaths.map((p) => entry(p)), ...blog, ...tagEntries, ...projects]
}
