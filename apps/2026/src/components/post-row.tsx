import { Link } from '@portfolio/i18n/navigation'

// Hàng bài viết kiểu showcase — dùng ở home + blog list. Hover đổi màu VIỀN (gold được cấp
// phép làm gạch ở mọi theme); tiêu đề 20px chỉ hoá gold ở dark, light giữ chữ đen.
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
      className='hover:border-primary group flex flex-col justify-between gap-1 border-b py-5 transition-colors md:flex-row md:items-baseline'
    >
      <span className='flex flex-col gap-1'>
        <span className='dark:group-hover:text-primary text-xl font-medium transition-colors md:text-2xl'>{title}</span>
        {summary && <span className='p text-muted-foreground'>{summary}</span>}
      </span>
      <span className='p-xs text-muted-foreground shrink-0'>{date}</span>
    </Link>
  )
}
