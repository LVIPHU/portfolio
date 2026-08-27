import { Link } from '@portfolio/i18n/navigation'

export type Crumb = { href?: string; label: string }

export function Breadcrumb({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label} className='p-xs text-muted-foreground'>
      <ol className='flex flex-wrap items-center gap-2'>
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.label} className='flex items-center gap-2'>
              {i > 0 && (
                <span aria-hidden className='text-primary'>
                  /
                </span>
              )}
              {last || !item.href ? (
                <span aria-current={last ? 'page' : undefined} className='text-foreground'>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className='hover:text-foreground hover:underline'>
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
