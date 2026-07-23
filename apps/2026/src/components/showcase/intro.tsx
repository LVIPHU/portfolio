'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { FelixFLX, FelixEI } from './felix-mark'
import s from './intro.module.css'

// Intro kiểu lenis: tấm phủ amber, chữ FELIX đen trượt lên so le rồi cả tấm
// trượt khỏi màn hình. Phát mỗi lần load trang thật; điều hướng trong site (SPA)
// không phát lại vì script quyết định chỉ chạy khi tải trang.
//
// QUAN TRỌNG — overlay nằm NGAY TRONG HTML server trả về (không chờ hydrate): nếu chỉ
// mount sau khi client chạy thì người dùng thấy nội dung trang trước rồi tấm amber mới
// nhảy vào (dev + 3D hydrate lâu → gần như không kịp thấy intro).
// Việc bỏ qua (mobile / reduced-motion) do CSS lo — KHÔNG dùng class trên <html> vì
// React hydration xoá sạch class do script trước đó gắn.
export function Intro() {
  const lenis = useLenis()

  const [isLoaded, setIsLoaded] = useState(false)
  const [introOut, setIntroOut] = useState(false)
  const [done, setDone] = useState(false)
  const [playing, setPlaying] = useState(false)
  const releasedRef = useRef(false)

  useEffect(() => {
    // cùng điều kiện với CSS ở trên: overlay bị ẩn thì đừng khoá scroll, gỡ luôn markup
    const skip = window.innerWidth < 800 || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (skip) {
      setDone(true)
      return
    }
    setPlaying(true)
    // Báo cho hero biết đang có intro → E/I của hero chờ ở dòng dưới, sẽ ghép cùng nhịp.
    // Gắn SAU hydration nên an toàn (gắn trước paint sẽ bị hydration xoá sạch class).
    document.documentElement.classList.add('intro-running')
    const id = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(id)
  }, [])

  // Chữ đã trượt vào xong → E/I trồi lên ghép (lenis: setIntroOut khi transition
  // của path có class 'show' kết thúc). Fallback timer phòng transition không bắn.
  const markIntroOut = () => {
    setIntroOut((v) => {
      if (!v) document.documentElement.classList.add('intro-out')
      return true
    })
  }

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(markIntroOut, 2900) // 1000 chờ + 1500 trượt + 375 stagger
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  // khoá scroll suốt intro
  useEffect(() => {
    if (!playing || !lenis) return
    lenis.stop()
    return () => lenis.start()
  }, [playing, lenis])

  // nhả scroll + gỡ overlay. Gọi được nhiều lần (transitionEnd + timeout dự phòng)
  // — bắt buộc có fallback, nếu transition không bắn thì trang sẽ kẹt không cuộn được.
  const release = () => {
    if (releasedRef.current) return
    releasedRef.current = true
    lenis?.start()
    setDone(true)
  }

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(release, 4600) // 1000 chờ + 1500 vào + 1500 ra + đệm
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  if (done) return null

  return (
    <div
      className={`${s.wrapper} ${isLoaded ? s.out : ''}`}
      aria-hidden
      onTransitionEnd={(e) => {
        // tấm phủ báo kết thúc → nhả scroll; path chữ báo kết thúc → tới pha ghép E/I
        if (e.target === e.currentTarget) release()
        else if ((e.target as Element).tagName === 'path') markIntroOut()
      }}
    >
      <div className={`${s.inner} ${isLoaded ? s.relative : ''}`}>
        <FelixFLX
          fill='var(--color-black, #000)'
          isLoaded={isLoaded}
          className={s.mark}
          letterClassName={s.start}
          showClassName={s.show}
        />
        <FelixEI
          fill='var(--color-black, #000)'
          isLoaded={isLoaded}
          className={`${s.mark} ${introOut ? s.translate : ''}`}
          letterClassName={s.start}
          showClassName={s.show}
        />
      </div>
    </div>
  )
}
