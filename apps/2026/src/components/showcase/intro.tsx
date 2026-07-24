'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { FelixFLX, FelixEI } from './felix-mark'
import s from './intro.module.css'

// Intro kiểu lenis: tấm phủ amber, chữ FELIX đen trượt lên so le, E/I trồi lên ghép
// vào F-L-X thành chữ hoàn chỉnh, rồi cả tấm trượt khỏi màn hình.
//
// QUAN TRỌNG — overlay nằm NGAY TRONG HTML server trả về (không chờ hydrate): nếu chỉ
// mount sau khi client chạy thì người dùng thấy nội dung trang trước rồi tấm amber mới
// nhảy vào. Việc bỏ qua (mobile / reduced-motion) do CSS lo — KHÔNG dùng class trên
// <html> trước paint vì React hydration xoá sạch class gắn kiểu đó.
//
// Intro chỉ mount ở trang chủ (main) và (showcase)/about — đúng phạm vi đã chọn; các
// trang nội dung sâu (blog...) không mang markup/JS intro. Cờ module-scope chống phát
// lại khi điều hướng SPA giữa 2 trang (hard load mới reset cờ).
let hasPlayedThisLoad = false

export function Intro() {
  const lenis = useLenis()
  // lenis đến MUỘN hơn effect đầu của Intro (ReactLenis set context trong effect cha).
  // Mọi chỗ nhả khoá phải đọc qua ref — closure bắt lenis=undefined từng gây kẹt cuộn.
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis

  const [isLoaded, setIsLoaded] = useState(false)
  const [introOut, setIntroOut] = useState(false)
  const [done, setDone] = useState(false)
  const [playing, setPlaying] = useState(false)
  const releasedRef = useRef(false)

  useEffect(() => {
    // cùng điều kiện với CSS (media query trong intro.module.css): overlay bị ẩn thì
    // đừng khoá scroll, gỡ luôn markup
    const skip =
      hasPlayedThisLoad || window.innerWidth < 800 || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (skip) {
      releasedRef.current = true
      setDone(true)
      return
    }
    hasPlayedThisLoad = true
    setPlaying(true)
    document.documentElement.classList.add('intro-running')
    const id = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(id)
  }, [])

  // khoá scroll suốt intro — không khoá nữa nếu release đã chạy trước khi lenis kịp đến
  useEffect(() => {
    if (!playing || !lenis || releasedRef.current) return
    lenis.stop()
    return () => lenis.start()
  }, [playing, lenis])

  // nhả scroll + gỡ overlay. Gọi được nhiều lần (transitionEnd + timeout dự phòng)
  // — bắt buộc có fallback, nếu transition không bắn thì trang sẽ kẹt không cuộn được.
  const release = () => {
    if (releasedRef.current) return
    releasedRef.current = true
    lenisRef.current?.start()
    setDone(true)
    // Gỡ class trạng thái sau khi transition ghép của hero chắc chắn xong — không để
    // state intro rò rỉ vĩnh viễn trên <html>. Hero rơi về trạng thái mặc định (.ei
    // đã ghép, không transition) nên không đổi hình.
    setTimeout(() => {
      document.documentElement.classList.remove('intro-running', 'intro-out')
    }, 1600)
  }

  // Chặn Tab suốt intro: tấm phủ che kín màn nhưng nội dung phía sau vẫn focus được —
  // người dùng bàn phím sẽ tab vào control vô hình (WCAG focus-not-obscured). aria-hidden
  // trên overlay chỉ ẩn nó khỏi screen reader, không chặn focus phía sau.
  useEffect(() => {
    if (!playing || done) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') e.preventDefault()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [playing, done])

  // resize xuống <800px giữa intro: CSS ẩn overlay ngay (không còn transitionEnd nào
  // sẽ bắn) → nhả khoá lập tức thay vì bắt user chờ fallback
  useEffect(() => {
    if (!playing) return
    const onResize = () => {
      if (window.innerWidth < 800) release()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [playing])

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(release, 4600) // 1000 chờ + 1500 vào + 1500 ra + đệm
    return () => clearTimeout(id)
  }, [playing])

  // Chữ trượt vào xong → E/I trồi lên ghép (đúng nhịp lenis: bắn theo transitionEnd
  // của path chữ; fallback timer phòng transition không bắn). Side effect DOM tách
  // riêng theo introOut — không nhét vào setState updater (updater phải pure).
  const markIntroOut = () => setIntroOut(true)

  useEffect(() => {
    if (!introOut) return
    document.documentElement.classList.add('intro-out')
  }, [introOut])

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(markIntroOut, 2900) // 1000 chờ + 1500 trượt + 375 stagger
    return () => clearTimeout(id)
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
