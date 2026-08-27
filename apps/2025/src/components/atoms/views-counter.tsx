'use client'

import { useEffect, useRef, useState } from 'react'
import type { StatsType } from '@portfolio/service'
import { useBlogStats, useUpdateBlogStats } from '@portfolio/service/stats/hooks'

export function ViewsCounter({ type, slug, className }: { type: StatsType; slug: string; className?: string }) {
  const [stats, isLoading] = useBlogStats(type, slug)
  const updateView = useUpdateBlogStats()
  const sent = useRef(false)
  const [optimistic, setOptimistic] = useState(0)

  useEffect(() => {
    if (isLoading || sent.current) return
    sent.current = true
    setOptimistic(1)
    void updateView({ type, slug, incrementViews: true })
  }, [isLoading, type, slug, updateView])

  return <span className={className}>{isLoading ? '---' : `${stats.views + optimistic} views`}</span>
}
