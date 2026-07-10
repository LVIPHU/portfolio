'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { Link, usePathname } from '@/i18n/navigation'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/projects', key: 'projects' },
  { href: '/resume', key: 'resume' },
  { href: '/gallery', key: 'gallery' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
] as const

export function SiteNav({ name }: { name: string }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className='bg-background/80 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4'>
        <Link href='/' className='font-semibold tracking-tight'>
          {name}
        </Link>

        <nav className='hidden items-center gap-1 md:flex'>
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                isActive(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className='flex items-center gap-2'>
          <LocaleSwitcher />
          <ThemeToggle />
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Menu'
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className='h-4 w-4' /> : <Menu className='h-4 w-4' />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className='border-t px-4 py-2 md:hidden'>
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'block rounded-md px-3 py-2 text-sm',
                isActive(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
