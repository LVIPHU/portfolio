'use client'

import { type CSSProperties, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useLenis } from 'lenis/react'
import { Link } from '@portfolio/i18n/navigation'
import { blockScrollKeys, blockWheelScroll } from '@/components/scroll/scroll-lock'
import { LocaleSwitcher } from '@/components/chrome/locale-switcher'
import { ThemeToggle } from '@/components/chrome/theme-toggle'
import { clsx } from 'clsx'
import s from './site-menu.module.css'

export type NavItem = { href: string; key: string }

// Nhịp so le giữa hai ký tự liền nhau khi hover (ms). Chạy TRÁI → PHẢI theo thứ tự đọc; bản
// trước so le từ giữa ra hai bên nên mắt không bắt được hướng, nhìn rối.
const CHAR_STEP = 45

// Ký tự trắng phải là NBSP: khoảng trắng thường trong một <span> riêng bị gộp/bỏ khi render.
const NBSP = ' '

// Chữ cuộn theo TỪNG KÝ TỰ, so le TRÁI → PHẢI theo thứ tự đọc. Cùng ngôn ngữ với nhãn nút
// PillButton (hai bản chồng nhau tráo chỗ) nhưng làm ở mức ký tự và không có nền — bản dự bị
// là gold.
//
// Dãy ký tự để aria-hidden và kèm một bản .sr-only: tách chữ ra từng <span> khiến trình đọc màn
// hình đọc rời từng chữ cái.
function RollingText({ text }: { text: string }) {
  const chars = Array.from(text)

  return (
    <>
      <span className={s.chars} aria-hidden>
        {chars.map((char, i) => (
          <span key={i} className={s.char} style={{ '--d': `${i * CHAR_STEP}ms` } as CSSProperties}>
            <span className={s.charFace}>{char === ' ' ? NBSP : char}</span>
            <span className={s.charFaceHidden}>{char === ' ' ? NBSP : char}</span>
          </span>
        ))}
      </span>
      <span className='sr-only'>{text}</span>
    </>
  )
}

