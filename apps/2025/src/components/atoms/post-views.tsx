'use client'

import { useBlogStats } from '@/hooks'

// Hiển thị lượt xem CHỈ-ĐỌC cho card danh sách: dùng useBlogStats (GET /api/stats) —
// KHÔNG tái dùng ViewsCounter vì component đó POST +1 view mỗi lần mount (sẽ thổi phồng
// lượt xem khi render nhiều card). DB placeholder → trả 0 tới khi cắm DB thật.
export function PostViews({ slug, className }: { slug: string; className?: string }) {
  const [stats, isLoading] = useBlogStats('blog', slug)
  return <span className={className}>{isLoading ? '—' : stats.views || 0}</span>
}
