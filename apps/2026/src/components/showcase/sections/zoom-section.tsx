'use client'

import { useRef } from 'react'
import { useLenis } from 'lenis/react'
import s from './sections.module.css'

// Port .solution zoom sequence: cuộn → progress1 phóng chữ, progress2 wipe trắng + flip theme dark→light.
export function ZoomSection({ first, enter, second }: { first: string; enter: string; second: string }) {
  const wrapper = useRef<HTMLElement>(null)

  useLenis(({ scroll }: { scroll: number }) => {
    const w = wrapper.current
    if (!w) return
    const top = w.getBoundingClientRect().top + scroll
    const windowHeight = window.innerHeight
    const start = top + windowHeight * 0.5
    const end = top + w.offsetHeight - windowHeight
    const progress = Math.min(1, Math.max(0, (scroll - start) / (end - start)))
    const center = 0.65
    const p1 = Math.min(1, Math.max(0, progress / center))
    const p2 = Math.min(1, Math.max(0, (progress - (center - 0.055)) / (1 - (center - 0.055))))
    // easing tăng tốc dần cho scale: nửa đầu chậm rãi (chữ "từ từ hiện"), dồn tốc về cuối
    const p1e = p1 * p1
    w.style.setProperty('--progress1', String(p1))
    w.style.setProperty('--progress1e', String(p1e))
    w.style.setProperty('--progress2', String(p2))
    const root = w.closest('.showcase-root') as HTMLElement | null
    if (root) root.setAttribute('data-theme', p2 >= 1 ? 'light' : 'dark')
  })

  // Nhấn amber vào TỪ CUỐI của dòng đầu (chữ zoom giữ màu xám để wipe trắng là nhân vật chính)
  const lastSpace = first.trim().lastIndexOf(' ')
  const firstHead = lastSpace > 0 ? first.trim().slice(0, lastSpace) : ''
  const firstAccent = lastSpace > 0 ? first.trim().slice(lastSpace + 1) : first.trim()

  return (
    <section ref={wrapper} data-earth-step='3' className={s.solution}>
      <div className={s.solutionInner}>
        <div className={s.zoom}>
          <h2 className={`h1 vh ${s.zoomFirst}`}>
            {firstHead && <>{firstHead} </>}
            <span className='contrast'>{firstAccent}</span>
          </h2>
          {/* h2 vh (to hơn h3) + scale-max nhỏ → ít phóng đại → chữ nét khi zoom */}
          <h2 className={`h2 vh ${s.zoomEnter}`}>{enter}</h2>
          <h2 className='h1 vh'>{second}</h2>
        </div>
      </div>
      {/* Marker threshold phụ: giữ Earth ĐẬU NGOÀI KHUNG suốt đoạn zoom; Earth chỉ
          bay lại vào khung trong viewport cuối (marker → featuring), đúng lúc wipe xong. */}
      <div data-earth-step='4' className={s.zoomEarthMarker} aria-hidden />
    </section>
  )
}
