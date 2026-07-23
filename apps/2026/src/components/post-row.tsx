import { Link } from '@/i18n/navigation'

// Hàng bài viết kiểu showcase (border-dưới, hover amber) — dùng ở home + blog list.
export function PostRow({
  slug,
  title,
  date,
  summary,
}: {
  slug: string
  title: string
  date: string
  summary?: string
}) {
  return (
    <Link
      href={`/blog/${slug}`}
      className='group flex flex-col justify-between gap-1 border-b py-5 sm:flex-row sm:items-baseline'
    >
      <span className='flex flex-col gap-1'>
        <span className='group-hover:text-primary text-xl font-medium transition-colors sm:text-2xl'>{title}</span>
        {summary && <span className='p text-muted-foreground'>{summary}</span>}
      </span>
      <span className='p-xs text-muted-foreground shrink-0'>{date}</span>
    </Link>
  )
}
