'use client'

import type { StatsType } from '@/db/schema'
import { useBlogStats, useUpdateBlogStats } from '@/hooks'
import { useEffect } from 'react'

export function ViewsCounter({ type, slug, className }: { type: StatsType; slug: string; className?: string }) {
  const [stats, isLoading] = useBlogStats(type, slug)
  const updateView = useUpdateBlogStats()

  useEffect(() => {
    if (!isLoading && stats) {
      updateView({ type, slug, views: stats['views'] + 1 }).then(() => {})
    }
  }, [stats, isLoading, updateView, type, slug])

  return <span className={className}>{isLoading ? '---' : (stats['views'] || 0) + ' views'}</span>
}
