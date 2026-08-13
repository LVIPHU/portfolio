'use client'

import { useLocale } from 'next-intl'
import { routing } from '@portfolio/i18n'
import { usePathname, useRouter } from '@portfolio/i18n/navigation'
import { cn } from '@portfolio/utils'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(next: string) {
    // Giữ nguyên path hiện tại, đổi locale
    router.replace(pathname, { locale: next })
  }

  return (
    <div className='flex items-center rounded-md border p-0.5 text-xs font-medium'>
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={cn(
            'rounded px-2 py-1 uppercase transition-colors',
            l === locale ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={l === locale}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
