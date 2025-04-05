import { GrowingUnderline, NavigationLink } from '@/components/atoms'

export function PostNav({
  next,
  nextLabel,
  prev,
  prevLabel,
}: {
  next?: { path: string; title: string }
  nextLabel?: string
  prev?: { path: string; title: string }
  prevLabel?: string
}) {
  if (next || prev) {
    return (
      <div className='flex flex-col gap-2 py-4 md:flex-row md:justify-between md:gap-12 xl:py-8'>
        {prev && prev.path ? (
          <div className='flex flex-col gap-1'>
            <NavLabel label={`←  ${prevLabel}`} />
            <NavigationLink href={`/${prev.path}`}>
              <GrowingUnderline data-umami-event='post-nav-prev'>{prev.title}</GrowingUnderline>
            </NavigationLink>
          </div>
        ) : (
          <div />
        )}
        {next && next.path && (
          <div className='flex flex-col items-end gap-1 text-right'>
            <NavLabel label={`${nextLabel}  →`} />
            <NavigationLink href={`/${next.path}`}>
              <GrowingUnderline data-umami-event='post-nav-next'>{next.title}</GrowingUnderline>
            </NavigationLink>
          </div>
        )}
      </div>
    )
  }
  return null
}

function NavLabel({ label }: { label?: string }) {
  if (label) {
    return <span className='tracking-wide text-gray-500 dark:text-gray-400'>{label}</span>
  }
  return null
}
