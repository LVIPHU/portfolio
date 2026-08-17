'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@portfolio/i18n/navigation'
import { SiteMenu, type NavItem } from '@/components/chrome/site-menu'
import { cn } from '@portfolio/utils'
import s from './site-nav.module.css'

const items = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/projects', key: 'projects' },
  { href: '/resume', key: 'resume' },
  { href: '/gallery', key: 'gallery' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
] as const satisfies readonly NavItem[]

export function SiteNav({
  name,
  email,
  socials,
  photos,
}: {
  name: string
  email: string
  socials: readonly { label: string; url: string }[]
  photos: readonly { src: string }[]
}) {
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

  // Đổi route thì đóng menu. Không chỉ dựa vào onClick của từng link: link đang-ở-trang-này
  // không đổi pathname, còn nút Back của trình duyệt thì không đi qua onClick nào cả.
  // Chỉnh state NGAY TRONG render (mẫu "adjusting state when a prop changes" của React) chứ
  // không dùng useEffect: setState trong effect gây thêm một vòng render và bị react-hooks cảnh báo.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    // Tấm menu là ANH EM của <header>, không phải con: header có backdrop-blur, mà
    // filter/backdrop-filter tạo containing block mới cho position:fixed — đặt tấm menu bên
    // trong thì `inset: 0` của nó sẽ bám khung header cao 58px thay vì cả viewport.
    <>
      <header
        data-home={isHome || undefined}
        // Menu mở thì nav phải đứng yên tại chỗ, kể cả đang ở đỉnh trang chủ — nếu không nút X
        // trượt mất khỏi màn hình cùng nav và không còn chỗ nào bấm để đóng.
        data-hidden={(isHome && !scrolled && !open) || undefined}
        className={cn(
          'bg-background/80 z-50 border-b backdrop-blur',
          isHome ? 'sticky top-0 min-[800px]:fixed min-[800px]:inset-x-0' : 'sticky top-0'
        )}
      >
        <div
          className='flex w-full items-center justify-between gap-4'
          style={{ paddingInline: 'var(--safe)', height: 'var(--header-height)', minHeight: '3.5rem' }}
        >
          {/* Gold KHÔNG được làm chữ nhỏ trên nền sáng (1.69:1) — light dùng gạch chân, dark
              giữ gold vì trên nền đen gold đạt 10.79:1. */}
          <Link href='/' className='p-s dark:hover:text-primary underline-offset-4 transition-colors hover:underline'>
            {name}
          </Link>

          {/* Đúng HAI nút: CTA gold + công tắc menu (bố cục landonorris.com). Nav ngang cũ,
              LocaleSwitcher và ThemeToggle đã dời hết vào trong tấm menu. */}
          <div className={s.actions}>
            <Link href='/contact' className={s.hire}>
              {t('hire')}
            </Link>
            <button
              type='button'
              className={s.toggle}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls='site-menu'
              aria-label={open ? t('close') : t('menu')}
            >
              <span className={s.bars} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <SiteMenu
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        isActive={isActive}
        email={email}
        socials={socials}
        photos={photos}
      />
    </>
  )
}