// Tấm menu toàn màn hình. Luôn ở trong DOM (chỉ đổi class) để animation ĐÓNG còn chạy được —
// unmount ngay thì tấm biến mất khựng một nhịp. Khi đóng thì `visibility: hidden` + aria-hidden
// nên trình đọc màn hình và Tab đều không với tới.
//
// socials/photos nhận qua PROP chứ không import @portfolio/content: entry gốc của content
// chạm filesystem (blog) nên là server-only — component 'use client' phải để layout truyền xuống.
export function SiteMenu({
  open,
  onClose,
  items,
  isActive,
  socials,
  photos,
}: {
  open: boolean
  onClose: () => void
  items: readonly NavItem[]
  isActive: (href: string) => boolean
  socials: readonly { label: string; url: string }[]
  photos: readonly { src: string }[]
}) {
  const t = useTranslations('nav')
  const lenis = useLenis()
  const panel = useRef<HTMLDivElement>(null)

  // Khoá cuộn nền khi menu mở. Lenis là nguồn cuộn duy nhất của site nên stop() là đúng chỗ;
  // khi prefers-reduced-motion (SmoothScroll không mount Lenis) thì tự chặn wheel/touch. KHÔNG
  // dùng `overflow: hidden` trên <html>: nó giấu thanh cuộn nên khung nội dung và mọi lớp
  // position:fixed (kể cả canvas 3D) rộng thêm — đúng cái nhích ngang mà native-scrollbar.css
  // vừa đi sửa, chỉ khác là lần này chỉ người bật reduced-motion mới dính.
  useEffect(() => {
    if (!open) return
    if (!lenis) return blockWheelScroll()
    lenis.stop()
    return () => lenis.start()
  }, [open, lenis])

  // Chặn phím cuộn khi menu mở: lenis chỉ chặn wheel/touch, còn `overflow: clip` của nó đã bị
  // trung hoà (native-scrollbar.css) để thanh cuộn không biến mất. KHÔNG chặn Tab — trong menu có
  // link và công tắc phải Tab tới được.
  useEffect(() => {
    if (!open) return
    return blockScrollKeys()
  }, [open])

  // Esc đóng menu — dialog nào cũng phải có đường thoát bằng bàn phím.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Focus trap: Tab xoay trong tấm. inert phần nền để trình đọc màn hình không đọc trang dưới.
  useEffect(() => {
    if (!open) return
    const root = panel.current
    if (!root) return
    const background = [document.getElementById('main'), document.querySelector('footer')].filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    )
    for (const el of background) el.inert = true

    const focusables = () =>
      [
        ...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ].filter((el) => !el.hasAttribute('disabled') && el.getClientRects().length > 0)

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    root.addEventListener('keydown', onKey)
    return () => {
      root.removeEventListener('keydown', onKey)
      for (const el of background) el.inert = false
    }
  }, [open])

  // Đưa tiêu điểm vào link đầu tiên khi mở (nút đóng vẫn Tab tới được vì nó nằm trên tấm này),
  // và TRẢ nó về chỗ cũ khi đóng. Không trả thì tấm đóng lại nhận `inert` kéo tiêu điểm về <body>:
  // đóng menu bằng Esc xong, Tab tiếp là chạy lại từ đầu trang chứ không quay về nút menu.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    panel.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }
  }, [open])

  // Hai cột ảnh xen kẽ: cột trái giữ ảnh chẵn, cột phải giữ ảnh lẻ rồi tụt xuống một nhịp (lệch
  // tầng như trang tham chiếu).
  const columns = [photos.filter((_, i) => i % 2 === 0), photos.filter((_, i) => i % 2 === 1)]

  return (
    <div
      ref={panel}
      id='site-menu'
      // class 'dark' toàn cục (globals.css khai `.dark { --background… }` cho BẤT KỲ phần tử nào):
      // tấm menu luôn nền đen bất kể site đang light hay dark, giống trang tham chiếu. Nhờ vậy gold
      // luôn đạt 10.79:1 nên chữ nhỏ hơn ngưỡng 56/64 comp vẫn được tô gold khi hover. Tailwind v4
      // ở app này dùng `@custom-variant dark (&:is(.dark *))` nên LocaleSwitcher/ThemeToggle bên
      // trong cũng ăn theo — không phải chép lại token.
      className={clsx('dark', s.overlay, open && s.open)}
      role='dialog'
      aria-modal='true'
      aria-label={t('menu')}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <div className={s.inner}>
        {/* Cột ảnh: chỉ desktop (CSS ẩn dưới --breakpoint-md) — menu mobile đang vừa đúng một màn hình,
            thêm ảnh vào là phải cuộn. <img> thuần chứ không next/image, giống trang /gallery:
            ảnh đã nằm sẵn trong public/content nên không cần optimizer. KHÔNG loading='lazy':
            tấm đóng là `visibility: hidden` nên ảnh không bao giờ vào viewport, trình duyệt hoãn
            tải vô hạn và lần mở menu đầu tiên là bốn ô trống. */}
        <div className={s.photos} aria-hidden>
          {columns.map((column, ci) => (
            <div key={ci} className={s.photoCol}>
              {column.map((photo, i) => (
                <figure key={photo.src} className={s.photo} style={{ '--i': ci + i * 2 } as CSSProperties}>
                  <img src={photo.src} alt='' />
                </figure>
              ))}
            </div>
          ))}
        </div>

        <div className={s.panel}>
          <nav className={s.nav}>
            {items.map((item, i) => {
              const active = isActive(item.href)
              const style = { '--i': i } as CSSProperties

              // Trang đang xem: KHÔNG phải link nữa — <span> gạch ngang, không bấm được, không
              // có hiệu ứng hover. Dùng <span> chứ không phải <a aria-disabled>: aria-disabled
              // chỉ nói với trình đọc màn hình, chuột và bàn phím vẫn điều hướng như thường.
              return (
                <span key={item.key} className={s.item}>
                  {active ? (
                    <span className={clsx(s.link, s.active)} style={style} aria-current='page'>
                      {t(item.key)}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={s.link}
                      style={style}
                      data-umami-event={`nav-${item.key}`}
                    >
                      <RollingText text={t(item.key)} />
                    </Link>
                  )}
                </span>
              )
            })}
          </nav>

          <div className={s.meta}>
            <div className={s.socials}>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={clsx('p-s', s.social)}
                >
                  {social.label}
                </a>
              ))}
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
