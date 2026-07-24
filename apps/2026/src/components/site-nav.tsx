'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { Link, usePathname } from '@/i18n/navigation'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@portfolio/ui'
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
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === '/'

  // Trang chủ: hero là wordmark FELIX chiếm trọn đỉnh màn hình, phải khớp chồng khít
  // với chữ trong tấm intro → nav không được chiếm chỗ lẫn che chữ. Nav trốn lên trên
  // khi đang ở đỉnh trang và trượt vào khi bắt đầu cuộn (CSS chỉ áp từ 800px trở lên —
  // mobile không có intro, mà ẩn nav ở mobile thì không mở được menu).
  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header
      data-home={isHome || undefined}
      data-hidden={(isHome && !scrolled) || undefined}
      className={cn(
        'bg-background/80 z-50 border-b backdrop-blur',
        isHome ? 'sticky top-0 min-[800px]:fixed min-[800px]:inset-x-0' : 'sticky top-0'
      )}
    >
      <div className='flex h-14 w-full items-center justify-between gap-4' style={{ paddingInline: 'var(--safe)' }}>
        <Link href='/' className='p-s hover:text-primary transition-colors'>
          {name}
        </Link>

        <nav className='hidden items-center gap-5 md:flex'>
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'p-xs transition-colors',
                isActive(item.href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
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
        <nav className='border-t py-2 md:hidden' style={{ paddingInline: 'var(--safe)' }}>
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn('p-s block py-3', isActive(item.href) ? 'text-primary' : 'text-muted-foreground')}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
