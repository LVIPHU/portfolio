'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from '@portfolio/i18n/navigation'
import { PillButton } from '@/components/effects/pill-button'
import { SiteMenu, type NavItem } from '@/components/chrome/site-menu'
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
  socials,
  photos,
}: {
  socials: readonly { label: string; url: string }[]
  photos: readonly { src: string }[]
}) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Đổi route thì đóng menu. Không chỉ dựa vào onClick của từng link: nút Back của trình duyệt
  // không đi qua onClick nào cả. Chỉnh state NGAY TRONG render (mẫu "adjusting state when a prop
  // changes" của React) — setState trong useEffect tốn thêm một vòng render và bị react-hooks
  // cảnh báo.
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
    <>
      {/* Không có thẻ <header> bọc: nút là lớp nổi, không có nền lẫn khung, và không được chiếm
          chỗ trong luồng của trang. Nhãn vùng đặt bằng aria-label để trình đọc màn hình vẫn nhận
          ra đây là điều hướng chính. */}
      {/* fixed-right-compensate: khi lenis khoá cuộn, thanh cuộn biến mất và viewport rộng thêm →
          lớp fixed này trôi sang phải. Luật bù nằm ở app/native-scrollbar.css. */}
      <nav className={`${s.bar} fixed-right-compensate`} aria-label={t('menu')}>
        <PillButton
          className={s.toggle}
          icon={<span className={s.bars} />}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls='site-menu'
          aria-label={open ? t('close') : t('menu')}
        />
      </nav>

      <SiteMenu
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        isActive={isActive}
        socials={socials}
        photos={photos}
      />
    </>
  )
}
