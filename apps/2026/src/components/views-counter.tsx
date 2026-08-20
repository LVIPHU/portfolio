'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { StatsType } from '@portfolio/service'
import { useBlogStats, useUpdateBlogStats } from '@portfolio/service/stats/hooks'

/** Đếm + ghi nhận 1 lượt xem mỗi lần mount (client). */
export function ViewsCounter({ type, slug, className }: { type: StatsType; slug: string; className?: string }) {
  const t = useTranslations('blog')
  const [stats, isLoading] = useBlogStats(type, slug)
  const updateView = useUpdateBlogStats()
  const sent = useRef(false)
  const [optimistic, setOptimistic] = useState(0)

  // Gửi CỜ, không gửi số: useBlogStats tắt hết revalidate nên lần mount sau trong cùng phiên đọc
  // lại số cũ trong cache; gửi số đó lên thì clamp ở server (không bao giờ hạ giá trị) coi như
  // không có gì thay đổi và lượt xem mất trắng. Để server `views = views + 1` là hết.
  useEffect(() => {
    if (isLoading || sent.current) return
    sent.current = true
    setOptimistic(1)
    void updateView({ type, slug, incrementViews: true })
  }, [isLoading, type, slug, updateView])

  if (isLoading) {
    return (
      <span className={className} aria-busy>
        ---
      </span>
    )
  }

  return <span className={className}>{t('views', { count: stats.views + optimistic })}</span>
}
