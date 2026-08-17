'use client'

import { type CSSProperties, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useLenis } from 'lenis/react'
import { Link } from '@portfolio/i18n/navigation'
import { LocaleSwitcher } from '@/components/chrome/locale-switcher'
import { ThemeToggle } from '@/components/chrome/theme-toggle'
import { clsx } from 'clsx'
import s from './site-menu.module.css'

export type NavItem = { href: string; key: string }

// Tấm menu toàn màn hình. Luôn ở trong DOM (chỉ đổi class) để animation ĐÓNG còn chạy được —
// unmount ngay thì tấm biến mất khựng một nhịp. Khi đóng thì `visibility: hidden` + aria-hidden
// nên trình đọc màn hình và Tab đều không với tới.
//
// email/socials nhận qua PROP chứ không import @portfolio/content: entry gốc của content chạm
// filesystem (blog) nên là server-only — component 'use client' phải để layout server truyền xuống.
export function SiteMenu({
  open,
  onClose,
  items,
  isActive,
  email,
  socials,
  photos,
}: {
  open: boolean
  onClose: () => void
  items: readonly NavItem[]
  isActive: (href: string) => boolean
  email: string
  socials: readonly { label: string; url: string }[]
  photos: readonly { src: string }[]
}) {
  const t = useTranslations('nav')
  const lenis = useLenis()
  const panel = useRef<HTMLDivElement>(null)

  // Khoá cuộn nền khi menu mở. Lenis là nguồn cuộn duy nhất của site nên stop() là đúng chỗ;
  // fallback overflow cho trường hợp prefers-reduced-motion (SmoothScroll không mount Lenis).
  useEffect(() => {
    if (!open) return
    if (lenis) lenis.stop()
    else document.documentElement.style.overflow = 'hidden'

    return () => {
      if (lenis) lenis.start()
      else document.documentElement.style.overflow = ''
    }
  }, [open, lenis])

  // Esc đóng menu — dialog nào cũng phải có đường thoát bằng bàn phím.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Đưa tiêu điểm vào link đầu tiên khi mở (nút X ở nav vẫn Tab tới được vì header nằm trên).
  useEffect(() => {
    if (!open) return
    panel.current?.querySelector<HTMLAnchorElement>('a')?.focus()
  }, [open])

  return (
    <div
      ref={panel}
      id='site-menu'
      className={clsx(s.overlay, open && s.open)}
      role='dialog'
      aria-modal='true'
      aria-label={t('menu')}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <div className={clsx(s.inner, 'layout-block-inner')}>
        <nav className={s.nav}>
          {items.map((item, i) => (
            <span key={item.key} className={s.item}>
              <Link
                href={item.href}
                onClick={onClose}
                className={clsx(s.link, isActive(item.href) && s.active)}
                style={{ '--i': i } as CSSProperties}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {t(item.key)}
              </Link>
            </span>
          ))}
        </nav>

        <div className={s.side}>
          {/* Cột ảnh: chỉ desktop (CSS ẩn dưới 800px) — menu mobile hiện vừa đúng một màn hình,
              thêm ảnh vào là phải cuộn. <img> thuần chứ không next/image, giống trang /gallery:
              ảnh đã nằm sẵn trong public/content nên không cần optimizer. */}
          <div className={s.photos} aria-hidden>
            {photos.map((photo, i) => (
              <figure key={photo.src} className={s.photo} style={{ '--i': i } as CSSProperties}>
                <img src={photo.src} alt='' loading='lazy' />
              </figure>
            ))}
          </div>

          <div className={s.meta}>
            <div className={s.metaBlock}>
              <span className={clsx('p-xs', s.metaLabel)}>{t('enquiries')}</span>
              <a href={`mailto:${email}`} className={s.email}>
                {email}
              </a>
            </div>

            <div className={s.metaBlock}>
              <span className={clsx('p-xs', s.metaLabel)}>{t('followMe')}</span>
              <div className={s.socials}>
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target='_blank'
                    rel='noreferrer'
                    className={clsx('p-s', s.social)}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            <div className={s.switches}>
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
