'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useBlogStatsList } from '@portfolio/service/stats/hooks'

type BlogStatsListValue = {
  viewsBySlug: Map<string, number>
  isLoading: boolean
}

const BlogStatsListContext = createContext<BlogStatsListValue | null>(null)

/** Một GET /api/stats?slugs=... cho cả trang list — tránh N request PostViews trên từng card. */
export function BlogStatsListProvider({ slugs, children }: { slugs: string[]; children: ReactNode }) {
  const [list, isLoading] = useBlogStatsList('blog', slugs)
  const value = useMemo<BlogStatsListValue>(
    () => ({
      viewsBySlug: new Map(list.map((row) => [row.slug, row.views])),
      isLoading,
    }),
    [list, isLoading]
  )
  return <BlogStatsListContext.Provider value={value}>{children}</BlogStatsListContext.Provider>
}

// Hiển thị lượt xem CHỈ-ĐỌC cho card danh sách.
// KHÔNG tái dùng ViewsCounter vì component đó POST +1 view mỗi lần mount.
export function PostViews({ slug, className }: { slug: string; className?: string }) {
  const batch = useContext(BlogStatsListContext)
  // slugs rỗng → hook không fetch (key = null). Ngoài provider thì fetch 1 slug.
  const [solo, soloLoading] = useBlogStatsList('blog', batch ? [] : [slug])
  const isLoading = batch ? batch.isLoading : soloLoading
  const views = batch ? (batch.viewsBySlug.get(slug) ?? 0) : (solo[0]?.views ?? 0)
  return <span className={className}>{isLoading ? '—' : views}</span>
}
